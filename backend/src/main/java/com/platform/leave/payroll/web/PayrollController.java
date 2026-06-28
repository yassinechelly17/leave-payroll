package com.platform.leave.payroll.web;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platform.leave.payroll.service.PayrollService;
import com.platform.leave.payroll.web.dto.PayrollRecordResponse;
import com.platform.leave.payroll.web.dto.PayrollRunResponse;

@RestController
@RequestMapping("/api/v1/payroll")
public class PayrollController {

	private final PayrollService payrollService;

	public PayrollController(PayrollService payrollService) {
		this.payrollService = payrollService;
	}

	@PostMapping("/runs")
	public PayrollRunResponse runPayroll(@RequestParam int month, @RequestParam int year) {
		return payrollService.runPayroll(month, year);
	}

	@GetMapping("/records")
	public List<PayrollRecordResponse> listRecords(@RequestParam int month, @RequestParam int year) {
		return payrollService.listRecords(month, year);
	}

	@GetMapping("/records/{id}")
	public PayrollRecordResponse getRecord(@PathVariable UUID id) {
		return payrollService.getRecord(id);
	}

}
