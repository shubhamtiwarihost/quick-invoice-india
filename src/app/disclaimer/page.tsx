import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Landmark,
  Scale,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer & Legal Tax Notice",
  description:
    "Disclaimer for SwiftGST (swiftgst.in). SwiftGST is an independent software tool not affiliated with the Goods and Services Tax Network (GSTN) or CBIC.",
  keywords: [
    "SwiftGST disclaimer",
    "non-government GST disclaimer",
    "tax calculator legal notice India",
    "GSTN non-affiliation",
    "swiftgst.in legal",
  ],
  alternates: {
    canonical: "https://swiftgst.in/disclaimer/",
  },
  openGraph: {
    title: "Disclaimer & Legal Tax Notice — SwiftGST",
    description:
      "SwiftGST is an independent private utility and not affiliated with GSTN, CBIC, or the Government of India.",
    url: "https://swiftgst.in/disclaimer/",
    type: "website",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-14">
      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 p-8 md:p-12 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 border border-amber-400/20 mb-4">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Important Notices</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Legal &amp; Tax Disclaimer
        </h1>
        <p className="mt-2 text-xs text-amber-200/90 font-medium">
          <em>Last updated: October 2026</em>
        </p>
        <p className="mt-4 text-base sm:text-lg text-amber-100/90 leading-relaxed font-normal max-w-3xl">
          Please read this legal notice carefully before utilizing any invoicing, calculation, or compliance tools provided on SwiftGST (
          <a
            href="https://swiftgst.in"
            className="text-white underline underline-offset-4 hover:text-amber-200 font-semibold"
          >
            https://swiftgst.in
          </a>
          ).
        </p>
      </div>

      <div className="mt-10 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* 1. Explicit Non-Government Entity Disclaimer */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 border border-amber-200 text-amber-900 shadow-2xs">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-amber-950">
                1. Non-Government Entity Notice
              </h2>
              <p className="text-xs text-amber-800 font-medium">Clear notice of non-affiliation with public authorities</p>
            </div>
          </div>
          <div className="text-amber-950 space-y-3 font-medium text-sm sm:text-base leading-relaxed">
            <p>
              <strong>SwiftGST (accessible via swiftgst.in) is an independent, privately owned and operated web utility platform.</strong>
            </p>
            <p>
              SwiftGST is <strong>NOT</strong> owned by, affiliated with, associated with, sponsored by, or officially endorsed by the
              <strong> Goods and Services Tax Network (GSTN)</strong>, the <strong>Central Board of Indirect Taxes and Customs (CBIC)</strong>,
              the <strong>Ministry of Finance</strong>, or any State or Central Government entity in India.
            </p>
            <p>
              The official Government of India Goods and Services Tax portal for GST registration, return filing (GSTR-1, GSTR-3B, GSTR-9),
              and tax challan payment is located exclusively at{" "}
              <a
                href="https://www.gst.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-amber-900 hover:text-amber-700 inline-flex items-center gap-1"
              >
                www.gst.gov.in <ExternalLink className="h-3.5 w-3.5" />
              </a>
              . The official E-Way Bill system is hosted at{" "}
              <a
                href="https://ewaybillgst.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-amber-900 hover:text-amber-700 inline-flex items-center gap-1"
              >
                ewaybillgst.gov.in <ExternalLink className="h-3.5 w-3.5" />
              </a>
              .
            </p>
          </div>
        </section>

        {/* 2. No Chartered Accountant or Legal Advisory Relationship */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                2. No Legal, Financial, or Tax Advisory Relationship
              </h2>
              <p className="text-xs text-slate-500">Informational and computational utility only</p>
            </div>
          </div>
          <p>
            The tools, invoice formats, rate calculators, state code lookups, HSN directories, and compliance guides hosted on SwiftGST
            are provided solely for educational, informational, and general calculation convenience.
          </p>
          <p>
            Nothing on this website constitutes formal financial advice, tax planning, Chartered Accountancy counsel, or legal opinion.
            GST laws and rates are subject to frequent amendments via official CBIC notifications and GST Council circulars.
            Taxpayers must exercise independent professional judgment and consult a certified Chartered Accountant (CA) or tax attorney
            for enterprise tax advisory, audit compliance, or disputed assessments.
          </p>
        </section>

        {/* 3. Limitation of Accuracy & Mathematical Figures */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                3. Accuracy of Calculations &amp; Regulatory Changes
              </h2>
              <p className="text-xs text-slate-500">Standard rounding and rate verification notice</p>
            </div>
          </div>
          <p>
            SwiftGST calculates tax to two decimals using standard half-up rounding, and splits tax into CGST/SGST or IGST based on the
            states you select. We aim to keep calculations and rates current with GST 2.0 (slabs of 0%, 5%, 18% and 40%, plus 3% for gold
            and jewellery, effective 22 September 2025), but we provide no guarantee of accuracy or fitness for any specific transaction.
            HSN/SAC rates shown are a convenience reference, not a legal notification.
          </p>
          <p>
            Users are advised to double-check their exported PDF figures, applicable cess components, and reverse charge applicability
            prior to issuing binding tax invoices to commercial clients or filing GSTR-1 returns.
          </p>
        </section>

        {/* 4. Third-Party Links & External Citations */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700 shadow-2xs">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                4. Third-Party Links &amp; References
              </h2>
              <p className="text-xs text-slate-500">External resources and citations</p>
            </div>
          </div>
          <p>
            SwiftGST may include hyperlinks to external websites, government portals, or commercial references (e.g., CBIC gazettes,
            GST Council press releases, RBI guidelines). We have no control over the content, uptime, or privacy policies of third-party
            sites and assume no responsibility for information found on external web pages.
          </p>
        </section>

        {/* 5. Contact Regarding Disclaimers */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                5. Contact &amp; Statutory Inquiries
              </h2>
              <p className="text-xs text-slate-500">Inquiries concerning our disclaimers</p>
            </div>
          </div>
          <p>
            If you have questions regarding our legal disclaimers or wish to notify us of an updated statutory notification,
            please reach out to{" "}
            <a href="mailto:support@swiftgst.in" className="text-teal-700 font-bold hover:underline">
              support@swiftgst.in
            </a>{" "}
            or visit our{" "}
            <Link href="/contact-us" className="text-teal-700 font-bold hover:underline">
              Contact Us page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
