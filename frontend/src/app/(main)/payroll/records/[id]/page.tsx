"use client";

import Link from "next/link";
import useSWR from "swr";

import { PayrollStatusBadge } from "@/components/ui/StatusBadge";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime, formatMoney, formatMonthYear } from "@/lib/format";
import { getPayrollRecord } from "@/lib/api";
import { panelClass, secondaryButtonClass } from "@/lib/styles";

export default function PayrollRecordPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(["payroll-record", params.id], () =>
    getPayrollRecord(params.id)
  );

  return (
    <div className="space-y-8">
      {data ? (
        <nav className="text-sm text-zinc-600 dark:text-zinc-400" aria-label="Breadcrumb">
          <Link
            href="/payroll"
            className="text-emerald-700 hover:underline dark:text-emerald-300"
          >
            Payroll
          </Link>
          <span className="mx-1.5 text-zinc-400">/</span>
          <span className="text-zinc-800 dark:text-zinc-200">Payslip</span>
        </nav>
      ) : null}

      <PageHeader
        title="Payslip detail"
        description="Snapshot of worked hours and pay for this period."
        actions={
          <Link href="/payroll" className={secondaryButtonClass}>
            Back to payroll
          </Link>
        }
      />

      {error ? (
        <AlertBanner variant="error">{error.message}</AlertBanner>
      ) : isLoading || !data ? (
        <Skeleton className="h-72 w-full max-w-xl" />
      ) : (
        <div className={`${panelClass} mx-auto max-w-xl`}>
          <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div>
              <p className="font-mono-data text-xs uppercase tracking-wider text-zinc-500">
                Payslip
              </p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Employee #{data.employeeId}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {formatMonthYear(data.periodMonth, data.periodYear)}
              </p>
            </div>
            <PayrollStatusBadge status={data.status} />
          </div>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 py-3 dark:border-zinc-800/80">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">Worked hours</dt>
              <dd className="font-mono-data text-sm text-zinc-900 dark:text-zinc-100">
                {data.workedHours.toFixed(2)} h
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-100 py-3 dark:border-zinc-800/80">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">Gross pay</dt>
              <dd className="font-mono-data text-sm text-zinc-900 dark:text-zinc-100">
                {formatMoney(data.grossPay)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-100 py-3 dark:border-zinc-800/80">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">Deductions</dt>
              <dd className="font-mono-data text-sm text-red-700 dark:text-red-400">
                −{formatMoney(data.deductions)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-4 dark:bg-emerald-950/30">
              <dt className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Net pay</dt>
              <dd className="font-mono-data text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {formatMoney(data.netPay)}
              </dd>
            </div>
            <div className="flex items-center justify-between pt-2">
              <dt className="text-xs text-zinc-500">Calculated at</dt>
              <dd className="font-mono-data text-xs text-zinc-500">
                {formatDateTime(data.calculatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
