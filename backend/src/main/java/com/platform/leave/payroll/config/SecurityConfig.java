package com.platform.leave.payroll.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("docker")
public class SecurityConfig {

	private final KeycloakJwtAuthenticationConverter jwtAuthenticationConverter;

	public SecurityConfig(KeycloakJwtAuthenticationConverter jwtAuthenticationConverter) {
		this.jwtAuthenticationConverter = jwtAuthenticationConverter;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
			.csrf(csrf -> csrf.disable())
			.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/actuator/health", "/api/health").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/v1/leave-requests", "/api/v1/leave-requests/**")
					.hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
				.requestMatchers(HttpMethod.POST, "/api/v1/leave-requests").hasRole("EMPLOYEE")
				.requestMatchers(HttpMethod.PATCH, "/api/v1/leave-requests/*/approve", "/api/v1/leave-requests/*/reject")
					.hasRole("MANAGER")
				.requestMatchers("/api/v1/payroll/**").hasAnyRole("MANAGER", "ADMIN")
				.anyRequest().authenticated()
			)
			.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
			)
			.build();
	}

}
