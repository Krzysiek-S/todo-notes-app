import NextAuth, { type DefaultSession } from "next-auth"
 
declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken?: string
    user: {
      // The user's postal address
      id: string
      address: string
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stripeCustomerId?: string | null; 
      subscription_status?: string;
      trialEndDate: Date | null;
      subscriptionId: string | null
    } & DefaultSession["user"]
  }
}