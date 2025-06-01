import { EnvConfig } from "@shared/types/config.types";
import { envConfig } from "./env.config";

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

  return createUrl(backendUrl, backendPort);
}

function createUrl(host: string, port?: string): string {
  if (!host) {
    return "";
  }
  return port ? `${host}:${port}` : host;
}
