import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import jwt from "jsonwebtoken"
import { checkSubscriptionStatus } from '../utils/checkSubscriptionStatus'; 

export const AuthOptions: NextAuthOptions = {
    providers: [
      GitHubProvider({
        clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET as string,
      
      }),
    ],
    adapter: SupabaseAdapter({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    }),
    callbacks: {
      async session({ session, user }) {
        const signingSecret = process.env.SUPABASE_JWT_SECRET
        if (signingSecret) {
          const payload = {
            aud: "authenticated",
            exp: Math.floor(new Date(session.expires).getTime() / 1000),
            sub: user.id,
            email: user.email,
            role: "authenticated",
          }
          session.supabaseAccessToken = jwt.sign(payload, signingSecret)
        }
        session.user.id = user.id;
  
        if (session.supabaseAccessToken) {
          const { subscriptionStatus, trialEndDate, subscriptionId } = await checkSubscriptionStatus(
            user.id,
            session.supabaseAccessToken
          );

          console.log("Fetched subscription status:", { subscriptionStatus, trialEndDate, subscriptionId });

          session.user.subscription_status = subscriptionStatus || 'inactive';
          session.user.trialEndDate = trialEndDate || null; // Upewnij się, że jest to w formacie Date lub null
        session.user.subscriptionId = subscriptionId || null; 
        } else {
          // Obsłuż sytuację, gdy token nie jest dostępny (np. logowanie błędu)
          console.error("Supabase access token is not available");
          session.user.subscription_status = 'inactive';
          session.user.trialEndDate = null;
        session.user.subscriptionId = null;
        }
        return session
      },
    },
  };