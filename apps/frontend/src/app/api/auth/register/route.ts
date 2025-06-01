// app/api/auth/register/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await fetch("http://localhost:4000/register", {
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
          maxAge: 3600,
          path: "/",
        });
      }
    }

    return NextResponse.json({ message: "Registration successful", ...data });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
