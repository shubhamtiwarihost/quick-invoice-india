"use client";

import {
  Store,
  CheckCircle2,
  BookOpen,
  Scale,
  Receipt,
  QrCode,
  Printer,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";
import { AdBannerSlot } from "@/components/ads/AdBannerSlot";

export const POS_FAQS: FaqItem[] = [
  {
    question: "Can an Indian retail shop print 58mm or 80mm thermal slips instead of A4 invoices?",
    answer:
      "Yes. Under Rule 46 and Rule 49 of the CGST Rules, 2017, retail businesses (especially grocery, kirana, apparel, and hardware stores) are legally permitted to issue compact thermal roll receipts (58mm or 80mm roll width) for B2C consumer sales, provided the receipt contains essential statutory identifiers: the trade name, registered address, 15-digit GSTIN, unique consecutive bill serial number, date of supply, description of items, quantity, total price, tax rate slab, and total tax charged.",
  },
  {
    question: "What is the daily cash receipt ceiling under Section 269ST of the Income Tax Act?",
    answer:
      "Under Section 269ST of the Income Tax Act, 1961, no person in India can accept cash of ₹2,00,000 (Two Lakh Rupees) or more: 1) in aggregate from a single person in a single day; 2) in respect of a single transaction; or 3) in respect of transactions relating to one event or occasion. For any retail bill of ₹2,00,000 or above, digital payment modes like UPI, Net Banking, or Card must be utilized to prevent heavy penalties under Section 271DA.",
  },
  {
    question: "Is HSN code mandatory on B2C retail counter cash memos?",
    answer:
      "Per CBIC Notification No. 78/2020 - Central Tax: Indian retailers with an aggregate annual turnover up to ₹5 Crores are exempt from mandatorily printing HSN codes on retail B2C cash memos (though mentioning them is good practice for inventory reconciliation). Retailers with an annual turnover exceeding ₹5 Crores must mention a minimum 6-digit HSN code on both B2B tax invoices and B2C sales.",
  },
  {
    question: "How does SwiftGST POS function completely offline without internet?",
    answer:
      "SwiftGST leverages browser-native IndexedDB (via the high-performance 'idb' engine). Your product catalog, live stock counts, customer directory, and sales registers are stored directly on your computer or mobile device. Even during complete internet disconnection or power fluctuations, you can scan barcodes, ring up sales, calculate change, and print receipts without interruptions. No data is sent to external cloud servers.",
  },
  {
    question: "Can I issue consolidated daily invoices for small retail sales under ₹200?",
    answer:
      "Yes. Under Section 31(3)(b) of the CGST Act read with Rule 46, a registered retailer is not required to issue an individual tax invoice if: 1) the value of goods supplied is less than ₹200; 2) the recipient is an unregistered consumer; and 3) the recipient does not require an invoice. At the close of each business day, the retailer can issue a single consolidated tax invoice for all such daily micro-transactions.",
  },
  {
    question: "How should split tender (cash + UPI) be recorded for retail accounting?",
    answer:
      "Split tender occurs frequently when a customer pays part of the total bill via cash and the remainder through a UPI QR code. For accurate daily drawer balancing and bank reconciliation, retail accounting systems record the exact split breakdown. SwiftGST POS supports split mode, separating cash drawer intake from digital UPI settlements to ensure zero discrepancy during end-of-day cash reconciliation.",
  },
];

export function PosComplianceGuide() {
  return (
    <section className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 mt-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Safe Advertisement Placement */}
        <AdBannerSlot slotId="pos-top-banner" />

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-600" />
            <span>Retail Compliance &amp; Quick Operator Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Operate the POS Counter &amp; Legal Retail GST Guidelines
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Master rapid barcode billing, split tender management, thermal receipt compliance,
            and CBIC retail accounting best practices.
          </p>
        </div>

        {/* 1. How to use guide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1. Step-by-Step POS Operator Workflow
              </h3>
              <p className="text-xs text-slate-500">Fast checkout workflow designed for busy retail counters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[11px]">
                  1
                </span>
                <span>Scan or Search Items</span>
              </div>
              <p className="leading-relaxed">
                Connect any standard USB or Bluetooth handheld barcode scanner. Point and scan product packaging to auto-add items to the cart, or use the instant name/category search filter.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[11px]">
                  2
                </span>
                <span>Customer &amp; Khata</span>
              </div>
              <p className="leading-relaxed">
                Select an existing customer from the dropdown to track loyalty points and Udhaar credit, or proceed directly with a default Walk-in Customer for instant retail sales.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[11px]">
                  3
                </span>
                <span>Tender &amp; Print Receipt</span>
              </div>
              <p className="leading-relaxed">
                Choose Cash (with auto change return calculation), dynamic UPI QR, Card, or Khata credit. Click Print Receipt to trigger formatted 58mm or 80mm thermal roll printouts.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Legal GST Best Practices for Retailers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                2. Legal Framework: Rule 46 &amp; Rule 49 Retail Cash Memo Compliance
              </h3>
              <p className="text-xs text-slate-500">Statutory guidelines under Central Goods and Services Tax Act</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              In the Indian retail sector, issuing an accurate legal document at the counter is mandatory.
              Registered businesses charging standard GST (0%, 5%, 12%, 18%, 28%) must issue a <strong>Tax Invoice</strong>
              under <strong>Rule 46</strong> or a simplified retail cash memo. Composition taxpayers (under Section 10) must issue a
              <strong>Bill of Supply</strong> under <strong>Rule 49</strong> with the mandatory words <em>&quot;Composition taxable person, not eligible to collect tax on supplies&quot;</em> clearly displayed.
            </p>
            <p>
              Every printed retail receipt must maintain strict chronological continuity with a unique financial year serial numbering
              system (e.g., POS-1001). Furthermore, under <strong>Section 36 of the CGST Act</strong>, every registered retailer must maintain
              sales registers, physical stock verification records, and tax calculation sheets for a minimum period of <strong>72 months (6 years)</strong> from the due date of furnishing of annual returns.
            </p>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Cash Handling Caution (Section 269ST):</strong> Never accept cash payments of ₹2,00,000 or above for any single transaction or day. Always insist on UPI, debit card, or RTGS to prevent severe 100% equivalent monetary penalties under Section 271DA.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Expandable FAQ Accordion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                3. Frequently Asked Questions (Retail POS &amp; Billing)
              </h3>
              <p className="text-xs text-slate-500">Legal, operational, and hardware answers for store owners</p>
            </div>
          </div>

          <div className="pt-2">
            <FaqAccordion items={POS_FAQS} />
          </div>
        </div>
      </div>
    </section>
  );
}
