package com.platform.leave.payroll.web.advice;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import feign.FeignException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
		return error(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(BadRequestException.class)
	ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex) {
		return error(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
			.findFirst()
			.map(err -> err.getField() + " " + err.getDefaultMessage())
			.orElse("Validation failed");
		return error(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(FeignException.class)
	ResponseEntity<Map<String, Object>> handleFeign(FeignException ex) {
		return error(HttpStatus.BAD_GATEWAY, "Attendance service unavailable: " + ex.status());
	}

	private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(Map.of(
			"timestamp", Instant.now().toString(),
			"status", status.value(),
			"error", status.getReasonPhrase(),
			"message", message
		));
	}

}
