import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import "./globals.css";

const roboto = Lexend({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "todo app",
  description: "simple todo app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>{children}</body>
    </html>
  );
}
