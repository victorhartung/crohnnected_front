"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { LanguageProvider } from "./language-provider";
import { ReportProvider } from "./report-context";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider>
          <ReportProvider>
            {children}
            <Toaster />
          </ReportProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
