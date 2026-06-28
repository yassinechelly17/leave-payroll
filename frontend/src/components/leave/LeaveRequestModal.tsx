"use client";

import { useState } from "react";

import { useToast } from "@/components/ui/Toast";
import { createLeaveRequest } from "@/lib/api";
import { fieldClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/lib/styles";

type LeaveRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function LeaveRequestModal({ open, onClose, onCreated }: LeaveRequestModalProps) {
  const toast = useToast();
  const [employeeId, setEmployeeId] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createLeaveRequest({
        employeeId: parseInt(employeeId, 10),
        startDate,
        endDate,
        reason: reason.trim() || undefined,
      });
      toast("Leave request submitted", "success");
      setReason("");
      onCreated();
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Submit failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm dark:bg-black/60"
      role="presentation"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-labelledby="leave-request-modal-title"
        className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="leave-request-modal-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          New leave request
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Submit a time-off request for approval.
        </p>
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
          <label className={labelClass}>
            Employee ID
            <input
              className={fieldClass}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Start date
              <input
                type="date"
                className={fieldClass}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label className={labelClass}>
              End date
              <input
                type="date"
                className={fieldClass}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>
          </div>
          <label className={labelClass}>
            Reason
            <input
              className={fieldClass}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={submitting}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
