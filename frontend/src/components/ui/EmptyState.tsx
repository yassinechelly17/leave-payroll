import type { ReactNode } from "react";

import clsx from "clsx";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/40",
        className
      )}
    >
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
      {description ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
