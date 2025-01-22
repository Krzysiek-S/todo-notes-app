import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import ClientLayout from "./client-layout";

import "./globals.css";

const roboto = Lexend({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "todo app",
  description: "simple todo app",
};

interface LayoutProps {
  children: React.ReactNode;
  // session: any;
  // pageProps: any;
}

export default function RootLayout({
  children,
}: // session,
// pageProps,
LayoutProps) {
  return (
    <ClientLayout>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#FFA384" />
        </head>
        <body>{children}</body>
      </html>
    </ClientLayout>
  );
}
