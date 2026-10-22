import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Free Customer Khata & Udhaar Ledger App",
  description:
    "Track customer Udhaar (credit balance), maintain transactional Khata ledgers, award customer loyalty points, and send 1-click WhatsApp payment reminders with dynamic UPI links.",
  keywords: [
    "customer khata app",
    "udhaar ledger online",
    "whatsapp payment reminder",
    "retail loyalty points CRM",
    "credit balance tracker",
    "small business khata software",
    "free digital bahi khata",
  ],
  alternates: {
    canonical: "https://swiftgst.in/customers/",
  },
  openGraph: {
    title: "Free Customer Khata & Loyalty CRM — SwiftGST",
    description:
      "Track market Udhaar, manage customer credit ledgers, reward repeat shoppers with loyalty points, and dispatch WhatsApp payment links.",
    url: "https://swiftgst.in/customers/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Customer Khata & Loyalty CRM — SwiftGST",
    description:
      "Digital Bahi Khata and CRM for Indian retail. Manage customer credit, reward loyalty points, and send WhatsApp payment requests.",
  },
};

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
