import { NextResponse } from "next/server";
import {
  createSession,
  getSessionCookieOptions,
  isAuthConfigured,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }
  if (!isAuthConfigured()) {
    return NextResponse.json({ message: "Authentication is not configured. Set AUTH_SECRET first." }, { status: 503 });
  }

  await connectDB();
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || typeof user.passwordHash !== "string" || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, role: user.role });
  response.cookies.set(SESSION_COOKIE, createSession(user._id.toString(), user.role), getSessionCookieOptions());
  return response;
}
