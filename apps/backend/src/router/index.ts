import express from "express";
import authenticationRouter from "./authentication.router";

const router = express.Router();

export default (): express.Router => {
  authenticationRouter(router);
  return router;
};
