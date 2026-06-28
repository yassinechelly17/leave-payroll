package com.platform.leave.payroll.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.platform.leave.payroll.domain.LeaveStatus;
import com.platform.leave.payroll.service.LeaveService;
import com.platform.leave.payroll.web.advice.GlobalExceptionHandler;
import com.platform.leave.payroll.web.dto.LeaveRequestResponse;

@ExtendWith(MockitoExtension.class)
class LeaveRequestControllerTest {

	private MockMvc mockMvc;

	@Mock
	private LeaveService leaveService;

	@InjectMocks
	private LeaveRequestController controller;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(controller)
			.setControllerAdvice(new GlobalExceptionHandler())
			.build();
	}

	@Test
	void createLeaveRequest_returnsCreated() throws Exception {
		UUID id = UUID.randomUUID();
		when(leaveService.create(any())).thenReturn(new LeaveRequestResponse(
			id, 1, LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5),
			LeaveStatus.PENDING, "Vacation", null,
			java.time.Instant.now(), java.time.Instant.now()
		));

		mockMvc.perform(post("/api/v1/leave-requests")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "employeeId": 1,
					  "startDate": "2026-06-01",
					  "endDate": "2026-06-05",
					  "reason": "Vacation"
					}
					"""))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(id.toString()))
			.andExpect(jsonPath("$.status").value("PENDING"));
	}

}
