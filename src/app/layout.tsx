import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { PersistHydration } from "@/components/shared/PersistHydration";
import { PageViewTracker } from "@/components/shared/PageViewTracker";
import { CookieConsent } from "@/components/common/CookieConsent";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import { AppLayoutManager } from "@/components/layout/AppLayoutManager";
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
  title: {
    default: "SwiftGST - Free Retail POS & GST Billing Software",
    template: "%s | SwiftGST",
  },
  description:
    "Superfast, mobile-friendly GST billing software for Indian retail, kirana, and clothing stores. Free POS, barcode inventory & customer ledger.",
  keywords: [
    "GST billing software",
    "free POS billing software India",
    "barcode inventory billing",
    "kirana store billing software",
    "retail POS system India",
    "customer Khata ledger app",
    "free GST invoice generator",
    "thermal printer billing app",
    "offline POS software",
  ],
  alternates: {
    canonical: "./",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SwiftGST - Free Retail POS & GST Billing Software",
    description:
      "Superfast, mobile-friendly GST billing software for Indian retail, kirana, and clothing stores. Free POS, barcode inventory & customer ledger.",
    url: "https://swiftgst.in",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "SwiftGST - Free Retail POS & GST Billing Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftGST - Free Retail POS & GST Billing Software",
    description:
      "Superfast, mobile-friendly GST billing software for Indian retail, kirana, and clothing stores. Free POS, barcode inventory & customer ledger.",
    images: ["/icon.svg"],
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
          <PageViewTracker />
          <AppLayoutManager>{children}</AppLayoutManager>
          <InstallPromptBanner />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
