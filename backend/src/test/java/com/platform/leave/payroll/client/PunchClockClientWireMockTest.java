package com.platform.leave.payroll.client;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

class PunchClockClientWireMockTest {

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Test
	void monthlyHoursResponse_deserializesWorkedHours() throws Exception {
		MonthlyHoursResponse response = objectMapper.readValue("""
			{
			  "daysPresent": 20,
			  "daysAbsent": 2,
			  "lateCount": 1,
			  "workedHours": 168.5,
			  "overtimeHours": 4.0,
			  "breakHours": 2.0,
			  "punctualityPct": 92.0
			}
			""", MonthlyHoursResponse.class);

		assertThat(response.workedHours()).isEqualTo(168.5);
		assertThat(response.daysPresent()).isEqualTo(20);
	}

}
