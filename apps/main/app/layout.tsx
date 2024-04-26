import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@repo/ui/css/styles.css";
import { TRPCReactProvider } from "@repo/trpc/src/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
