import type { Metadata } from "next";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { ToolsHub } from "@/components/shared/ToolsHub";
import { HomeComplianceGuide, HOME_FAQS } from "@/components/home/HomeComplianceGuide";
import { RetailSuiteShowcase } from "@/components/home/RetailSuiteShowcase";

export const metadata: Metadata = {
  title: { absolute: "SwiftGST — Free Retail POS & GST Billing Software India" },
  description:
    "SwiftGST (Swift GST) is India's 100% free retail POS billing software, barcode inventory tracker, customer Khata ledger, and instant GST invoice generator. 100% private, offline-ready, zero sign-up required.",
  keywords: [
    "SwiftGST",
    "Swift GST",
    "swift gst software",
    "swift gst billing",
    "swiftgst.in",
    "retail POS billing software",
    "free GST billing software India",
    "barcode inventory software",
    "customer khata ledger app",
    "kirana store billing software",
    "GST invoice generator India",
    "thermal receipt printer software",
    "free invoicing software small business",
  ],
  alternates: {
    canonical: "https://swiftgst.in/",
  },
  openGraph: {
    title: "SwiftGST — Free Retail POS & GST Billing Software India",
    description:
      "SwiftGST (Swift GST) is India's 100% free retail POS billing software, barcode inventory tracking, customer Khata ledger, and GST invoice generator for small businesses.",
    url: "https://swiftgst.in/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftGST — Free Retail POS & GST Billing Software India",
    description:
      "SwiftGST (Swift GST) is India's 100% free retail POS billing software, barcode inventory tracking, customer Khata ledger, and GST invoice generator.",
  },
};

export default function HomePage() {
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SwiftGST",
    alternateName: [
      "Swift GST",
      "SwiftGST India",
      "swiftgst.in",
      "Swift GST Billing Software",
      "Swift GST POS",
    ],
    url: "https://swiftgst.in/",
    description:
      "Free retail POS billing counter, barcode inventory tracking, customer Khata ledger, and 100% free GST invoice generator for Indian small businesses.",
    publisher: {
      "@type": "Organization",
      name: "SwiftGST",
      url: "https://swiftgst.in/",
      logo: "https://swiftgst.in/logo.png",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://swiftgst.in/hsn-finder/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

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
    logo: "https://swiftgst.in/logo.png",
    sameAs: [
      "https://www.instagram.com/swiftgst.in/",
      "https://www.facebook.com/people/Swiftgstin/61594169346217/"
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
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
        pageTitle="SwiftGST — Free Retail POS & GST Billing Software"
        badgeText="100% Free & Private"
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
