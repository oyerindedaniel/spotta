// import { TRPCReactProvider } from "@repo/api/src/react";

import "@repo/ui/css/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { dir } from "i18next";

import { TRPCReactProvider } from "@repo/api/src/react";
import { languages, LanguagesType } from "@repo/i18n";
import { SonnerToaster, Toaster } from "@repo/ui";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }));
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotta Admin",
  description: "Built by oyerinde daniel",
};

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: LanguagesType };
}): JSX.Element {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={cn("bg-background", inter.className)}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            // disableTransitionOnChange
          >
            {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}

            {children}
            <SonnerToaster />
            <Toaster />
            <ModalProvider />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
