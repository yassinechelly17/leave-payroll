package com.platform.leave.payroll.web.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record CreateLeaveRequest(
	@NotNull Integer employeeId,
	@NotNull LocalDate startDate,
	@NotNull LocalDate endDate,
	String reason
) {
}
