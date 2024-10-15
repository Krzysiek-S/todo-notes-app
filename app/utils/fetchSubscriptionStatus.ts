// utils/fetchSubscriptionStatus.ts
import { getSession } from "next-auth/react";
import { checkSubscriptionStatus } from "./checkSubscriptionStatus";

export async function fetchSubscriptionStatus() {
  const session = await getSession();

  // Upewnij się, że token istnieje
  const supabaseAccessToken = session?.supabaseAccessToken;
  const userId = session?.user.id;

  if (!supabaseAccessToken || !userId) {
    console.error("Supabase access token or user ID is missing.");
    return {
      subscriptionStatus: "inactive",
      trialEndDate: null,
      subscriptionId: null,
    };
  }

  // Wywołaj checkSubscriptionStatus z poprawnymi argumentami
  return await checkSubscriptionStatus(userId, supabaseAccessToken);
}
