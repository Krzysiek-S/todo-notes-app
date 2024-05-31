import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
      Discord({
        clientId: process.env.AUTH_DISCORD_CLIENT_ID as string,
        clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET as string,
      }),
    ],
  })