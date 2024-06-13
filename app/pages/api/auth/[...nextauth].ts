import NextAuth, { NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { DefaultSession } from "next-auth";

// Declare module to extend the default types
declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_CLIENT_ID as string,
      clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET as string,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
  }),
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
