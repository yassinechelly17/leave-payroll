package com.platform.leave.payroll.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity
public class AppConfig {

	@Bean
	KeycloakJwtAuthenticationConverter keycloakJwtAuthenticationConverter() {
		return new KeycloakJwtAuthenticationConverter();
	}

}
