import express from "express";
import { getUser } from "../controllers/test.controller";

export default (router: express.Router) => {
  router.get("/test/user", getUser);
};
