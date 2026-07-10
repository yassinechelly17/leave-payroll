"use client";

import { SessionProvider } from "next-auth/react";

import { SessionRecovery } from "@/components/SessionRecovery";

export function Providers({ children }: { children: React.ReactNode }) {
  // Keycloak access tokens live ~5min; polling well under that keeps the NextAuth session cookie
  // itself refreshed (via the jwt callback in lib/auth.ts) for as long as the tab stays open,
  // independent of window-focus refetching. The BFF proxy also self-heals on a stale/expired
  // cookie (see api/backend/[...path]/route.ts), so this is a defense-in-depth optimization,
  // not the only thing keeping backend calls authenticated.
  return (
    <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus>
      <SessionRecovery />
      {children}
    </SessionProvider>
  );
}
