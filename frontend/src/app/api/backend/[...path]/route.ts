import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { refreshAccessToken } from "@/lib/auth";
import { backendUrl } from "@/lib/serverEnv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function targetUrl(req: NextRequest, segments: string[]) {
  const path = segments.join("/");
  const search = req.nextUrl.search;
  return `${backendUrl()}/${path}${search}`;
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json(
      { error: "unauthorized", reason: "no_session" },
      { status: 401 }
    );
  }

  const accessToken = token?.accessToken as string | undefined;
  const needsRefresh =
    Boolean(token.refreshToken) &&
    (!accessToken ||
      !token.accessTokenExpires ||
      Date.now() >= (token.accessTokenExpires as number) - 10_000);
  if (needsRefresh) {
    token = await refreshAccessToken(token);
  }

  const refreshedAccessToken = token?.accessToken as string | undefined;
  if (!refreshedAccessToken || token?.error) {
    return NextResponse.json(
      {
        error: "unauthorized",
        reason: token?.error === "RefreshAccessTokenError" ? "refresh_failed" : "no_access_token",
        hasRefreshToken: Boolean(token?.refreshToken),
        hasAccessToken: Boolean(refreshedAccessToken),
      },
      { status: 401 }
    );
  }

  const url = targetUrl(req, pathSegments);
  const method = req.method;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${refreshedAccessToken}`);
  const accept = req.headers.get("accept");
  if (accept) headers.set("Accept", accept);

  try {
    if (method === "GET" || method === "HEAD") {
      const res = await fetch(url, { method, headers });
      const out = new Headers();
      const ct = res.headers.get("content-type");
      if (ct) out.set("Content-Type", ct);
      out.set("Cache-Control", "no-store");
      return new NextResponse(res.body, { status: res.status, headers: out });
    }

    const ct = req.headers.get("content-type");
    if (ct) headers.set("Content-Type", ct);

    const res = await fetch(url, {
      method,
      headers,
      body: req.body,
      // @ts-expect-error duplex required when forwarding a body (Node fetch)
      duplex: "half",
    });

    const out = new Headers();
    const outCt = res.headers.get("content-type");
    if (outCt) out.set("Content-Type", outCt);
    out.set("Cache-Control", "no-store");
    return new NextResponse(res.body, { status: res.status, headers: out });
  } catch {
    return NextResponse.json(
      { error: "backend_unavailable", message: "API gateway or backend is not reachable" },
      { status: 503 }
    );
  }
}

type Ctx = { params: { path: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function HEAD(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path);
}
