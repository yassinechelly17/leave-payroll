import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth-cookie";

export const dynamic = "force-dynamic";

export async function POST() {
  cookies().set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
