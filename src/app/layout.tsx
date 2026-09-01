import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Footer, Navbar } from "@/components/shared/Navbar";
import { PersistHydration } from "@/components/shared/PersistHydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickInvoice India — GST & Tax Invoice Generator",
  description:
    "Create GST and non-GST invoices for Indian businesses in under a minute. Live A4 preview, CGST/SGST/IGST, and PDF download — no account needed.",
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
