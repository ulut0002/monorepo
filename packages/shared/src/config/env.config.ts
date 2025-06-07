// src/shared/config/env.config.ts

import dotenv from "dotenv";
import path from "path";
import { EnvConfig } from "../types/config.types";

// This configuration file loads environment variables manually from .env files.
// It supports both a fallback .env and an environment-specific .env.{env} file.

// Resolve the absolute path to the repository root
const root = path.resolve(__dirname, "../../../../");

// Determine the current environment; default is "development"
const env = process.env.NODE_ENV || "development";

// Define paths for the fallback and main environment-specific .env files
const mainEnvPath = path.join(root, `.env.${env}`);
const fallbackEnvPath = path.join(root, ".env");

// Load the fallback .env file first (lowest priority)
dotenv.config({ path: fallbackEnvPath });

// Load the main environment-specific file next (overrides fallback values)
dotenv.config({ path: mainEnvPath });

// Extract environment variables into a typed configuration object
const envConfig: EnvConfig = {
  BACKEND_URL: process.env.BACKEND_URL || "",
  BACKEND_PORT: process.env.BACKEND_PORT || "",
  BACKEND_MONGODB_URI: process.env.BACKEND_MONGODB_URI || "",
  BACKEND_JWT_SECRET_KEY: process.env.BACKEND_JWT_SECRET_KEY || "",
};

export { envConfig };
