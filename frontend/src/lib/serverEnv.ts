/**
 * Server-only API base for the BFF proxy (no trailing slash).
 * Docker/platform: gateway route, e.g. http://api-gateway:8090/api/leave
 * Standalone dev: direct backend, e.g. http://127.0.0.1:8082/api/v1
 */
export function backendUrl(): string {
  const u = process.env.BACKEND_URL || "http://127.0.0.1:8082/api/v1";
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
