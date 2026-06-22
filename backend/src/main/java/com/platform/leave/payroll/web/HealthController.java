package com.platform.leave.payroll.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

	private final String serviceSlug;

	public HealthController(@Value("${spring.application.name}") String applicationName) {
		this.serviceSlug = applicationName.replace("-backend", "");
	}

	@GetMapping("/health")
	public Map<String, String> health() {
		return Map.of("status", "ok", "service", serviceSlug);
	}

}
