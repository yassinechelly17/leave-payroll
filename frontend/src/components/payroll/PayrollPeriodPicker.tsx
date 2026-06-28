"use client";

import { MONTH_NAMES } from "@/lib/format";
import { fieldClass, filterPanelClass, labelClass } from "@/lib/styles";

type PayrollPeriodPickerProps = {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

function yearOptions(): number[] {
  const current = new Date().getFullYear();
  return [current - 2, current - 1, current, current + 1, current + 2];
}

export function PayrollPeriodPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
}: PayrollPeriodPickerProps) {
  return (
    <div className={filterPanelClass}>
      <label className={`${labelClass} w-44`}>
        Month
        <select
          className={fieldClass}
          value={month}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (Number.isFinite(v) && v >= 1 && v <= 12) onMonthChange(v);
          }}
        >
          {MONTH_NAMES.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className={`${labelClass} w-32`}>
        Year
        <select
          className={fieldClass}
          value={year}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (Number.isFinite(v)) onYearChange(v);
          }}
        >
          {yearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
