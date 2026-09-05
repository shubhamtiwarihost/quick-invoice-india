import type { Metadata } from "next";
import HsnFinderClient from "./HsnFinderClient";
import { HsnComplianceGuide, HSN_FAQS } from "@/components/hsn/HsnComplianceGuide";

export const metadata: Metadata = {
  title: "HSN & SAC Code Finder (GST Rates Directory) — SwiftGST",
  description:
    "Search 4 to 8 digit Indian HSN codes for goods and SAC codes for services. Instant GST slab rates (0%, 5%, 12%, 18%, 28%) and 1-click apply to invoice.",
  keywords: [
    "HSN code finder",
    "SAC code directory India",
    "GST rate list by HSN",
    "services accounting code search",
    "HSN code 998314",
    "GST HSN code search online",
    "goods and services tax code directory",
  ],
  alternates: {
    canonical: "https://swiftgst.in/hsn-finder/",
  },
  openGraph: {
    title: "HSN & SAC Code Finder (GST Rates Directory) — SwiftGST",
    description:
      "Find official HSN and SAC codes for Indian GST billing. Verify 4 to 8 digit codes and applicable tax rates with 1-click invoice insertion.",
    url: "https://swiftgst.in/hsn-finder/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSN & SAC Code Finder — SwiftGST",
    description:
      "Instant search for HSN and SAC codes and official GST rates for Indian invoices.",
  },
};

export default function HsnFinderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST HSN & SAC Code Directory",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/hsn-finder/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free search directory of Indian HSN and SAC codes with official GST tax slabs.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HSN_FAQS.map((faq) => ({
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
      <HsnFinderClient>
        <HsnComplianceGuide />
      </HsnFinderClient>
    </>
  );
}
