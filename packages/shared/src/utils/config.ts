import { EnvConfig } from "../types";

import envConfig from "@/packages/shared/src/config/env.config";

export function loadEnvConfig(): EnvConfig {
  return { ...envConfig };
}

export function getBackendUrl(): string | undefined {
  const config = loadEnvConfig();

  const backendUrl = config.BACKEND_URL;
  const backendPort = config.BACKEND_PORT;

  if (!backendUrl || !backendPort) {
    return undefined;
  }

  return `${backendUrl}:${backendPort}`;
}
