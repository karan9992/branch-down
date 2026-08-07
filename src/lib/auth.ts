import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

export const SESSION_COOKIE = "branch_down_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type Session = {
  userId: string;
  expiresAt: number;
  role: "USER" | "ADMIN";
};

const scrypt = promisify(scryptCallback);

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isAuthConfigured() {
  return Boolean(getAuthSecret());
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safelyMatches(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) return false;

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return safelyMatches(derivedKey.toString("hex"), storedHash);
}

export function createSession(userId: string, role: Session["role"]) {
  const secret = getAuthSecret();
  if (!secret) throw new Error("Authentication is not configured.");

  const session: Session = {
    userId,
    role,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

export function verifySession(token: string | undefined): Session | null {
  const secret = getAuthSecret();
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safelyMatches(signature, sign(payload, secret))) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    return (session.role === "ADMIN" || session.role === "USER") && session.userId && session.expiresAt > Math.floor(Date.now() / 1000)
      ? session
      : null;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
