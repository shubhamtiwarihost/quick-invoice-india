import type { Metadata } from "next";
import Link from "next/link";
import {
  Scissors,
  ShieldCheck,
  FileCheck2,
  Calculator,
  ArrowRight,
  Shirt,
} from "lucide-react";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Boutique & Tailoring GST Invoice Generator",
  description:
    "Free GST invoice generator for fashion boutiques, tailoring studios, and designer ateliers in India. Pre-loaded stitching SAC 998822, 5% and 18% apparel GST slabs (₹2,500 per piece rule), and instant PDF.",
  keywords: [
    "boutique invoice generator",
    "tailoring bill format GST",
    "boutique GST bill maker",
    "stitching charges SAC code 9988",
    "apparel GST invoice format",
    "designer lehenga bill format",
    "custom clothing invoice India",
  ],
  alternates: {
    canonical: "https://swiftgst.in/boutique-invoice-generator/",
  },
  openGraph: {
    title: "Boutique & Tailoring GST Invoice Generator — SwiftGST",
    description:
      "Generate compliant GST bills for fashion boutiques, stitching, alterations, and designer apparel in India. Pre-seeded with the current 5% (up to ₹2,500) and 18% (above ₹2,500) apparel slabs.",
    url: "https://swiftgst.in/boutique-invoice-generator/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boutique & Tailoring GST Bill Generator — SwiftGST",
    description:
      "Create professional GST invoices for boutiques, stitching, and custom apparel with SAC 998822 & HSN 5007.",
  },
};

const BOUTIQUE_FAQS: FaqItem[] = [
  {
    question: "What is the official GST rate for stitching and tailoring services?",
    answer:
      "Under GST SAC Code 998822 ('Job work services on textile and apparel'), custom stitching and tailoring services attract a concessional GST rate of 5% when the customer provides their own fabric. If you supply the complete readymade stitched apparel including fabric, the GST rate is 5% for garments priced up to ₹2,500 per piece and 18% for garments priced above ₹2,500. The threshold was ₹1,000 (with 12% above it) until 22 September 2025.",
  },
  {
    question: "How should a boutique bill if the customer brings their own cloth?",
    answer:
      "When the customer brings their own cloth/fabric, you are providing a pure job work tailoring service. Bill this under SAC 998822 with 5% GST (2.5% CGST + 2.5% SGST for intra-state). Mention the service description clearly as 'Custom tailoring / stitching charges of bridal lehenga' without adding cloth cost.",
  },
  {
    question: "Can boutique owners enroll under the GST Composition Scheme?",
    answer:
      "Yes! Boutique owners who are purely traders or manufacturers of apparel with annual turnover up to ₹1.5 Crore can opt for the Composition Scheme and pay a flat 1% GST (0.5% CGST + 0.5% SGST) on total turnover without claiming ITC. If you provide tailoring/stitching services, you can opt for the Composition Scheme for Service Providers under Section 10(2A) at a flat 6% rate (turnover up to ₹50 Lakhs).",
  },
  {
    question: "Can boutique studios claim Input Tax Credit (ITC) on sewing machines and studio rent?",
    answer:
      "Yes. Regular GST-registered boutique owners can claim full Input Tax Credit on capital goods such as industrial sewing machines, interlock machines, steam irons, cutting tables, studio commercial rent, and showroom electricity (if billed in business name with GSTIN).",
  },
  {
    question: "Is GST registration compulsory for an Instagram home boutique or custom designer?",
    answer:
      "If your total annual sales are below ₹40 Lakhs (for supply of goods) or ₹20 Lakhs (for tailoring services), GST registration is not mandatory, provided all sales are intra-state. However, if you ship designer clothes across state lines (inter-state) or sell on Amazon/Flipkart/Myntra, GST registration becomes mandatory regardless of turnover.",
  },
  {
    question: "What essential details should be included on a boutique invoice?",
    answer:
      "A boutique tax invoice must include: GSTIN & PAN of the boutique, serialized invoice number, date of trial/delivery, customer name and phone, itemized description (stitching vs fabric vs embellishments), correct HSN/SAC code, applicable GST slab (5% or 18%), payment breakdown (advance paid vs balance due), and clear alteration/return terms.",
  },
];

export default function BoutiqueInvoiceGeneratorPage() {
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Boutique & Tailoring Invoice Generator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/boutique-invoice-generator/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free GST invoice generator for fashion boutiques, tailoring studios, and designer ateliers. Pre-loaded stitching SAC 998822 and 5%/18% apparel GST slabs.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BOUTIQUE_FAQS.map((faq) => ({
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
        initialPreset="boutique"
        pageTitle="Boutique & Tailoring Studio GST Invoice Generator"
        badgeText="Pre-loaded: Stitching SAC 998822 · 5% / 18% Apparel Slabs"
        childrenBelowWorkspace={
          <article className="mx-auto max-w-5xl px-4 py-12 space-y-16 text-slate-800">
            {/* Guide Introduction Banner */}
            <section className="rounded-3xl border border-pink-200 bg-linear-to-br from-pink-950 via-purple-950 to-slate-900 p-8 md:p-12 text-white shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-200 border border-pink-400/20">
                <Scissors className="h-3.5 w-3.5" />
                Boutique & Couture Tax Guide
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
                How to Bill Under GST as a Fashion Boutique & Tailoring Studio
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-pink-100 max-w-3xl">
                Navigating GST in the Indian fashion industry requires distinguishing between pure tailoring services (SAC 998822 @ 5%), raw fabrics (HSN 5007/5208 @ 5%), and finished designer garments (5% up to ₹2,500 per piece, 18% above). Here is your complete compliance guide.
              </p>
            </section>

            {/* Step-by-Step Compliance Guidelines */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-700 font-bold border border-pink-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step-by-Step Boutique GST Invoicing Guidelines
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ensure proper classification between job work tailoring and fabric sales
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-pink-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-900 text-xs">
                      1
                    </span>
                    <h4>Separate Stitching from Fabric Material</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    When a client brings their own fabric for lehengas, blouses, or suits, bill the stitching as Job Work under SAC 998822 at 5% GST. If supplying the cloth as well, list fabric lines under HSN 5007/5208 separately on the invoice.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-pink-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-900 text-xs">
                      2
                    </span>
                    <h4>Understand the ₹2,500 Garment Slab Rule</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    For readymade or complete stitched garments sold off-the-rack: garments with sale value up to ₹2,500 per piece attract 5% GST. Garments priced above ₹2,500 per piece attract 18% GST. The old ₹1,000 and 12% rule ended on 22 September 2025.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-pink-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-900 text-xs">
                      3
                    </span>
                    <h4>Clearly Record Advance & Balance Payments</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Custom designer studios typically take a 50% booking advance. Mention the advance receipt voucher number or specify &ldquo;50% Advance Received&rdquo; and &ldquo;Balance Due on Trial Fitting&rdquo; in the invoice notes.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-pink-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-900 text-xs">
                      4
                    </span>
                    <h4>Protect Against Alteration & Storage Disputes</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Include your customized terms: number of free alteration trials (e.g. within 14 days), no return on custom cut fabrics, and garment storage liability beyond 30 days after intimation.
                  </p>
                </div>
              </div>
            </section>

            {/* HSN & SAC Slabs Reference Table */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Shirt className="h-5 w-5 text-pink-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Essential HSN & SAC Codes for Boutiques & Tailoring Studios
                </h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Classification</th>
                      <th className="px-4 py-3">GST Rate</th>
                      <th className="px-4 py-3">Description & Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-pink-700">998822</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Apparel Job Work / Tailoring</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5%</td>
                      <td className="px-4 py-3 text-slate-500">Stitching charges for lehengas, suits, blouses on customer fabric</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-pink-700">998821</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Alteration & Hemming Services</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5%</td>
                      <td className="px-4 py-3 text-slate-500">Fitting adjustments, length alteration, hook/zipper replacements</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-pink-700">5007</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Woven Fabrics of Silk</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5%</td>
                      <td className="px-4 py-3 text-slate-500">Pure Banarasi silk, raw silk, Tussar silk fabric material</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-pink-700">6214</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Shawls, Scarves & Dupattas</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">5% / 18%</td>
                      <td className="px-4 py-3 text-slate-500">Embroidered dupattas and stoles: 5% up to ₹2,500 per piece, 18% above</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Interactive FAQ Accordion */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-pink-700" />
                <h3 className="text-xl font-bold text-slate-900">
                  Frequently Asked Questions (Boutique GST Invoicing)
                </h3>
              </div>
              <FaqAccordion items={BOUTIQUE_FAQS} />
            </section>

            {/* Related Tools Callout */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Looking for blank printable boutique bills or composition scheme comparisons?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Explore our GST Invoice Templates Hub and Composition Scheme Calculator.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/composition-calculator"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
                >
                  <Calculator className="h-3.5 w-3.5 text-pink-700" />
                  Composition Calc
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
