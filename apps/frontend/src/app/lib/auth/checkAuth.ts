// lib/auth/checkAuth.ts
import {
  getBackendUrl,
  loadEnvConfig,
} from "@/packages/shared/src/utils/config";
import { GetServerSidePropsContext } from "next";
import { User } from "@shared/types"; // Make sure this exists and matches backend
// utils/auth.ts

interface AuthResult {
  isAuthenticated: boolean;
  user?: User;
}

export async function checkAuth(
  context: GetServerSidePropsContext
): Promise<AuthResult> {
  const config = loadEnvConfig();

  if (!config.COOKIE_NAME) {
    return { isAuthenticated: false };
  }

  const cookie = context.req.cookies[config.COOKIE_NAME];
  const url = getBackendUrl();

  if (!cookie || !url) {
    return { isAuthenticated: false };
  }

  const fullUrl = `${url}/api/auth/validate`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        Cookie: `${config.COOKIE_NAME}=${cookie}`,
      },
    });

    if (!response.ok) throw new Error(`Failed auth call: ${response.status}`);

    const data = await response.json();

    if (data.success && data.user) {
      return {
        isAuthenticated: true,
        user: data.user,
      };
    }

    return { isAuthenticated: false };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { isAuthenticated: false };
  }
}
