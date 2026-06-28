package com.platform.leave.payroll.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

import feign.RequestInterceptor;

@Configuration
@Profile("docker")
public class FeignConfig {

	@Bean
	OAuth2AuthorizedClientService oAuth2AuthorizedClientService(ClientRegistrationRepository registrations) {
		return new InMemoryOAuth2AuthorizedClientService(registrations);
	}

	@Bean
	OAuth2AuthorizedClientManager oAuth2AuthorizedClientManager(
		ClientRegistrationRepository registrations,
		OAuth2AuthorizedClientService authorizedClientService
	) {
		OAuth2AuthorizedClientProvider provider = OAuth2AuthorizedClientProviderBuilder.builder()
			.clientCredentials()
			.build();
		AuthorizedClientServiceOAuth2AuthorizedClientManager manager =
			new AuthorizedClientServiceOAuth2AuthorizedClientManager(registrations, authorizedClientService);
		manager.setAuthorizedClientProvider(provider);
		return manager;
	}

	@Bean
	RequestInterceptor oauth2FeignRequestInterceptor(OAuth2AuthorizedClientManager authorizedClientManager) {
		return new OAuth2FeignRequestInterceptor(authorizedClientManager, "leave-payroll");
	}

}
