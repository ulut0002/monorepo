import { Request, Response, NextFunction } from "express";
import { validationConfig } from "../config/validation.config";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  normalizeEmail,
} from "@shared/utils/validators";
import { createUser, getUserById } from "../services/user.services";
import { authentication, random } from "../helpers/index";

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

    const existingUser = await getUserById(normalized);
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

export { register };
