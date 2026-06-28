package com.platform.leave.payroll.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.platform.leave.payroll.domain.PayrollRecord;
import com.platform.leave.payroll.domain.PayrollStatus;

public record PayrollRecordResponse(
	UUID id,
	Integer employeeId,
	short periodYear,
	short periodMonth,
	BigDecimal workedHours,
	BigDecimal grossPay,
	BigDecimal deductions,
	BigDecimal netPay,
	PayrollStatus status,
	Instant calculatedAt
) {
	public static PayrollRecordResponse from(PayrollRecord entity) {
		return new PayrollRecordResponse(
			entity.getId(),
			entity.getEmployeeId(),
			entity.getPeriodYear(),
			entity.getPeriodMonth(),
			entity.getWorkedHours(),
			entity.getGrossPay(),
			entity.getDeductions(),
			entity.getNetPay(),
			entity.getStatus(),
			entity.getCalculatedAt()
		);
	}
}
