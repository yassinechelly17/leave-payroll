import { NextResponse } from "next/server";

import { backendUrl } from "@/lib/serverEnv";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch(`${backendUrl()}/api/health`, { cache: "no-store" });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
