import { createContext, useContext, useState, ReactNode } from "react";

interface SubscriptionContextType {
  trialEndDate: Date | null;
  setTrialEndDate: (date: Date | null) => void;
}

// Tworzymy kontekst z domyślną wartością `undefined`, co oznacza, że musi być używane wewnątrz dostawcy.
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  return (
    <SubscriptionContext.Provider value={{ trialEndDate, setTrialEndDate }}>
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
