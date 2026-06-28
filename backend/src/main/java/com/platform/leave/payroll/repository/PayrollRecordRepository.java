package com.platform.leave.payroll.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platform.leave.payroll.domain.PayrollRecord;

public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, UUID> {

	Optional<PayrollRecord> findByEmployeeIdAndPeriodYearAndPeriodMonth(
		Integer employeeId,
		short periodYear,
		short periodMonth
	);

	List<PayrollRecord> findByPeriodYearAndPeriodMonthOrderByEmployeeIdAsc(short periodYear, short periodMonth);

}
