import type { Metadata } from "next";
import { QuotationWorkspace } from "@/components/quotation/QuotationWorkspace";

export const metadata: Metadata = {
  title: "Free Estimate & Quotation Maker (GST Compliant) — QuickInvoice India",
  description:
    "Generate professional price quotations and estimates with validity dates, client payment terms, and 1-click conversion to GST Tax Invoice. Free, client-side, zero sign-up.",
  keywords: [
    "quotation maker",
    "estimate generator",
    "gst quotation maker",
    "price quote maker india",
    "convert quotation to invoice",
    "freelance estimate generator",
    "proforma quotation maker",
  ],
  openGraph: {
    title: "Free Estimate & Quotation Maker — QuickInvoice India",
    description:
      "Generate formal price quotes and project estimates with custom validity and terms. Convert seamlessly into GST invoices.",
    type: "website",
  },
};

export default function QuotationMakerPage() {
  return <QuotationWorkspace />;
}
