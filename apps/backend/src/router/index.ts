import express from "express";
import authenticationRouter from "./authentication.router";
import usersRouter from "./users.router";
import testRouter from "./test.router";
const router = express.Router();

export default (): express.Router => {
  authenticationRouter(router);
  usersRouter(router);
  testRouter(router);
  return router;
};
