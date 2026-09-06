import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Store Settings & Cashier Quick-PIN — SwiftGST",
  description:
    "Configure store details, cashier lock PIN, receipt header/footer notes, GSTIN, and business category.",
  alternates: {
    canonical: "https://swiftgst.in/settings/",
  },
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
