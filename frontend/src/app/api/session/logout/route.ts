import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// RP-initiated (federated) logout: returns Keycloak's end_session_endpoint URL so the client
// can navigate there *after* clearing its own NextAuth session — this also ends the Keycloak
// SSO cookie, so re-clicking "Sign in" shows the login form again instead of silently
// re-authenticating the existing SSO session. Mirrors services/auth-service/frontend.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const keycloakBrowserUrl = process.env.KEYCLOAK_BROWSER_URL || "http://localhost:9090";
  const clientId = process.env.KEYCLOAK_CLIENT_ID || "demo-client";
  // After logout, send the user back to the central hub (auth-service frontend), not this app's
  // own root — matches demo-client's existing http://localhost:8085/* redirectUris entry.
  const hubUrl = process.env.HUB_URL || "http://localhost:8085";

  const endSessionUrl = new URL(
    `${keycloakBrowserUrl}/realms/workforce-os/protocol/openid-connect/logout`
  );
  endSessionUrl.searchParams.set("client_id", clientId);
  endSessionUrl.searchParams.set("post_logout_redirect_uri", `${hubUrl}/`);
  if (token?.idToken) {
    endSessionUrl.searchParams.set("id_token_hint", token.idToken);
  }

  return NextResponse.json({ url: endSessionUrl.toString() });
}
