import { Request, Response } from "express";

/**
 * Public API metadata endpoint.
 * This is useful for frontend devs, documentation tools, or simple testing.
 * It gives a quick overview of available routes and their purpose.
 */
const getApiInfo = (_req: Request, res: Response) => {
  res.json({
    name: "My Backend API", // Name of the API service
    version: "1.0.0", // Current version of the backend API
    description: "This is the public API for my backend app.",
    endpoints: [
      // Documented public endpoints (can expand over time)
      {
        path: "/auth/register",
        method: "POST",
        description: "Register a new user",
      },
      {
        path: "/auth/login",
        method: "POST",
        description: "Login and receive JWT (via cookie)",
      },
      {
        path: "/auth/me",
        method: "GET",
        description: "Get the currently authenticated user (must be logged in)",
      },
      {
        path: "/health",
        method: "GET",
        description: "Basic health check to verify API is running",
      },
    ],
  });
};

export { getApiInfo };
