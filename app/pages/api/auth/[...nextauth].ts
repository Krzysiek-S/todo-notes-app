import NextAuth from "next-auth";
   import Discord from "next-auth/providers/discord";
   import { SupabaseAdapter } from "@next-auth/supabase-adapter";

   export default NextAuth({
     providers: [
       Discord({
         clientId: process.env.AUTH_DISCORD_CLIENT_ID as string,
         clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET as string,
       }),
     ],
     adapter: SupabaseAdapter({
       url: process.env.SUPABASE_URL as string,
       secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
     }),
     callbacks: {
       async jwt({ token, account }) {
         if (account) {
           token.accessToken = account.access_token;
         }
         return token;
       },
       async session({ session, token }) {
         if (typeof token.accessToken === 'string') {
           session.accessToken = token.accessToken;
         }
         return session;
       },
     },
   });