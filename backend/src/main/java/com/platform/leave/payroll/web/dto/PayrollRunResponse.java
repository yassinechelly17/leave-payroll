package com.platform.leave.payroll.web.dto;

import java.util.List;

public record PayrollRunResponse(
	short periodYear,
	short periodMonth,
	int recordsCreated,
	List<PayrollRecordResponse> records
) {
}
