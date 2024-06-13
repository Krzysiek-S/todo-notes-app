import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function ServerSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
