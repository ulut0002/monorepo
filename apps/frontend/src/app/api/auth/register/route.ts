import { NextRequest, NextResponse } from "next/server";
import { INewUser } from "@shared/types";
import { registerUser } from "@shared/services/auth/auth.services";
export async function POST(req: NextRequest) {
  try {
    const payload: INewUser = await req.json();

    if (!payload.email || !payload.password || !payload.username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await registerUser(payload);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Register endpoint is live",
    timestamp: new Date().toISOString(),
  });
}
