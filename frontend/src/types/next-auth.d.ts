import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    preferredUsername?: string;
    error?: string;
    hasAccessToken?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    preferredUsername?: string;
    error?: string;
  }
}
