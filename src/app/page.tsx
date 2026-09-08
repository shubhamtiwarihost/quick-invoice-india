import type { Metadata } from "next";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { ToolsHub } from "@/components/shared/ToolsHub";
import { HomeComplianceGuide, HOME_FAQS } from "@/components/home/HomeComplianceGuide";
import { RetailSuiteShowcase } from "@/components/home/RetailSuiteShowcase";

export const metadata: Metadata = {
  title: "SwiftGST — Free GST Invoice Generator India (PDF, UPI QR, GSTR-1)",
  description:
    "Create 100% free GST and non-GST invoices for Indian businesses in under a minute. Live A4 preview, CGST/SGST/IGST, UPI QR code, GSTR-1 CSV export & PDF download — no sign up needed.",
  keywords: [
    "GST invoice generator India",
    "free GST bill maker online",
    "tax invoice format India",
    "generate GST invoice PDF",
    "invoice maker with UPI QR code",
    "GSTR-1 sales CSV exporter",
    "free invoicing software for small business",
    "non GST bill of supply maker",
  ],
  alternates: {
    canonical: "https://swiftgst.in/",
  },
  openGraph: {
    title: "SwiftGST — Fast & Easy GST Invoicing for India",
    description:
      "Create GST & Non-GST invoices in seconds. Live preview, dynamic UPI payment QR code, GSTR-1 export, and instant PDF download.",
    url: "https://swiftgst.in/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftGST — Free GST Invoice Generator India",
    description:
      "Fast, compliant GST invoicing with live A4 preview, UPI QR code, and instant PDF export.",
  },
};

export default function HomePage() {
  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Invoice Generator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free browser-based GST invoice generator and tax utility for Indian small businesses, freelancers, and enterprises.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1280",
    },
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SwiftGST",
    url: "https://swiftgst.in/",
    logo: "https://swiftgst.in/icon.svg",
    description:
      "Free, private, browser-based GST compliance and invoicing tools for Indian businesses.",
    founder: {
      "@type": "Person",
      name: "Shubham Tiwari",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <InvoiceWorkspace
        childrenBelowWorkspace={
          <>
            <RetailSuiteShowcase />
            <ToolsHub />
            <HomeComplianceGuide />
          </>
        }
      />
    </>
  );
}
