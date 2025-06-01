import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.BACKEND_JWT_SECRET_KEY!);
  } catch {
    return null;
  }
}
