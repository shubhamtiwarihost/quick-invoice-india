import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  X,
  Zap,
  ArrowRight,
  PhoneOff,
  Sparkles,
  Lock,
  FileSpreadsheet,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";
import { GuideExtras, type GuideBlock } from "@/components/shared/GuideExtras";

const EXTRAS_CLEARTAX_FREE_ALTERNATIVE: GuideBlock[] = [
  {
    "heading": "Where SwiftGST fits",
    "bullets": [
      "You only need a fast invoice or a GST calculation without logging in.",
      "You are a freelancer, boutique or kirana owner with simple billing.",
      "You want free tools that explain the current GST 2.0 rates."
    ]
  },
  {
    "heading": "When ClearTax may suit you better",
    "bullets": [
      "You file GST returns or need ITC reconciliation.",
      "You need e-invoicing (IRN) for a larger business.",
      "Your CA works inside ClearTax and wants your data there."
    ]
  }
];


export const metadata: Metadata = {
  title: "Free ClearTax Alternative for GST Invoicing",
  description:
    "Looking for a free alternative to ClearTax invoice generator? SwiftGST requires no phone number, no login, and zero paywalls. Unlimited GST invoices, dynamic UPI QR codes & clean PDF downloads.",
  keywords: [
    "cleartax alternative",
    "free alternative to cleartax",
    "cleartax invoice generator free",
    "gst invoice maker without phone number",
    "gst billing without login",
    "free gst invoice no watermark",
    "cleartax competitor India",
  ],
  alternates: {
    canonical: "https://swiftgst.in/cleartax-free-alternative/",
  },
  openGraph: {
    title: "Best Free ClearTax Alternative for GST Invoicing — SwiftGST",
    description:
      "Generate compliant GST invoices without providing your phone number or enduring spam sales calls. 100% free with zero watermarks.",
    url: "https://swiftgst.in/cleartax-free-alternative/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ClearTax Alternative for GST Billing — SwiftGST",
    description:
      "100% free GST billing with zero phone signup, zero watermarks, and instant PDF download.",
  },
};

const COMPARISON_ROWS = [
  {
    feature: "Phone Number & Login Required",
    cleartax: "Mandatory phone & OTP (leads to sales calls)",
    swiftgst: "Never required — zero signup, zero spam",
    swiftAdvantage: true,
  },
  {
    feature: "Pricing & Paywalls",
    cleartax: "Free tier heavily capped; pushed to paid plans",
    swiftgst: "100% Free forever with no limits",
    swiftAdvantage: true,
  },
  {
    feature: "PDF Watermarks",
    cleartax: "Watermarked / ClearTax branding on free exports",
    swiftgst: "Zero watermarks — 100% clean, white-label",
    swiftAdvantage: true,
  },
  {
    feature: "App / Heavy Software Download",
    cleartax: "Heavy web portal with slow corporate scripts",
    swiftgst: "Loads in < 1 second on mobile or desktop",
    swiftAdvantage: true,
  },
  {
    feature: "Dynamic UPI Payment QR Code",
    cleartax: "Complex merchant gateway integration needed",
    swiftgst: "Auto-embedded UPI QR code on every bill",
    swiftAdvantage: true,
  },
  {
    feature: "GSTR-1 Table 4 CSV Export",
    cleartax: "Restricted to paid annual software plans",
    swiftgst: "Free 1-click export of saved invoices to CSV",
    swiftAdvantage: true,
  },
  {
    feature: "Data Privacy & Storage",
    cleartax: "Client & invoice records uploaded to cloud servers",
    swiftgst: "100% Private — stored locally in your browser",
    swiftAdvantage: true,
  },
  {
    feature: "WhatsApp Direct Sharing",
    cleartax: "Requires email verification or paid API addons",
    swiftgst: "1-Click direct WhatsApp Web / App sharing",
    swiftAdvantage: true,
  },
];

const CLEARTAX_FAQS: FaqItem[] = [
  {
    question: "Why should I choose SwiftGST over ClearTax for GST invoicing?",
    answer:
      "ClearTax operates primarily as an enterprise tax-filing corporation. Their free invoice tools often require your mobile phone number, which is followed by persistent sales calls and aggressive upsells to expensive paid packages. SwiftGST is built specifically for Indian small business owners, freelancers, and retail shops: zero login, zero phone number requests, zero watermarks, and 100% free forever.",
  },
  {
    question: "Does SwiftGST charge any subscription or add-on fee later?",
    answer:
      "No. SwiftGST is completely free. There are no trial periods, no hidden credits to purchase, and no paid tiers. All features—including A4 PDF downloads, GSTR-1 CSV exports, dynamic UPI QR generation, and signature drawing—are fully unlocked for everyone.",
  },
  {
    question: "Will my PDF invoices contain any SwiftGST watermark?",
    answer:
      "No. Invoices generated on SwiftGST are completely white-label. Your clients see only your business name, your logo, your signature, and your bank/UPI payment details.",
  },
  {
    question: "Can I export my invoices to GSTR-1 for filing my monthly return?",
    answer:
      "Yes! SwiftGST includes a built-in GSTR-1 Table 4 (B2B Taxable Supplies) CSV exporter. With one click, your saved draft invoices are formatted into the exact CSV schema required by the official GST offline tool and GST portal.",
  },
  {
    question: "Where is my business and customer data stored?",
    answer:
      "Unlike ClearTax which uploads your customer list and turnover figures to remote servers, SwiftGST processes and stores everything safely on your own device. Your financial data never leaves your device.",
  },
];

export default function ClearTaxAlternativePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST — Free ClearTax Alternative",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/cleartax-free-alternative/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "100% free alternative to ClearTax invoice generator with no phone number login, zero watermarks, and local browser privacy.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CLEARTAX_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : faq.question,
      },
    })),
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero Header */}
      <div className="rounded-3xl border border-teal-200 bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 p-8 md:p-12 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
          <Sparkles className="h-3.5 w-3.5" />
          Transparent Software Comparison
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          The 100% Free Alternative to ClearTax Invoice Generator
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-teal-100 max-w-3xl">
          Tired of entering your mobile number just to download an invoice, followed by endless telecalling sales pitches? Switch to SwiftGST: zero sign-up, zero watermarks, dynamic UPI payment QR codes, and instant PDF download.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-lg hover:bg-teal-500 active:scale-95 transition"
          >
            <Zap className="h-4 w-4 text-teal-200" />
            Open Free Generator — No Phone Needed
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-teal-200/90 font-medium">
            <PhoneOff className="h-4 w-4 text-teal-400" />
            <span>Zero Spam Calls · Zero Paywalls · 100% Private</span>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <PhoneOff className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Phone Number / No Login</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            We never ask for your mobile number or email. Create and download bills in total anonymity with zero spam calls.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Zero PDF Watermarks</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            All exported PDF invoices are 100% white-label. No third-party logos, badges, or promotional watermarks.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Private In-Browser Architecture</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Calculations run locally in your browser. Your customer data, rates, and turnover figures are never sent to remote servers.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Free GSTR-1 CSV Export</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Export all your saved sales invoices into a compliant GSTR-1 Table 4 CSV file ready for CA filing in 1 click.
          </p>
        </div>
      </section>

      {/* Transparent Feature Comparison Matrix */}
      <section className="mt-16 space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            ClearTax vs SwiftGST: Transparent Feature Comparison
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Side-by-side comparison of everyday invoicing capabilities and pricing policies.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Feature / Capability</th>
                <th className="px-5 py-3.5 text-slate-500">ClearTax Generator</th>
                <th className="px-5 py-3.5 text-teal-800 bg-teal-50/50">SwiftGST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {row.feature}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500 shrink-0" />
                      <span>{row.cleartax}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-teal-900 bg-teal-50/30">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-teal-600 shrink-0 font-bold" />
                      <span>{row.swiftgst}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-4 leading-relaxed text-xs md:text-sm text-slate-600 shadow-xs">
        <h3 className="text-base md:text-lg font-bold text-slate-900">
          Why Indian SMBs and Freelancers Are Switching to SwiftGST
        </h3>
        <p>
          ClearTax built a massive software platform for corporate tax returns and large enterprises. ClearTax is aimed mainly at larger businesses and filing workflows. For a quick 3-item invoice, small business owners, boutique designers, kirana merchants and freelancers often want something lighter: no login and no setup. That is the gap SwiftGST is built for.
        </p>
        <p>
          SwiftGST was created with a straightforward mission: provide Indian entrepreneurs with an instant, private, and 100% free tool that handles GST calculation, dynamic UPI QR payment generation, and pixel-perfect A4 printing without corporate baggage.
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="mt-16 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-700" />
          <h3 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>
        <FaqAccordion items={CLEARTAX_FAQS} />
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-16 rounded-2xl border border-teal-200 bg-teal-50/70 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base md:text-lg font-bold text-teal-950">
            Ready to generate your invoice in 30 seconds?
          </h3>
          <p className="text-xs md:text-sm text-teal-800 mt-1">
            Zero login, zero phone number required. Works instantly in any browser.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-teal-800 active:scale-95 transition shrink-0"
        >
          <Zap className="h-4 w-4" />
          Start Free Invoicing Now
        </Link>
      </section>
    <GuideExtras title="Is SwiftGST the right fit compared with ClearTax?" blocks={EXTRAS_CLEARTAX_FREE_ALTERNATIVE} />
    </main>
  );
}
