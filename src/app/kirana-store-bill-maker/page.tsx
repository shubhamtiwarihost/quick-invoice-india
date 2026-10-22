import type { Metadata } from "next";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  FileCheck2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Kirana Store Bill Maker & GST Invoice Generator",
  description:
    "Free retail cash memo and GST bill maker for Indian Kirana stores, FMCG retailers, and grocery shops. Pre-loaded 0% & 5% grocery essentials, instant print & WhatsApp share.",
  keywords: [
    "kirana store bill maker",
    "retail grocery bill generator",
    "kirana GST invoice format",
    "FMCG retail cash memo",
    "grocery store bill maker India",
    "0% 5% GST grocery bill",
    "supermarket billing software online free",
  ],
  alternates: {
    canonical: "https://swiftgst.in/kirana-store-bill-maker/",
  },
  openGraph: {
    title: "Kirana Store Bill Maker & Retail GST Invoice Generator — SwiftGST",
    description:
      "Instant retail bill maker for Indian grocery shops and Kirana stores. Pre-configured FMCG items, 0% and 5% GST slabs, QR code UPI, and instant A4/thermal printing.",
    url: "https://swiftgst.in/kirana-store-bill-maker/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirana Store Bill Maker & Grocery Invoice Generator — SwiftGST",
    description:
      "Create fast retail bills for grocery shops and Kirana stores with 0% & 5% GST slabs, QR code, and WhatsApp sharing.",
  },
};

const KIRANA_FAQS: FaqItem[] = [
  {
    question: "Does a small Kirana grocery store need mandatory GST registration?",
    answer:
      "In India, businesses exclusively engaged in the supply of goods are exempt from GST registration if their aggregate annual turnover does not exceed ₹40 Lakhs (₹20 Lakhs in Special Category States), provided they only make intra-state sales. If your sales are below this limit, you do not need GST and can issue simple retail cash memos or Bills of Supply.",
  },
  {
    question: "What items in a Kirana store are taxed at 0% (Nil GST)?",
    answer:
      "Unbranded or non-pre-packaged staple food items such as loose wheat/atta, loose rice, loose pulses/dals, fresh milk, curd/buttermilk, eggs, salt, fresh fruits, vegetables, and unprocessed grains attract 0% GST (Exempt). However, pre-packaged and labelled pulses, flour, and curd in sealed packets carry 5% GST.",
  },
  {
    question: "How does the 1% GST Composition Scheme work for Kirana stores?",
    answer:
      "Eligible grocery retailers with annual turnover up to ₹1.5 Crore can enroll in the Composition Scheme under Section 10 of the CGST Act. Under this scheme, the store pays a flat tax of only 1% of total turnover (0.5% CGST + 0.5% SGST) and files a simple quarterly statement (CMP-08). Composition dealers cannot charge GST from customers and must issue a 'Bill of Supply' instead of a Tax Invoice.",
  },
  {
    question: "When should a Kirana store issue a 'Tax Invoice' vs a 'Bill of Supply'?",
    answer:
      "Issue a Tax Invoice if you are a regular registered taxpayer selling taxable items (like edible oils, branded snacks, soaps @ 5% or 18%) to B2B or retail buyers where GST is separately charged. Issue a Bill of Supply if you are a Composition dealer OR if you are selling 100% exempt goods (like unbranded rice, salt, fresh milk). SwiftGST allows 1-click toggling between Tax Invoice and Bill of Supply (Non-GST mode).",
  },
  {
    question: "Can Kirana stores issue retail bills without the buyer's GSTIN or address?",
    answer:
      "Yes. For Business-to-Consumer (B2C) retail sales to walk-in customers, the buyer's GSTIN is not required. You can simply leave the customer name as 'Walk-in Retail Customer' or 'Cash Sale'. Under GST rules, recipient address is only mandatory for B2C invoices if the invoice value exceeds ₹50,000.",
  },
  {
    question: "Can I collect instant UPI payments by printing a QR code on the grocery bill?",
    answer:
      "Yes! By entering your store UPI VPA (e.g. yourstore@oksbi or 9876543210@paytm), SwiftGST generates an embedded payment QR code directly onto the printed bill or PDF. Customers simply point their PhonePe, Google Pay, or Paytm camera at the paper bill and confirm the exact balance.",
  },
];

export default function KiranaStoreBillMakerPage() {
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Kirana Store Bill Maker",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/kirana-store-bill-maker/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free retail grocery bill maker and GST invoice generator for Indian Kirana stores, FMCG retailers, and supermarkets.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: KIRANA_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : faq.question,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <InvoiceWorkspace
        initialPreset="kirana"
        pageTitle="Kirana Store Bill Maker & Retail GST Generator"
        badgeText="Pre-loaded: Daily FMCG Lines · 0% & 5% Grocery Slabs · Auto Round-Off"
        childrenBelowWorkspace={
          <article className="mx-auto max-w-5xl px-4 py-12 space-y-16 text-slate-800">
            {/* Guide Introduction Banner */}
            <section className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-950 via-teal-950 to-slate-900 p-8 md:p-12 text-white shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200 border border-emerald-400/20">
                <Store className="h-3.5 w-3.5" />
                Retail & Grocery Billing Guide
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
                How to Bill Under GST as a Kirana Store & FMCG Retailer
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-emerald-100 max-w-3xl">
                Indian grocery shops handle hundreds of fast-moving products every day across 0%, 5% and 18% GST slabs. Learn how to maintain clear retail accounts, handle walk-in cash memos, and take advantage of the 1% Composition Scheme.
              </p>
            </section>

            {/* Step-by-Step Compliance Guidelines */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step-by-Step Kirana Billing & GST Rules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Crucial compliance rules for daily retail counter billing
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 text-xs">
                      1
                    </span>
                    <h4>Classify 0% Exempt vs 5% Taxable Groceries</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Unbranded staple grains, loose dals, and fresh milk are exempt (0% GST). Pre-packaged, pre-labelled branded food staples (atta, packaged rice, edible oils, and spices) are taxed at 5% GST.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 text-xs">
                      2
                    </span>
                    <h4>Understand the 1% Composition Option</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    If your annual turnover is under ₹1.5 Crore, the Composition Scheme allows you to pay a flat 1% tax on total sales with zero invoice-level tax tracking and simplified quarterly CMP-08 filing.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 text-xs">
                      3
                    </span>
                    <h4>Simplified Walk-in B2C Cash Memos</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    For daily counter sales under ₹50,000, you do not need the customer’s name, address, or GSTIN. Mark the client as &ldquo;Walk-in Customer&rdquo; and provide item names, quantities, and round-off total.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 text-xs">
                      4
                    </span>
                    <h4>Print Dynamic UPI QR Code on Receipts</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Eliminate cash shortages and speed up retail checkouts by placing your UPI QR code directly on every printed slip. Customers scan with any UPI app to pay the exact rupee amount.
                  </p>
                </div>
              </div>
            </section>

            {/* Grocery FMCG Slabs Reference Table */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Common GST Slabs for Daily Grocery & Kirana Products
                </h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">HSN Code</th>
                      <th className="px-4 py-3">Product Description</th>
                      <th className="px-4 py-3">GST Slab</th>
                      <th className="px-4 py-3">Key Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">1101 / 1006</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Wheat Flour (Atta) & Rice</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">0% (Nil) / 5%</td>
                      <td className="px-4 py-3 text-slate-500">0% if loose/unbranded; 5% if pre-packaged & labelled</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">1512 / 1515</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Edible Sunflower, Mustard & Groundnut Oil</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5%</td>
                      <td className="px-4 py-3 text-slate-500">All edible cooking oils attract 5% GST</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">2501</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Iodized Table Salt</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">0% (Nil)</td>
                      <td className="px-4 py-3 text-slate-500">Completely exempt from GST</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">0405</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Butter & Ghee</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5%</td>
                      <td className="px-4 py-3 text-slate-500">Butter, ghee and cheese (was 12% before 22 Sept 2025)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">3401 / 3402</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Soaps & Washing Detergent Powders</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5% / 18%</td>
                      <td className="px-4 py-3 text-slate-500">Toilet soap (3401) is 5%; washing detergent powders (3402) are 18%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Interactive FAQ Accordion */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-700" />
                <h3 className="text-xl font-bold text-slate-900">
                  Frequently Asked Questions (Kirana Store & Retail GST)
                </h3>
              </div>
              <FaqAccordion items={KIRANA_FAQS} />
            </section>

            {/* Related Tools Callout */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Need to check HSN codes for FMCG or calculate reverse GST?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Use our free HSN Code Directory and Inclusive/Exclusive GST Calculator.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/hsn-finder"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-emerald-700" />
                  HSN Finder
                </Link>
                <Link
                  href="/gst-invoice-templates"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-800 shadow-xs"
                >
                  Download Templates
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          </article>
        }
      />
    </>
  );
}
