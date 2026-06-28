-- leave_request: owned by leave-payroll only
CREATE TABLE leave_request (
  id UUID PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  reason TEXT,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE payroll_record (
  id UUID PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  period_year SMALLINT NOT NULL,
  period_month SMALLINT NOT NULL,
  worked_hours NUMERIC(10,2) NOT NULL,
  gross_pay NUMERIC(12,2) NOT NULL,
  deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (employee_id, period_year, period_month)
);

CREATE INDEX idx_leave_request_employee ON leave_request(employee_id);
CREATE INDEX idx_payroll_record_period ON payroll_record(period_year, period_month);
