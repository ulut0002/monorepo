import { Router } from "express";
import { getApiInfo } from "../controllers/root.controller";
import passport from "passport";

const rootRouter: Router = Router();

rootRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getApiInfo
);

export { rootRouter };
