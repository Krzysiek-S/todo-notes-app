"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import { SubscriptionProvider } from "./context/SubscriptionContext";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SessionProvider>
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </SessionProvider>
  );
}
