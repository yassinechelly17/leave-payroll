"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { fieldClass, primaryButtonClass, labelClass } from "@/lib/styles";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Login failed");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="absolute right-4 top-4 z-10 w-40">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="font-mono-data text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500">
            Leave & Payroll
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-500">
            Use Keycloak credentials when infra is running, or dev bypass locally.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-900/60">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <label className={labelClass}>
              Username
              <input
                className={fieldClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className={labelClass}>
              Password
              <input
                type="password"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}
            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
