"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { LeaveRequestModal } from "@/components/leave/LeaveRequestModal";
import { LeaveRequestTable } from "@/components/leave/LeaveRequestTable";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import {
  approveLeaveRequest,
  listLeaveRequests,
  rejectLeaveRequest,
} from "@/lib/api";
import type { LeaveStatus } from "@/lib/types";
import { fieldClass, filterPanelClass, labelClass, primaryButtonClass } from "@/lib/styles";

type StatusFilter = "all" | LeaveStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

function parseStatusParam(raw: string | null): StatusFilter {
  if (raw === "PENDING" || raw === "APPROVED" || raw === "REJECTED" || raw === "CANCELLED") {
    return raw;
  }
  return "all";
}

export default function LeaveRequestsContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [employeeFilterInput, setEmployeeFilterInput] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() =>
    parseStatusParam(searchParams.get("status"))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    setStatusFilter(parseStatusParam(searchParams.get("status")));
  }, [searchParams]);

  useEffect(() => {
    const t = window.setTimeout(() => setEmployeeFilter(employeeFilterInput), 350);
    return () => window.clearTimeout(t);
  }, [employeeFilterInput]);

  const filterId = employeeFilter.trim() ? parseInt(employeeFilter.trim(), 10) : undefined;
  const swrKey = ["leave-requests", Number.isFinite(filterId) ? filterId : null] as const;

  const { data, error, isLoading, mutate } = useSWR(swrKey, () =>
    listLeaveRequests(Number.isFinite(filterId) ? filterId : undefined)
  );

  const filteredRows = useMemo(() => {
    if (!data) return undefined;
    if (statusFilter === "all") return data;
    return data.filter((r) => r.status === statusFilter);
  }, [data, statusFilter]);

  const onApprove = useCallback(
    async (id: string) => {
      setActionId(id);
      try {
        await approveLeaveRequest(id);
        toast("Leave request approved", "success");
        await mutate();
      } catch (e) {
        toast(e instanceof Error ? e.message : "Approve failed", "error");
      } finally {
        setActionId(null);
      }
    },
    [mutate, toast]
  );

  const onReject = useCallback(
    async (id: string) => {
      setActionId(id);
      try {
        await rejectLeaveRequest(id);
        toast("Leave request rejected", "success");
        await mutate();
      } catch (e) {
        toast(e instanceof Error ? e.message : "Reject failed", "error");
      } finally {
        setActionId(null);
      }
    },
    [mutate, toast]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leave requests"
        description="Submit time-off requests and manage approvals."
        actions={
          <button
            type="button"
            className={primaryButtonClass}
            onClick={() => setModalOpen(true)}
          >
            New request
          </button>
        }
      />

      <div className={filterPanelClass}>
        <label className="block min-w-[10rem] flex-1">
          <span className={labelClass}>Filter by employee ID</span>
          <input
            className={fieldClass}
            value={employeeFilterInput}
            onChange={(e) => setEmployeeFilterInput(e.target.value)}
            placeholder="All employees"
          />
        </label>
        <label className="block w-44">
          <span className={labelClass}>Status</span>
          <select
            className={fieldClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <AlertBanner variant="error">{error.message}</AlertBanner> : null}

      <LeaveRequestTable
        rows={filteredRows}
        isLoading={isLoading}
        actionId={actionId}
        onApprove={(id) => void onApprove(id)}
        onReject={(id) => void onReject(id)}
        onCreateClick={() => setModalOpen(true)}
      />

      <LeaveRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => void mutate()}
      />
    </div>
  );
}
