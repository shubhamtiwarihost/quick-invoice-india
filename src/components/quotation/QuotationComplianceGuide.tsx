import {
  Scale,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const QUOTATION_FAQS: FaqItem[] = [
  {
    question: "What is the legal difference between an Estimate, a Quotation, and a Tax Invoice?",
    answer:
      "An 'Estimate' is an approximate non-binding cost assessment based on initial project discussions. A 'Quotation' (or formal quote) is a specific, legally binding offer of price under the Indian Contract Act, 1872 that commits the supplier to deliver described goods or services at the agreed rate within a stated validity period. A 'Tax Invoice' is issued under Section 31 of the CGST Act once goods are delivered or services are completed, demanding actual payment and enabling the buyer to claim Input Tax Credit (ITC).",
  },
  {
    question: "Is a price quotation legally binding once accepted by the client?",
    answer:
      "Yes. Under Section 2 and Section 7 of the Indian Contract Act, 1872, when a formal written quotation issued with specific terms and validity is accepted in writing (via signature, email confirmation, or purchase order) by the recipient, it constitutes a legally enforceable commercial contract.",
  },
  {
    question: "Do I need to include GST on a quotation if I am unregistered?",
    answer:
      "No. If your aggregate turnover is under the mandatory registration threshold (₹20 Lakhs for services / ₹40 Lakhs for goods), you should not charge GST. You can quote the net price and state 'Exempt from GST under Section 22 of CGST Act'. If registered, you should mention the base price, applicable GST slab (e.g. 18%), and estimated tax amount so the client understands their gross liability.",
  },
  {
    question: "How does 1-click conversion from Quotation to GST Tax Invoice work on SwiftGST?",
    answer:
      "When your client approves the estimate, simply click 'Convert to GST Invoice' on the top action bar. SwiftGST automatically transfers your seller profile, client billing details, line items, rates, and HSN/SAC codes directly into the active GST invoice editor, assigning a consecutive tax invoice number and generating a live A4 bill with dynamic UPI QR code.",
  },
  {
    question: "What is the ideal validity period to include on an estimate or quotation?",
    answer:
      "In India, standard commercial quotations typically specify a validity window of 15 to 30 calendar days. Including an explicit validity date protects your business against unforeseen raw material price surges, wholesale supply fluctuations, and labor inflation.",
  },
  {
    question: "Can I use an accepted quotation as a Proforma Invoice to request advance payment?",
    answer:
      "Yes. Many Indian businesses issue a Proforma Invoice or accepted quotation to secure an initial 20% to 50% advance mobilization deposit before commencing work or dispatching goods. Under GST rules, advance receipts for services require issuing a Receipt Voucher under Section 31(3)(d).",
  },
];

export function QuotationComplianceGuide() {
  return (
    <section className="w-full bg-white py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-semibold text-blue-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span>Commercial Law &amp; Estimation Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Guide to Business Quotations &amp; Estimates in India
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Master the legal distinctions between quotes, proforma bills, and final tax invoices,
            protect your project margins, and streamline client approvals.
          </p>
        </div>

        {/* 1. The Legal Matrix: Quote vs Estimate vs Proforma vs Tax Invoice */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Quotation vs Estimate vs Proforma vs Tax Invoice
              </h3>
              <p className="text-xs text-slate-500">Commercial document hierarchy under Indian mercantile law</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="font-bold text-slate-900 text-sm block">1. Estimate (Rough Assessment)</span>
              <p className="mt-1 text-slate-600 leading-relaxed">
                An initial, non-binding approximation of likely costs. Subject to variance if client requirements change during execution. Not legally enforceable on fixed pricing.
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 shadow-2xs">
              <span className="font-bold text-teal-950 text-sm block">2. Formal Quotation (Binding Offer)</span>
              <p className="mt-1 text-teal-900/90 leading-relaxed">
                A definitive, fixed-price commercial proposal governed by the Indian Contract Act, 1872. Guarantees rates for a fixed validity window (e.g. 15–30 days).
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 shadow-2xs">
              <span className="font-bold text-blue-950 text-sm block">3. Proforma Invoice (Advance Billing)</span>
              <p className="mt-1 text-blue-900/90 leading-relaxed">
                A preliminary commercial bill issued prior to delivery of goods or services. Used by corporate buyers to issue purchase orders and release mobilization advances.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="font-bold text-slate-900 text-sm block">4. GST Tax Invoice (Statutory Demand)</span>
              <p className="mt-1 text-slate-600 leading-relaxed">
                The mandatory final accounting document issued under Section 31 of the CGST Act. Demands final settlement, accounts for output GST, and allows buyer ITC.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Key Components Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Anatomy of a High-Converting Commercial Quote
              </h3>
              <p className="text-xs text-slate-500">Essential elements that protect your cash flow and speed up approvals</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
            {[
              { title: "Granular Scope of Deliverables", desc: "Detailed breakdown of exact line items, specifications, or billable hours to eliminate scope creep." },
              { title: "Definitive Validity Period", desc: "Explicit expiration date (e.g., Valid for 21 days from issue) to safeguard against rising supply costs." },
              { title: "Staged Payment Milestones", desc: "Clear schedule of advance deposits (e.g., 40% advance, 40% upon staging, 20% upon delivery)." },
              { title: "GST & Tax Transparency", desc: "Distinct display of base taxable values and estimated CGST/SGST/IGST percentages." },
              { title: "Standard Delivery Timelines", desc: "Estimated turnaround windows contingent upon prompt client feedback and sign-off." },
              { title: "Acceptance Signature Block", desc: "Dedicated signatory area for authorized client representative endorsement." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-600 text-[11px] font-bold text-white font-mono">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-500 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 1-Click Invoice Conversion Feature */}
        <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Instant 1-Click Conversion to GST Tax Invoice
              </h3>
              <p className="text-xs text-slate-500">Zero re-typing, zero accounting errors</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In standard accounting systems, converting an approved estimate into an active tax invoice requires re-entering customer details,
            re-typing line items, and manually re-calculating taxes. With <strong>SwiftGST</strong>, clicking the <strong>&quot;Convert to Tax Invoice&quot;</strong> button
            seamlessly migrates your entire quotation data into the tax invoice generator, auto-applies consecutive serial numbering,
            and produces a print-ready A4 bill in under 5 seconds.
          </p>
        </div>

        {/* 4. FAQs */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900">Quotation &amp; Estimate FAQs</h3>
            <p className="text-xs text-slate-500 mt-1">Frequently asked questions regarding commercial pricing and contracts</p>
          </div>
          <FaqAccordion items={QUOTATION_FAQS} />
        </div>
      </div>
    </section>
  );
}
