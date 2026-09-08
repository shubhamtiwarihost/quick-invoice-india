import Link from "next/link";
import {
  BookOpen,
  Hash,
  AlertTriangle,
  ArrowRight,
  Layers,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const HSN_FAQS: FaqItem[] = [
  {
    question: "What is the difference between an HSN Code and a SAC Code?",
    answer:
      "HSN (Harmonized System of Nomenclature) is an internationally standardized 6-to-8 digit system developed by the World Customs Organization (WCO) to classify physical goods. SAC (Services Accounting Code) is a 6-digit classification system created by the Central Board of Indirect Taxes and Customs (CBIC) exclusively for services, where every code starts with '99' (e.g., SAC 998314 for IT development services).",
  },
  {
    question: "How many digits of HSN code are mandatory on GST tax invoices?",
    answer:
      "Under CBIC Notification No. 78/2020: (1) Businesses with aggregate annual turnover up to ₹5 Crore must mention at least 4 digits of HSN on all B2B tax invoices (reporting on B2C invoices is optional). (2) Businesses with annual turnover exceeding ₹5 Crore must mandatorily mention 6 digits of HSN on all B2B and B2C tax invoices. (3) Complete 8-digit HSN codes are mandatory for import/export consignments and specified chemical/narcotic goods.",
  },
  {
    question: "What is the penalty under GST for entering an incorrect or missing HSN code?",
    answer:
      "Under Section 125 of the CGST Act (General Penalty), failure to mention mandatory HSN/SAC codes or quoting incorrect codes attracts a penalty of up to ₹25,000 under CGST and ₹25,000 under SGST (total ₹50,000 per violation). Additionally, the GST portal will reject Table 12 of GSTR-1 if required HSN summary details are omitted.",
  },
  {
    question: "Which SAC code applies to freelance software developers and IT consultants?",
    answer:
      "The official SAC code for software design, website development, UI/UX engineering, and IT consulting is SAC 998314 ('Information technology design and development services') or SAC 998313 ('Information technology consulting and support services'). Both fall under the standard 18% GST slab rate.",
  },
  {
    question: "Can an invoice contain multiple items with different HSN codes and GST rates?",
    answer:
      "Yes. Indian GST law permits multiple line items on a single tax invoice, each with its own individual HSN/SAC code and corresponding tax slab (e.g., item 1 at 5% and item 2 at 18%). SwiftGST automatically calculates tax subtotals per slab and outputs the compliant breakdown required for GSTR-1 reporting.",
  },
  {
    question: "How do I report HSN codes in my monthly or quarterly GSTR-1 return?",
    answer:
      "Taxpayers report their cumulative sales summarized by HSN/SAC in Table 12 of Form GSTR-1. For each distinct HSN/SAC code, you must report the Description, Unit Quantity Code (UQC), Total Quantity, Total Value, Taxable Value, and the exact IGST, CGST, and SGST amounts collected.",
  },
];

export function HsnComplianceGuide() {
  return (
    <section className="mt-14 border-t border-slate-200 bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-700" />
            <span>Statutory Classification Framework</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Guide to HSN &amp; SAC Codes in India
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Understand CBIC turnover thresholds, digit requirements, Table 12 GSTR-1 reporting,
            and avoid costly Section 125 non-compliance penalties.
          </p>
        </div>

        {/* 1. HSN vs SAC Comparison */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. HSN Code (Goods) vs SAC Code (Services)
              </h3>
              <p className="text-xs text-slate-500">
                Two complementary classification systems governing Indian taxation
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <span className="font-bold text-slate-900 text-sm block">
                HSN — Harmonized System of Nomenclature
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies exclusively to <strong>tangible physical goods</strong>. Maintained globally by the World Customs Organization (WCO) with over 5,000 commodity groups. Adopted by India with a 2-digit chapter, 2-digit heading, 2-digit sub-heading, and 2-digit regional tariff structure.
              </p>
              <div className="rounded-lg bg-teal-50 border border-teal-200/80 p-3 text-xs text-teal-900">
                <strong>Example:</strong> HSN 0902 represents Tea, whether or not flavoured; HSN 6109 represents T-shirts and singlets.
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <span className="font-bold text-slate-900 text-sm block">
                SAC — Services Accounting Code
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies exclusively to <strong>intangible professional services</strong>. Uniformly standardized by the CBIC under Chapter 99. Every valid SAC code in India begins with the prefix &quot;99&quot;.
              </p>
              <div className="rounded-lg bg-blue-50 border border-blue-200/80 p-3 text-xs text-blue-900">
                <strong>Example:</strong> SAC 998314 represents IT software design &amp; engineering; SAC 9954 represents General Construction Services.
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mandatory Turnover Thresholds */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Mandatory Digits by Turnover (CBIC Notification 78/2020)
              </h3>
              <p className="text-xs text-slate-500">
                Statutory digit rules enforced across all Indian tax invoices
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Turnover up to ₹5 Cr</span>
              <div className="font-mono text-base font-bold text-teal-700">4 Digits (B2B)</div>
              <p className="text-slate-600 leading-relaxed">
                Mandatory 4 digits on all B2B invoices. Optional for B2C retail supplies to consumers.
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 space-y-2">
              <span className="font-bold text-teal-950 text-sm block">Turnover above ₹5 Cr</span>
              <div className="font-mono text-base font-bold text-teal-800">6 Digits (All)</div>
              <p className="text-teal-900/90 leading-relaxed">
                Mandatory 6 digits on all B2B and B2C tax invoices without exception.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Chemicals &amp; Exports</span>
              <div className="font-mono text-base font-bold text-slate-900">8 Digits (Full)</div>
              <p className="text-slate-600 leading-relaxed">
                Full 8-digit tariff code mandatory for cross-border exports and notified chemical goods.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Penalties & GSTR-1 Table 12 Reporting */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Non-Compliance Risks &amp; Return Filing
              </h3>
              <p className="text-xs text-slate-500">
                Avoiding penalties under Section 125 of the CGST Act
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <h4 className="font-bold text-amber-950">Section 125 General Penalty</h4>
              <p className="text-amber-900/90 text-xs leading-relaxed">
                Quoting incorrect HSN codes to evade higher tax slabs or omitting HSN codes where mandatory can attract a general penalty of up to <strong>₹25,000 under CGST</strong> and <strong>₹25,000 under SGST</strong> (total ₹50,000 per violation).
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">GSTR-1 Table 12 Auto-Validation</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                The GST portal cross-verifies Table 12 HSN summaries with the total taxable turnover in Table 4 (B2B) and Table 7 (B2C). Mismatched rates or missing codes will cause filing errors.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA to Invoicing */}
        <div className="rounded-2xl border border-teal-200 bg-linear-to-r from-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Apply verified HSN codes to your invoice in 1 click</h3>
            <p className="mt-1 text-xs text-teal-200 max-w-xl">
              Select any HSN code above and click &quot;Add to invoice&quot; — SwiftGST automatically pre-populates the item name, rate, and tax slab into your active bill.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition active:scale-95"
          >
            <span>Open Invoice Generator</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900">HSN &amp; SAC Code FAQs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Frequently asked questions regarding product and service classification in India
            </p>
          </div>
          <FaqAccordion items={HSN_FAQS} />
        </div>
      </div>
    </section>
  );
}
