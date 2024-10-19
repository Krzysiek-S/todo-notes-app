// utils/fetchSubscriptionStatus.ts
import { getSession } from "next-auth/react";
import { checkSubscriptionStatus } from "./checkSubscriptionStatus";

export async function fetchSubscriptionStatus() {
  try {
    const session = await getSession();

    // Upewnij się, że sesja istnieje
    if (!session) {
      console.error("Brak sesji użytkownika.");
      return {
        subscriptionStatus: "inactive",
        trialEndDate: null,
        subscriptionId: null,
      };
    }

    const { supabaseAccessToken, user } = session;
    const userId = user?.id;

    // Upewnij się, że token i userId istnieją
    if (!supabaseAccessToken || !userId) {
      console.error("Supabase access token lub user ID jest brakujący.");
      return {
        subscriptionStatus: "inactive",
        trialEndDate: null,
        subscriptionId: null,
      };
    }

    // Wywołaj checkSubscriptionStatus z poprawnymi argumentami
    return await checkSubscriptionStatus(userId, supabaseAccessToken);

  } catch (error) {
    console.error("Błąd podczas pobierania statusu subskrypcji:", error);
    return {
      subscriptionStatus: "inactive",
      trialEndDate: null,
      subscriptionId: null,
    };
  }
}
