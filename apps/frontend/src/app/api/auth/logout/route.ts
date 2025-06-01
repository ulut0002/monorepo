// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: "",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return NextResponse.json({ message: "Logged out successfully" });
}
