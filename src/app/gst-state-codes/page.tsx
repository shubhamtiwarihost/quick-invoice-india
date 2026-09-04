import type { Metadata } from "next";
import GstStateCodesClient from "./GstStateCodesClient";

export const metadata: Metadata = {
  title: "Indian GST State Code List 2026 — 2-Digit Codes & Capitals Directory — SwiftGST",
  description:
    "Complete list of 2-digit Indian GST State Codes (01 to 38, 97) with state names, capitals, union territories, and instant GSTIN validation. Fast 1-click copy for invoices and e-way bills.",
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
  openGraph: {
    title: "GST State Code List 2026 — Indian State Codes & Capitals Directory — SwiftGST",
    description:
      "Official CBIC 2-digit GST state codes for all 37 Indian States and Union Territories. Search by name, capital, or code with 1-click copy.",
    type: "website",
  },
};

export default function GstStateCodesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are GST State Codes in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GST State Codes are two-digit numerical identifiers assigned by the Central Board of Indirect Taxes and Customs (CBIC) representing each State and Union Territory in India. They form the first two characters of any 15-digit GSTIN.",
        },
      },
      {
        "@type": "Question",
        name: "What is the GST state code for Maharashtra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The GST state code for Maharashtra is 27.",
        },
      },
      {
        "@type": "Question",
        name: "What is the GST state code for Delhi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The GST state code for Delhi is 07.",
        },
      },
      {
        "@type": "Question",
        name: "What is the GST state code for Karnataka?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The GST state code for Karnataka is 29.",
        },
      },
      {
        "@type": "Question",
        name: "How many GST state codes exist in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There are currently 37 active GST state codes in India covering 28 States, 8 Union Territories, and 1 Other Territory (Code 97).",
        },
      },
    ],
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
