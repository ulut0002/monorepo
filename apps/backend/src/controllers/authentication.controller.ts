// Load environment-specific configuration values (e.g., JWT secret).
import { envConfig } from "@shared/config/env.config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// User-related service functions: for lookup, creation, etc.
import {
  createLocalUser,
  findExistingUserByUsernameOrEmail,
  findUserById,
  findUserByUsername,
} from "../services/user.services";

import bcrypt from "bcryptjs";
import { StrategyOptions, Strategy as JwtStrategy } from "passport-jwt";
import { PassportStatic } from "passport";

// Utilities for structured error handling and validation
import {
  createErrorResponse,
  createValidationErrorCollector,
} from "../lib/error";
import { MessageCodes, MessageTexts } from "@shared/constants";

/**
 * Configures Passport.js with JWT strategy using a cookie-based token.
 */
const configureJwtStrategy = (passport: PassportStatic) => {
  const secret = envConfig.BACKEND_JWT_SECRET_KEY;

  if (!secret || secret.trim().length < 5) {
    console.error("JWT secret key is missing or too short");
    return;
  }

  const opts: StrategyOptions = {
    jwtFromRequest: (req: Request) => {
      if (req && req.cookies) {
        return req.cookies.token; // Extract token from signed cookie
      }
      return null;
    },
    secretOrKey: secret,
  };

  // Attach the JWT strategy to passport
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await findUserById(payload.sub); // Decode user ID from token
        return user ? done(null, user) : done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

/**
 * Registers a new user with username, email, password.
 * Hashes password and sets a secure token in a cookie.
 */
const register = async (req: Request, res: Response): Promise<void> => {
  const { username = "", email = "", password = "", name = "" } = req.body;

  const errors = createValidationErrorCollector();
  errors.add("username", username, MessageCodes.REQUIRED_FIELD);
  errors.add("email", email, MessageCodes.REQUIRED_FIELD);
  errors.add("password", password, MessageCodes.REQUIRED_FIELD);

  // Validate required fields
  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.VALIDATION_ERROR,
        message: MessageTexts[MessageCodes.VALIDATION_ERROR],
        details: errors.get(),
      })
    );
    return;
  }

  const jwtSecretKey = envConfig.BACKEND_JWT_SECRET_KEY || "";
  errors.add(
    "securityKey",
    jwtSecretKey && jwtSecretKey.trim().length >= 5,
    MessageCodes.MISSING_SECURITY_KEY
  );

  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.MISSING_SECURITY_KEY,
        message: MessageTexts[MessageCodes.MISSING_SECURITY_KEY],
        details: errors.get(),
      })
    );
    return;
  }

  try {
    const existingUser = await findExistingUserByUsernameOrEmail(
      username,
      email
    );
    if (existingUser) {
      errors.add(
        MessageCodes.EXISTING_USER,
        false,
        MessageTexts[MessageCodes.EXISTING_USER]
      );
    }

    if (errors.hasErrors()) {
      res.status(400).json(
        createErrorResponse({
          code: MessageCodes.EXISTING_USER,
          message: MessageTexts[MessageCodes.VALIDATION_ERROR],
          details: errors.get(),
        })
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createLocalUser({
      username,
      email,
      password: hashedPassword,
      name,
    });

    // Issue and send JWT in HTTP-only cookie
    const token = jwt.sign(
      { sub: newUser._id, username: newUser.username },
      jwtSecretKey,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(201)
      .json({ message: "Authentication successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Authenticates a user with username + password.
 * On success, sets JWT in a cookie.
 */
const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const errors = createValidationErrorCollector();

  errors.add("username", username, MessageCodes.REQUIRED_FIELD);
  errors.add("password", password, MessageCodes.REQUIRED_FIELD);

  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.VALIDATION_ERROR,
        message: MessageTexts[MessageCodes.VALIDATION_ERROR],
        details: errors.get(),
      })
    );
    return;
  }

  const jwtSecretKey = envConfig.BACKEND_JWT_SECRET_KEY;
  errors.add(
    "securityKey",
    jwtSecretKey && jwtSecretKey.trim().length >= 5,
    MessageCodes.MISSING_SECURITY_KEY
  );

  if (errors.hasErrors()) {
    res.status(400).json(
      createErrorResponse({
        code: MessageCodes.MISSING_SECURITY_KEY,
        message: MessageTexts[MessageCodes.MISSING_SECURITY_KEY],
        details: errors.get(),
      })
    );
    return;
  }

  try {
    const user = await findUserByUsername(username);
    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.add(MessageTexts[MessageCodes.AUTH_FAILED]);
    }

    if (errors.hasErrors()) {
      res.status(401).json(
        createErrorResponse({
          code: MessageCodes.AUTH_FAILED,
          message: MessageTexts[MessageCodes.AUTH_FAILED],
          details: errors.get(),
          showDetails: false,
        })
      );
      return;
    }

    const token = jwt.sign(
      { sub: user._id, username: user.username },
      jwtSecretKey!,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(200)
      .json({ message: "Authentication successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logs out the user by clearing the cookie.
 */
const logout = (req: Request, res: Response): void => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
};

/**
 * Returns the currently authenticated user.
 * Assumes passport middleware has attached `req.user`.
 */
const me = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  // Strip password before returning user object
  const { password, ...safeUser } = (user as any).toObject();
  res.json({ user: safeUser });
};

export { register, login, configureJwtStrategy, logout, me };
