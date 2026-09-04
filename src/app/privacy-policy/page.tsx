import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Cookie, Server, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — SwiftGST",
  description:
    "Read the SwiftGST (swiftgst.in) privacy policy. Learn about our strict browser-local data processing, analytics, cookies, and data protection practices.",
  keywords: [
    "SwiftGST privacy policy",
    "invoice privacy India",
    "client-side GST calculator privacy",
    "swiftgst.in privacy",
  ],
  openGraph: {
    title: "Privacy Policy — SwiftGST",
    description:
      "SwiftGST values your privacy. Invoicing and calculation data remains local to your browser.",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-teal-100 bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-10 text-white shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          Legal & Privacy
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-teal-200/90 font-medium">
          <em>Last Updated: September 2026</em>
        </p>
        <p className="mt-3 text-base text-teal-100/90 leading-relaxed font-normal max-w-2xl">
          SwiftGST (accessible via{" "}
          <a
            href="https://swiftgst.in"
            className="text-white underline underline-offset-4 hover:text-teal-200"
          >
            https://swiftgst.in
          </a>
          ) values your privacy. This Privacy Policy outlines the types of
          information we collect and how we utilize and safeguard it.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Section 1 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <EyeOff className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              1. Information We Collect
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            We may collect basic personal identification information such as
            your name and email address if you reach out via our contact form or
            subscribe to updates. When using free utility tools (like
            calculators and invoice generators), data entered remains on your
            browser and is <strong>not</strong> stored or shared on our servers.
          </p>
        </section>

        {/* Section 2 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Server className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              2. Log Files & Analytics
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            Like most websites, SwiftGST uses standard log files and
            privacy-focused web analytics to analyze trends, administer the
            site, and track user movement across the platform for optimization
            purposes. These files log visitors when they visit websites —
            including IP addresses, browser types, Internet Service Providers
            (ISP), timestamp references, and referring/exit pages.
          </p>
        </section>

        {/* Section 3 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Cookie className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">3. Cookies</h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            We use essential cookies and browser local storage to maintain user
            preferences (such as your draft invoices, selected GST rates, or UI
            theme) and ensure smooth site navigation. You can instruct your
            browser to refuse cookies or clear local storage if you prefer.
          </p>
        </section>

        {/* Section 4 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Lock className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">4. Data Security</h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            We implement standard SSL encryption (HTTPS) and industry best
            practices to ensure your data is kept secure against unauthorized
            access. Because your business draft calculations happen client-side,
            your customer records never reside in a cloud database.
          </p>
        </section>

        {/* Section 5 */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Mail className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              5. Contact Us Regarding Privacy
            </h2>
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
            If you have any questions regarding this policy or our data practices,
            please reach us at{" "}
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
