import type { Metadata } from "next";
import GstStateCodesClient from "./GstStateCodesClient";
import { STATE_CODE_FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "GST State Code List 2026: All States & UTs (01–38)",
  description:
    "Complete list of GST state codes for all 28 States and 8 Union Territories (01 to 38, plus 97 and the old Andhra Pradesh code 28). Search by name or code, copy in one click, and validate a GSTIN.",
  keywords: [
    "GST state codes",
    "GST state code list",
    "2 digit GST code",
    "GST code 27",
    "GST state code 07",
    "GST code list India 2026",
    "GST jurisdiction codes",
    "place of supply GST code",
  ],
  alternates: {
    canonical: "https://swiftgst.in/gst-state-codes/",
  },
  openGraph: {
    title: "GST State Code List 2026: All States & UTs (01–38)",
    description:
      "All GST state codes in one list: 28 States, 8 Union Territories, code 97 and the old Andhra Pradesh code 28. Search by name, capital or code.",
    url: "https://swiftgst.in/gst-state-codes/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST State Codes Directory — SwiftGST",
    description:
      "Search every Indian State and UT 2-digit GST code with 1-click copy.",
  },
};

export default function GstStateCodesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STATE_CODE_FAQS.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GstStateCodesClient />
    </>
  );
}
