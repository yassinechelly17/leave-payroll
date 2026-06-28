export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200/90 dark:bg-zinc-800/80 ${className}`}
      aria-hidden
    />
  );
}
