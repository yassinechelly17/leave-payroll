"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { StatCard } from "@/components/ui/StatCard";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatMonthYear } from "@/lib/format";
import { listLeaveRequests, listPayrollRecords } from "@/lib/api";
import { panelClass } from "@/lib/styles";

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

export default function DashboardPage() {
  const { status } = useSession();
  const ready = status === "authenticated";

  const { data: leaves, error: leaveError, isLoading: leavesLoading } = useSWR(
    ready ? "dashboard-leaves" : null,
    () => listLeaveRequests()
  );

  const { data: payroll, error: payrollError, isLoading: payrollLoading } = useSWR(
    ready ? ["dashboard-payroll", currentMonth, currentYear] : null,
    () => listPayrollRecords(currentMonth, currentYear)
  );

  const err = leaveError || payrollError;
  const pending = leaves?.filter((l) => l.status === "PENDING").length;
  const totalLeaves = leaves?.length;
  const payrollCount = payroll?.length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of leave requests and payroll for your team."
      />

      {err ? (
        <AlertBanner variant="error">
          {err instanceof Error ? err.message : String(err)}
        </AlertBanner>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending approvals"
          value={pending}
          borderClass="border-amber-500/40"
          textClass="text-amber-700 dark:text-amber-400"
          loading={leavesLoading && !leaves}
        />
        <StatCard
          label="Total leave requests"
          value={totalLeaves}
          borderClass="border-emerald-500/40"
          textClass="text-emerald-700 dark:text-emerald-400"
          loading={leavesLoading && !leaves}
        />
        <StatCard
          label="Payroll records"
          value={payrollCount}
          borderClass="border-sky-500/40"
          textClass="text-sky-700 dark:text-sky-400"
          loading={payrollLoading && !payroll}
        />
        <StatCard
          label="Current period"
          value={formatMonthYear(currentMonth, currentYear)}
          borderClass="border-zinc-300/60 dark:border-zinc-700/60"
          textClass="text-zinc-800 dark:text-zinc-200 text-lg"
          loading={false}
        />
      </section>

      <section className={panelClass}>
        <h2 className="font-mono-data text-xs font-medium uppercase tracking-wider text-zinc-500">
          Quick actions
        </h2>
        <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <li>
            <Link
              href="/leave-requests?status=PENDING"
              className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-500/30 hover:bg-emerald-50 hover:text-emerald-800 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-200"
            >
              Review pending requests
              {pending !== undefined ? (
                <span className="ml-2 font-mono-data text-xs text-zinc-500">({pending})</span>
              ) : null}
            </Link>
          </li>
          <li>
            <Link
              href="/leave-requests"
              className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-500/30 hover:bg-emerald-50 hover:text-emerald-800 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-200"
            >
              All leave requests
            </Link>
          </li>
          <li>
            <Link
              href="/payroll"
              className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-emerald-500/30 hover:bg-emerald-50 hover:text-emerald-800 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-200"
            >
              Run payroll
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
