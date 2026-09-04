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
} from "lucide-react";

export const metadata: Metadata = {
  title: "About SwiftGST — Fast & Easy GST Invoicing & Compliance",
  description:
    "Learn about SwiftGST (swiftgst.in) — our mission to simplify GST compliance, invoice generation, and tax workflows for Indian businesses, freelancers, and accountants.",
  keywords: [
    "about SwiftGST",
    "GST invoicing India",
    "Indian business compliance tools",
    "GST utility platform",
    "swiftgst.in",
  ],
  openGraph: {
    title: "About SwiftGST — Fast & Easy GST Invoicing",
    description:
      "Simplifying GST compliance and invoicing for Indian businesses, freelancers, traders, and accountants.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-teal-100 bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-10 text-white shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
          <Sparkles className="h-3.5 w-3.5" />
          About Our Platform
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          About SwiftGST
        </h1>
        <p className="mt-3 text-lg text-teal-100/90 leading-relaxed font-normal max-w-2xl">
          Simplifying GST Compliance and Invoicing for Indian Businesses.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Who We Are */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Zap className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Who We Are</h2>
          </div>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-600">
            <strong>SwiftGST</strong> (
            <a
              href="https://swiftgst.in"
              className="text-teal-700 font-medium hover:underline"
            >
              swiftgst.in
            </a>
            ) is a modern, fast, and easy-to-use digital utility platform built
            to assist Indian freelancers, small businesses, traders, and
            accountants with tax calculations, invoicing, and compliance
            workflows.
          </p>
        </section>

        {/* Our Mission */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Target className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          </div>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-600">
            Managing taxes and generating compliant invoices shouldn&apos;t be
            complicated or time-consuming. Our mission is to provide intuitive,
            high-performance web utilities that save time and reduce errors in
            daily business bookkeeping.
          </p>
        </section>

        {/* What We Offer */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">What We Offer</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm md:text-base text-slate-600">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Instant GST and tax calculations:</strong> Real-time
                computations for forward and reverse GST, inter-state IGST, and
                intra-state CGST/SGST splits.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Compliant invoice and bill formatting tools:</strong>{" "}
                Professional A4 live preview templates, PDF downloads, and
                1-click WhatsApp sharing with QR codes.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clear, actionable compliance guides and resources:</strong>{" "}
                Official 2-digit GST state codes, GSTIN MOD 36 checksum
                validators, and E-Way bill threshold checkers.
              </span>
            </li>
          </ul>

          {/* Quick links to tools */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link
              href="/"
              className="group flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 transition-all hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div>
                <FileText className="h-5 w-5 text-teal-700" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-teal-800">
                  GST Invoice Generator
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Create PDF & WhatsApp invoices in seconds.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-700">
                Launch <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/quotation-maker"
              className="group flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 transition-all hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div>
                <FileText className="h-5 w-5 text-teal-700" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-teal-800">
                  Quotation Maker
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Professional estimates with 1-click GST conversion.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-700">
                Launch <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/gst-state-codes"
              className="group flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 transition-all hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div>
                <Calculator className="h-5 w-5 text-teal-700" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-teal-800">
                  State Codes Directory
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Complete 2-digit Indian state & UT code list.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-700">
                Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Privacy & Client-side Highlight */}
        <section className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-emerald-950">
                100% Client-Side Privacy Guarantee
              </h2>
              <p className="mt-2 text-sm text-emerald-900/90 leading-relaxed">
                Unlike traditional software, your invoice details, buyer
                information, and financial data are processed directly inside
                your web browser. We never transmit or store your invoices on
                external servers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
