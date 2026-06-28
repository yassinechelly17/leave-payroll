import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth-cookie";

const devBypass = process.env.DEV_BYPASS_AUTH === "true";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/session/login") || pathname.startsWith("/api/session/logout")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/backend") && !token && !devBypass) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (devBypass) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
