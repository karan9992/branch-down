import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, getSessionCookieOptions, hashPassword, isAuthConfigured, SESSION_COOKIE } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  adminCode: z.string().nullable().optional().transform((value) => value ?? undefined),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid registration details." }, { status: 400 });
  }
  if (!isAuthConfigured()) {
    return NextResponse.json({ message: "Authentication is not configured. Set AUTH_SECRET first." }, { status: 503 });
  }

  const { name, email, password, role, adminCode } = parsed.data;
  if (role === "ADMIN" && (!process.env.ADMIN_REGISTRATION_CODE || adminCode !== process.env.ADMIN_REGISTRATION_CODE)) {
    return NextResponse.json({ message: "A valid administrator registration code is required." }, { status: 403 });
  }

  await connectDB();
  const existingUser = await User.exists({ email });
  if (existingUser) {
    return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
  }

  const user = await User.create({ name, email, role, passwordHash: await hashPassword(password) });
  const response = NextResponse.json({ success: true, role: user.role }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, createSession(user._id.toString(), user.role), getSessionCookieOptions());
  return response;
}
