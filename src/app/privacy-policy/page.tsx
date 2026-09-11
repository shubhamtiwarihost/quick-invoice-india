import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Cookie,
  Server,
  Mail,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — SwiftGST Data Protection & Cookie Disclosure",
  description:
    "Official Privacy Policy for SwiftGST (swiftgst.in). Comprehensive disclosures on browser LocalStorage usage, Cookie Consent policy, Google AdSense & Analytics third-party cookies, and DPDP / GDPR compliance.",
  keywords: [
    "SwiftGST privacy policy",
    "invoice generator privacy India",
    "AdSense cookie policy",
    "localStorage privacy disclosure",
    "DPDP Act compliance invoice",
    "swiftgst.in legal",
  ],
  alternates: {
    canonical: "https://swiftgst.in/privacy-policy/",
  },
  openGraph: {
    title: "Privacy Policy — SwiftGST Data Protection & Cookie Disclosure",
    description:
      "SwiftGST processes all billing and calculations privately on your device. Read our comprehensive data protection and cookie disclosures.",
    url: "https://swiftgst.in/privacy-policy/",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-14">
      {/* Header Banner */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-12 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Legal &amp; Data Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-teal-200/90 font-medium">
          <em>Effective Date: September 2024 · Last Revised &amp; Verified: September 2026</em>
        </p>
        <p className="mt-4 text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-3xl">
          At SwiftGST (accessible via{" "}
          <a
            href="https://swiftgst.in"
            className="text-white underline underline-offset-4 hover:text-teal-200 font-semibold"
          >
            https://swiftgst.in
          </a>
          ), your privacy and data security are foundational principles. This document transparently explains
          what data is processed, how secure device storage operates, how third-party advertising cookies function,
          and your rights under Indian and international privacy regulations.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* 1. Core Architecture: On-Device Privacy */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <EyeOff className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                1. Core Architectural Principle: On-Device Processing
              </h2>
              <p className="text-xs text-slate-500">Your commercial invoice data never reaches our web servers</p>
            </div>
          </div>
          <p>
            The primary functionality of SwiftGST — including GST invoice generation, quotation drafting, reverse tax calculations,
            UPI QR code generation, and PDF file rendering — executes privately on your device.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs sm:text-sm text-emerald-950 font-medium">
            <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Zero Financial Data Transmission:</span>
            </div>
            When you enter your business GSTIN, customer billing address, item rates, bank account numbers, or digital signatures,
            none of this information is transmitted to or stored on SwiftGST databases or backend cloud servers.
          </div>
        </section>

        {/* 2. Browser LocalStorage & Draft Preservation */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700 shadow-2xs">
              <Server className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                2. Use of Browser LocalStorage
              </h2>
              <p className="text-xs text-slate-500">Convenience caching stored solely on your physical device</p>
            </div>
          </div>
          <p>
            To prevent you from losing your work upon refreshing or reopening your browser, SwiftGST utilizes the standard W3C
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono font-bold text-slate-800">window.localStorage</code> API.
            The following keys may be stored on your local browser:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>
              <code className="font-mono font-semibold text-slate-800">swiftgst_active_draft</code>: Stores your currently active invoice draft (seller details, line items, and invoice number) locally on your device.
            </li>
            <li>
              <code className="font-mono font-semibold text-slate-800">swiftgst_saved_invoices_v1</code>: Stores previously saved invoices in your offline history so you can re-load or duplicate them later.
            </li>
            <li>
              <code className="font-mono font-semibold text-slate-800">swiftgst_cookie_consent</code>: Stores your preference regarding cookie consent (<code className="font-mono text-teal-800">&apos;accepted&apos;</code> or <code className="font-mono text-teal-800">&apos;declined&apos;</code>).
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            You can clear these stored records at any moment by clearing your browser cache and cookies, or by tapping &quot;Reset Sample&quot; in the editor.
          </p>
        </section>

        {/* 3. Cookies & Advertising Disclosure (Google AdSense & Analytics) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-700 shadow-2xs">
              <Cookie className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                3. Cookies &amp; Third-Party Advertising (Google AdSense)
              </h2>
              <p className="text-xs text-slate-500">Strict compliance with Google AdSense Program Policies</p>
            </div>
          </div>
          <p>
            Cookies are small text files placed on your device by websites you visit. SwiftGST uses cookies and similar tracking
            technologies for platform stability, aggregate traffic analysis, and to serve advertisements that fund our 100% free service.
          </p>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-5 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 text-sm">Google AdSense &amp; DoubleClick Cookie Disclosures:</h3>
            <p className="text-slate-600 leading-relaxed">
              • Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to SwiftGST or other websites on the Internet.
            </p>
            <p className="text-slate-600 leading-relaxed">
              • Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </p>
            <p className="text-slate-600 leading-relaxed">
              • Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
              >
                Google Ads Settings <ExternalLink className="h-3 w-3" />
              </a>
              . Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
              >
                www.aboutads.info <ExternalLink className="h-3 w-3" />
              </a>
              .
            </p>
          </div>
        </section>

        {/* 4. Information You Voluntarily Provide */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700 shadow-2xs">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                4. Information You Voluntarily Provide
              </h2>
              <p className="text-xs text-slate-500">Contact form and customer support communications</p>
            </div>
          </div>
          <p>
            If you contact us via email at <code className="font-mono font-semibold text-teal-800">support@swiftgst.in</code> or through our
            Contact Us form, we receive your name, email address, message subject, and inquiry content. This information is used
            exclusively to address your inquiry, provide technical support, and resolve issues. We never sell, rent, or lease your
            email contact information to third parties.
          </p>
        </section>

        {/* 5. Indian Law & DPDP Act 2023 Compliance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                5. Compliance with Indian DPDP Act 2023 &amp; IT Act 2000
              </h2>
              <p className="text-xs text-slate-500">Digital Personal Data Protection Act, 2023 adherence</p>
            </div>
          </div>
          <p>
            SwiftGST operates in full compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection
            (DPDP) Act, 2023 of India. Because our utilities operate without central user accounts or central data storage:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li><strong>Purpose Limitation:</strong> We process minimal data only for the explicit purpose of responding to direct inquiries.</li>
            <li><strong>Data Minimization:</strong> We do not ask for, collect, or store Aadhaar numbers, confidential banking credentials, or personal passwords.</li>
            <li><strong>Right to Erasure:</strong> Because invoice data is held solely in your local browser, clearing your browser storage permanently erases all records.</li>
          </ul>
        </section>

        {/* 6. International Privacy Rights (GDPR & CCPA) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                6. International Data Rights (GDPR &amp; CCPA)
              </h2>
              <p className="text-xs text-slate-500">Rights for European Union and international visitors</p>
            </div>
          </div>
          <p>
            Depending on your location, you have legal rights under the General Data Protection Regulation (GDPR) and the California
            Consumer Privacy Act (CCPA), including:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <strong className="block text-slate-900 mb-0.5">Right to Access:</strong>
              You may request copies of personal communication data held by us.
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <strong className="block text-slate-900 mb-0.5">Right to Rectification:</strong>
              You may request correction of inaccurate support information.
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <strong className="block text-slate-900 mb-0.5">Right to Erasure:</strong>
              You may request deletion of your support email records.
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <strong className="block text-slate-900 mb-0.5">Right to Opt-Out:</strong>
              You may reject non-essential cookies via our Cookie Consent banner.
            </div>
          </div>
        </section>

        {/* 7. Changes & Contact Info */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                7. Contact Our Privacy Officer
              </h2>
              <p className="text-xs text-slate-500">Inquiries regarding this policy</p>
            </div>
          </div>
          <p>
            If you have any questions, clarifications, or requests regarding this Privacy Policy or our cookie handling,
            please contact our compliance officer at:
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm">
            <p><strong>Platform:</strong> SwiftGST (swiftgst.in)</p>
            <p className="mt-1"><strong>Privacy &amp; Compliance Email:</strong>{" "}
              <a href="mailto:support@swiftgst.in" className="text-teal-700 font-bold hover:underline">
                support@swiftgst.in
              </a>
            </p>
            <p className="mt-1"><strong>Contact Helpdesk:</strong>{" "}
              <Link href="/contact-us" className="text-teal-700 font-bold hover:underline">
                swiftgst.in/contact-us/
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
