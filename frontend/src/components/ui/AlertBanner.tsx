import type { ReactNode } from "react";

type AlertBannerProps = {
  title?: string;
  children?: ReactNode;
  variant?: "info" | "warning" | "error";
};

export function AlertBanner({ title, children, variant = "info" }: AlertBannerProps) {
  const styles =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
      : variant === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100"
        : "border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200";

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {title ? <div className="font-medium">{title}</div> : null}
      {children ? (
        <div className={title ? "mt-1 text-sm opacity-90" : "text-sm"}>{children}</div>
      ) : null}
    </div>
  );
}
