import { NextFunction, Request, Response } from "express";

const ensureBody = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.body || typeof req.body !== "object") {
    (req as any).body = {};
  }
  next();
};

export { ensureBody };
