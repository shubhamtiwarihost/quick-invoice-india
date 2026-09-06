import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Footer, Navbar } from "@/components/shared/Navbar";
import { PersistHydration } from "@/components/shared/PersistHydration";
import { CookieConsent } from "@/components/common/CookieConsent";
import { NativeBottomNav } from "@/components/mobile/NativeBottomNav";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#059669",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://swiftgst.in"),
  title: "SwiftGST - Free POS, Khata & GST Invoicing",
  description:
    "Free retail POS billing counter, inventory stock tracking, customer Khata ledger, and GST invoice generator. 100% offline-ready client-side PWA.",
  manifest: "/manifest.json",
  openGraph: {
    title: "SwiftGST - Free POS, Khata & GST Invoicing",
    description:
      "Free retail POS billing counter, inventory stock tracking, customer Khata ledger, and GST invoice generator. 100% offline-ready client-side PWA.",
    url: "https://swiftgst.in",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SwiftGST",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
  verification: {
    google: "NHpHjplljnwTL5mqvpTuN6ZDVEGz0XVPGFl8F46112c",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-100 font-sans text-slate-900">
        <AuthProvider>
          <PersistHydration />
          <Navbar />
          {children}
          <Footer />
          <NativeBottomNav />
          <InstallPromptBanner />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
