import { getBackendUrl } from "@monorepo/shared/config/env.utils";
import { NextRequest, NextResponse } from "next/server";

// This route handles login requests from the frontend to the backend.
// It proxies the request to the backend, captures the token cookie from the response,
// and then sets the token as an HttpOnly cookie on the Next.js domain.

export async function POST(req: NextRequest) {
  // Parse the JSON body from the request
  const body = await req.json();

  // Get the backend URL (e.g., http://localhost:4000)
  const backendHost = getBackendUrl();

  try {
    // Forward the login request to the backend API
    const response = await fetch(`${backendHost}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // If backend responds with error (e.g., 401), return error to client
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Extract Set-Cookie header from the backend response
    const rawSetCookie = response.headers.get("set-cookie");

    // Parse JSON body from backend response
    const data = await response.json();

    // Prepare response to send back to the client
    const res = NextResponse.json({ message: "Login successful", ...data });

    // If Set-Cookie header exists, extract token and set it on the response
    if (rawSetCookie) {
      const match = rawSetCookie.match(/token=([^;]+);?/);
      const token = match?.[1];

      if (token) {
        // Set the token as an HttpOnly cookie on the frontend's domain
        res.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60, // 1 hour
        });
      }
    }

    // Return success response
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
