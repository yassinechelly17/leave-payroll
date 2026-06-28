"use client";

import { useCallback, useEffect, useState } from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme-script";

type Theme = "light" | "dark";

function readDomTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readDomTheme());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readDomTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100/80 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200/90 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
