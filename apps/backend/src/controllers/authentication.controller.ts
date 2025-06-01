import { envConfig } from "@shared/config/env.config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  createLocalUser,
  findExistingUserByUsernameOrEmail,
  findUserById,
  findUserByUsername,
} from "../services/user.services";
import bcrypt from "bcryptjs";
import {
  ExtractJwt,
  StrategyOptions,
  Strategy as JwtStrategy,
} from "passport-jwt";
import { PassportStatic } from "passport";
import {
  createErrorResponse,
  createValidationErrorCollector,
} from "../lib/error";
import { MessageCodes } from "@shared/constants/message.codes";
import { MessageTexts } from "@shared/constants/message.texts";
import { log } from "console";

const configureJwtStrategy = (passport: PassportStatic) => {
  const secret = envConfig.BACKEND_JWT_SECRET_KEY;

  if (!secret || secret.trim().length < 5) {
    console.error("JWT secret key is missing or too short");
    return;
  }

  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await findUserById(payload.sub);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

const register = async (req: Request, res: Response): Promise<void> => {
  const { username = "", email = "", password = "", name = "" } = req.body;

  const errors = createValidationErrorCollector();
  errors.add("username", username, MessageCodes.REQUIRED_FIELD);
  errors.add("email", email, MessageCodes.REQUIRED_FIELD);
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
    // Check if user exists
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

    // Issue JWT token
    const token = jwt.sign(
      { sub: newUser._id, username: newUser.username },
      jwtSecretKey,
      { expiresIn: "1h" }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
      // res.status(401).json({ message: "Invalid credentials" });
      // return;
      errors.add(MessageTexts[MessageCodes.AUTH_FAILED]);
    }
    console.log("has errors", errors.hasErrors());

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

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login, configureJwtStrategy };
