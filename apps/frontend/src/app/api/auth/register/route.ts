// app/api/auth/register/route.ts

import { getBackendUrl } from "@shared/config/env.utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// This route proxies a registration request to the backend server.
// On successful registration, it extracts the auth token from the Set-Cookie header
// and stores it in a cookie for the frontend domain.

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendHost = getBackendUrl(); // e.g. http://localhost:4000

  try {
    // Send user data to the backend's /auth/register endpoint
    const response = await fetch(`${backendHost}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // If backend responds with an error, relay it to the frontend
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Get Set-Cookie header from the backend (containing the JWT token)
    const rawSetCookie = response.headers.get("set-cookie");
    const data = await response.json();

    if (rawSetCookie) {
      // Extract token value from "Set-Cookie: token=...;" header
      const match = rawSetCookie.match(/token=([^;]+);/);
      const token = match?.[1];

      if (token) {
        // Set the token as a cookie on the frontend domain
        const cookieStore = await cookies();
        cookieStore.set({
          name: "token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600, // 1 hour
          path: "/",
        });
      }
    }

    // Respond with success and any additional user data from backend
    return NextResponse.json({ message: "Registration successful", ...data });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
