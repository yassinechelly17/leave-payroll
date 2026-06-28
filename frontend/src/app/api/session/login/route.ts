import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE, DEV_SESSION_TOKEN } from "@/lib/auth-cookie";
import {
  devBypassAuth,
  keycloakClientId,
  keycloakClientSecret,
  keycloakTokenUrl,
} from "@/lib/serverEnv";

export const dynamic = "force-dynamic";

async function loginWithKeycloak(username: string, password: string) {
  const tokenUrl = keycloakTokenUrl();
  if (!tokenUrl) {
    return null;
  }

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: keycloakClientId(),
    client_secret: keycloakClientSecret(),
    username,
    password,
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Keycloak login failed");
  }

  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "username and password required" }, { status: 400 });
  }

  let token: string | null = null;

  if (keycloakTokenUrl()) {
    try {
      token = await loginWithKeycloak(username, password);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: detail }, { status: 401 });
    }
  } else if (devBypassAuth()) {
    token = DEV_SESSION_TOKEN;
  } else {
    return NextResponse.json(
      { error: "Keycloak not configured. Set KEYCLOAK_TOKEN_URL or DEV_BYPASS_AUTH=true." },
      { status: 503 }
    );
  }

  if (!token) {
    return NextResponse.json({ error: "login failed" }, { status: 401 });
  }

  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
