package com.platform.leave.payroll.client;

public record MonthlyHoursResponse(
	int daysPresent,
	int daysAbsent,
	int lateCount,
	double workedHours,
	double overtimeHours,
	double breakHours,
	double punctualityPct
) {
}
