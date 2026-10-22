import {
  CheckCircle2,
  Scale,
  BookOpen,
  Landmark,
  FileCheck2,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const HOME_FAQS: FaqItem[] = [
  {
    question: "What are the 16 mandatory particulars required on a GST Tax Invoice under Rule 46?",
    answer:
      "Under Rule 46 of the Central Goods and Services Tax (CGST) Rules, 2017, a valid tax invoice must contain: 1) Supplier name, address, and GSTIN; 2) Consecutive serial number (unique for the financial year, max 16 characters); 3) Date of issue; 4) Recipient name, address, and GSTIN (if registered); 5) Recipient address & state code for unregistered buyers if value exceeds ₹50,000; 6) 4 or 6-digit HSN/SAC code; 7) Description of goods/services; 8) Quantity and unit; 9) Total value; 10) Taxable value after discounts; 11) Tax rates (CGST, SGST, IGST); 12) Exact tax amount charged; 13) Place of supply with state name and 2-digit code; 14) Delivery address if different from billing; 15) Reverse charge indicator (RCM); and 16) Physical or digital signature of the authorized signatory.",
  },
  {
    question: "How do I know whether to charge CGST + SGST or IGST?",
    answer:
      "The tax head depends entirely on the location of the supplier and the Place of Supply (POS) under the IGST Act, 2017. If your business state and the buyer's place of supply are in the same Indian State or Union Territory, it is an Intra-State supply requiring equal halves of Central GST (CGST) and State GST (SGST). If the supplier and place of supply are in different states, it is an Inter-State supply requiring Integrated GST (IGST). SwiftGST automatically detects and splits this based on the buyer's 2-digit GSTIN state code.",
  },
  {
    question: "What is the legal deadline for issuing a GST Tax Invoice under Section 31?",
    answer:
      "Under Section 31(1) of the CGST Act, for supply of goods, the invoice must be issued before or at the time of removal of goods for delivery (or when goods are made available to the recipient). Under Section 31(2), for supply of services, the invoice must be issued within 30 days from the date of the provision of service (or 45 days for insurers, banking companies, and financial institutions).",
  },
  {
    question: "What is the difference between a Tax Invoice and a Bill of Supply?",
    answer:
      "A 'Tax Invoice' is issued by regular GST-registered taxpayers charging CGST, SGST, or IGST, which enables business buyers to claim Input Tax Credit (ITC). A 'Bill of Supply' is issued under Section 31(3)(c) by businesses dealing in exempt goods/services or those registered under the Composition Scheme (Section 10), where no GST can be collected from customers and no ITC can be claimed.",
  },
  {
    question: "What are the current HSN / SAC code reporting mandates for Indian businesses?",
    answer:
      "Per Notification No. 78/2020 - Central Tax: Businesses with aggregate annual turnover up to ₹5 Crores in the preceding financial year must mention minimum 4-digit HSN/SAC codes on B2B tax invoices (optional for B2C). Businesses with aggregate annual turnover above ₹5 Crores must mention minimum 6-digit HSN/SAC codes on all B2B and B2C tax invoices.",
  },
  {
    question: "Can I embed a dynamic UPI Payment QR Code directly on my invoice?",
    answer:
      "Yes. Under Rule 46(q) and dynamic QR mandates, printing an interoperable UPI payment QR code allows clients to instantly pay the invoice using GPay, PhonePe, Paytm, or BHIM. SwiftGST dynamically encodes your UPI VPA, business name, invoice number, and exact rupee total into an instant scan-to-pay QR on the exported PDF.",
  },
  {
    question: "What are the rules for invoice serial numbering in a financial year?",
    answer:
      "Rule 46(b) mandates that invoice serial numbers must be consecutive, containing only alphabets, numerals, and special characters (hyphen '-' and slash '/'). It must not exceed 16 characters and must be strictly unique for each financial year (e.g., INV/2026-27/001).",
  },
  {
    question: "Are invoices generated on SwiftGST legally valid for commercial use in India?",
    answer:
      "Yes. Invoices created using SwiftGST contain all 16 mandatory particulars required under Rule 46 of the CGST Rules, 2017. Once printed or digitally signed by your authorized representative, they serve as valid legal commercial documents for accounting, client billing, bank verification, and Input Tax Credit claims.",
  },
];

export function HomeComplianceGuide() {
  return (
    <section className="w-full bg-white py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-600" />
            <span>Statutory Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Legal Guide to GST Invoicing in India
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Understanding Section 31 of the CGST Act 2017, Rule 46 particulars, Place of Supply rules,
            and compliance best practices for Indian SMBs, freelancers, and enterprises.
          </p>
        </div>

        {/* 1. The Legal Framework: Section 31 & Rule 46 */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Statutory Foundations: Section 31 of CGST Act, 2017
              </h3>
              <p className="text-xs text-slate-500">The legal mandate governing tax invoices in India</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              In the Indian Goods and Services Tax ecosystem, a <strong>Tax Invoice</strong> is not merely an accounting request for payment;
              it is a primary statutory document required under <strong>Section 31 of the Central Goods and Services Tax (CGST) Act, 2017</strong>.
              It acts as legal evidence of the transfer of goods or services and serves as the exclusive evidentiary foundation upon which
              registered buyers claim <strong>Input Tax Credit (ITC)</strong> under Section 16.
            </p>
            <p>
              Under Indian tax law, failing to issue an invoice with the prescribed statutory particulars or issuing an improper invoice
              can attract penalties up to ₹10,000 or the tax amount involved (whichever is higher) under <strong>Section 122 of the CGST Act</strong>.
              SwiftGST was engineered from the ground up to ensure 100% adherence to every field mandated by the GST Council.
            </p>
          </div>
        </div>

        {/* 2. The 16 Mandatory Particulars Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. The 16 Mandatory Particulars Under Rule 46 Checklist
              </h3>
              <p className="text-xs text-slate-500">Every valid Indian GST tax invoice must include these sixteen items</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
            {[
              { num: "01", title: "Supplier Name, Address & GSTIN", desc: "Legal entity name, trade name, physical address, and 15-digit GST identification number." },
              { num: "02", title: "Consecutive Serial Number", desc: "Unique alphanumeric serial number not exceeding 16 characters, continuous for the fiscal year." },
              { num: "03", title: "Date of Invoice Issuance", desc: "Exact calendar date when the bill is issued to the recipient." },
              { num: "04", title: "Recipient Particulars (B2B)", desc: "Name, registered billing address, and GSTIN/UIN of the recipient (if registered)." },
              { num: "05", title: "Unregistered Buyer Address (B2C)", desc: "Mandatory name, delivery address, and state code if taxable invoice value exceeds ₹50,000." },
              { num: "06", title: "HSN / SAC Code", desc: "Harmonized System Nomenclature code (goods) or Service Accounting Code (services)." },
              { num: "07", title: "Description of Goods or Services", desc: "Clear, unambiguous breakdown of goods supplied or scope of service rendered." },
              { num: "08", title: "Quantity & Unit of Measurement (UOM)", desc: "Count, metric volume, hours, meters, kilograms, or pieces." },
              { num: "09", title: "Total Value of Supply", desc: "Gross commercial price before discounts and trade rebates." },
              { num: "10", title: "Taxable Value of Supply", desc: "Net assessable base value upon which GST rates are mathematically applied." },
              { num: "11", title: "Applicable Tax Slabs", desc: "Clear identification of CGST, SGST, IGST, or Cess percentages (0%, 5%, 18% or 40%)." },
              { num: "12", title: "Tax Amount Charged", desc: "Exact rupee amount of central tax, state tax, and integrated tax charged." },
              { num: "13", title: "Place of Supply & State Code", desc: "Destination state name and 2-digit GST state code under the IGST Act." },
              { num: "14", title: "Delivery Destination Address", desc: "Explicit consignee address if different from the primary billing address." },
              { num: "15", title: "Reverse Charge Indicator (RCM)", desc: "Prominent statement indicating whether tax is payable on reverse charge basis." },
              { num: "16", title: "Authorized Signature", desc: "Physical hand signature or authorized digital electronic signature (DSC)." },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-700 text-[11px] font-bold text-white font-mono">
                  {item.num}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-500 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Tax Determination: Intra-State vs Inter-State Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Tax Splitting Rules: Intra-State vs Inter-State Supply
              </h3>
              <p className="text-xs text-slate-500">How the Place of Supply (POS) determines tax liability</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              The GST structure in India operates on a dual taxation model governed by the <strong>Integrated Goods and Services Tax (IGST) Act, 2017</strong>.
              Determining whether an invoice should charge <strong>CGST + SGST</strong> or <strong>IGST</strong> depends on the relationship
              between the <em>Location of the Supplier</em> and the <em>Place of Supply</em>:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="rounded-xl border border-teal-200 bg-white p-4 shadow-2xs">
                <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800 border border-teal-200 mb-2">
                  Intra-State Supply (Same State)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When the supplier location and the Place of Supply are in the same State or Union Territory.
                  The tax rate is bifurcated 50:50 into <strong>Central GST (CGST)</strong> and <strong>State GST (SGST)</strong> (or UTGST).
                  Example: 18% GST splits into 9% CGST + 9% SGST.
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-2xs">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800 border border-blue-200 mb-2">
                  Inter-State Supply (Different States)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When the supplier location and the Place of Supply are in different States, or involves SEZ units / export transactions.
                  The full tax rate is collected as <strong>Integrated GST (IGST)</strong> and remitted to the Central Government for revenue sharing.
                  Example: An 18% rate applies in full as 18% IGST.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. GSTR-1 Reporting & Reconciliation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-700 shadow-2xs">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                4. GSTR-1 Return Filing &amp; Invoice Matching
              </h3>
              <p className="text-xs text-slate-500">How invoices flow into your buyer&apos;s GSTR-2B</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Every outward tax invoice generated must be reported in <strong>Form GSTR-1</strong> by the 11th of the following month
              (or 13th for quarterly IFF filers under the QRMP scheme). Once reported:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li><strong>B2B Invoices (Table 4A):</strong> Invoices with the buyer&apos;s GSTIN populate Table 4A, auto-reflecting in the buyer&apos;s GSTR-2B for instant Input Tax Credit claiming.</li>
              <li><strong>B2C Large (Table 5A):</strong> Inter-state supplies to unregistered persons where the invoice value exceeds ₹2.5 Lakhs must be reported invoice-wise.</li>
              <li><strong>B2C Small (Table 7):</strong> All other retail cash memos and unregistered intra-state supplies are reported as state-wise consolidated summaries.</li>
            </ul>
            <p>
              With SwiftGST, you can export your entire batch of invoices directly to a <strong>CBIC-formatted GSTR-1 CSV file</strong> with one click,
              eliminating manual data entry errors.
            </p>
          </div>
        </div>

        {/* 5. FAQ Section */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 mt-1">Official answers to common GST invoicing and compliance questions</p>
          </div>
          <FaqAccordion items={HOME_FAQS} />
        </div>
      </div>
    </section>
  );
}
