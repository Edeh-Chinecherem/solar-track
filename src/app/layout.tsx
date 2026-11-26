import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthRoleProvider } from "@/components/providers/auth-role-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { OfflineBanner } from "@/components/ui/offline-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenerAfrik - Solar Operations & Fleet Telemetry",
  description: "GreenerAfrik Energies Limited (RC 9402141): Enterprise, residential & commercial solar installations, 10-stage tracking, IoT telemetry, and PAYG metering.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A5C36"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.className} antialiased bg-emerald-50/30 dark:bg-[#042414] text-[#05361e] dark:text-white min-h-screen flex flex-col`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthRoleProvider>
              <ToastProvider>
                <OfflineBanner />
                <div className="flex-1 flex flex-col">{children}</div>
              </ToastProvider>
            </AuthRoleProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
