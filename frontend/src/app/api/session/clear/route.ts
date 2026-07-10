import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function clearMatchingCookies(
  res: NextResponse,
  cookieHeader: string | null,
  shouldClear: (name: string) => boolean
) {
  const names = new Set<string>();
  if (cookieHeader) {
    for (const part of cookieHeader.split(";")) {
      const name = part.trim().split("=")[0];
      if (name && shouldClear(name)) names.add(name);
    }
  }
  for (const name of [
    "next-auth.session-token",
    "next-auth.session-token.0",
    "next-auth.session-token.1",
    "next-auth.session-token.2",
    "next-auth.session-token.3",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.session-token.0",
    "__Secure-next-auth.session-token.1",
    "att_token",
  ]) {
    if (shouldClear(name)) names.add(name);
  }
  for (const name of Array.from(names)) {
    res.cookies.set(name, "", { path: "/", maxAge: 0, expires: new Date(0) });
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const scope = url.searchParams.get("scope") || "session";
  const res = NextResponse.json({ ok: true, scope });
  const header = req.headers.get("cookie");

  if (scope === "all") {
    clearMatchingCookies(
      res,
      header,
      (name) =>
        name.startsWith("next-auth.") ||
        name.startsWith("__Secure-next-auth.") ||
        name.startsWith("__Host-next-auth.") ||
        name === "att_token"
    );
  } else {
    clearMatchingCookies(
      res,
      header,
      (name) =>
        name.startsWith("next-auth.session-token") ||
        name.startsWith("__Secure-next-auth.session-token") ||
        name === "att_token"
    );
  }
  return res;
}

export async function GET(req: Request) {
  return POST(req);
}
