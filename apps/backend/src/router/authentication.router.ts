// src/routes/auth.ts
import express, { Router } from "express";
import { login, register } from "../controllers";

const authRouter: Router = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

export { authRouter };
