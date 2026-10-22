import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  X,
  Zap,
  ArrowRight,
  Sparkles,
  Receipt,
  Store,
  Users,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Free Vyapar Alternative — No Watermark, Zero Fees",
  description:
    "Looking for a 100% free alternative to Vyapar billing software? SwiftGST requires no paid plan or yearly renewal, no software download, and leaves zero watermarks on bills. Includes retail POS, barcode inventory, customer Khata & instant PDF/thermal receipts.",
  keywords: [
    "vyapar alternative",
    "free vyapar alternative",
    "vyapar app alternative free",
    "vyapar billing software alternative for pc",
    "best alternative to vyapar",
    "free gst billing software without watermark",
    "vyapar desktop alternative free",
    "free retail pos software india",
  ],
  alternates: {
    canonical: "https://swiftgst.in/vyapar-free-alternative/",
  },
  openGraph: {
    title: "Best Free Vyapar Alternative for GST Invoicing & POS — SwiftGST",
    description:
      "Save ₹3,000 to ₹7,000 per year. Generate GST invoices and retail bills with zero watermark, instant thermal receipt printing, and browser speed.",
    url: "https://swiftgst.in/vyapar-free-alternative/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Vyapar Alternative for GST Billing & Retail POS — SwiftGST",
    description:
      "100% free forever. No annual subscriptions, no watermark, and runs directly in your browser without 100MB software downloads.",
  },
};

const COMPARISON_ROWS = [
  {
    feature: "Annual License Cost / Subscription",
    vyapar: "Paid plans for full features (check Vyapar's site for current pricing)",
    swiftgst: "100% Free forever (₹0) — zero hidden charges",
    swiftAdvantage: true,
  },
  {
    feature: "Bill / Invoice Watermarks",
    vyapar: "Branding may appear on free plans (check current terms)",
    swiftgst: "100% White-label — zero watermarks or company logos",
    swiftAdvantage: true,
  },
  {
    feature: "Installation & Storage Footprint",
    vyapar: "Desktop and mobile app install",
    swiftgst: "0 MB install — runs in any browser, PWA offline ready",
    swiftAdvantage: true,
  },
  {
    feature: "Retail POS Counter & Barcode Scanning",
    vyapar: "Paid addon module with complex configuration",
    swiftgst: "Built-in high speed POS with USB/Bluetooth auto-focus",
    swiftAdvantage: true,
  },
  {
    feature: "58mm & 80mm Thermal Receipt Printing",
    vyapar: "Requires specialized printer drivers and desktop setup",
    swiftgst: "Instant browser printing to any standard thermal roll",
    swiftAdvantage: true,
  },
  {
    feature: "Dynamic UPI QR Code on Invoices",
    vyapar: "Restricted on basic tiers; merchant setup required",
    swiftgst: "Auto-embedded UPI payment QR on every invoice & slip",
    swiftAdvantage: true,
  },
  {
    feature: "Customer Khata (Udhaar) & WhatsApp Reminders",
    vyapar: "Limited SMS credits or manual WhatsApp sharing",
    swiftgst: "Free 1-click WhatsApp payment reminders & ledger tracking",
    swiftAdvantage: true,
  },
  {
    feature: "GSTR-1 Ready Sales Reports",
    vyapar: "Export often locked behind higher Gold plans",
    swiftgst: "1-Click free CSV export matching GST portal Table 4",
    swiftAdvantage: true,
  },
  {
    feature: "Financial Data Privacy",
    vyapar: "Data synced to cloud servers with corporate access",
    swiftgst: "100% Private — stored securely on your own device",
    swiftAdvantage: true,
  },
];

const VYAPAR_FAQS: FaqItem[] = [
  {
    question: "Why are Indian shopkeepers switching from Vyapar to SwiftGST?",
    answer:
      "Vyapar is a full-featured desktop and mobile billing suite, and many of its advanced features are on paid plans (see Vyapar's site for current pricing). SwiftGST was built to provide a permanent, 100% free solution with high-speed POS billing, thermal printing, barcode scanning, and GSTR-1 compliance without any subscription fees.",
  },
  {
    question: "Do I need to download or install any heavy software for PC?",
    answer:
      "No. SwiftGST is a modern Progressive Web App (PWA). It runs instantly inside Google Chrome, Microsoft Edge, Safari, or mobile browsers without consuming 100MBs of computer disk space. You can also click 'Install App' for an offline desktop icon experience.",
  },
  {
    question: "Can I use SwiftGST for thermal receipt printing like Vyapar?",
    answer:
      "Yes! SwiftGST provides full support for both 58mm (2-inch) and 80mm (3-inch) thermal POS receipt printers. You can print clean, compact receipts with your shop logo, GSTIN, cashier name, itemized GST breakdown, and dynamic UPI QR code with zero watermark.",
  },
  {
    question: "How do I migrate my products or inventory into SwiftGST?",
    answer:
      "SwiftGST supports simple, fast catalog management. You can add items directly on the counter, scan existing barcodes, or import inventory products so you can begin billing customers within minutes.",
  },
  {
    question: "Is my business customer data secure on SwiftGST?",
    answer:
      "Yes. Your customer ledger, product prices, invoices, and sales transactions are saved privately and securely on your device. Unlike proprietary software providers that hold your business data on remote servers, your records remain completely in your control.",
  },
];

export default function VyaparAlternativePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST — Free Vyapar Alternative",
    operatingSystem: "All (Web Browser, Windows, Mac, Android, iOS)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/vyapar-free-alternative/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "100% free alternative to Vyapar billing software with retail POS, barcode scanning, zero watermark, and no yearly renewal fees.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: VYAPAR_FAQS.map((faq) => ({
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
          <Sparkles className="h-3.5 w-3.5 text-teal-300" />
          Vyapar Alternative Comparison
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          The 100% Free Alternative to Vyapar Billing Software
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-teal-100 max-w-3xl">
          Want to print retail bills without a subscription or watermark? Switch to SwiftGST: zero annual fees, zero software download, retail POS with barcode scanning, thermal printing &amp; customer Khata.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-lg hover:bg-teal-500 active:scale-95 transition"
          >
            <Zap className="h-4 w-4 text-teal-200" />
            Launch Free POS Counter — No Fees
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-teal-400/40 bg-teal-900/40 px-5 py-3 text-xs md:text-sm font-semibold text-teal-100 hover:bg-teal-900/60 transition"
          >
            Create A4 Tax Invoice
          </Link>
        </div>
      </div>

      {/* Highlights Grid */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Zero Watermark / Clean Bills</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Never let third-party promotional watermarks taint your customer invoices. All bills are 100% white-label.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <Store className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Retail POS &amp; Barcode Scanner</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            High-speed billing counter built for kirana, garments, hardware &amp; supermarkets with USB/Bluetooth scanner auto-focus.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <Receipt className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">58mm / 80mm Thermal Rolls</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Directly print thermal cash slips with shop details, itemized tax breakdown, and UPI intent payment QR code.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-3">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Customer Khata &amp; WhatsApp</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Track customer Udhaar balance, record payments, and send 1-click WhatsApp payment reminders free.
          </p>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="mt-16 space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Vyapar vs SwiftGST: Detailed Feature Comparison
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500">
            See why thousands of Indian retail shops and MSMEs are moving away from paid desktop software.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="p-4 md:w-1/3">Key Feature</th>
                  <th className="p-4 md:w-1/3 text-slate-500">Vyapar Billing Software</th>
                  <th className="p-4 md:w-1/3 text-teal-700 bg-teal-50/50">
                    SwiftGST (Free Alternative)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-medium text-slate-900 flex items-start gap-2">
                      <span className="font-semibold text-slate-800">{row.feature}</span>
                    </td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-start gap-1.5">
                        <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{row.vyapar}</span>
                      </div>
                    </td>
                    <td className="p-4 bg-teal-50/30 font-medium text-teal-950">
                      <div className="flex items-start gap-1.5">
                        <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{row.swiftgst}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-16 rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Looking for free billing software with no yearly renewal?
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Start billing in seconds. No app downloads, no subscriptions, and complete offline capability.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Link
            href="/pos"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-teal-500 transition"
          >
            Launch POS Counter
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-xs md:text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            Make A4 Invoice
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16 space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500">
            Everything you need to know about migrating from Vyapar to SwiftGST.
          </p>
        </div>
        <FaqAccordion items={VYAPAR_FAQS} />
      </section>
    </main>
  );
}
