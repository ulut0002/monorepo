import express from "express";
import {
  login,
  register,
  validate,
} from "../controllers/authentication.controller";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/validate", validate);
};
