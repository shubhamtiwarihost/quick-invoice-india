import Link from "next/link";
import {
  BookOpen,
  Calculator,
  ShieldCheck,
  Scale,
  ArrowRight,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const FREELANCE_FAQS: FaqItem[] = [
  {
    question: "What is the Section 44ADA Presumptive Taxation Scheme for Indian freelancers?",
    answer:
      "Section 44ADA of the Income Tax Act allows specified professionals (software developers, technical consultants, UI/UX designers, accountants, lawyers) with gross annual receipts up to ₹75 Lakhs (where digital receipts exceed 95%) to declare a flat 50% of gross revenue as taxable profit. The remaining 50% is presumed to cover operational business expenses, exempting the professional from maintaining tedious books of account or undergoing an income tax audit.",
  },
  {
    question: "Do I need to register for GST if I freelance for foreign clients in US Dollars?",
    answer:
      "Yes, if your aggregate turnover crosses ₹20 Lakhs. Under Section 16 of the IGST Act, cross-border freelance work is classified as an 'Export of Services' and qualifies as a Zero-Rated Supply. By submitting an annual Letter of Undertaking (LUT) in Form GST RFD-11 on the GST portal, you can invoice foreign clients at 0% GST without paying tax up-front or blocking capital.",
  },
  {
    question: "How many hours per week should a freelancer assume are truly billable?",
    answer:
      "Most successful freelancers only bill between 20 and 25 hours per week out of a 40-hour work schedule (a 50% to 60% billable utilization rate). The remaining 15 to 20 hours are required for non-billable business activities such as client prospecting, proposal drafting, invoicing, bookkeeping, and continuous technical learning.",
  },
  {
    question: "What SAC code should an Indian freelancer use on their invoices?",
    answer:
      "Software engineers, web developers, and technical contractors use SAC 998314 ('Information technology design and development services') or SAC 998313 ('Information technology consulting and support services'). Creative writers and graphic designers typically use SAC 998391. For domestic clients, these services attract 18% GST.",
  },
  {
    question: "How should I structure payment terms to prevent late payments?",
    answer:
      "To safeguard cash flow, standard practice for freelancers is requiring a 30% to 50% advance deposit before commencing project work, followed by milestone progress payments, and retaining the final 10% to 20% deliverable release until full invoice clearance. Always specify a 7-day or 14-day payment due date on your SwiftGST invoice.",
  },
  {
    question: "What is TDS under Section 194J and how does it affect domestic freelance payouts?",
    answer:
      "When invoicing Indian registered corporate clients, the client is legally required to deduct Tax Deducted at Source (TDS) under Section 194J of the Income Tax Act. For technical services, the TDS rate is typically 2% or 10%. The deducted amount is credited to your PAN and reflects in your Form 26AS / AIS, which you can adjust against your annual income tax liability.",
  },
];

export function FreelanceRateGuide() {
  return (
    <section className="mt-14 border-t border-slate-200 bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-700" />
            <span>Freelance Economics &amp; Tax Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The Complete Financial &amp; Tax Guide for Indian Freelancers
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Master sustainable pricing formulas, leverage Section 44ADA tax exemptions, and bill
            global clients with zero-rated GST compliance.
          </p>
        </div>

        {/* 1. Pricing Strategy Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. The True Hourly Rate Formula
              </h3>
              <p className="text-xs text-slate-500">
                Accounting for unpaid administration, sick leave, and overhead
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A common mistake made by new consultants is dividing their desired annual salary by 2,080 hours (40 hours × 52 weeks). This ignores business reality: you do not have paid sick leave, company medical benefits, hardware allowances, or client acquisition teams.
          </p>

          <div className="rounded-xl bg-slate-900 p-5 font-mono text-xs text-teal-300 space-y-2">
            <p className="text-white font-bold font-sans text-sm">Target Hourly Rate =</p>
            <p>(Desired Take-Home Income + Annual Overhead) ÷ [Billable Weeks × Realistic Weekly Billable Hours]</p>
            <p className="text-slate-400 font-sans text-[11px] pt-1 border-t border-slate-800">
              *Adjust denominator for 48 active billing weeks (allowing 4 weeks vacation) and 25 billable hours/week.
            </p>
          </div>
        </div>

        {/* 2. Section 44ADA & Tax Optimization */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Section 44ADA Presumptive Taxation Scheme
              </h3>
              <p className="text-xs text-slate-500">
                Save 50% or more on accounting fees and legally reduce taxable income
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 space-y-2">
              <span className="font-bold text-teal-950 text-sm block">50% Flat Deemed Profit</span>
              <p className="text-teal-900/90 leading-relaxed text-xs">
                Under Section 44ADA, you are permitted to declare exactly 50% of your gross freelance receipts as net taxable income. If your gross receipts are ₹30 Lakhs, your declared income is only ₹15 Lakhs.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">₹75 Lakhs Revenue Ceiling</span>
              <p className="text-slate-600 leading-relaxed text-xs">
                The threshold limit has been enhanced to <strong>₹75 Lakhs</strong> per financial year for professionals whose aggregate cash receipts do not exceed 5% of total turnover (standard for bank-paid freelancers).
              </p>
            </div>
          </div>
        </div>

        {/* 3. Export of Services & LUT Invoicing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Foreign Client Invoicing (Export of Services under LUT)
              </h3>
              <p className="text-xs text-slate-500">
                How to legally invoice overseas clients at 0% GST
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When you provide software, design, or writing services to an international client outside India and receive payment in convertible foreign exchange (via Wire, Stripe, PayPal, or Wise), the transaction qualifies as an <strong>Export of Services</strong> under Section 2(6) of the IGST Act:
          </p>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-200 p-3.5 space-y-1">
              <span className="font-bold text-slate-900">Step 1: File LUT Online</span>
              <p className="text-slate-600 text-[11px] leading-snug">
                File Form GST RFD-11 annually on the GST portal to execute a Letter of Undertaking.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3.5 space-y-1">
              <span className="font-bold text-slate-900">Step 2: Bill at 0% GST</span>
              <p className="text-slate-600 text-[11px] leading-snug">
                Issue tax invoices in USD/EUR stating: &quot;Supply meant for export under LUT without payment of IGST&quot;.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3.5 space-y-1">
              <span className="font-bold text-slate-900">Step 3: Secure FIRC / FIRS</span>
              <p className="text-slate-600 text-[11px] leading-snug">
                Obtain Foreign Inward Remittance Certificates from your receiving bank as statutory proof.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA */}
        <div className="rounded-2xl border border-teal-200 bg-linear-to-r from-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Ready to bill your clients with professional clarity?</h3>
            <p className="mt-1 text-xs text-teal-200 max-w-xl">
              Create beautiful, itemized freelance invoices with hourly or fixed milestone rates, SAC codes, and dynamic UPI QR payment codes.
            </p>
          </div>
          <Link
            href="/freelancer-invoice-generator/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 transition active:scale-95"
          >
            <span>Generate Freelance Invoice</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900">Freelancer Finance &amp; Tax FAQs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Essential tax, legal, and operational questions answered for Indian independent professionals
            </p>
          </div>
          <FaqAccordion items={FREELANCE_FAQS} />
        </div>
      </div>
    </section>
  );
}
