import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Free POS Billing Counter — Barcode & UPI QR",
  description:
    "Fast retail billing counter with USB/Bluetooth barcode scanner auto-focus, dynamic UPI intent QR, split payment modes, cash drawer change calculation, and 58mm/80mm thermal receipt printing. 100% free and offline-capable.",
  keywords: [
    "POS billing counter",
    "retail billing software India",
    "free thermal bill maker",
    "58mm 80mm receipt printer",
    "barcode scanner billing",
    "offline retail POS",
    "UPI QR invoice counter",
    "kirana POS billing",
  ],
  alternates: {
    canonical: "https://swiftgst.in/pos/",
  },
  openGraph: {
    title: "Free POS Billing Counter — SwiftGST",
    description:
      "High-speed retail counter billing with barcode auto-detect, instant cash tender change, UPI QR codes, and thermal receipt printing.",
    url: "https://swiftgst.in/pos/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free POS Billing Counter — SwiftGST",
    description:
      "Fast retail counter billing with barcode scanning, instant cash drawer reconciliation, and thermal receipt printing.",
  },
};

export default function PosLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
