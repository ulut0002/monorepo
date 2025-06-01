// src/routes/auth.ts

import express, { Router } from "express";
import { login, logout, me, register } from "../controllers";
import passport from "passport";

const authRouter: Router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    Authenticates a user and sets the JWT cookie
 * @access  Public
 */
authRouter.post("/login", login);

/**
 * @route   POST /auth/register
 * @desc    Registers a new user and sets the JWT cookie
 * @access  Public
 */
authRouter.post("/register", register);

/**
 * @route   GET /auth/me
 * @desc    Returns currently authenticated user's info
 * @access  Protected (requires JWT cookie)
 */
authRouter.get("/me", passport.authenticate("jwt", { session: false }), me);

/**
 * @route   POST /auth/logout
 * @desc    Clears the JWT cookie (logs user out)
 * @access  Protected (optional, since it just clears a cookie)
 */
authRouter.post("/logout", logout);

export { authRouter };
