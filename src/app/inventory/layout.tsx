import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Free Inventory & Stock Management Software (Barcode & CSV Import/Export) — SwiftGST",
  description:
    "Private, browser-based inventory and stock tracking for Indian retail stores. Manage SKU catalogs, GST tax slabs, low-stock threshold alerts, and bulk CSV import/export with zero account required.",
  keywords: [
    "inventory management software India",
    "free stock manager",
    "retail stock alert",
    "CSV inventory import export",
    "barcode stock tracker",
    "GST product catalog",
    "offline inventory software",
  ],
  alternates: {
    canonical: "https://swiftgst.in/inventory/",
  },
  openGraph: {
    title: "Free Inventory & Stock Management Software — SwiftGST",
    description:
      "Manage product catalogs, real-time stock levels, low-stock alerts, and CSV import/export with client-side privacy.",
    url: "https://swiftgst.in/inventory/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Inventory & Stock Manager — SwiftGST",
    description:
      "Track inventory, receive low-stock alerts, and manage product catalogs with instant CSV bulk import/export.",
  },
};

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
