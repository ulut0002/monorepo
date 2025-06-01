import { Request, Response } from "express";

const getApiInfo = (_req: Request, res: Response) => {
  res.json({
    name: "My Backend API",
    version: "1.0.0",
    description: "This is the public API for my backend app.",
    endpoints: [
      {
        path: "/auth/register",
        method: "POST",
        description: "Register a new user",
      },
      {
        path: "/auth/login",
        method: "POST",
        description: "Login and receive JWT",
      },
      {
        path: "/auth/me",
        method: "GET",
        description: "Get current authenticated user",
      },
      { path: "/health", method: "GET", description: "Health check endpoint" },
      // Add more as needed
    ],
  });
};

export { getApiInfo };
