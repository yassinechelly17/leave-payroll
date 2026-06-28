package com.platform.leave.payroll.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platform.leave.payroll.domain.LeaveRequest;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, UUID> {

	List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Integer employeeId);

}
