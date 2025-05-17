import { INewUser } from "../../types";
import { getBackendUrl, loadEnvConfig } from "../../utils/config";

async function registerUser(
  payload: INewUser
): Promise<{ success: boolean; error?: string }> {
  const config = loadEnvConfig();

  const url = getBackendUrl();

  if (!config.BACKEND_URL) {
    return { success: false, error: "Missing BACKEND_HOST in config" };
  }
  if (!config.BACKEND_PORT) {
    return { success: false, error: "Missing BACKEND_PORT in config" };
  }

  try {
    // Simulate success
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function validateUser() {
  const config = getBackendUrl();
}

export { registerUser, validateUser };
