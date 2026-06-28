package com.platform.leave.payroll.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platform.leave.payroll.client.MonthlyHoursResponse;
import com.platform.leave.payroll.client.PunchClockClient;
import com.platform.leave.payroll.domain.PayrollRecord;
import com.platform.leave.payroll.domain.PayrollStatus;
import com.platform.leave.payroll.repository.PayrollRecordRepository;
import com.platform.leave.payroll.web.advice.BadRequestException;
import com.platform.leave.payroll.web.advice.ResourceNotFoundException;
import com.platform.leave.payroll.web.dto.PayrollRecordResponse;
import com.platform.leave.payroll.web.dto.PayrollRunResponse;

@Service
public class PayrollService {

	private final PayrollRecordRepository payrollRecordRepository;
	private final PunchClockClient punchClockClient;
	private final BigDecimal hourlyRate;
	private final List<Integer> defaultEmployeeIds;

	public PayrollService(
		PayrollRecordRepository payrollRecordRepository,
		PunchClockClient punchClockClient,
		@Value("${app.payroll.hourly-rate}") BigDecimal hourlyRate,
		@Value("${app.payroll.default-employee-ids}") String defaultEmployeeIds
	) {
		this.payrollRecordRepository = payrollRecordRepository;
		this.punchClockClient = punchClockClient;
		this.hourlyRate = hourlyRate;
		this.defaultEmployeeIds = Arrays.stream(defaultEmployeeIds.split(","))
			.map(String::trim)
			.filter(s -> !s.isEmpty())
			.map(Integer::valueOf)
			.toList();
	}

	@Transactional
	public PayrollRunResponse runPayroll(int month, int year) {
		validatePeriod(month, year);
		short periodMonth = (short) month;
		short periodYear = (short) year;

		List<PayrollRecordResponse> created = defaultEmployeeIds.stream()
			.map(employeeId -> calculateForEmployee(employeeId, periodMonth, periodYear))
			.map(PayrollRecordResponse::from)
			.toList();

		return new PayrollRunResponse(periodYear, periodMonth, created.size(), created);
	}

	@Transactional(readOnly = true)
	public List<PayrollRecordResponse> listRecords(int month, int year) {
		validatePeriod(month, year);
		return payrollRecordRepository
			.findByPeriodYearAndPeriodMonthOrderByEmployeeIdAsc((short) year, (short) month)
			.stream()
			.map(PayrollRecordResponse::from)
			.toList();
	}

	@Transactional(readOnly = true)
	public PayrollRecordResponse getRecord(UUID id) {
		return payrollRecordRepository.findById(id)
			.map(PayrollRecordResponse::from)
			.orElseThrow(() -> new ResourceNotFoundException("Payroll record not found: " + id));
	}

	private PayrollRecord calculateForEmployee(Integer employeeId, short periodMonth, short periodYear) {
		payrollRecordRepository
			.findByEmployeeIdAndPeriodYearAndPeriodMonth(employeeId, periodYear, periodMonth)
			.ifPresent(existing -> {
				throw new BadRequestException(
					"Payroll already exists for employee " + employeeId + " in " + periodMonth + "/" + periodYear
				);
			});

		MonthlyHoursResponse stats = punchClockClient.getMonthlyStats(employeeId, periodMonth, periodYear);
		BigDecimal workedHours = BigDecimal.valueOf(stats.workedHours()).setScale(2, RoundingMode.HALF_UP);
		BigDecimal grossPay = workedHours.multiply(hourlyRate).setScale(2, RoundingMode.HALF_UP);
		BigDecimal deductions = BigDecimal.ZERO;
		BigDecimal netPay = grossPay.subtract(deductions).setScale(2, RoundingMode.HALF_UP);

		PayrollRecord record = new PayrollRecord();
		record.setEmployeeId(employeeId);
		record.setPeriodMonth(periodMonth);
		record.setPeriodYear(periodYear);
		record.setWorkedHours(workedHours);
		record.setGrossPay(grossPay);
		record.setDeductions(deductions);
		record.setNetPay(netPay);
		record.setStatus(PayrollStatus.FINALIZED);
		return payrollRecordRepository.save(record);
	}

	private void validatePeriod(int month, int year) {
		if (month < 1 || month > 12) {
			throw new BadRequestException("month must be between 1 and 12");
		}
		if (year < 2000 || year > 2100) {
			throw new BadRequestException("year must be between 2000 and 2100");
		}
	}

}
