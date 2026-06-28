"use client";

import { useState } from "react";
import useSWR from "swr";

import { PayrollPeriodPicker } from "@/components/payroll/PayrollPeriodPicker";
import { PayrollTable } from "@/components/payroll/PayrollTable";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { formatMonthYear } from "@/lib/format";
import { listPayrollRecords, runPayroll } from "@/lib/api";
import { primaryButtonClass } from "@/lib/styles";

const now = new Date();

export default function PayrollPage() {
  const toast = useToast();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [running, setRunning] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const swrKey = ["payroll-records", month, year] as const;

  const { data, error, isLoading, mutate } = useSWR(swrKey, () =>
    listPayrollRecords(month, year)
  );

  async function onRunPayroll() {
    setRunning(true);
    try {
      const result = await runPayroll(month, year);
      toast(`Payroll run complete — ${result.recordsCreated} record(s) created`, "success");
      setConfirmOpen(false);
      await mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Payroll run failed", "error");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Monthly payroll"
        description="Run payroll for a period and review payslip snapshots."
        actions={
          <button
            type="button"
            className={primaryButtonClass}
            onClick={() => setConfirmOpen(true)}
            disabled={running}
          >
            {running ? "Running…" : "Run payroll"}
          </button>
        }
      />

      <PayrollPeriodPicker
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      {error ? <AlertBanner variant="error">{error.message}</AlertBanner> : null}

      <PayrollTable rows={data} isLoading={isLoading} />

      <ConfirmDialog
        open={confirmOpen}
        title="Run payroll?"
        description={`Generate payroll records for ${formatMonthYear(month, year)}. Existing records for the same employee and period will be skipped.`}
        confirmLabel="Run payroll"
        busy={running}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void onRunPayroll()}
      />
    </div>
  );
}
