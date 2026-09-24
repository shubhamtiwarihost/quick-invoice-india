import { Suspense } from "react";
import type { Metadata } from "next";
import GstinValidatorClient from "./GstinValidatorClient";

export const metadata: Metadata = {
  title: "GSTIN Validator & Checksum Checker — SwiftGST",
  description:
    "Verify 15-digit Indian GSTIN format and official MOD 36 check digit. Get instant breakdown of State Code, PAN number, Entity Type, and validity status.",
  keywords: [
    "GSTIN validator",
    "GST number check",
    "GSTIN checksum calculator",
    "verify GSTIN India",
    "GST state code",
    "GST PAN format",
  ],
  alternates: {
    canonical: "https://swiftgst.in/gstin-validator/",
  },
  openGraph: {
    title: "GSTIN Validator & Checksum Checker — SwiftGST",
    description:
      "Verify 15-digit Indian GSTIN format, 2-digit state code, PAN entity, and MOD 36 check digit online.",
    url: "https://swiftgst.in/gstin-validator/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSTIN Validator & MOD 36 Checksum Checker — SwiftGST",
    description:
      "Free online 15-digit Indian GSTIN number validation and entity analysis.",
  },
};

export default function GstinValidatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST GSTIN Validator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/gstin-validator/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Verify 15-digit Indian GSTIN structure, MOD 36 algorithm check digit, and taxpayer registration state.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  Official MOD 36 Verification
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  GSTIN Validator &amp; Breakdown
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Verify any 15-character Goods and Services Tax Identification Number (GSTIN) with structure decoding and check digit verification.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 animate-pulse">
              Loading validator…
            </div>
          </main>
        }
      >
        <GstinValidatorClient />
      </Suspense>
    </>
  );
}
