"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

import { primaryButtonClass } from "@/lib/styles";

export function SignInButton() {
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    setBusy(true);
    try {
      await fetch("/api/session/clear", { method: "POST", credentials: "include" });
      await signIn("keycloak", { callbackUrl: "/dashboard" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={handleSignIn} disabled={busy} className={primaryButtonClass}>
      {busy ? "Signing in…" : "Sign in with Keycloak"}
    </button>
  );
}

const signOutButtonClassName =
  "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";

export function SignOutButton() {
  async function handleSignOut() {
    let federatedLogoutUrl: string | null = null;
    try {
      const res = await fetch("/api/session/logout");
      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        federatedLogoutUrl = data.url ?? null;
      }
    } catch {
      // Local-only sign-out below is an acceptable fallback if this call fails.
    }

    await signOut({ redirect: false });
    await fetch("/api/session/clear?scope=all", { method: "POST", credentials: "include" }).catch(
      () => {}
    );
    window.location.replace(federatedLogoutUrl ?? "http://localhost:8085");
  }

  return (
    <button type="button" onClick={handleSignOut} className={signOutButtonClassName}>
      Log out
    </button>
  );
}
