package com.platform.leave.payroll;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class FlywayMigrationIntegrationTest {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void flywayCreatesDomainTables() {
		Integer leaveTable = jdbcTemplate.queryForObject(
			"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'LEAVE_REQUEST'",
			Integer.class
		);
		Integer payrollTable = jdbcTemplate.queryForObject(
			"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'PAYROLL_RECORD'",
			Integer.class
		);
		assertThat(leaveTable).isEqualTo(1);
		assertThat(payrollTable).isEqualTo(1);
	}

}
