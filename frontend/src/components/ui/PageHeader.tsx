import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ title, description, meta, actions, children }: PageHeaderProps) {
  const trailing = (
    <>
      {children}
      {meta}
      {actions}
    </>
  );
  const hasTrailing = Boolean(children || meta || actions);

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      {hasTrailing ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{trailing}</div>
      ) : null}
    </div>
  );
}
