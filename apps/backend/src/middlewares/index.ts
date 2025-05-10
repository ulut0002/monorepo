import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../services/user.services";
import envConfig from "@/packages/shared/src/config/env.config";

const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const COOKIE_NAME = envConfig.COOKIE_NAME || "";

    const sessionToken = req.cookies[COOKIE_NAME];
    if (!sessionToken) {
      res.status(403).json({ message: "Unauthorized1" });
      return;
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      res.status(403).json({ message: "Unauthorized2" });
      return;
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unauthorized3" });
    return;
  }
};

const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId =
      typeof get(req, "identity._id") === "object"
        ? get(req, "identity._id").toString()
        : "";

    if (!currentUserId) {
      res.status(403).json({ message: "Unauthorized4" });
      return;
    }
    if (currentUserId !== id) {
      res.status(403).json({ message: "Unauthorized5" });
      return;
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unauthorized6" });
    return;
  }
};

export { isAuthenticated, isOwner };
