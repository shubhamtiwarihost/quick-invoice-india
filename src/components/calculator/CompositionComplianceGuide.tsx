import Link from "next/link";
import {
  BookOpen,
  Scale,
  AlertTriangle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const COMPOSITION_FAQS: FaqItem[] = [
  {
    question: "What is the turnover threshold to opt for the GST Composition Scheme?",
    answer:
      "For manufacturers, traders, and restaurants, the aggregate annual turnover threshold is ₹1.5 Crore in most Indian states (₹75 Lakhs in 8 Special Category Northeastern and Hill States: Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, and Uttarakhand). For standalone service providers eligible under Section 10(2A), the threshold limit is ₹50 Lakhs.",
  },
  {
    question: "Can a composition dealer issue a Tax Invoice or charge GST to customers?",
    answer:
      "No. Under Section 10(4) of the CGST Act, a composition dealer cannot collect GST from their customers nor can they issue a standard Tax Invoice. Instead, they must issue a 'Bill of Supply' under Rule 49, prominently bearing the words: 'Composition taxable person, not eligible to collect tax on supplies'.",
  },
  {
    question: "Can a composition dealer make inter-state sales or export goods?",
    answer:
      "No. Under Section 10(2)(c) of the CGST Act, a composition taxpayer is strictly prohibited from making inter-state outward supplies of goods or services, including zero-rated export consignments. However, they are permitted to make inter-state inward purchases (procure raw materials from other states).",
  },
  {
    question: "Can a composition dealer sell goods through e-commerce platforms like Amazon or Flipkart?",
    answer:
      "Recent amendments allow unregistered and composition dealers to supply goods intra-state through e-commerce operators subject to specific enrollment conditions under Notification No. 34/2023 – Central Tax, provided they do not make inter-state sales and their aggregate turnover remains within the composition cap.",
  },
  {
    question: "What returns must a composition taxpayer file and what are the due dates?",
    answer:
      "Composition taxpayers enjoy drastically simplified filings: (1) Form CMP-08: Quarterly challan-cum-statement for paying flat tax, due by the 18th of the month following the quarter. (2) Form GSTR-4: Comprehensive annual return due by 30th April following the close of the financial year. Unlike regular taxpayers, they are exempt from monthly GSTR-1 and GSTR-3B filings.",
  },
  {
    question: "Can I switch between the Composition Scheme and Regular GST Scheme?",
    answer:
      "Yes. A taxpayer can opt into the Composition Scheme at the beginning of any financial year by filing Form GST CMP-02 on the GST portal before 31st March. Conversely, they can opt out voluntarily at any time during the year by filing Form GST CMP-04, or they will be automatically disqualified the moment their turnover crosses the statutory limit.",
  },
];

export function CompositionComplianceGuide() {
  return (
    <section className="mt-14 border-t border-slate-200 bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-700" />
            <span>Section 10 Statutory Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            GST Composition Scheme Rules, Eligibility &amp; Compliance Guide
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Understand statutory turnover caps, Bill of Supply requirements, CMP-08 quarterly schedules,
            and critical trade-offs before opting in.
          </p>
        </div>

        {/* 1. Turnover Limits by Category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Statutory Turnover Limits &amp; Prescribed Tax Rates
              </h3>
              <p className="text-xs text-slate-500">
                Fixed flat rates under Section 10 of CGST Act and Notification 02/2019
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Traders &amp; Manufacturers</span>
              <div className="font-mono text-xl font-bold text-teal-700">1% Flat Tax</div>
              <p className="text-slate-600 leading-relaxed">
                0.5% CGST + 0.5% SGST. Annual turnover cap: <strong>₹1.5 Crore</strong> (₹75 Lakhs for Special Category States).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Restaurants (Non-Alcohol)</span>
              <div className="font-mono text-xl font-bold text-teal-700">5% Flat Tax</div>
              <p className="text-slate-600 leading-relaxed">
                2.5% CGST + 2.5% SGST. Serving food or non-alcoholic drinks. Turnover cap: <strong>₹1.5 Crore</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 space-y-2">
              <span className="font-bold text-teal-950 text-sm block">Service Providers (Sec 10(2A))</span>
              <div className="font-mono text-xl font-bold text-teal-800">6% Flat Tax</div>
              <p className="text-teal-900/90 leading-relaxed">
                3% CGST + 3% SGST. Standalone service providers and mixed suppliers. Turnover cap: <strong>₹50 Lakhs</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Critical Restrictions & Ineligibility */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Ineligibility &amp; Operational Restrictions
              </h3>
              <p className="text-xs text-slate-500">
                Who cannot opt into the Composition Scheme under CGST law
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
            {[
              {
                title: "No Inter-State Outward Supplies",
                desc: "Suppliers selling goods or services across state borders are barred from composition. All sales must remain strictly intra-state.",
              },
              {
                title: "Zero Input Tax Credit (ITC)",
                desc: "Neither the composition dealer can claim ITC on inward purchases, nor can their B2B buyers claim credit on purchases made from them.",
              },
              {
                title: "No Tax Collection from Buyers",
                desc: "Dealers must pay the 1%, 5%, or 6% flat tax directly out of their own profit margins; they cannot collect it separately on the bill.",
              },
              {
                title: "Restricted Goods Manufacturers",
                desc: "Manufacturers of ice cream, pan masala, tobacco products, and aerated beverages are barred under Section 10(2)(e).",
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-1">
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Filing Schedule CMP-08 & GSTR-4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Simplified Return Filing Calendar
              </h3>
              <p className="text-xs text-slate-500">
                Enjoy zero monthly return fatigue with quarterly and annual statements
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-bold">
                Quarterly Payment
              </span>
              <h4 className="font-bold text-slate-900">Form CMP-08</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Summary of turnover and flat tax remittance. Due on the <strong>18th of the month</strong> following the close of each quarter (e.g., 18th July for Q1, 18th October for Q2).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                Annual Return
              </span>
              <h4 className="font-bold text-slate-900">Form GSTR-4</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Comprehensive annual declaration of aggregate inward purchases and sales turnover. Due by <strong>30th April</strong> following the end of the financial year.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA to Invoicing */}
        <div className="rounded-2xl border border-teal-200 bg-linear-to-r from-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Create compliant Bills of Supply or Tax Invoices</h3>
            <p className="mt-1 text-xs text-teal-200 max-w-xl">
              Whether you are registered under Regular GST or the Composition Scheme, SwiftGST generates legally compliant bills with zero setup.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition active:scale-95"
          >
            <span>Create Bill Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900">Composition Scheme FAQs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Practical answers to frequent taxpayer queries regarding Section 10 provisions
            </p>
          </div>
          <FaqAccordion items={COMPOSITION_FAQS} />
        </div>
      </div>
    </section>
  );
}
