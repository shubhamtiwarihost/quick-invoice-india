import type { Metadata } from "next";
import CompositionClient from "./CompositionClient";
import {
  CompositionComplianceGuide,
  COMPOSITION_FAQS,
} from "@/components/calculator/CompositionComplianceGuide";

export const metadata: Metadata = {
  title: "Composition Scheme vs Regular GST Calculator — SwiftGST",
  description:
    "Compare Composition Scheme (1%, 5%, 6% flat tax) vs Regular GST scheme (Output tax minus ITC). Find out your net tax liability and compliance savings.",
  keywords: [
    "composition scheme calculator",
    "composition vs regular gst",
    "gst composition eligibility",
    "cmp-08 calculator",
    "gst itc comparison",
    "composition scheme turnover limit",
  ],
  alternates: {
    canonical: "https://swiftgst.in/composition-calculator/",
  },
  openGraph: {
    title: "Composition Scheme vs Regular GST Calculator — SwiftGST",
    description:
      "Compare 1%, 5%, 6% composition flat rate against regular GST with Input Tax Credit to choose the best scheme.",
    url: "https://swiftgst.in/composition-calculator/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Composition vs Regular GST Calculator — SwiftGST",
    description:
      "Free tax scheme comparison for traders, manufacturers, and service providers under Section 10.",
  },
};

export default function CompositionCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Composition Scheme Calculator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/composition-calculator/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Compare flat composition tax vs regular GST with ITC to determine the lowest net tax option.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COMPOSITION_FAQS.map((faq) => ({
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
      <CompositionClient>
        <CompositionComplianceGuide />
      </CompositionClient>
    </>
  );
}
