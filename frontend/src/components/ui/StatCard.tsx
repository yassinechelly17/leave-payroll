import { Skeleton } from "@/components/ui/Skeleton";

type StatCardProps = {
  label: string;
  value: string | number | undefined;
  borderClass: string;
  textClass: string;
  loading?: boolean;
};

export function StatCard({ label, value, borderClass, textClass, loading }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border bg-zinc-50 px-4 py-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-900/40 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:hover:transform-none ${borderClass}`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {label}
      </div>
      <div className={`mt-2 min-h-[2rem] font-mono-data text-2xl tabular-nums ${textClass}`}>
        {loading ? (
          <Skeleton className="mt-1 h-8 w-16" />
        ) : value === undefined ? (
          <span className="text-zinc-400 dark:text-zinc-600">—</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
