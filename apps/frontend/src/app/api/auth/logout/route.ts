// app/api/auth/logout/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// This API route handles logging the user out by clearing the auth token cookie.
// It sets the "token" cookie to an empty value and expires it immediately.

export async function POST() {
  // Get the cookie store for the current request
  const cookieStore = await cookies();

  // Overwrite the token cookie with an empty value and expire it
  cookieStore.set({
    name: "token",
    value: "",
    maxAge: 0, // Cookie is removed immediately
    path: "/", // Make sure the cookie is cleared for the root path
  });

  // Return success message to client
  return NextResponse.json({ message: "Logged out successfully" });
}
