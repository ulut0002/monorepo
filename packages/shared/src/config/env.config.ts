import dotenv from "dotenv";
import path from "path";
import { EnvConfig } from "../types";

// Absolute path to repo root
const root = path.resolve(__dirname, "../../../../");

const env = process.env.NODE_ENV || "development";
const mainEnvPath = path.join(root, `.env.${env}`);
const fallbackEnvPath = path.join(root, ".env");

dotenv.config({ path: fallbackEnvPath }); // fallback first (lowest priority)
dotenv.config({ path: mainEnvPath }); // main env next (overrides fallback)

const envConfig: EnvConfig = {
  BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_URL,
  BACKEND_PORT: process.env.BACKEND_PORT || "",
  BACKEND_MONGODB_URI: process.env.BACKEND_MONGODB_URI || "",
  BACKEND_SECRET_KEY: process.env.BACKEND_SECRET_KEY || "",

  COOKIE_NAME: process.env.COOKIE_NAME || "",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || "",
};

export default envConfig;
