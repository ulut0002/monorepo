import { EnvConfig, INewUser } from "../../types";
import { loadEnvConfig } from "../../utils/config";

async function registerUser(
  payload: INewUser
): Promise<{ success: boolean; error?: string }> {
  const config = loadEnvConfig();

  console.log("Config", config);

  if (!config.BACKEND_HOST) {
    return { success: false, error: "Missing BACKEND_HOST in config" };
  }
  if (!config.BACKEND_PORT) {
    return { success: false, error: "Missing BACKEND_PORT in config" };
  }

  try {
    // Example: send to real DB or external service here
    console.log("Registering user", payload);

    // Simulate success
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export { registerUser };
