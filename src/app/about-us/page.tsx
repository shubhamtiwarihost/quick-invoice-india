import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Calculator,
  ShieldCheck,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  BookOpen,
  Mail,
  Lock,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — SwiftGST Mission, Team & Compliance Standards",
  description:
    "Learn about SwiftGST (swiftgst.in) — our founding mission, editorial standards, creator background, and commitment to 100% private, client-side Indian GST invoicing and compliance.",
  keywords: [
    "about SwiftGST",
    "SwiftGST mission",
    "GST invoicing India",
    "Indian tax compliance software",
    "client-side invoice privacy",
    "swiftgst.in about",
  ],
  alternates: {
    canonical: "https://swiftgst.in/about-us/",
  },
  openGraph: {
    title: "About Us — SwiftGST Mission, Team & Compliance Standards",
    description:
      "Empowering Indian SMBs, freelancers, and accountants with fast, free, private GST compliance and billing utilities.",
    url: "https://swiftgst.in/about-us/",
    type: "website",
  },
};

export default function AboutUsPage() {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SwiftGST",
    url: "https://swiftgst.in",
    logo: "https://swiftgst.in/icon.svg",
    description:
      "Free, private, browser-based GST compliance and invoicing tools for Indian small businesses, freelancers, and enterprises.",
    founder: {
      "@type": "Person",
      name: "Shubham Tiwari",
      jobTitle: "Founder & Lead Architect",
    },
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@swiftgst.in",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />

      {/* Header Banner */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-12 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Story &amp; Values</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          About SwiftGST
        </h1>
        <p className="mt-4 text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-3xl">
          Empowering Indian freelancers, small businesses, and accountants with instantaneous,
          100% private GST compliance tools — zero sign-up paywalls, zero tele-calling, and zero cloud tracking.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {/* Mission Statement */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Our Founding Mission</h2>
              <p className="text-xs text-slate-500">Democratizing professional billing for 63+ million Indian enterprises</p>
            </div>
          </div>
          <div className="mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              In India, micro, small, and medium enterprises (MSMEs) and independent contractors are the backbone of the economy.
              Yet, creating a simple, legally compliant GST tax invoice or calculating reverse tax often requires navigating bloated,
              subscription-gated cloud accounting portals, mandatory phone number registrations that lead to aggressive telemarketing calls,
              or downloading heavy desktop software.
            </p>
            <p>
              <strong>SwiftGST (swiftgst.in) was founded on a simple premise:</strong> Basic tax invoicing, GST state code lookups,
              and tax calculations are fundamental commercial utilities that should be fast, completely free, and strictly private.
              By leveraging modern client-side web technologies, SwiftGST executes all calculations, PDF document generation, and UPI payment
              QR codes directly inside your browser without transmitting your sensitive client records to any server.
            </p>
          </div>
        </section>

        {/* Founder & Leadership */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Founder &amp; Leadership</h2>
              <p className="text-xs text-slate-500">Dedicated to India&apos;s independent business &amp; freelance community</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 sm:p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-xl font-bold text-white shadow-md select-none">
              ST
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Shubham Tiwari</h3>
                <span className="rounded-full bg-teal-100 border border-teal-200 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                  Founder &amp; Lead Architect
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Shubham Tiwari founded SwiftGST with the objective of eliminating friction in Indian commercial invoicing and GST compliance. Recognizing the privacy risks, subscription costs, and unsolicited telemarketing common with legacy accounting platforms, he built SwiftGST as an open, client-side web suite where calculations, invoice generation, and tax filing utilities run directly in the browser with zero data harvesting.
              </p>
            </div>
          </div>
        </section>

        {/* E-E-A-T & Creator Standards */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700 shadow-2xs">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Expertise &amp; Editorial Standards</h2>
              <p className="text-xs text-slate-500">Rigorous CBIC tax alignment and continuous legal verification</p>
            </div>
          </div>
          <div className="mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              Our calculators, invoice builders, and compliance guides are developed through continuous consultation with the latest
              official statutory notifications published by the Central Board of Indirect Taxes and Customs (CBIC) and the Goods and
              Services Tax Council.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 mt-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <BookOpen className="h-5 w-5 text-teal-700 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Section 31 Compliance</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  All templates strictly adhere to Rule 46 invoice particulars under the Central Goods and Services Tax Act, 2017.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <CheckCircle2 className="h-5 w-5 text-teal-700 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">MOD 36 Validation</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  GSTIN validation implements the official ISO/IEC 7064 MOD 36, 37 check-digit algorithm utilized by the GST portal.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <ShieldCheck className="h-5 w-5 text-teal-700 mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Rule 138 E-Way Limits</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  State-specific consignment thresholds (₹50,000 / ₹1,00,000) are regularly updated in accordance with state gazette releases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 100% Client-Side Privacy Pillar */}
        <section className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-white p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-emerald-950">Our Zero-Data-Collection Architecture</h2>
              <p className="text-xs text-emerald-800">Your commercial numbers remain exclusively on your device</p>
            </div>
          </div>
          <p className="mt-4 text-sm sm:text-base text-emerald-900/90 leading-relaxed">
            Unlike commercial CRM and cloud invoicing apps, <strong>SwiftGST does not require you to create an account, enter a mobile number, or store invoices on our servers</strong>.
            All PDF rendering and mathematical computations happen inside your web browser via HTML5 Canvas and WebAssembly.
            Your local draft is preserved using standard browser <code className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-mono font-semibold text-emerald-900">localStorage</code>,
            meaning neither SwiftGST nor any third party has access to your client lists, billing amounts, or bank details.
          </p>
        </section>

        {/* Comprehensive Utilities Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700 shadow-2xs">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">The SwiftGST Utility Suite</h2>
              <p className="text-xs text-slate-500">Complete, integrated billing and compliance solutions</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link
              href="/"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div>
                <FileText className="h-5 w-5 text-teal-700" />
                <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-teal-800">
                  GST Invoice Generator
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Tax Invoices, Bills of Supply, UPI QR codes &amp; GSTR-1 CSV exports.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-700">
                <span>Use Tool</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/quotation-maker"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div>
                <FileText className="h-5 w-5 text-teal-700" />
                <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-teal-800">
                  Quotation &amp; Estimate Maker
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Formal client estimates with validity periods and 1-click invoice conversion.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-700">
                <span>Use Tool</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/gst-calculator"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div>
                <Calculator className="h-5 w-5 text-teal-700" />
                <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-teal-800">
                  GST Calculator
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Forward and reverse tax computations for 5%, 12%, 18%, 28% slabs.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-700">
                <span>Use Tool</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Contact & Transparency */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Contact &amp; Feedback</h2>
              <p className="text-xs text-slate-500">We welcome community feedback, suggestions, and corrections</p>
            </div>
          </div>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            SwiftGST is actively maintained and improved based on input from Indian Chartered Accountants, small business owners,
            and freelancers. If you have questions about our calculations, need support, or wish to report a discrepancy,
            please reach out directly to our engineering team at{" "}
            <a href="mailto:support@swiftgst.in" className="text-teal-700 font-bold hover:underline">
              support@swiftgst.in
            </a>
            , visit our{" "}
            <Link href="/contact-us" className="text-teal-700 font-bold hover:underline">
              Contact Us page
            </Link>
            , or message us on Instagram at{" "}
            <a
              href="https://www.instagram.com/swiftgst.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 font-bold hover:underline"
            >
              @swiftgst.in
            </a>
            . We typically respond within 24–48 business hours.
          </p>
        </section>
      </div>
    </main>
  );
}
