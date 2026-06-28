package com.platform.leave.payroll.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platform.leave.payroll.domain.LeaveRequest;
import com.platform.leave.payroll.domain.LeaveStatus;
import com.platform.leave.payroll.repository.LeaveRequestRepository;
import com.platform.leave.payroll.web.advice.BadRequestException;
import com.platform.leave.payroll.web.advice.ResourceNotFoundException;
import com.platform.leave.payroll.web.dto.CreateLeaveRequest;
import com.platform.leave.payroll.web.dto.LeaveRequestResponse;

@Service
public class LeaveService {

	private final LeaveRequestRepository leaveRequestRepository;

	public LeaveService(LeaveRequestRepository leaveRequestRepository) {
		this.leaveRequestRepository = leaveRequestRepository;
	}

	@Transactional(readOnly = true)
	public List<LeaveRequestResponse> list(Integer employeeId) {
		List<LeaveRequest> requests = employeeId == null
			? leaveRequestRepository.findAll()
			: leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
		return requests.stream().map(LeaveRequestResponse::from).toList();
	}

	@Transactional
	public LeaveRequestResponse create(CreateLeaveRequest request) {
		if (request.endDate().isBefore(request.startDate())) {
			throw new BadRequestException("endDate must be on or after startDate");
		}

		LeaveRequest entity = new LeaveRequest();
		entity.setEmployeeId(request.employeeId());
		entity.setStartDate(request.startDate());
		entity.setEndDate(request.endDate());
		entity.setReason(request.reason());
		entity.setStatus(LeaveStatus.PENDING);
		return LeaveRequestResponse.from(leaveRequestRepository.save(entity));
	}

	@Transactional
	public LeaveRequestResponse approve(UUID id, UUID approverId) {
		LeaveRequest entity = findOrThrow(id);
		if (entity.getStatus() != LeaveStatus.PENDING) {
			throw new BadRequestException("Only pending leave requests can be approved");
		}
		entity.setStatus(LeaveStatus.APPROVED);
		entity.setApprovedBy(approverId);
		return LeaveRequestResponse.from(leaveRequestRepository.save(entity));
	}

	@Transactional
	public LeaveRequestResponse reject(UUID id, UUID approverId) {
		LeaveRequest entity = findOrThrow(id);
		if (entity.getStatus() != LeaveStatus.PENDING) {
			throw new BadRequestException("Only pending leave requests can be rejected");
		}
		entity.setStatus(LeaveStatus.REJECTED);
		entity.setApprovedBy(approverId);
		return LeaveRequestResponse.from(leaveRequestRepository.save(entity));
	}

	private LeaveRequest findOrThrow(UUID id) {
		return leaveRequestRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));
	}

}
