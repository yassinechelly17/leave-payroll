package com.platform.leave.payroll.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "attendance-backend")
public interface PunchClockClient {

	@GetMapping("/api/employees/{employeeId}/monthly")
	MonthlyHoursResponse getMonthlyStats(
		@PathVariable("employeeId") Integer employeeId,
		@RequestParam("month") int month,
		@RequestParam("year") int year
	);

}
