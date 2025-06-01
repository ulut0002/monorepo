// routes/protected.ts
import express, { Router } from "express";
import passport from "../lib/passport";

const router: Router = express.Router();

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Hello, protected world!", user: req.user });
  }
);

export default router;
