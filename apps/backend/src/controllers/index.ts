// Re-export controller functions for use in route handlers or app entry points.
// This centralizes exports and keeps imports cleaner wherever these handlers are used.

import {
  configureJwtStrategy, // Passport strategy to extract JWT from cookies and validate user
  login, // Controller to handle user login (JWT issued via cookie)
  register, // Controller to handle new user registration
  me, // Returns currently authenticated user (via cookie-authenticated request)
  logout, // Clears auth cookie to log user out
} from "./authentication.controller";

import { getApiInfo } from "./root.controller"; // Returns basic public API metadata (e.g., /api root route)

export { register, login, configureJwtStrategy, getApiInfo, logout, me };
