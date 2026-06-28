package com.platform.leave.payroll.web;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.platform.leave.payroll.service.LeaveService;
import com.platform.leave.payroll.web.dto.CreateLeaveRequest;
import com.platform.leave.payroll.web.dto.LeaveRequestResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/leave-requests")
public class LeaveRequestController {

	private final LeaveService leaveService;

	public LeaveRequestController(LeaveService leaveService) {
		this.leaveService = leaveService;
	}

	@GetMapping
	public List<LeaveRequestResponse> list(@RequestParam(required = false) Integer employeeId) {
		return leaveService.list(employeeId);
	}

	@PostMapping
	public LeaveRequestResponse create(@Valid @RequestBody CreateLeaveRequest request) {
		return leaveService.create(request);
	}

	@PatchMapping("/{id}/approve")
	public LeaveRequestResponse approve(
		@PathVariable UUID id,
		@AuthenticationPrincipal Jwt jwt,
		@RequestHeader(value = "X-Approver-Id", required = false) UUID approverId
	) {
		return leaveService.approve(id, resolveApprover(jwt, approverId));
	}

	@PatchMapping("/{id}/reject")
	public LeaveRequestResponse reject(
		@PathVariable UUID id,
		@AuthenticationPrincipal Jwt jwt,
		@RequestHeader(value = "X-Approver-Id", required = false) UUID approverId
	) {
		return leaveService.reject(id, resolveApprover(jwt, approverId));
	}

	private UUID resolveApprover(Jwt jwt, UUID approverId) {
		if (approverId != null) {
			return approverId;
		}
		if (jwt != null) {
			return UUID.fromString(jwt.getSubject());
		}
		return UUID.fromString("00000000-0000-0000-0000-000000000001");
	}

}
