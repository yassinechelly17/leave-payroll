"use client";

import { useState } from "react";

import { LeaveStatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  formatDateRange,
  formatDateTime,
  leaveDurationDays,
} from "@/lib/format";
import type { LeaveRequest } from "@/lib/types";
import {
  dangerGhostButtonClass,
  ghostButtonClass,
  primaryButtonClass,
  tableBodyClass,
  tableClass,
  tableHeadRowClass,
  tableRowClass,
  tableWrapClass,
  tdClass,
  thClass,
} from "@/lib/styles";

type LeaveRequestTableProps = {
  rows: LeaveRequest[] | undefined;
  isLoading: boolean;
  actionId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCreateClick?: () => void;
};

export function LeaveRequestTable({
  rows,
  isLoading,
  actionId,
  onApprove,
  onReject,
  onCreateClick,
}: LeaveRequestTableProps) {
  const [rejectId, setRejectId] = useState<string | null>(null);

  const colCount = 6;

  return (
    <>
      <div className={tableWrapClass}>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={tableHeadRowClass}>
                <th className={thClass}>Employee</th>
                <th className={thClass}>Dates</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Reason</th>
                <th className={thClass}>Submitted</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className={tableBodyClass}>
              {isLoading && !rows
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className={tdClass}>
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className={tdClass}>
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className={tdClass}>
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className={tdClass}>
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className={tdClass}>
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className={tdClass}>
                        <Skeleton className="h-4 w-20" />
                      </td>
                    </tr>
                  ))
                : null}
              {!isLoading && rows?.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="p-6">
                    <EmptyState
                      title="No leave requests"
                      description="Submit a new request to get started."
                      action={
                        onCreateClick ? (
                          <button type="button" className={primaryButtonClass} onClick={onCreateClick}>
                            Create first request
                          </button>
                        ) : undefined
                      }
                      className="border-none bg-transparent py-6"
                    />
                  </td>
                </tr>
              ) : null}
              {rows?.map((row) => {
                const days = leaveDurationDays(row.startDate, row.endDate);
                const busy = actionId === row.id;
                return (
                  <tr key={row.id} className={tableRowClass}>
                    <td className={`${tdClass} font-mono-data text-zinc-600 dark:text-zinc-300`}>
                      #{row.employeeId}
                    </td>
                    <td className={tdClass}>
                      <div className="text-zinc-800 dark:text-zinc-100">
                        {formatDateRange(row.startDate, row.endDate)}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {days} day{days === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <LeaveStatusBadge status={row.status} />
                    </td>
                    <td
                      className={`${tdClass} max-w-[12rem] truncate text-zinc-600 dark:text-zinc-300`}
                      title={row.reason ?? undefined}
                    >
                      {row.reason || "—"}
                    </td>
                    <td className={`${tdClass} font-mono-data text-xs text-zinc-500 dark:text-zinc-400`}>
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td className={tdClass}>
                      {row.status === "PENDING" ? (
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            className={ghostButtonClass}
                            disabled={busy}
                            onClick={() => onApprove(row.id)}
                          >
                            {busy ? "…" : "Approve"}
                          </button>
                          <button
                            type="button"
                            className={dangerGhostButtonClass}
                            disabled={busy}
                            onClick={() => setRejectId(row.id)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={rejectId !== null}
        title="Reject leave request?"
        description="This will mark the request as rejected. The employee may need to submit a new request."
        confirmLabel="Reject"
        variant="danger"
        busy={actionId === rejectId}
        onCancel={() => setRejectId(null)}
        onConfirm={() => {
          if (rejectId) {
            onReject(rejectId);
            setRejectId(null);
          }
        }}
      />
    </>
  );
}
