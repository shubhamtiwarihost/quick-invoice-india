import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  X,
  Zap,
  ArrowRight,
  Smartphone,
  Sparkles,
  Lock,
  FileSpreadsheet,
  HardDriveDownload,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Free myBillBook Alternative for GST Invoicing",
  description:
    "Looking for a free alternative to myBillBook? SwiftGST requires no 100MB app download, no mobile OTP login, and zero monthly subscription fees. Generate GST invoices in any browser with zero watermarks.",
  keywords: [
    "mybillbook alternative",
    "free alternative to mybillbook",
    "mybillbook desktop free alternative",
    "billing software without app download",
    "gst invoice without mybillbook watermark",
    "free vyapar mybillbook alternative",
    "free mobile billing software India",
  ],
  alternates: {
    canonical: "https://swiftgst.in/mybillbook-free-alternative/",
  },
  openGraph: {
    title: "Best Free myBillBook Alternative for GST Invoicing — SwiftGST",
    description:
      "Generate compliant GST bills directly in your web browser without installing 100MB apps or paying monthly subscription fees.",
    url: "https://swiftgst.in/mybillbook-free-alternative/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free myBillBook Alternative for GST Billing — SwiftGST",
    description:
      "No 100MB app download, zero subscription fees, and no watermarks on PDF invoices.",
  },
};

const COMPARISON_ROWS = [
  {
    feature: "Storage & Installation Required",
    mybillbook: "100MB+ heavy app install required on phone/PC",
    swiftgst: "0 MB — runs instantly in any browser",
    swiftAdvantage: true,
  },
  {
    feature: "Pricing & Paid Tier Paywalls",
    mybillbook: "Heavily limited free tier; Silver/Gold ₹2,500-₹5,000/yr",
    swiftgst: "100% Free forever with zero paywalls",
    swiftAdvantage: true,
  },
  {
    feature: "PDF Watermarks on Free Invoices",
    mybillbook: "Prominent myBillBook watermark on free PDF exports",
    swiftgst: "Zero watermarks — 100% white-label bills",
    swiftAdvantage: true,
  },
  {
    feature: "Mandatory Mobile Number Login",
    mybillbook: "Forced OTP signup on every new device",
    swiftgst: "No phone number, no OTP, no signup needed",
    swiftAdvantage: true,
  },
  {
    feature: "Multi-Device Desktop Support",
    mybillbook: "Desktop app access locked behind paid plans",
    swiftgst: "Works seamlessly on Mac, Windows, iPhone & Android",
    swiftAdvantage: true,
  },
  {
    feature: "WhatsApp Invoice Sharing",
    mybillbook: "Restricted quotas; pushes paid WhatsApp credits",
    swiftgst: "Free 1-click direct WhatsApp Web / App share",
    swiftAdvantage: true,
  },
  {
    feature: "GSTR-1 Table 4 CSV Sales Export",
    mybillbook: "Gated behind paid business tiers",
    swiftgst: "1-Click CSV export for easy CA filing",
    swiftAdvantage: true,
  },
  {
    feature: "Complete Data Privacy",
    mybillbook: "Business ledger data synchronized to company servers",
    swiftgst: "100% Private — all data saved safely on your device",
    swiftAdvantage: true,
  },
];

const MYBILLBOOK_FAQS: FaqItem[] = [
  {
    question: "Why should I use SwiftGST instead of downloading myBillBook?",
    answer:
      "myBillBook requires downloading an 80MB–150MB mobile or desktop app, completing a mandatory phone OTP registration, and accepting strict free-tier quotas (which place watermarks on your customer invoices). SwiftGST works instantly in any web browser without consuming phone storage, requires no signup, and exports 100% watermark-free GST invoices for free.",
  },
  {
    question: "Do I have to pay any subscription fee to use SwiftGST on my desktop computer?",
    answer:
      "No. While myBillBook charges ₹2,500 to ₹5,000+ per year for desktop computer access, SwiftGST is completely free on all devices—including laptops, desktops, tablets, and smartphones.",
  },
  {
    question: "Can I share invoices directly to my customer's WhatsApp for free?",
    answer:
      "Yes. SwiftGST features a 1-click WhatsApp direct share modal that pre-formats a professional message with your buyer's name, invoice number, and your UPI payment ID without requiring paid API credits or third-party gateways.",
  },
  {
    question: "Can I print on regular A4 and thermal receipt printers?",
    answer:
      "Yes! SwiftGST provides full vector A4 PDF export and native browser print dialogs configured for both standard A4 office printers and POS receipt printers.",
  },
  {
    question: "Can I convert estimates or quotations into tax invoices?",
    answer:
      "Yes. SwiftGST includes a free Quotation Maker that allows you to create professional client estimates with custom validity dates and convert them into official GST Tax Invoices in 1 click.",
  },
];

export default function MyBillBookAlternativePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST — Free myBillBook Alternative",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/mybillbook-free-alternative/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "100% free alternative to myBillBook for GST invoicing without 100MB app installation, zero watermarks, and no monthly fees.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MYBILLBOOK_FAQS.map((faq) => ({
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
          Zero Storage · Zero Subscription
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          The 100% Free Alternative to myBillBook
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-teal-100 max-w-3xl">
          Generate clean, professional GST tax invoices directly in your web browser without downloading heavy 100MB apps, enduring mobile OTP barriers, or paying annual desktop upgrade fees.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-lg hover:bg-teal-500 active:scale-95 transition"
          >
            <Zap className="h-4 w-4 text-teal-200" />
            Generate Invoices in Browser — No App Needed
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-teal-200/90 font-medium">
            <HardDriveDownload className="h-4 w-4 text-teal-400" />
            <span>0 MB Install · Zero Watermarks · Free Forever</span>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <Smartphone className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No 100MB App Download</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Don&apos;t clog your smartphone storage with heavy APKs. SwiftGST opens instantly in Chrome, Safari, or Edge in &lt;1 second.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Zero Watermark Pollution</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            myBillBook adds watermarks on free tiers. SwiftGST gives you 100% white-label, corporate-grade PDF invoices for free.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Phone Number Login</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            No OTP verification or marketing spam. Start creating your GST invoice immediately upon loading the page.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Free Desktop Compatibility</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Never pay ₹2,500/year just to use billing on your office PC. SwiftGST works on all desktop and mobile screens natively.
          </p>
        </div>
      </section>

      {/* Transparent Feature Comparison Matrix */}
      <section className="mt-16 space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            myBillBook vs SwiftGST: Transparent Feature Comparison
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Compare mobile app overhead, subscription costs, and everyday invoicing convenience.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Feature / Requirement</th>
                <th className="px-5 py-3.5 text-slate-500">myBillBook App</th>
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
                      <span>{row.mybillbook}</span>
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
          Escape Heavy App Installs and Annual Subscription Paywalls
        </h3>
        <p>
          Billing apps like myBillBook and Vyapar initially advertise themselves as simple billing tools. However, they soon require downloading 100MB apps, syncing your entire contact book, and upgrading to paid annual tiers just to remove watermarks or print invoices from a desktop browser.
        </p>
        <p>
          SwiftGST takes the opposite approach: zero bloat, zero app stores, and zero subscriptions. You open the site in your browser, enter your line items, and download an authorized, compliant GST invoice with embedded UPI QR codes in seconds.
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
        <FaqAccordion items={MYBILLBOOK_FAQS} />
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-16 rounded-2xl border border-teal-200 bg-teal-50/70 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base md:text-lg font-bold text-teal-950">
            Ready to create your GST invoice without downloading any app?
          </h3>
          <p className="text-xs md:text-sm text-teal-800 mt-1">
            Works smoothly on mobile and desktop browsers with zero installation.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-teal-800 active:scale-95 transition shrink-0"
        >
          <Zap className="h-4 w-4" />
          Start Billing in Browser Now
        </Link>
      </section>
    </main>
  );
}
