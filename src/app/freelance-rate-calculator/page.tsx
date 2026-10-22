import type { Metadata } from "next";
import { RelatedTools } from "@/components/shared/RelatedTools";
import FreelanceRateClient from "./FreelanceRateClient";
import {
  FreelanceRateGuide,
  FREELANCE_FAQS,
} from "@/components/calculator/FreelanceRateGuide";

export const metadata: Metadata = {
  title: "Freelance Rate & Hourly Income Calculator",
  description:
    "Calculate your ideal freelance hourly rate, daily retainer, and project costs based on your target income, working hours, business expenses, and taxes.",
  keywords: [
    "freelance rate calculator",
    "hourly rate calculator India",
    "freelance retainer estimator",
    "consulting fee calculator",
    "freelance project pricing",
    "freelancer hourly charge",
  ],
  alternates: {
    canonical: "https://swiftgst.in/freelance-rate-calculator/",
  },
  openGraph: {
    title: "Freelance Rate & Hourly Income Calculator — SwiftGST",
    description:
      "Calculate your hourly rate, monthly retainer, and project costs based on target income and working hours.",
    url: "https://swiftgst.in/freelance-rate-calculator/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Rate Calculator — SwiftGST",
    description:
      "Find your true hourly and daily consulting rates with tax and expense adjustments.",
  },
};

export default function FreelanceRateCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Freelance Rate Calculator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/freelance-rate-calculator/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Calculate hourly rates, daily retainer, and project milestones for freelancers and consultants.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FREELANCE_FAQS.map((faq) => ({
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
      <FreelanceRateClient>
        <FreelanceRateGuide />
      </FreelanceRateClient>
      <RelatedTools current="/freelance-rate-calculator/" prefer={["/invoice/", "/gst-calculator/", "/gstin-validator/"]} />
    </>
  );
}
