package com.platform.leave.payroll.config;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

	private final JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();

	public KeycloakJwtAuthenticationConverter() {
		delegate.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
	}

	@Override
	public AbstractAuthenticationToken convert(Jwt jwt) {
		return delegate.convert(jwt);
	}

	private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
		JwtGrantedAuthoritiesConverter scopes = new JwtGrantedAuthoritiesConverter();
		Collection<GrantedAuthority> authorities = scopes.convert(jwt);

		Map<String, Object> realmAccess = jwt.getClaim("realm_access");
		if (realmAccess == null) {
			return authorities != null ? authorities : Collections.emptyList();
		}

		@SuppressWarnings("unchecked")
		List<String> roles = (List<String>) realmAccess.get("roles");
		if (roles == null) {
			return authorities != null ? authorities : Collections.emptyList();
		}

		List<GrantedAuthority> realmRoles = roles.stream()
			.map(role -> new SimpleGrantedAuthority("ROLE_" + role))
			.collect(Collectors.toList());

		if (authorities == null) {
			return realmRoles;
		}
		realmRoles.addAll(authorities);
		return realmRoles;
	}

}
