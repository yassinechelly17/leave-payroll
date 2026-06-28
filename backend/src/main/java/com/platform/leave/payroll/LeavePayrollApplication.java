package com.platform.leave.payroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class LeavePayrollApplication {

	public static void main(String[] args) {
		SpringApplication.run(LeavePayrollApplication.class, args);
	}

}
