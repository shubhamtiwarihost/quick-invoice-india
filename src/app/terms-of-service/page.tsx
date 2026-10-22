import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Landmark,
  FileCode2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & User Agreement",
  description:
    "Review the Terms of Service governing your use of SwiftGST (swiftgst.in). Permitted commercial use, software availability, intellectual property, and limitations of liability.",
  keywords: [
    "SwiftGST terms of service",
    "terms of use swiftgst",
    "GST invoice generator terms India",
    "billing software agreement",
    "swiftgst.in legal terms",
  ],
  alternates: {
    canonical: "https://swiftgst.in/terms-of-service/",
  },
  openGraph: {
    title: "Terms of Service — SwiftGST User Agreement & Legal Terms",
    description:
      "Review the Terms of Service governing your access and usage of SwiftGST (swiftgst.in).",
    url: "https://swiftgst.in/terms-of-service/",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-14">
      {/* Header Banner */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-12 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20 mb-4">
          <Scale className="h-3.5 w-3.5" />
          <span>Binding User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-teal-200/90 font-medium">
          <em>Effective Date: September 2024 · Last updated: October 2026</em>
        </p>
        <p className="mt-4 text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-3xl">
          Welcome to SwiftGST. By accessing, browsing, or using{" "}
          <a
            href="https://swiftgst.in"
            className="text-white underline underline-offset-4 hover:text-teal-200 font-semibold"
          >
            https://swiftgst.in
          </a>
          , you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* 1. Permitted Use */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <UserCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">1. Permitted Lawful Use</h2>
              <p className="text-xs text-slate-500">Guidelines for commercial and personal billing</p>
            </div>
          </div>
          <p>
            SwiftGST provides browser-based billing, estimation, and tax calculation utilities designed for Indian small businesses,
            freelancers, consultants, and accounting professionals. You agree to use SwiftGST solely for genuine, legitimate commercial
            and recordkeeping activities.
          </p>
          <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-xs sm:text-sm text-red-950 font-medium">
            <strong>Prohibited Activities:</strong> You must not use SwiftGST to manufacture counterfeit tax invoices, generate fraudulent Input Tax Credit (ITC) paper bills, misrepresent GSTIN numbers without proper authorization under Section 132 of the CGST Act, 2017, or introduce malicious payloads, automated scraping bots, or denial-of-service scripts.
          </div>
        </section>

        {/* 2. User Tax & Compliance Responsibility */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700 shadow-2xs">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">2. Tax Compliance &amp; Regulatory Responsibility</h2>
              <p className="text-xs text-slate-500">Sole taxpayer accountability for statutory returns</p>
            </div>
          </div>
          <p>
            While SwiftGST applies standard computational formulas aligned with the Central Goods and Services Tax (CGST) Act, 2017,
            Integrated Goods and Services Tax (IGST) Act, 2017, and Rule 46 of the CGST Rules:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>
              <strong>Tax Slab Selection:</strong> You are solely responsible for verifying the correct HSN/SAC code and applicable GST rate (currently 0%, 3%, 5%, 18% or 40%) for your goods or services.
            </li>
            <li>
              <strong>Place of Supply:</strong> You must ensure the Place of Supply matches the recipient&apos;s state of delivery in accordance with Section 10 and Section 12 of the IGST Act.
            </li>
            <li>
              <strong>Statutory Returns:</strong> Generating an invoice on SwiftGST does not automatically transmit data to the GST Portal. You remain responsible for uploading outward supplies to Form GSTR-1 and discharging tax liability via Form GSTR-3B.
            </li>
          </ul>
        </section>

        {/* 3. Intellectual Property Rights */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700 shadow-2xs">
              <FileCode2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">3. Intellectual Property Rights</h2>
              <p className="text-xs text-slate-500">Protection of software, brand assets, and original designs</p>
            </div>
          </div>
          <p>
            All original source code, user interface layouts, graphic illustrations, articles, documentation, and the &quot;SwiftGST&quot;
            name and logo are the intellectual property of SwiftGST and are protected by Indian copyright and intellectual property laws.
            You are granted a non-exclusive, revocable, royalty-free license to generate, export, download, and distribute invoices created
            with our platform for your own business operations.
          </p>
        </section>

        {/* 4. Service Availability & "As-Is" Disclaimer */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-700 shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">4. Service Availability &amp; &ldquo;As Is&rdquo; Warranty Disclaimer</h2>
              <p className="text-xs text-slate-500">Uninterrupted operation and software execution terms</p>
            </div>
          </div>
          <p>
            SwiftGST and all included calculation utilities are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
            We make no representations or warranties of any kind, express or implied, regarding uptime, defect-free operation,
            or uninterrupted server availability. We reserve the right to modify, enhance, or discontinue any feature at any time without notice.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-700 shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability</h2>
              <p className="text-xs text-slate-500">Scope of legal liability</p>
            </div>
          </div>
          <p>
            To the maximum extent permitted by applicable Indian law, in no event shall SwiftGST, its developers, or contributors be
            liable for any indirect, incidental, special, consequential, or punitive damages, including loss of business profits,
            penalties assessed by tax authorities, audit discrepancies, or data loss arising from your use of this service.
          </p>
        </section>

        {/* 6. Governing Law & Jurisdiction */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">6. Governing Law &amp; Jurisdiction</h2>
              <p className="text-xs text-slate-500">Legal jurisdiction under Indian statutes</p>
            </div>
          </div>
          <p>
            These Terms of Service and any dispute or claim arising out of or in connection with them shall be governed by and construed
            in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action shall be brought
            exclusively in the competent courts situated in India.
          </p>
        </section>

        {/* 7. Contact Regarding Terms */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">7. Legal Inquiries</h2>
              <p className="text-xs text-slate-500">Questions about this user agreement</p>
            </div>
          </div>
          <p>
            For legal inquiries, copyright notices, or questions concerning these Terms of Service, please contact us at{" "}
            <a href="mailto:support@swiftgst.in" className="text-teal-700 font-bold hover:underline">
              support@swiftgst.in
            </a>{" "}
            or write through our{" "}
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
