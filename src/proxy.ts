import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "branch_down_admin_session";

function getRole(token: string | undefined) {
  try {
    const payload = token?.split(".")[0];
    if (!payload) return null;
    const encoded = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const session = JSON.parse(atob(encoded)) as { role?: string };
    return session.role;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const role = getRole(request.cookies.get(SESSION_COOKIE)?.value);
  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/home") && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/home/:path*"],
};
