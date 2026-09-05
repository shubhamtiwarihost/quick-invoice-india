"use client";

import {
  Users,
  BookOpen,
  Scale,
  CheckCircle2,
  Phone,
  MessageCircle,
  Coins,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";
import { AdBannerSlot } from "@/components/ads/AdBannerSlot";

export const CUSTOMER_FAQS: FaqItem[] = [
  {
    question: "When is GST payable on credit (Udhaar) sales made to retail customers?",
    answer:
      "Under Section 12 of the Central Goods and Services Tax (CGST) Act, 2017, the 'Time of Supply' of goods occurs on the date of issue of the tax invoice or the date on which payment is entered in books of account, whichever is earlier. Therefore, even if a customer purchases goods on credit (Udhaar) and pays nothing upfront, the store owner is legally liable to deposit the output GST for that sale in their monthly GSTR-3B return for that tax period.",
  },
  {
    question: "What is the legal limitation period to recover unpaid retail debt in India?",
    answer:
      "Under Article 19 and Article 113 of the Limitation Act, 1961, the statutory period to institute a legal suit for recovery of unpaid money or goods sold on credit is strictly 3 (three) years from the date the debt arose. However, under Section 18 of the Limitation Act, if the debtor gives a written acknowledgment of the debt (such as a WhatsApp reply confirming the balance, a signed ledger voucher, or a partial payment), a fresh limitation period of 3 years begins from the date of that acknowledgment.",
  },
  {
    question: "Can a shopkeeper claim a GST refund if an Udhaar customer never pays (bad debt)?",
    answer:
      "Unlike some international jurisdictions, Indian GST law does not provide an automatic mechanism to reclaim output tax deposited on bad debts incurred from B2C retail customers. A seller can only issue a Credit Note under Section 34 of the CGST Act if goods are returned, deficient, or if there is an agreed post-sale discount, and such credit notes must be reported before 30th November following the end of the financial year. Pure bad debts cannot be adjusted against output GST liability.",
  },
  {
    question: "How does the 1-click WhatsApp collection reminder link operate?",
    answer:
      "When you click 'Send WhatsApp Reminder' on any customer card, SwiftGST compiles a polite, professionally formatted Hindi/English message containing the customer's name, store name, exact outstanding balance in Rupees, and a prompt for payment via UPI. It opens the official WhatsApp Web or WhatsApp mobile application directly with the pre-filled message, requiring zero manual copy-pasting.",
  },
  {
    question: "How does the loyalty points rewards engine work?",
    answer:
      "Loyalty points encourage repeat store visits and customer retention. In SwiftGST, retail bills generate loyalty points based on checkout spending (e.g., 1 point per ₹100 spent). As customers accumulate points, store cashiers can apply point credits to discount future bills or reward regular shoppers, boosting customer lifetime value.",
  },
  {
    question: "Is customer contact information and credit ledger data stored privately?",
    answer:
      "Yes. All customer profiles, mobile numbers, GST numbers, outstanding balances, settlement histories, and loyalty balances reside strictly in your browser's local IndexedDB database. SwiftGST never transmits customer directories to remote servers or shares phone numbers with marketing aggregators.",
  },
];

export function CustomersComplianceGuide() {
  return (
    <section className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 mt-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Safe Advertisement Placement */}
        <AdBannerSlot slotId="customers-top-banner" />

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-semibold text-amber-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>Digital Ledger &amp; Legal Best Practices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Manage Customer Khata &amp; Indian Retail Credit Regulations
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Record customer Udhaar, settle payments via Cash or UPI, send 1-click WhatsApp reminders,
            and understand the legal frameworks of the Limitation Act and Time of Supply under GST.
          </p>
        </div>

        {/* 1. How to use guide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1. Customer Ledger &amp; Loyalty Workflow
              </h3>
              <p className="text-xs text-slate-500">Digital ledger management for retail kiranas, boutiques, and traders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[11px]">
                  1
                </span>
                <span>Register Customer Profile</span>
              </div>
              <p className="leading-relaxed">
                Add a new customer with their Full Name, 10-digit mobile number, and optional B2B GSTIN. Once added, their profile is instantly available during checkout in the POS Counter.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[11px]">
                  2
                </span>
                <span>Record Udhaar &amp; Settle Cash</span>
              </div>
              <p className="leading-relaxed">
                When a customer takes goods on credit, selecting payment mode &quot;Khata&quot; at POS checkout automatically credits their ledger balance. Use &quot;Record Payment&quot; when they repay via Cash or UPI.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[11px]">
                  3
                </span>
                <span>1-Click WhatsApp Reminders</span>
              </div>
              <p className="leading-relaxed">
                Click &quot;WhatsApp Reminder&quot; on any debtor with an overdue balance. SwiftGST generates a polite collection notification with the exact rupee amount and store details ready to send.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Legal GST & Limitation Act Best Practices */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                2. Legal Realities: Section 12 GST Time of Supply &amp; The Limitation Act
              </h3>
              <p className="text-xs text-slate-500">Statutory debt rights and tax obligations for Indian retailers</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              In traditional Indian commerce, offering <em>Udhaar</em> (store credit) is standard practice to build lasting customer relationships.
              However, business owners must understand that under <strong>Section 12(2) of the CGST Act</strong>, your legal obligation to pay
              goods and services tax arises the moment the tax invoice or cash memo is generated. The government does not allow deferred tax payment
              merely because the customer has promised to pay next month.
            </p>
            <p>
              Furthermore, under the <strong>Limitation Act, 1963</strong>, retail debts expire after <strong>3 years</strong> from the date of the
              transaction unless the debtor formally acknowledges the balance in writing under <strong>Section 18</strong>.
              Regularly sending digital payment reminders via WhatsApp or SMS serves as verifiable evidence of ongoing communication and acknowledgment,
              protecting the store owner against unenforceable bad debt disputes.
            </p>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Credit Discipline Rule:</strong> Establish a maximum credit ceiling per customer (e.g., ₹5,000) and request weekly or monthly settlements. This maintains healthy store working capital without overextending your cash flow.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Expandable FAQ Accordion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white shadow-xs">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                3. Frequently Asked Questions (Khata &amp; Credit Ledger)
              </h3>
              <p className="text-xs text-slate-500">Udhaar recovery, loyalty points, and digital ledger accounting questions</p>
            </div>
          </div>

          <div className="pt-2">
            <FaqAccordion items={CUSTOMER_FAQS} />
          </div>
        </div>
      </div>
    </section>
  );
}
