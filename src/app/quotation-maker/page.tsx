import type { Metadata } from "next";
import { QuotationWorkspace } from "@/components/quotation/QuotationWorkspace";
import { QuotationComplianceGuide, QUOTATION_FAQS } from "@/components/quotation/QuotationComplianceGuide";

export const metadata: Metadata = {
  title: "Free Estimate & Quotation Maker (GST Compliant) — SwiftGST",
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
  alternates: {
    canonical: "https://swiftgst.in/quotation-maker/",
  },
  openGraph: {
    title: "Free Estimate & Quotation Maker — SwiftGST",
    description:
      "Generate formal price quotes and project estimates with custom validity and terms. Convert seamlessly into GST invoices.",
    url: "https://swiftgst.in/quotation-maker/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Estimate & Quotation Maker — SwiftGST",
    description:
      "Create formal price quotations with validity terms and convert directly to GST invoices in 1 click.",
  },
};

export default function QuotationMakerPage() {
  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Estimate & Quotation Maker",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/quotation-maker/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free estimate and quotation maker with validity periods and 1-click conversion to GST Tax Invoices.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUOTATION_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <QuotationWorkspace childrenBelowWorkspace={<QuotationComplianceGuide />} />
    </>
  );
}
