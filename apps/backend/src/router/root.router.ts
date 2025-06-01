// src/routes/root.router.ts

import { Router } from "express";
import passport from "passport";
import { getApiInfo } from "../controllers/root.controller";

const rootRouter: Router = Router();

/**
 * @route   GET /
 * @desc    Returns basic API info (metadata, available routes, etc.)
 * @access  Protected (requires valid JWT in cookie)
 */
rootRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getApiInfo
);

export { rootRouter };
