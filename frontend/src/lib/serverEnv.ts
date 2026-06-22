/** Server-only: Spring Boot base URL (no trailing slash). */
export function backendUrl(): string {
  const u = process.env.BACKEND_URL || "http://127.0.0.1:8082";
  return u.replace(/\/$/, "");
}
