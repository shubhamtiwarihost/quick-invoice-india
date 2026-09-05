"use client";

import {
  Package,
  BookOpen,
  Scale,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";
import { AdBannerSlot } from "@/components/ads/AdBannerSlot";

export const INVENTORY_FAQS: FaqItem[] = [
  {
    question: "What happens to GST Input Tax Credit (ITC) if stock is damaged, expired, or stolen?",
    answer:
      "Under Section 17(5)(h) of the Central Goods and Services Tax (CGST) Act, 2017, Input Tax Credit (ITC) is strictly blocked and cannot be availed on goods that are lost, stolen, destroyed, written off, or disposed of by way of gift or free samples. If you have previously claimed ITC on such goods when purchasing them from your distributor, you are legally required to reverse that ITC in your monthly GSTR-3B return along with applicable interest.",
  },
  {
    question: "Is physical stock verification legally mandatory for GST-registered businesses?",
    answer:
      "Yes. Under Section 35(1)(b) of the CGST Act read with Rule 56 of the CGST Rules, 2017, every registered person is legally mandated to maintain a true and correct account of the opening balance, receipt, supply, goods lost, stolen, destroyed, written off, and the closing balance of stock. During GST audit or department inspection under Section 65/71, unexplained discrepancies between physical inventory and book stock can be treated as unaccounted sales liable to tax and penalty under Section 122.",
  },
  {
    question: "How do I calculate true gross profit margins when prices include GST?",
    answer:
      "To calculate true gross profit, compare base prices excluding GST. For example, if an item is bought for ₹118 (including 18% GST of ₹18) and sold for ₹150 (including 18% GST of ₹22.88), the net purchase cost is ₹100 and the net sale price is ₹127.12. The true gross profit is ₹27.12 (a 21.3% net margin). The GST collected (₹22.88) minus the ITC paid (₹18) is ₹4.88, which is remitted to the government and does not impact your actual operating margin.",
  },
  {
    question: "What are the columns required for bulk CSV product catalog uploads?",
    answer:
      "The SwiftGST bulk CSV importer accepts standard tabular columns: 'Name' (Product Title), 'Category' (e.g., Grocery, Beverages, Apparel), 'Barcode' (UPC, EAN-13, or custom SKU), 'HSN' (4 to 8 digit code), 'Cost Price' (Purchase cost in INR), 'Sale Price' (Selling retail price), 'GST Rate' (0, 5, 12, 18, 28), 'Stock' (Current in-hand units), and 'Min Stock' (Low-inventory reorder alert threshold).",
  },
  {
    question: "How does the low-stock alert threshold work?",
    answer:
      "Each product in the inventory master allows you to define a 'Min Stock' threshold (e.g., 5 units). Whenever sales made through the POS Counter reduce an item's remaining inventory to or below that threshold, the system automatically flags the item with an amber or red warning badge. This alerts store managers to reorder from suppliers before suffering out-of-stock lost sales.",
  },
  {
    question: "Is inventory data stored securely without cloud exposure?",
    answer:
      "Yes. All product records, cost prices, stock counts, and barcode mappings are stored client-side in your web browser using HTML5 IndexedDB storage. No product catalogs or sensitive supplier cost data are uploaded to third-party cloud servers or shared externally.",
  },
];

export function InventoryComplianceGuide() {
  return (
    <section className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 mt-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Safe Advertisement Placement */}
        <AdBannerSlot slotId="inventory-top-banner" />

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold text-blue-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span>Stock Master &amp; Statutory Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Manage Store Inventory &amp; GST Input Tax Credit (ITC) Rules
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Maintain accurate product catalogs, track profit margins, adhere to Section 17(5) stock write-off rules,
            and ensure seamless audit-ready inventory records.
          </p>
        </div>

        {/* 1. How to use guide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1. Product Master &amp; Stock Control Workflow
              </h3>
              <p className="text-xs text-slate-500">Optimizing inventory control for retail and wholesale stores</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[11px]">
                  1
                </span>
                <span>Add &amp; Map Products</span>
              </div>
              <p className="leading-relaxed">
                Click &quot;Add Product&quot; to enter item name, selling price, purchase cost, HSN code, and assigned GST tax slab (0%, 5%, 12%, 18%, 28%). Enter or scan barcode numbers for instant POS lookup.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[11px]">
                  2
                </span>
                <span>Set Low-Stock Triggers</span>
              </div>
              <p className="leading-relaxed">
                Define a minimum safety stock count for each SKU. When item quantities fall below this number, the product row displays a prominent low-stock badge so you can place timely purchase orders.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[11px]">
                  3
                </span>
                <span>Bulk CSV Import &amp; Export</span>
              </div>
              <p className="leading-relaxed">
                Manage thousands of items with ease. Download our standardized CSV template, populate product details in Excel or Google Sheets, and import your entire store catalog in one click.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Legal GST & ITC Rules for Stock Management */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                2. Statutory Compliance: Section 35 Records &amp; Section 17(5) Reversals
              </h3>
              <p className="text-xs text-slate-500">Legal maintenance of stock registers under Indian tax regulations</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Under <strong>Section 35 of the CGST Act, 2017</strong>, maintaining an accurate, date-wise stock register
              is a primary legal obligation for all registered taxpayers in India. The stock register must document opening balances,
              goods received through inward tax invoices, sales through outward cash memos, and the verifiable closing balance.
            </p>
            <p>
              Store operators must exercise strict diligence when writing off damaged, expired, or unsaleable products. Under
              <strong>Section 17(5)(h)</strong>, any goods that are destroyed, lost, written off, or distributed as free gifts become
              ineligible for Input Tax Credit. If ITC was claimed at the time of purchase, it must be proactively reversed in
              <strong>Table 4(B)(2) of Form GSTR-3B</strong> for that tax period to avoid interest and penalty under Section 50 and 73.
            </p>
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>HSN Mandate Compliance:</strong> Ensure all products carry verified 4-digit or 6-digit HSN codes per Notification No. 78/2020. Accurate HSN mapping guarantees seamless GSTR-1 Table 12 reporting during monthly or quarterly tax filings.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Expandable FAQ Accordion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                3. Frequently Asked Questions (Inventory &amp; Stock)
              </h3>
              <p className="text-xs text-slate-500">Stock maintenance, barcode mapping, and ITC accounting clarifications</p>
            </div>
          </div>

          <div className="pt-2">
            <FaqAccordion items={INVENTORY_FAQS} />
          </div>
        </div>
      </div>
    </section>
  );
}
