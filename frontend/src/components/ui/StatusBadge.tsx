import clsx from "clsx";

import type { LeaveStatus, PayrollStatus } from "@/lib/types";

const leaveStyles: Record<LeaveStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
  REJECTED: "bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-200",
  CANCELLED: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const payrollStyles: Record<PayrollStatus, string> = {
  DRAFT: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  FINALIZED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
};

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        leaveStyles[status]
      )}
    >
      {status}
    </span>
  );
}

export function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        payrollStyles[status]
      )}
    >
      {status}
    </span>
  );
}
