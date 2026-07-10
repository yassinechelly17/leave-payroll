"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { SignInButton } from "@/components/AuthButtons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AlertBanner } from "@/components/ui/AlertBanner";

function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;
  return <AlertBanner variant="error">Sign-in failed. Please try again.</AlertBanner>;
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="absolute right-4 top-4 z-10 w-40">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="font-mono-data text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500">
            Leave &amp; Payroll
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-500">
            Sign in with your Keycloak credentials.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-900/60">
          <div className="flex flex-col gap-5">
            <Suspense fallback={null}>
              <LoginError />
            </Suspense>
            <SignInButton />
          </div>
        </div>
      </div>
    </div>
  );
}
