package com.platform.leave.payroll.web.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.platform.leave.payroll.domain.LeaveRequest;
import com.platform.leave.payroll.domain.LeaveStatus;

public record LeaveRequestResponse(
	UUID id,
	Integer employeeId,
	LocalDate startDate,
	LocalDate endDate,
	LeaveStatus status,
	String reason,
	UUID approvedBy,
	Instant createdAt,
	Instant updatedAt
) {
	public static LeaveRequestResponse from(LeaveRequest entity) {
		return new LeaveRequestResponse(
			entity.getId(),
			entity.getEmployeeId(),
			entity.getStartDate(),
			entity.getEndDate(),
			entity.getStatus(),
			entity.getReason(),
			entity.getApprovedBy(),
			entity.getCreatedAt(),
			entity.getUpdatedAt()
		);
	}
}
