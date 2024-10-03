import NextAuth from "next-auth";
import { AuthOptions } from "@/app/lib/auth";

// Definicja interfejsu sesji, rozszerzająca SessionBase

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };
