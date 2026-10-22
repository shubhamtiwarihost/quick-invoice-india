import type { Metadata } from "next";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { InvoiceGuide } from "@/components/invoice/InvoiceGuide";

export const metadata: Metadata = {
  title: "Free GST Invoice Generator Online",
  description:
    "Generate 100% free GST-compliant tax invoices and bills of supply online. Instant PDF download, UPI QR code, automatic tax calculations, and GSTR-1 CSV export.",
  alternates: {
    canonical: "https://swiftgst.in/invoice/",
  },
  openGraph: {
    title: "Free GST Invoice Generator Online — SwiftGST",
    description:
      "Generate 100% free GST-compliant tax invoices and bills of supply online. Instant PDF download, UPI QR code, automatic tax calculations, and GSTR-1 CSV export.",
    url: "https://swiftgst.in/invoice/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free GST Invoice Generator Online — SwiftGST",
    description:
      "Generate 100% free GST-compliant tax invoices and bills of supply online. Instant PDF download, UPI QR code, automatic tax calculations, and GSTR-1 CSV export.",
  },
};

export default function InvoicePage() {
  return (
    <InvoiceWorkspace
      pageTitle="Free GST Invoice Generator"
      badgeText="Tax Invoice & Bill of Supply"
      childrenBelowWorkspace={<InvoiceGuide />}
    />
  );
}
