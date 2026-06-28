/** Server-only: Spring Boot base URL (no trailing slash). */
export function backendUrl(): string {
  const u = process.env.BACKEND_URL || "http://127.0.0.1:8082";
  return u.replace(/\/$/, "");
}

export function devBypassAuth(): boolean {
  return process.env.DEV_BYPASS_AUTH === "true";
}

export function keycloakTokenUrl(): string | null {
  return process.env.KEYCLOAK_TOKEN_URL || null;
}

export function keycloakClientId(): string {
  return process.env.KEYCLOAK_CLIENT_ID || "api-gateway";
}

export function keycloakClientSecret(): string {
  return process.env.KEYCLOAK_CLIENT_SECRET || "api-gateway-secret";
}
