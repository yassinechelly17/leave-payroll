export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type PayrollStatus = "DRAFT" | "FINALIZED";

export interface LeaveRequest {
  id: string;
  employeeId: number;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveRequest {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: number;
  periodYear: number;
  periodMonth: number;
  workedHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  calculatedAt: string;
}

export interface PayrollRunResponse {
  periodYear: number;
  periodMonth: number;
  recordsCreated: number;
  records: PayrollRecord[];
}
