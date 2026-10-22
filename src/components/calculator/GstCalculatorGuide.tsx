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
    question: "What are the current GST slabs in India after GST 2.0?",
    answer:
      "Since 22 September 2025 (GST 2.0), India has four main GST rates: 0% (nil-rated and exempt items such as unbranded foodgrains, fresh milk, paneer and printed books), 5% (essentials such as packaged food, tea, soap, medicines and apparel up to ₹2,500 per piece), 18% (the standard rate for most goods and services) and 40% (luxury and sin goods such as large cars, aerated drinks and tobacco). Gold and jewellery continue at 3%. The old 12% and 28% slabs no longer apply to new supplies.",
  },
  {
    question: "What changed in GST 2.0 on 22 September 2025?",
    answer:
      "The GST Council removed the 12% and 28% slabs. Most items that were taxed at 12% moved to 5% (with some moving to 18%), and most items that were taxed at 28% moved to 18%. A new 40% rate now applies to luxury and sin goods, replacing 28% plus cess. If you quote or bill prices, update your price lists and invoice templates to the new rates for supplies made on or after 22 September 2025.",
  },
  {
    question: "What is the GST rate on clothes and footwear now?",
    answer:
      "Apparel and footwear priced up to ₹2,500 per piece (or per pair) attract 5% GST, and items priced above ₹2,500 per piece attract 18% GST. The threshold is applied to each piece, not to the total invoice value. Earlier, the 5% rate applied only up to ₹1,000 and 12% applied above that.",
  },
  {
    question: "Is GST calculated before or after a discount?",
    answer:
      "If a discount is allowed before or at the time of supply and is shown on the tax invoice, GST is charged on the value after the discount. For example, a ₹10,000 item with a 10% discount has a taxable value of ₹9,000, so GST at 18% is ₹1,620 and the invoice total is ₹10,620. Discounts given after the supply have different rules, so check Section 15 of the CGST Act.",
  },
  {
    question: "How do I calculate 40% GST on a luxury or sin good?",
    answer:
      "The method is the same as any other slab. On a taxable value of ₹10,000 at 40%, GST is ₹4,000 and the invoice total is ₹14,000. For an intra-state sale this is split as 20% CGST and 20% SGST, and for an inter-state sale the full 40% is charged as IGST.",
  },
  {
    question: "Which GST rate should I use if I am not sure?",
    answer:
      "Look up the HSN code (for goods) or SAC code (for services) of what you sell, then check the rate notified for that code. Our HSN and SAC finder lists typical rates for common items, including price thresholds and exceptions. If you cannot decide, confirm the rate with the official CBIC notification or a chartered accountant, because charging the wrong rate can lead to interest and penalties.",
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
                2. Current GST Rate Slabs (GST 2.0, effective 22 September 2025)
              </h3>
              <p className="text-xs text-slate-500">
                The GST Council replaced the old 0/5/12/18/28 structure with 0%, 5%, 18% and 40%
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-emerald-800 text-sm block">0% (Nil / Exempt)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Loose unbranded foodgrains, fresh milk, paneer, Indian breads (roti, paratha), printed books, sanitary napkins and specified life-saving drugs.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-teal-800 text-sm block">5% (Essentials)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Packaged food (biscuits, namkeen, butter), tea, coffee, soap, shampoo, toothpaste, medicines, apparel and footwear up to ₹2,500 per piece, and hotel rooms priced ₹1,000 to ₹7,500 a day.
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3.5">
              <span className="font-bold text-teal-950 text-sm block">18% (Standard Rate)</span>
              <p className="mt-1 text-teal-900/90 leading-snug">
                Most goods and services: software and IT services, professional services, air conditioners, TVs, washing machines, cement, small cars, motorcycles up to 350 cc, and apparel above ₹2,500 per piece.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <span className="font-bold text-slate-900 text-sm block">40% (Luxury &amp; Sin Goods)</span>
              <p className="mt-1 text-slate-600 leading-snug">
                Large cars and SUVs, motorcycles above 350 cc, aerated and sweetened drinks, yachts and private aircraft. Tobacco and pan masala move to 40% from a date still to be notified. This replaces the old 28% plus cess.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Also:</strong> gold and jewellery continue at <strong>3%</strong>. The old <strong>12%</strong> and <strong>28%</strong> slabs no longer apply to supplies made on or after 22 September 2025, although invoices for earlier supplies keep the rate that applied at the time. Rates are indicative; always confirm the rate for your exact product using its HSN or SAC code in our{" "}
            <Link href="/hsn-finder/" className="font-semibold text-teal-700 hover:underline">HSN &amp; SAC code finder</Link>.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <caption className="bg-slate-50 px-4 py-2 text-left text-[11px] font-semibold text-slate-600">
                What moved in GST 2.0
              </caption>
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2">Old slab</th>
                  <th className="px-4 py-2">New slab</th>
                  <th className="px-4 py-2">Typical examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-2 font-semibold">12%</td>
                  <td className="px-4 py-2">Mostly 5% (some 18%)</td>
                  <td className="px-4 py-2">Butter, ghee, medicines, namkeen, apparel up to ₹2,500</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">18%</td>
                  <td className="px-4 py-2">5% for selected items</td>
                  <td className="px-4 py-2">Biscuits, soap, shampoo, toothpaste</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">28%</td>
                  <td className="px-4 py-2">Mostly 18%</td>
                  <td className="px-4 py-2">Air conditioners, TVs, cement, small cars, auto parts</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">28% + cess</td>
                  <td className="px-4 py-2">40%</td>
                  <td className="px-4 py-2">Large cars, aerated drinks, yachts, private aircraft</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Worked Examples */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Worked GST examples on ₹10,000 (exclusive)
            </h3>
            <p className="text-xs text-slate-500">
              Intra-state supply, so tax splits equally into CGST and SGST
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2">GST rate</th>
                  <th className="px-4 py-2">CGST</th>
                  <th className="px-4 py-2">SGST</th>
                  <th className="px-4 py-2">Total GST</th>
                  <th className="px-4 py-2">Invoice total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                <tr><td className="px-4 py-2 font-sans font-semibold">3%</td><td className="px-4 py-2">₹150</td><td className="px-4 py-2">₹150</td><td className="px-4 py-2">₹300</td><td className="px-4 py-2">₹10,300</td></tr>
                <tr><td className="px-4 py-2 font-sans font-semibold">5%</td><td className="px-4 py-2">₹250</td><td className="px-4 py-2">₹250</td><td className="px-4 py-2">₹500</td><td className="px-4 py-2">₹10,500</td></tr>
                <tr><td className="px-4 py-2 font-sans font-semibold">18%</td><td className="px-4 py-2">₹900</td><td className="px-4 py-2">₹900</td><td className="px-4 py-2">₹1,800</td><td className="px-4 py-2">₹11,800</td></tr>
                <tr><td className="px-4 py-2 font-sans font-semibold">40%</td><td className="px-4 py-2">₹2,000</td><td className="px-4 py-2">₹2,000</td><td className="px-4 py-2">₹4,000</td><td className="px-4 py-2">₹14,000</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 text-xs text-slate-600 leading-relaxed">
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="font-bold text-slate-900">Reverse GST at 5%</h4>
              <p className="mt-1">
                A packet priced ₹1,050 inclusive of 5% GST has a base value of (1,050 × 100) ÷ 105 = ₹1,000, so the GST inside the price is ₹50.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="font-bold text-slate-900">Inter-state at 18%</h4>
              <p className="mt-1">
                Software services of ₹50,000 from Delhi (07) to a client in Karnataka (29) attract IGST of 18%, which is ₹9,000, for a total of ₹59,000.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="font-bold text-slate-900">Apparel threshold</h4>
              <p className="mt-1">
                A ₹2,400 shirt carries 5% GST (₹120). A ₹3,000 jacket crosses the ₹2,500 limit and carries 18% GST (₹540).
              </p>
            </div>
          </div>
        </div>

        {/* Common mistakes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Common GST calculation mistakes to avoid</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc pl-5">
            <li>
              <strong>Using an old slab.</strong> Price lists built before 22 September 2025 may still use 12% or 28%. Re-check each item against its HSN or SAC code.
            </li>
            <li>
              <strong>Applying the wrong formula to an MRP.</strong> When a price already includes GST, divide by (100 + rate) and multiply by 100. Subtracting the rate percentage from the total gives the wrong base value.
            </li>
            <li>
              <strong>Charging CGST and SGST on an inter-state sale.</strong> Compare the supplier&apos;s state code with the Place of Supply. If they differ, charge IGST. See the{" "}
              <Link href="/gst-state-codes/" className="font-semibold text-teal-700 hover:underline">GST state code list</Link>.
            </li>
            <li>
              <strong>Ignoring the per-piece apparel threshold.</strong> The ₹2,500 limit applies to each piece, not to the invoice total.
            </li>
            <li>
              <strong>Entering a wrong GSTIN.</strong> A mistyped GSTIN can block your customer&apos;s input tax credit. Check it with the{" "}
              <Link href="/gstin-validator/" className="font-semibold text-teal-700 hover:underline">GSTIN validator</Link>.
            </li>
            <li>
              <strong>Mixing composition and regular rules.</strong> Composition dealers cannot charge GST on invoices. See the{" "}
              <Link href="/composition-calculator/" className="font-semibold text-teal-700 hover:underline">composition scheme calculator</Link>.
            </li>
          </ul>
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
