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
  title: "Terms and Conditions — SwiftGST",
  description:
    "Read the Terms and Conditions for SwiftGST (swiftgst.in). Permitted use, software availability, limitation of liability, and governing law.",
  keywords: [
    "SwiftGST terms and conditions",
    "terms of service swiftgst",
    "invoice generator terms India",
    "swiftgst.in terms",
  ],
  openGraph: {
    title: "Terms and Conditions — SwiftGST",
    description:
      "Review the Terms and Conditions governing your access and use of SwiftGST (swiftgst.in).",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-teal-100 bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-10 text-white shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
          <Scale className="h-3.5 w-3.5" />
          Legal Agreement
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-xs text-teal-200/90 font-medium">
          <em>Last Updated: September 2026</em>
        </p>
        <p className="mt-3 text-base text-teal-100/90 leading-relaxed font-normal max-w-2xl">
          Welcome to SwiftGST. By accessing and using{" "}
          <a
            href="https://swiftgst.in"
            className="text-white underline underline-offset-4 hover:text-teal-200"
          >
            https://swiftgst.in
          </a>
          , you agree to comply with and be bound by the following Terms and
          Conditions.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Section 1 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <FileCode2 className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              1. Intellectual Property
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            All software, brand elements, UI designs, and original written
            content on SwiftGST are the intellectual property of SwiftGST and
            are protected by applicable copyright laws.
          </p>
        </section>

        {/* Section 2 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <UserCheck className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              2. Permitted Use
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            You agree to use this website solely for lawful purposes. You must
            not use our services to create fraudulent invoices, attempt
            unauthorized access, or introduce malicious scripts or viruses.
          </p>
        </section>

        {/* Section 3 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              3. Software Availability & &ldquo;As Is&rdquo; Basis
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            Our utilities and tools are provided on an &ldquo;as-is&rdquo; and
            &ldquo;as-available&rdquo; basis without any warranty of
            uninterrupted operation, server uptime, or defect-free execution.
          </p>
        </section>

        {/* Section 4 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              4. Limitation of Liability
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            In no event shall SwiftGST or its operators be liable for any
            direct, indirect, incidental, or consequential damages resulting
            from the use or inability to use this platform, including errors in
            tax calculation or invoice drafting.
          </p>
        </section>

        {/* Section 5 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Landmark className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              5. Governing Law
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            These terms shall be governed by and interpreted in accordance with
            the laws of India. Any disputes arising shall be subject to the
            exclusive jurisdiction of the courts of India.
          </p>
        </section>

        {/* Contact Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Mail className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Questions Regarding Terms
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            If you have questions regarding these Terms and Conditions, please
            contact us at{" "}
            <a
              href="mailto:support@swiftgst.in"
              className="text-teal-700 font-semibold hover:underline"
            >
              support@swiftgst.in
            </a>
            , or visit our{" "}
            <Link href="/contact" className="text-teal-700 font-semibold hover:underline">
              Contact Page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
