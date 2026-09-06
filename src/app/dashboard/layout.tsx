import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Store Back-Office Dashboard & Retail Overview — SwiftGST",
  description:
    "Merchant back-office overview: daily sales, invoice count, stock depletion alerts, customer Udhaar ledger balance, and 1-click POS terminal launcher.",
  alternates: {
    canonical: "https://swiftgst.in/dashboard/",
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
