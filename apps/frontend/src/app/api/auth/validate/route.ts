import { NextResponse } from "next/server";
import envConfig from "@/packages/shared/src/config/env.config";
import { cookies } from "next/headers";
import { getBackendUrl } from "@/packages/shared/src/utils/config";

export async function GET() {
  const cookieName = envConfig.COOKIE_NAME || "auth_token";
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(cookieName)?.value;

  if (!sessionToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const fullUrl = `${backendUrl}}/api/auth/validate`;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Cookie: `${cookieName}=${sessionToken}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Auth validate proxy error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
