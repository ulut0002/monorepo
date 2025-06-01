// lib/auth.ts

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * Extracts and verifies the JWT token stored in the user's cookies.
 * This function is intended for use in server-side code only.
 *
 * @returns The decoded user object if the token is valid, or null if not.
 */
export async function getSessionUser() {
  // Retrieve the cookie store (Next.js server-side cookie API)
  const cookieStore = await cookies();

  // Get the value of the token cookie
  const token = cookieStore.get("token")?.value;

  // No token means no user session
  if (!token) return null;

  try {
    // Verify and decode the token using the backend's secret key
    return jwt.verify(token, process.env.BACKEND_JWT_SECRET_KEY!);
  } catch {
    // Token is invalid or expired
    return null;
  }
}
