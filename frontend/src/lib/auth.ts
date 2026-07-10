import http from "node:http";

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

const keycloakIssuer =
  process.env.KEYCLOAK_ISSUER_URI || "http://auth-keycloak:8080/realms/workforce-os";
const keycloakBrowserUrl = process.env.KEYCLOAK_BROWSER_URL || "http://localhost:9090";
const keycloakTokenIssuer = `${keycloakBrowserUrl}/realms/workforce-os`;
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "demo-client";
const keycloakBrowserHost = new URL(keycloakBrowserUrl).host;
const tokenEndpoint = `${keycloakIssuer}/protocol/openid-connect/token`;

/**
 * POST application/x-www-form-urlencoded to Keycloak's Docker-internal token URL while sending
 * the browser-facing Host header. Required because KC_HOSTNAME_STRICT=false binds token `iss`
 * (and refresh validation) to the Host used at authorization time (localhost:9090), but the
 * container can only reach Keycloak as auth-keycloak:8080. undici/fetch forbid overriding Host.
 */
function postFormWithHostOverride(
  url: string,
  body: string,
  hostHeader: string
): Promise<{ status: number; json: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const req = http.request(
      {
        hostname: target.hostname,
        port: target.port || 80,
        path: `${target.pathname}${target.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
          Host: hostHeader,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode ?? 0, json: JSON.parse(data) });
          } catch (error) {
            reject(error);
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: keycloakClientId,
      refresh_token: String(token.refreshToken),
    });
    const { status, json: refreshed } = await postFormWithHostOverride(
      tokenEndpoint,
      params.toString(),
      keycloakBrowserHost
    );
    if (status < 200 || status >= 300) throw refreshed;
    if (!refreshed.access_token) throw new Error("refresh response missing access_token");

    return {
      ...token,
      accessToken: refreshed.access_token as string,
      accessTokenExpires: Date.now() + Number(refreshed.expires_in ?? 300) * 1000,
      refreshToken: (refreshed.refresh_token as string | undefined) ?? token.refreshToken,
      idToken: (refreshed.id_token as string | undefined) ?? token.idToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to refresh Keycloak access token", error);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    KeycloakProvider({
      id: "keycloak",
      clientId: keycloakClientId,
      clientSecret: "",
      issuer: keycloakTokenIssuer,
      wellKnown: undefined,
      authorization: {
        url: `${keycloakBrowserUrl}/realms/workforce-os/protocol/openid-connect/auth`,
        params: { scope: "openid email profile" },
      },
      // Custom token request so the authorization-code exchange also sends the browser-facing
      // Host header (same reason as refreshAccessToken). Without this, Keycloak can return
      // tokens that NextAuth then fails to attach cleanly — leaving a session with no accessToken.
      token: {
        url: tokenEndpoint,
        async request({ params, checks, provider }) {
          const body = new URLSearchParams();
          body.set("grant_type", "authorization_code");
          body.set("client_id", keycloakClientId);
          body.set("code", String(params.code ?? ""));
          body.set(
            "redirect_uri",
            String(provider.callbackUrl ?? `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`)
          );
          if (checks.code_verifier) {
            body.set("code_verifier", checks.code_verifier);
          }
          const { status, json } = await postFormWithHostOverride(
            tokenEndpoint,
            body.toString(),
            keycloakBrowserHost
          );
          if (status < 200 || status >= 300) {
            console.error("Keycloak token exchange failed", status, json);
            throw new Error(`Keycloak token exchange failed: ${status}`);
          }
          if (!json.access_token) {
            console.error("Keycloak token exchange missing access_token", json);
            throw new Error("Keycloak token exchange missing access_token");
          }
          return { tokens: json };
        },
      },
      userinfo: `${keycloakIssuer}/protocol/openid-connect/userinfo`,
      jwks_endpoint: `${keycloakIssuer}/protocol/openid-connect/certs`,
      client: {
        token_endpoint_auth_method: "none",
      },
      checks: ["pkce", "state"],
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const accessToken = account.access_token;
        const refreshToken = account.refresh_token;
        const idToken = account.id_token;
        console.info("[auth:jwt] initial login", {
          hasAccessToken: Boolean(accessToken),
          hasRefreshToken: Boolean(refreshToken),
          hasIdToken: Boolean(idToken),
          expiresAt: account.expires_at,
        });
        if (!accessToken) {
          // Refuse to create a "half" session — BFF would only ever return no_access_token.
          throw new Error("Keycloak login did not return an access_token");
        }
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.idToken = idToken;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 300 * 1000;
        token.error = undefined;
      }

      const preferredUsername = (profile as { preferred_username?: string } | undefined)
        ?.preferred_username;
      if (preferredUsername) {
        token.preferredUsername = preferredUsername;
      }

      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number) - 10_000
      ) {
        return token;
      }
      if (!token.refreshToken) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.preferredUsername ?? session.user.name;
      }
      session.preferredUsername = token.preferredUsername;
      session.error = token.error;
      // Expose a boolean only — never the raw token — so the UI can detect a broken session.
      session.hasAccessToken = Boolean(token.accessToken);
      return session;
    },
  },
};
