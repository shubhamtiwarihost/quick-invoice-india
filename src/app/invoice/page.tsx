import type { Metadata } from "next";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { ToolsHub } from "@/components/shared/ToolsHub";
import { HomeComplianceGuide } from "@/components/home/HomeComplianceGuide";
import { RetailSuiteShowcase } from "@/components/home/RetailSuiteShowcase";

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
      childrenBelowWorkspace={
        <>
          <RetailSuiteShowcase />
          <ToolsHub />
          <HomeComplianceGuide />
        </>
      }
    />
  );
}
