"use client";

import Link from "next/link";

import { PayrollStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMoney } from "@/lib/format";
import type { PayrollRecord } from "@/lib/types";
import {
  tableBodyClass,
  tableClass,
  tableHeadRowClass,
  tableRowClass,
  tableWrapClass,
  tdClass,
  thClass,
} from "@/lib/styles";

type PayrollTableProps = {
  rows: PayrollRecord[] | undefined;
  isLoading: boolean;
};

export function PayrollTable({ rows, isLoading }: PayrollTableProps) {
  const colCount = 7;

  return (
    <div className={tableWrapClass}>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr className={tableHeadRowClass}>
              <th className={thClass}>Employee</th>
              <th className={thClass}>Worked hours</th>
              <th className={thClass}>Gross</th>
              <th className={thClass}>Deductions</th>
              <th className={thClass}>Net pay</th>
              <th className={thClass}>Status</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className={tableBodyClass}>
            {isLoading && !rows
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className={tdClass}>
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className={tdClass}>
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className={tdClass}>
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className={tdClass}>
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className={tdClass}>
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className={tdClass}>
                      <Skeleton className="h-5 w-14" />
                    </td>
                    <td className={tdClass}>
                      <Skeleton className="h-4 w-10" />
                    </td>
                  </tr>
                ))
              : null}
            {!isLoading && rows?.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="p-6">
                  <EmptyState
                    title="No payroll records"
                    description="Run payroll for this period to generate payslips."
                    className="border-none bg-transparent py-6"
                  />
                </td>
              </tr>
            ) : null}
            {rows?.map((row) => (
              <tr key={row.id} className={tableRowClass}>
                <td className={`${tdClass} font-mono-data text-zinc-600 dark:text-zinc-300`}>
                  #{row.employeeId}
                </td>
                <td className={`${tdClass} font-mono-data text-zinc-800 dark:text-zinc-100`}>
                  {row.workedHours.toFixed(2)}
                </td>
                <td className={`${tdClass} font-mono-data text-zinc-800 dark:text-zinc-100`}>
                  {formatMoney(row.grossPay)}
                </td>
                <td className={`${tdClass} font-mono-data text-zinc-800 dark:text-zinc-100`}>
                  {formatMoney(row.deductions)}
                </td>
                <td className={`${tdClass} font-mono-data font-medium text-zinc-900 dark:text-zinc-50`}>
                  {formatMoney(row.netPay)}
                </td>
                <td className={tdClass}>
                  <PayrollStatusBadge status={row.status} />
                </td>
                <td className={tdClass}>
                  <Link
                    href={`/payroll/records/${row.id}`}
                    className="text-sm font-medium text-emerald-700 underline-offset-2 hover:text-emerald-600 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
