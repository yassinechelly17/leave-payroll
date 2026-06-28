package com.platform.leave.payroll.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payroll_record")
@Getter
@Setter
@NoArgsConstructor
public class PayrollRecord {

	@Id
	private UUID id;

	@Column(name = "employee_id", nullable = false)
	private Integer employeeId;

	@Column(name = "period_year", nullable = false)
	private short periodYear;

	@Column(name = "period_month", nullable = false)
	private short periodMonth;

	@Column(name = "worked_hours", nullable = false, precision = 10, scale = 2)
	private BigDecimal workedHours;

	@Column(name = "gross_pay", nullable = false, precision = 12, scale = 2)
	private BigDecimal grossPay;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal deductions = BigDecimal.ZERO;

	@Column(name = "net_pay", nullable = false, precision = 12, scale = 2)
	private BigDecimal netPay;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private PayrollStatus status;

	@Column(name = "calculated_at", nullable = false)
	private Instant calculatedAt;

	@PrePersist
	void onCreate() {
		if (id == null) {
			id = UUID.randomUUID();
		}
		if (calculatedAt == null) {
			calculatedAt = Instant.now();
		}
		if (status == null) {
			status = PayrollStatus.DRAFT;
		}
		if (deductions == null) {
			deductions = BigDecimal.ZERO;
		}
	}

}
