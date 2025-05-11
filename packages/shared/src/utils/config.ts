import { EnvConfig } from "../types";
import dotenv from "dotenv";
import envConfig from "@/packages/shared/src/config/env.config";

export function loadEnvConfig(): EnvConfig {
  return { ...envConfig };
}
