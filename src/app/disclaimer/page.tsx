import type { Metadata } from "next";
import { AlertTriangle, Landmark, Scale, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer & Legal Notice — SwiftGST",
  description:
    "Official non-government disclaimer, educational notice, and limitation of accuracy for SwiftGST (swiftgst.in).",
  keywords: [
    "SwiftGST disclaimer",
    "non-government entity GST disclaimer",
    "tax calculator disclaimer",
    "swiftgst.in legal",
  ],
  openGraph: {
    title: "Disclaimer & Legal Notice — SwiftGST",
    description:
      "SwiftGST is an independent utility platform not affiliated with GSTN, CBIC, or the Government of India.",
    type: "website",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-950 via-slate-900 to-slate-900 p-8 md:p-10 text-white shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 border border-amber-400/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          Legal Notice & Terms
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Disclaimer
        </h1>
        <p className="mt-2 text-xs text-amber-200/90 font-medium">
          <em>Last Updated: September 2026</em>
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Section 1: Non-Government Entity */}
        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Landmark className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-amber-950">
              1. Non-Government Entity Disclaimer
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-amber-950">
            <strong>
              SwiftGST (swiftgst.in) is an independent private platform and
              utility service. We are NOT associated, affiliated, endorsed, or
              connected in any manner with the Goods and Services Tax Network
              (GSTN), Central Board of Indirect Taxes and Customs (CBIC), or the
              Government of India.
            </strong>{" "}
            The official Goods and Services Tax portal is accessible at{" "}
            <a
              href="https://www.gst.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-amber-900 hover:text-amber-700"
            >
              gst.gov.in
            </a>
            .
          </p>
        </section>

        {/* Section 2: No Financial or Legal Advice */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Scale className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              2. No Financial or Legal Advice
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            The calculators, templates, articles, and utilities provided on this
            website are for educational and informational purposes only. While
            we strive to keep information accurate and up to date, tax laws are
            subject to periodic regulatory updates. SwiftGST does not provide
            legal, financial, or formal tax advice. Users should consult a
            qualified Chartered Accountant or tax professional for formal
            compliance.
          </p>
        </section>

        {/* Section 3: Limitation of Accuracy */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              3. Limitation of Accuracy
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            We make no warranties regarding the absolute completeness, accuracy,
            or reliability of calculated figures or generated templates. Use of
            the site&apos;s outputs is at your own risk.
          </p>
        </section>
      </div>
    </main>
  );
}
