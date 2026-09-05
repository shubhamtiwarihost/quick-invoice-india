import type { Metadata } from "next";
import EwayBillClient from "./EwayBillClient";
import {
  EwayBillComplianceGuide,
  EWAY_FAQS,
} from "@/components/eway/EwayBillComplianceGuide";

export const metadata: Metadata = {
  title: "GST E-Way Bill Rule & Exemption Checker — SwiftGST",
  description:
    "Check if your consignment requires a GST E-Way bill based on state thresholds (₹50k vs ₹1 Lakh), inter-state rules, and service exemptions under GST Rule 138.",
  keywords: [
    "eway bill checker",
    "gst e-way bill threshold",
    "intra state eway bill limit",
    "eway bill exemptions India",
    "Rule 138 GST",
    "eway bill limit Maharashtra Delhi",
  ],
  alternates: {
    canonical: "https://swiftgst.in/eway-bill-checker/",
  },
  openGraph: {
    title: "GST E-Way Bill Rule & Exemption Checker — SwiftGST",
    description:
      "Check state-wise E-Way bill thresholds and exemptions under Rule 138 of CGST rules.",
    url: "https://swiftgst.in/eway-bill-checker/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST E-Way Bill Threshold Checker — SwiftGST",
    description:
      "Instant consignment value check for intra-state and inter-state E-Way Bill compliance.",
  },
};

export default function EwayBillCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST E-Way Bill Checker",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/eway-bill-checker/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Verify E-Way bill necessity based on consignment value, intra vs inter-state rules, and state-specific thresholds.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EWAY_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : faq.question,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <EwayBillClient>
        <EwayBillComplianceGuide />
      </EwayBillClient>
    </>
  );
}
