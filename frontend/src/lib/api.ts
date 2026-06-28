import type {
  CreateLeaveRequest,
  LeaveRequest,
  PayrollRecord,
  PayrollRunResponse,
} from "./types";

function backendPath(path: string) {
  return `/api/backend/${path.replace(/^\//, "")}`;
}

function buildQuery(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(backendPath(path), {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  return fetchJson<T>(path, {
    method: "POST",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function patchJson<T>(path: string): Promise<T> {
  return fetchJson<T>(path, { method: "PATCH" });
}

export async function listLeaveRequests(employeeId?: number): Promise<LeaveRequest[]> {
  const query = buildQuery({ employeeId });
  return fetchJson<LeaveRequest[]>(`leave-requests${query}`);
}

export async function createLeaveRequest(body: CreateLeaveRequest): Promise<LeaveRequest> {
  return postJson<LeaveRequest>("leave-requests", body);
}

export async function approveLeaveRequest(id: string): Promise<LeaveRequest> {
  return patchJson<LeaveRequest>(`leave-requests/${id}/approve`);
}

export async function rejectLeaveRequest(id: string): Promise<LeaveRequest> {
  return patchJson<LeaveRequest>(`leave-requests/${id}/reject`);
}

export async function runPayroll(month: number, year: number): Promise<PayrollRunResponse> {
  const query = buildQuery({ month, year });
  return postJson<PayrollRunResponse>(`payroll/runs${query}`);
}

export async function listPayrollRecords(
  month: number,
  year: number
): Promise<PayrollRecord[]> {
  const query = buildQuery({ month, year });
  return fetchJson<PayrollRecord[]>(`payroll/records${query}`);
}

export async function getPayrollRecord(id: string): Promise<PayrollRecord> {
  return fetchJson<PayrollRecord>(`payroll/records/${id}`);
}
