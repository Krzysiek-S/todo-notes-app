"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

interface SubscriptionContextType {
  isSubscribed: boolean;
  trialEndDate: Date | null;
  fetchSubscriptionStatus: () => Promise<void>;
  setTrialEndDate: (date: Date | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!session) {
      console.warn("Brak sesji, nie można pobrać statusu subskrypcji");
      return;
    }
    try {
      const res = await fetch("/api/subscription/status");
      const { isSubscribed, trialEndDate } = await res.json();
      setIsSubscribed(isSubscribed);
      setTrialEndDate(trialEndDate ? new Date(trialEndDate) : null);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    }
  }, [session]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        trialEndDate,
        fetchSubscriptionStatus,
        setTrialEndDate,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
