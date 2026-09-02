import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Footer, Navbar } from "@/components/shared/Navbar";
import { PersistHydration } from "@/components/shared/PersistHydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "QuickInvoice India — GST & Tax Invoice Generator",
  description:
    "Create GST and non-GST invoices for Indian businesses in under a minute. Live A4 preview, CGST/SGST/IGST, and PDF download — no account needed.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QuickInvoice",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
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
        <PersistHydration />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
