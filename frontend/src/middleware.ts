import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Pre-migration ROPC login set this httpOnly cookie directly; the code that set/read it is gone,
// but browsers that logged in before the Keycloak migration still carry it around indefinitely
// (nothing here ever told them to drop it). It's harmless to the current NextAuth-based flow —
// nothing reads it anymore — but it's confusing when debugging (mixed old/new auth cookies on the
// same request), so proactively clear it on every response until it's flushed from old sessions.
const LEGACY_COOKIE_NAME = "att_token";

function clearLegacyCookie(res: NextResponse): NextResponse {
  res.cookies.delete(LEGACY_COOKIE_NAME);
  return res;
}

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return clearLegacyCookie(res);
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    return withNoStore(NextResponse.next());
  }
  if (pathname.startsWith("/api/session/")) {
    return withNoStore(NextResponse.next());
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const cookieHeader = req.headers.get("cookie") || "";
    const hasSessionCookie =
      cookieHeader.includes("next-auth.session-token") ||
      cookieHeader.includes("__Secure-next-auth.session-token");
    if (hasSessionCookie && !pathname.startsWith("/api/")) {
      const res = withNoStore(NextResponse.redirect(new URL("/login", req.url)));
      for (const part of cookieHeader.split(";")) {
        const name = part.trim().split("=")[0];
        if (
          name.startsWith("next-auth.session-token") ||
          name.startsWith("__Secure-next-auth.session-token") ||
          name === "att_token"
        ) {
          res.cookies.set(name, "", { path: "/", maxAge: 0, expires: new Date(0) });
        }
      }
      return res;
    }
  }

  if (pathname.startsWith("/api/backend") && !token) {
    return withNoStore(
      NextResponse.json({ error: "unauthorized", reason: "no_session" }, { status: 401 })
    );
  }
  if (pathname.startsWith("/api/")) {
    return withNoStore(NextResponse.next());
  }

  if (pathname === "/login") {
    if (token) {
      return withNoStore(NextResponse.redirect(new URL("/dashboard", req.url)));
    }
    return withNoStore(NextResponse.next());
  }

  if (pathname === "/") {
    if (token) {
      return withNoStore(NextResponse.redirect(new URL("/dashboard", req.url)));
    }
    return withNoStore(NextResponse.redirect(new URL("/login", req.url)));
  }

  if (!token) {
    return withNoStore(NextResponse.redirect(new URL("/login", req.url)));
  }

  return withNoStore(NextResponse.next());
}

export async function middleware(req: NextRequest) {
  return handle(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
