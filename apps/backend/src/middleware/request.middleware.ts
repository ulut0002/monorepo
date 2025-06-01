import { NextFunction, Request, Response } from "express";

/**
 * Middleware to ensure that `req.body` is always defined and an object.
 *
 * This prevents downstream middleware or route handlers from failing
 * due to `req.body` being `undefined`, especially when clients send no body or malformed JSON.
 */
const ensureBody = (req: Request, _res: Response, next: NextFunction) => {
  // If req.body is not defined or not an object, assign an empty object to it.
  if (!req.body || typeof req.body !== "object") {
    (req as any).body = {}; // Cast to `any` to avoid TypeScript complaints about readonly body type
  }
  // Proceed to the next middleware or route handler
  next();
};

export { ensureBody };
