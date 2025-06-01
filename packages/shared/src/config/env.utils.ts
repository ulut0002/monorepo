// src/shared/config/env.utils.ts

import { EnvConfig } from "@shared/types/config.types";
import { envConfig } from "./env.config";

/**
 * Returns a shallow copy of the loaded environment configuration.
 */
export function loadEnvConfig(): EnvConfig {
  return { ...envConfig };
}

/**
 * Constructs the backend URL using the host and port from environment config.
 * Returns undefined if either value is missing.
 */
export function getBackendUrl(): string | undefined {
  const config = loadEnvConfig();

  const backendUrl = config.BACKEND_URL;
  const backendPort = config.BACKEND_PORT;

  if (!backendUrl || !backendPort) {
    return undefined;
  }

  return createUrl(backendUrl, backendPort);
}

/**
 * Helper function to join host and port into a full URL string.
 * Returns an empty string if host is not defined.
 */
function createUrl(host: string, port?: string): string {
  if (!host) {
    return "";
  }
  return port ? `${host}:${port}` : host;
}
