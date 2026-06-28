"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leave-requests", label: "Leave requests" },
  { href: "/payroll", label: "Payroll" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 md:h-full md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 md:block md:border-b-0 md:px-4 md:pt-5 md:pb-2">
          <div className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Leave & Payroll
          </div>
        </div>
        <nav className="flex max-h-[40vh] flex-wrap gap-1 overflow-y-auto overscroll-contain px-2 py-2 md:max-h-none md:flex-1 md:flex-col md:px-2 md:py-3">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-emerald-600/15 font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => {
              void fetch("/api/session/logout", { method: "POST" }).finally(() => {
                router.replace("/login");
                router.refresh();
              });
            }}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
