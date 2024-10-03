// types/next-auth.d.ts
import NextAuth from "next-auth";

// Rozszerzenie typu User, aby dodać stripeCustomerId
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stripeCustomerId?: string | null;  // Dodaj stripeCustomerId tutaj
    };
  }
}
