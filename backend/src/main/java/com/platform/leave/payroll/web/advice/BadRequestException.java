package com.platform.leave.payroll.web.advice;

public class BadRequestException extends RuntimeException {

	public BadRequestException(String message) {
		super(message);
	}

}
