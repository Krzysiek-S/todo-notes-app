import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
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
          // Persist the OAuth access_token to the token right after signin
          if (account) {
            token.accessToken = account.access_token
          }
          return token
        },
        async session({ session, token, user }) {
          if (typeof token.accessToken === 'string')
          // Send properties to the client, like an access_token from a provider.
          session.accessToken = token.accessToken
          return session
        }
      }
  })