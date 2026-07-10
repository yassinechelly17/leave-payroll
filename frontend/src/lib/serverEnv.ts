/**
 * Server-only API base for the BFF proxy (no trailing slash).
 * Docker/platform: gateway route, e.g. http://api-gateway:8090/api/leave
 * Standalone dev: direct backend, e.g. http://127.0.0.1:8082/api/v1
 */
export function backendUrl(): string {
  const u = process.env.BACKEND_URL || "http://127.0.0.1:8082/api/v1";
  return u.replace(/\/$/, "");
}
