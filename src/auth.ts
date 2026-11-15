import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { isEmailAllowed } from "./lib/whitelist";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified;
      if (!email || verified === false) return false;
      return isEmailAllowed(email);
    },
  },
});
