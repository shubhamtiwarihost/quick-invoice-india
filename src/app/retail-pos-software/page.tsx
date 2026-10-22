import type { Metadata } from "next";
import Link from "next/link";
import {
  Barcode,
  Receipt,
  QrCode,
  Zap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  CreditCard,
  WifiOff,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";
import { GuideExtras, type GuideBlock } from "@/components/shared/GuideExtras";

const EXTRAS_RETAIL_POS_SOFTWARE: GuideBlock[] = [
  {
    "heading": "Hardware that works",
    "bullets": [
      "Barcode scanner: most USB and Bluetooth scanners behave like a keyboard, so they work without drivers.",
      "Receipt printer: 58 mm and 80 mm thermal printers are the common sizes for counter bills.",
      "Device: a phone, tablet or PC with a modern browser is enough."
    ]
  },
  {
    "heading": "End-of-day routine",
    "bullets": [
      "Compare cash in the drawer against the day's cash sales.",
      "Check low-stock items before ordering.",
      "Export the GSTR-1 CSV from saved invoices at month end for your accountant."
    ]
  },
  {
    "heading": "Know the limits",
    "paragraphs": [
      "SwiftGST keeps data in your browser, so it suits a single counter. Clearing browser data removes it, so download your PDFs and CSVs regularly. It does not file returns or generate e-way bills; those are done on the GST portal."
    ]
  }
];


export const metadata: Metadata = {
  title: "Free Retail POS Billing Software India",
  description:
    "Fast, 100% free Retail POS billing counter software for Indian stores. Auto-detects USB/Bluetooth barcode scanners, prints 58mm/80mm thermal receipts, generates dynamic UPI payment QR codes, and works offline.",
  keywords: [
    "retail pos billing software",
    "free retail pos software india",
    "kirana pos billing software",
    "barcode scanner billing software",
    "free thermal printer billing app",
    "supermarket billing software free",
    "offline pos billing counter",
    "retail store pos software",
  ],
  alternates: {
    canonical: "https://swiftgst.in/retail-pos-software/",
  },
  openGraph: {
    title: "Free Retail POS Billing Software India — SwiftGST",
    description:
      "High-speed retail counter billing with barcode scanning, instant cash drawer reconciliation, UPI QR codes, and thermal receipt printing.",
    url: "https://swiftgst.in/retail-pos-software/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Retail POS Billing Software India — SwiftGST",
    description:
      "Fast retail counter billing with barcode auto-detect, instant cash tender change, UPI QR codes, and thermal receipt printing.",
  },
};

const POS_FEATURES = [
  {
    icon: Barcode,
    title: "Instant Barcode Scanner Auto-Focus",
    description:
      "Connect any USB or Bluetooth laser barcode scanner. SwiftGST automatically detects scanned codes and adds items to the cart in 0.2 seconds without clicking.",
  },
  {
    icon: Receipt,
    title: "58mm & 80mm Thermal Receipt Printing",
    description:
      "Print crystal-clear thermal roll slips on standard ESC/POS thermal printers. Includes store name, address, GSTIN, cashier info, and itemized tax breakdown.",
  },
  {
    icon: QrCode,
    title: "Dynamic UPI QR Code on Every Bill",
    description:
      "Show a dynamic UPI QR code with the exact total bill amount pre-loaded. Customers scan using PhonePe, Google Pay, or Paytm for instant payment.",
  },
  {
    icon: CreditCard,
    title: "Multi-Tender & Split Payment Modes",
    description:
      "Accept payments via Cash, UPI, Card, or Split. Instant cash change calculation prevents mental math errors and keeps lines moving fast.",
  },
  {
    icon: WifiOff,
    title: "100% Offline PWA Mode",
    description:
      "Keep billing even if your internet connection drops. All transactions and cart operations run completely inside your local browser cache.",
  },
  {
    icon: PackageCheck,
    title: "Live Stock Level Indicators",
    description:
      "See current inventory levels directly on the billing tiles. Get automatic warnings when a product is running low or out of stock.",
  },
];

const POS_FAQS: FaqItem[] = [
  {
    question: "Do I need to buy expensive POS hardware or computers to use SwiftGST?",
    answer:
      "No. SwiftGST works on any existing laptop, desktop PC, tablet, or smartphone. Simply open Google Chrome or Microsoft Edge and launch the POS counter. It connects seamlessly to standard USB and Bluetooth barcode scanners and thermal printers.",
  },
  {
    question: "Which thermal printers are compatible with SwiftGST POS?",
    answer:
      "SwiftGST supports all standard 2-inch (58mm) and 3-inch (80mm) thermal receipt printers, including popular Indian brands like Everycom, TVS, Epson, NGX, Pegasus, and generic USB/Bluetooth ESC/POS printers.",
  },
  {
    question: "How does the barcode scanner integrate with the counter?",
    answer:
      "Most retail barcode scanners operate as 'Keyboard Wedge' input devices. When you scan an EAN-13, UPC, or custom barcode SKU, SwiftGST automatically captures the code, matches it against your inventory catalog, and adds the product to the active cart instantly.",
  },
  {
    question: "Can I hold or park a bill when a customer forgets their wallet?",
    answer:
      "Yes! You can park the current customer's cart with 1 click, ring up the next customer in line, and resume the parked bill whenever the first customer returns.",
  },
  {
    question: "Is there any monthly or annual subscription fee?",
    answer:
      "None. SwiftGST Retail POS is 100% free with unlimited bills, unlimited products, and zero watermarks.",
  },
];

export default function RetailPosSoftwarePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST — Free Retail POS Software",
    operatingSystem: "All (Web Browser, Windows, Mac, Android, iOS)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/retail-pos-software/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free retail Point-of-Sale billing counter with barcode scanner support, 58mm/80mm thermal receipts, dynamic UPI QR, and offline capability.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: POS_FAQS.map((faq) => ({
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
          Free Retail Point of Sale System
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          Free Retail POS Billing Software for Indian Stores
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-teal-100 max-w-3xl">
          Designed for Kirana stores, clothing boutiques, footwear shops, pharmacies &amp; supermarkets. High-speed checkout, barcode scanning, 58mm/80mm thermal receipts, and dynamic UPI QR code payments.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-xs md:text-sm font-semibold text-white shadow-lg hover:bg-teal-500 active:scale-95 transition"
          >
            <Zap className="h-4 w-4 text-teal-200" />
            Launch POS Counter Now — Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-teal-200/90 font-medium">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>Works Offline · Zero Subscription · No Watermark</span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="mt-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Everything Your Checkout Counter Needs
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-500">
            Built from the ground up for speed, simplicity, and non-stop checkout lines during rush hours.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {POS_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-300 hover:shadow-md transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step by Step Workflow */}
      <section className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-12">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            How to Ring Up a Sale in 3 Seconds
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500">
            Engineered for minimal clicks so your cashier never keeps customers waiting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm mb-3">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Scan or Tap Item</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Scan barcode or tap the product category tile. Quantity and tax calculations update instantly in the active cart.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm mb-3">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Select Payment Tender</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Choose Cash, UPI QR, or Card. Enter cash received to see exact change due in bold green font.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm mb-3">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Print Thermal Slip</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Press Enter or tap Print. A 58mm or 80mm thermal receipt prints instantly, ready for the customer.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to upgrade your store&apos;s billing counter?
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Free forever. No installation, no credit card, and no hidden license renewal fees.
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
        </div>
      </section>

      {/* FAQs */}
      <section className="mt-16 space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500">
            Common questions about setting up SwiftGST retail point of sale.
          </p>
        </div>
        <FaqAccordion items={POS_FAQS} />
      </section>
    <GuideExtras title="Setting up a retail counter" blocks={EXTRAS_RETAIL_POS_SOFTWARE} />
    </main>
  );
}
