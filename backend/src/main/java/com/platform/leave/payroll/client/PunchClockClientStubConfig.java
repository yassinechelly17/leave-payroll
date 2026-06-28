package com.platform.leave.payroll.client;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"local", "test"})
public class PunchClockClientStubConfig {

	@Bean
	PunchClockClient punchClockClient() {
		return (employeeId, month, year) -> new MonthlyHoursResponse(
			20, 2, 1, 160.0, 8.0, 4.0, 95.0
		);
	}

}
