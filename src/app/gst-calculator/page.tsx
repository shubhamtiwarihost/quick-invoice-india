import type { Metadata } from "next";
import GstCalculatorClient from "./GstCalculatorClient";
import { GstCalculatorGuide, GST_CALC_FAQS } from "@/components/calculator/GstCalculatorGuide";

export const metadata: Metadata = {
  title: "GST Calculator Online (Inclusive & Exclusive) — SwiftGST",
  description:
    "Fast online GST calculator for Indian businesses. Calculate inclusive and exclusive GST for 0%, 5%, 12%, 18%, and 28% slabs with CGST, SGST, and IGST breakdown.",
  keywords: [
    "GST calculator India",
    "reverse GST calculator",
    "inclusive GST formula",
    "exclusive GST calculator",
    "CGST SGST calculator",
    "18% GST calculator",
    "GST amount calculation online",
  ],
  alternates: {
    canonical: "https://swiftgst.in/gst-calculator/",
  },
  openGraph: {
    title: "GST Calculator Online (Inclusive & Exclusive) — SwiftGST",
    description:
      "Calculate GST inclusive and exclusive amounts with CGST, SGST, and IGST breakdowns for 5%, 12%, 18%, and 28% tax slabs.",
    url: "https://swiftgst.in/gst-calculator/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Calculator Online — SwiftGST",
    description:
      "Free GST calculator with inclusive/exclusive modes, tax slab buttons, and intra/inter-state split.",
  },
};

export default function GstCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST GST Calculator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/gst-calculator/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free forward and reverse GST calculator with intra/inter-state splits for 0%, 5%, 12%, 18%, and 28% slabs.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GST_CALC_FAQS.map((faq) => ({
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
      <GstCalculatorClient>
        <GstCalculatorGuide />
      </GstCalculatorClient>
    </>
  );
}
