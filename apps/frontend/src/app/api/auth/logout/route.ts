// app/api/auth/logout/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendUrl } from "@shared/config/env.utils";

// This route clears the token cookie and optionally notifies the backend logout endpoint.

export async function POST() {
  const cookieStore = await cookies();

  // Clear the cookie on the client
  cookieStore.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  // Fire-and-forget backend logout (no need to await)
  const backendHost = getBackendUrl();
  if (backendHost) {
    fetch(`${backendHost}/auth/logout`, {
      method: "POST",
      credentials: "include", // if backend needs cookies
    }).catch((err) => {
      console.error("Failed to notify backend logout:", err);
    });
  }

  return NextResponse.json({ message: "Logged out successfully" });
}
