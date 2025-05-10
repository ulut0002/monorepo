import dotenv from "dotenv";
import path from "path";
import { EnvConfig } from "@shared/types";

const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../../../../.env.${env}`);
dotenv.config({ path: envPath });

// fallback
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
dotenv.config();

const envConfig: EnvConfig = {
  BACKEND_PORT: process.env.BACKEND_PORT || "",
  BACKEND_MONGODB_URI: process.env.BACKEND_MONGODB_URI || "",
  BACKEND_SECRET_KEY: process.env.BACKEND_SECRET_KEY || "",

  COOKIE_NAME: process.env.COOKIE_NAME || "",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || "",
};

export default envConfig;
