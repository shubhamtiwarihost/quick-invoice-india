import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Business Analytics, Profit Tracking & GSTR-1 Sales Report — SwiftGST",
  description:
    "Real-time retail financial pulse: gross sales, cash in drawer, UPI receipts, gross profit margin calculation, current stock valuation, and 1-click CA-compliant GSTR-1 sales register CSV export.",
  keywords: [
    "business analytics for retail",
    "gross profit tracker",
    "GSTR-1 sales register exporter",
    "cash drawer register report",
    "inventory asset valuation",
    "retail revenue dashboard",
    "gst sales report CSV",
  ],
  alternates: {
    canonical: "https://swiftgst.in/analytics/",
  },
  openGraph: {
    title: "Business Analytics & GSTR-1 Sales Report — SwiftGST",
    description:
      "Track daily sales, cash drawer reconciliations, product profit margins, and export GSTR-1 CSV registers for tax filing.",
    url: "https://swiftgst.in/analytics/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Analytics & GSTR-1 Report — SwiftGST",
    description:
      "Monitor sales pulse, gross profit margins, top-selling inventory items, and export GSTR-1 CSV reports.",
  },
};

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
