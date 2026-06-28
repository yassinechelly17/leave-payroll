package com.platform.leave.payroll.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.platform.leave.payroll.client.MonthlyHoursResponse;
import com.platform.leave.payroll.client.PunchClockClient;
import com.platform.leave.payroll.domain.PayrollRecord;
import com.platform.leave.payroll.domain.PayrollStatus;
import com.platform.leave.payroll.repository.PayrollRecordRepository;
import com.platform.leave.payroll.web.dto.PayrollRecordResponse;

@ExtendWith(MockitoExtension.class)
class PayrollServiceTest {

	@Mock
	private PayrollRecordRepository payrollRecordRepository;

	@Mock
	private PunchClockClient punchClockClient;

	private PayrollService payrollService;

	@BeforeEach
	void setUp() {
		payrollService = new PayrollService(
			payrollRecordRepository,
			punchClockClient,
			new BigDecimal("20.00"),
			"1"
		);
	}

	@Test
	void runPayroll_calculatesNetPayFromWorkedHours() {
		when(payrollRecordRepository.findByEmployeeIdAndPeriodYearAndPeriodMonth(eq(1), eq((short) 2026), eq((short) 6)))
			.thenReturn(java.util.Optional.empty());
		when(punchClockClient.getMonthlyStats(1, 6, 2026))
			.thenReturn(new MonthlyHoursResponse(20, 2, 1, 100.0, 5.0, 2.0, 90.0));
		when(payrollRecordRepository.save(org.mockito.ArgumentMatchers.any(PayrollRecord.class)))
			.thenAnswer(invocation -> invocation.getArgument(0));

		var result = payrollService.runPayroll(6, 2026);

		assertThat(result.recordsCreated()).isEqualTo(1);
		PayrollRecordResponse record = result.records().get(0);
		assertThat(record.workedHours()).isEqualByComparingTo("100.00");
		assertThat(record.grossPay()).isEqualByComparingTo("2000.00");
		assertThat(record.netPay()).isEqualByComparingTo("2000.00");
		assertThat(record.status()).isEqualTo(PayrollStatus.FINALIZED);
	}

}
