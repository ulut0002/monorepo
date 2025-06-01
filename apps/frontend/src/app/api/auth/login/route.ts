import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Get the token from the backend response cookie
    const rawSetCookie = response.headers.get("set-cookie");
    const data = await response.json();

    if (rawSetCookie) {
      const match = rawSetCookie.match(/token=([^;]+);/);
      const token = match?.[1];

      if (token) {
        const cookieStore = await cookies();
        cookieStore.set({
          name: "token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60,
        });
      }
    }

    return NextResponse.json({ message: "Login successful", ...data });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
