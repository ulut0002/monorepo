import dotenv from "dotenv";
import path from "path";
import { EnvConfig } from "@shared/types/config.types";

// Absolute path to repo root
const root = path.resolve(__dirname, "../../../../");

const env = process.env.NODE_ENV || "development";
const mainEnvPath = path.join(root, `.env.${env}`);
const fallbackEnvPath = path.join(root, ".env");

dotenv.config({ path: fallbackEnvPath }); // fallback first (lowest priority)
dotenv.config({ path: mainEnvPath }); // main env next (overrides fallback)

const envConfig: EnvConfig = {
  BACKEND_URL: process.env.BACKEND_URL || "", // e.g. localhost
  BACKEND_PORT: process.env.BACKEND_PORT || "", // e.g. 8080
  BACKEND_MONGODB_URI: process.env.BACKEND_MONGODB_URI || "",
  BACKEND_JWT_SECRET_KEY: process.env.BACKEND_JWT_SECRET_KEY || "",
};

export { envConfig };
