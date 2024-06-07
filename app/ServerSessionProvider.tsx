import { getServerSession } from "next-auth/next";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { authOptions } from "@/app/pages/api/auth/[...nextauth]";

export default async function ServerSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
