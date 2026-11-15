import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const secret = process.env.AUTH_SECRET;
// Cookie name is the encryption salt. Keep it identical on http localhost
// even if a proxy sets x-forwarded-proto to https.
const useSecureCookies = (process.env.AUTH_URL ?? "http://localhost:3000").startsWith("https://");

export const authConfig = {
  trustHost: true,
  secret,
  useSecureCookies,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
