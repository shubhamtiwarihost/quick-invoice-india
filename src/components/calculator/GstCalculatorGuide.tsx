import Link from "next/link";
import {
  Calculator,
  Percent,
  Split,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const GST_CALC_FAQS: FaqItem[] = [
  {
    question: "What is the mathematical formula for calculating GST (Exclusive Mode)?",
    answer:
      "When adding GST to a net taxable value: GST Amount = (Taxable Amount × GST Rate) ÷ 100. The Total Gross Invoice Amount = Taxable Amount + GST Amount. For example, on a ₹10,000 professional fee at 18% GST, the GST is ₹1,800, bringing the final payable total to ₹11,800.",
  },
  {
    question: "How do you calculate reverse GST from an inclusive MRP price?",
    answer:
      "To extract the base taxable value from a GST-inclusive price: Base Taxable Value = (Gross Amount × 100) ÷ (100 + GST Rate). The GST Amount is then: Gross Amount − Base Taxable Value. For example, if a product costs ₹1,180 inclusive of 18% GST, the base value is (1,180 × 100) ÷ 118 = ₹1,000, and the embedded GST is ₹180.",
  },
  {
    question: "How is GST split between Central and State governments for Intra-State sales?",
    answer:
      "When the supplier and buyer are located within the same Indian State or Union Territory, the supply is considered 'Intra-State'. In this scenario, the applicable GST is divided equally into two components: Central GST (CGST) at half the rate and State GST (SGST) at half the rate. For an 18% slab, 9% is CGST and 9% is SGST.",
  },
  {
    question: "When should Integrated GST (IGST) be charged instead of CGST and SGST?",
    answer:
      "Integrated GST (IGST) is levied exclusively on 'Inter-State' supplies, which occur when the supplier's state differs from the customer's Place of Supply (POS) state under Section 7 of the IGST Act, 2017. IGST is charged at the full slab rate (e.g., 18%) and remitted directly to the Central Government for inter-governmental revenue distribution.",
  },
  {
    question: "What are the 5 primary GST tax slabs in India?",
    answer:
      "The Indian GST framework comprises 5 primary standard rate brackets: 0% (unbranded food grains, fresh vegetables, milk), 5% (household essentials, packaged food, tea, apparel below ₹1,000), 12% (processed foods, business software, apparel above ₹1,000), 18% (standard rate for IT services, telecom, industrial goods), and 28% (motor vehicles, luxury commodities, aerated beverages) plus applicable Compensation Cess.",
  },
  {
    question: "Can business buyers claim Input Tax Credit (ITC) on the calculated GST?",
    answer:
      "Yes. If the buyer is registered under GST and the inward purchase is used in the course or furtherance of business, they can claim 100% Input Tax Credit under Section 16 of the CGST Act, provided the supplier files GSTR-1 and the invoice reflects correctly in the buyer's GSTR-2B.",
  },
];

export function GstCalculatorGuide() {
  return (
    <section className="mt-14 border-t border-slate-200 bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-700" />
            <span>Statutory Tax Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Goods &amp; Services Tax (GST) is Calculated in India
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Understand the exact mathematical formulas for forward (exclusive) and reverse (inclusive)
            tax computation under the CGST &amp; IGST Acts.
          </p>
        </div>

        {/* Mathematical Formulas Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Forward vs Reverse GST Calculation Formulas
              </h3>
              <p className="text-xs text-slate-500">
                Mathematical proof and standard accounting implementation
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Exclusive Formula */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">A. Exclusive (Add GST)</span>
                <span className="rounded-md bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-bold">
                  B2B Billing Standard
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applied when quoting a net taxable base price and appending statutory GST at the end of the bill.
              </p>
              <div className="rounded-lg bg-slate-900 p-3.5 font-mono text-xs text-teal-300 space-y-1">
                <p>GST Amount = (Base × Rate) ÷ 100</p>
                <p>Total Invoice = Base + GST Amount</p>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Example: ₹10,000 base with 18% GST → ₹1,800 tax = ₹11,800 total.
              </p>
            </div>

            {/* Inclusive Formula */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">B. Inclusive (Remove GST)</span>
                <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                  B2C / Retail MRP
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Used to determine the original taxable base when prices are stated inclusive of all statutory taxes.
              </p>
              <div className="rounded-lg bg-slate-900 p-3.5 font-mono text-xs text-blue-300 space-y-1">
                <p>Base Value = (Gross × 100) ÷ (100 + Rate)</p>
                <p>GST Amount = Gross − Base Value</p>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Example: ₹1,180 retail MRP with 18% GST → ₹1,000 base + ₹180 tax.
              </p>
            </div>
          </div>
        </div>

        {/* GST Rates Slab Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Official Indian GST Rate Slabs (2026 CBIC Schedule)
              </h3>
              <p className="text-xs text-slate-500">
                Statutory categories established by the GST Council
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-emerald-800 text-sm block">0% (Nil / Exempt)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Fresh fruits, unbranded flour (atta), fresh milk, salt, organic fertilizers, judicial papers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-teal-800 text-sm block">5% (Household Essentials)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Packaged food items, edible oils, tea, coffee, life-saving medicines, apparel under ₹1,000.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-blue-800 text-sm block">12% (Standard Lower)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Processed foods, fruit juices, dairy products (butter, cheese), business software, non-AC dining.
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3.5 sm:col-span-2">
              <span className="font-bold text-teal-950 text-sm block">18% (Standard Rate — Majority of Services)</span>
              <p className="mt-1 text-teal-900/90 leading-snug">
                Software development, IT consulting, capital goods, financial services, telecom, industrial equipment.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-slate-900 text-sm block">28% (Luxury &amp; Demerit)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Automobiles, air conditioners, aerated drinks, cement, luxury hospitality (+ Cess).
              </p>
            </div>
          </div>
        </div>

        {/* Intra-State vs Inter-State Supply */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs">
              <Split className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Intra-State vs Inter-State Tax Jurisdiction
              </h3>
              <p className="text-xs text-slate-500">
                Determined strictly by the 2-digit state code of Supplier and Place of Supply
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Intra-State Supply (Same State)</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                If the supplier&apos;s registered address and the recipient&apos;s Place of Supply (POS) are located in the same state (e.g., Maharashtra 27 to Maharashtra 27), tax is split into <strong>CGST (50%)</strong> and <strong>SGST (50%)</strong>.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Inter-State Supply (Different State)</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                If goods or services travel across state borders (e.g., Delhi 07 to Karnataka 29), <strong>Integrated GST (IGST)</strong> is charged at the full 100% rate with no CGST/SGST split.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA to Invoicing */}
        <div className="rounded-2xl border border-teal-200 bg-linear-to-r from-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Ready to turn this calculation into a tax invoice?</h3>
            <p className="mt-1 text-xs text-teal-200 max-w-xl">
              SwiftGST auto-applies CGST, SGST, IGST, generates dynamic UPI QR codes, and produces print-ready A4 invoices in seconds.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition active:scale-95"
          >
            <span>Create Invoice Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900">GST Calculator FAQs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Common questions regarding tax calculation rules and compliance in India
            </p>
          </div>
          <FaqAccordion items={GST_CALC_FAQS} />
        </div>
      </div>
    </section>
  );
}
