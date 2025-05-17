import { Request, Response, NextFunction } from "express";
import { validationConfig } from "../config/validation.config";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  normalizeEmail,
} from "@shared/utils/validators";
import {
  createUser,
  getUserByEmail,
  getUserBySessionToken,
} from "../services/user.services";
import { authentication, random } from "../helpers/index";
import envConfig from "@/packages/shared/src/config/env.config";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!isValidEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (!isValidPassword(password, validationConfig.passwordRules)) {
      res.status(400).json({ message: "Weak password" });
      return;
    }

    if (!isValidUsername(username, validationConfig.usernameRules)) {
      res.status(400).json({ message: "Invalid username format" });
      return;
    }

    const normalized = normalizeEmail(email, validationConfig.emailOptions);
    if (!normalized) {
      res.status(400).json({ message: "Unsupported email domain" });
      return;
    }

    const existingUser = await getUserByEmail(normalized);
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const salt = random();
    const user = await createUser({
      email: normalized,
      username,
      authentication: { salt, password: authentication(salt, password) },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err); // good practice to pass unexpected errors to centralized error handler
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(
      email,
      validationConfig.emailOptions
    );
    if (!normalizedEmail || !password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const user = await getUserByEmail(
      normalizedEmail,
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.authentication || typeof user.authentication.salt !== "string") {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (expectedHash !== user.authentication.password) {
      res.status(403).json({ message: "Invalid credentials" });
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    if (envConfig.COOKIE_NAME && envConfig.COOKIE_DOMAIN) {
      res.cookie(envConfig.COOKIE_NAME, user.authentication.sessionToken, {
        domain: envConfig.COOKIE_DOMAIN,
        path: "/",
      });
    }
    res.status(200).json({ user }).end();
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }
};

const validate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cookieName = envConfig.COOKIE_NAME || "auth_token";
    const sessionToken = req.cookies?.[cookieName];

    if (!sessionToken) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid session" });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { register, login, validate };
