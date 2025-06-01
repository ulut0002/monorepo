// src/routes/auth.ts

import express, { Router } from "express";
import { login, logout, me, register } from "../controllers";
import passport from "passport";

const authRouter: Router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    Logs in a user and issues a JWT as an HttpOnly cookie.
 * @access  Public
 */
authRouter.post("/login", login);

/**
 * @route   POST /auth/register
 * @desc    Creates a new user account and issues a JWT as an HttpOnly cookie.
 * @access  Public
 */
authRouter.post("/register", register);

/**
 * @route   GET /auth/me
 * @desc    Returns the authenticated user's public profile.
 * @access  Protected - requires a valid JWT in the cookie.
 */
authRouter.get("/me", passport.authenticate("jwt", { session: false }), me);

/**
 * @route   POST /auth/logout
 * @desc    Logs the user out by clearing the JWT cookie.
 * @access  Optional protection — works even if the user is already logged out.
 */
authRouter.post("/logout", logout);

export { authRouter };
