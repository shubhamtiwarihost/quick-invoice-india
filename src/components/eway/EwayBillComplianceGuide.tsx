import Link from "next/link";
import {
  BookOpen,
  Truck,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const EWAY_FAQS: FaqItem[] = [
  {
    question: "What is an E-Way Bill and when is it legally mandatory?",
    answer:
      "An Electronic Way Bill (E-Way Bill) is a statutory document generated on the ewaybillgst.gov.in portal under Rule 138 of the CGST Rules, 2017. It is mandatory for any commercial movement of physical goods where the total consignment value (including taxes) exceeds ₹50,000 for inter-state transit, or exceeds state-specific limits (₹50,000 to ₹1,00,000) for intra-state transit.",
  },
  {
    question: "What is the validity period of an E-Way Bill?",
    answer:
      "Validity is distance-dependent: For Regular Cargo, an E-Way Bill is valid for 1 day for every 200 km (or part thereof). For Over Dimensional Cargo (ODC) or multimodal shipments involving sea transport, validity is 1 day for every 20 km. Transporters can extend validity within 8 hours before or after expiry if transit is delayed due to natural calamity or breakdown.",
  },
  {
    question: "What is the difference between Part-A and Part-B of an E-Way Bill?",
    answer:
      "Part-A contains transaction details: GSTIN of supplier and recipient, Place of Delivery (PIN code), Invoice/Challan Number and Date, Value of Goods, HSN code, and reason for transport. Part-B contains conveyance details: Transporter Document Number (RR/LR/Airway Bill) and Vehicle Registration Number. An E-Way Bill is only valid for transit once Part-B is completed.",
  },
  {
    question: "What are the penalties under Section 129 for transporting goods without an E-Way Bill?",
    answer:
      "Transporting consignments without an active E-Way Bill leads to intercept, detention, and seizure of the vehicle and goods under Section 129 of the CGST Act. The owner must pay a penalty equal to 200% of the tax payable on taxable goods before release. For tax-exempt goods, the penalty is 2% of the value of goods or ₹25,000, whichever is lower.",
  },
  {
    question: "Are services subject to E-Way Bill generation?",
    answer:
      "No. Rule 138 applies exclusively to the physical movement of tangible goods. Invoicing for intangible services (e.g. software development, marketing, consulting, AMC contracts) is 100% exempt from E-Way Bill provisions, regardless of the invoice value.",
  },
  {
    question: "Which Indian states have a higher intra-state E-Way Bill limit of ₹1,00,000?",
    answer:
      "Several high-volume commercial states have issued official notifications raising the intra-state consignment threshold from ₹50,000 to ₹1,00,000. These states include Maharashtra, Delhi, West Bengal, Bihar, Tamil Nadu, Jharkhand, and Rajasthan (for intra-city/intra-state movements of non-notified goods).",
  },
];

export function EwayBillComplianceGuide() {
  return (
    <section className="mt-14 border-t border-slate-200 bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 rounded-3xl">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-teal-700" />
            <span>Rule 138 Transport Regulations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive E-Way Bill Compliance &amp; Rule 138 Guide
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Understand statutory thresholds, distance-based validity calculations, Part-A vs Part-B requirements,
            and severe Section 129 transit penalties.
          </p>
        </div>

        {/* 1. Threshold Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Statutory Threshold Limits (Inter-State vs Intra-State)
              </h3>
              <p className="text-xs text-slate-500">
                Determining mandatory e-way bill generation triggers
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <span className="font-bold text-slate-900 text-sm block">Inter-State Transit (All India)</span>
              <div className="font-mono text-xl font-bold text-teal-700">₹50,000 Threshold</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When goods cross any state border (e.g., Gujarat to Maharashtra), an E-Way Bill is mandatory if the invoice consignment value (including IGST and cess) exceeds ₹50,000. No state has the power to dilute this central threshold.
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-5 space-y-3">
              <span className="font-bold text-teal-950 text-sm block">Intra-State Transit (State Relaxations)</span>
              <div className="font-mono text-xl font-bold text-teal-800">₹50,000 or ₹1,00,000</div>
              <p className="text-xs text-teal-900/90 leading-relaxed">
                While the default Central limit is ₹50,000, key states (including <strong>Maharashtra, Delhi, West Bengal, Bihar, Tamil Nadu, and Rajasthan</strong>) have issued special notifications raising the intra-state threshold to <strong>₹1,00,000</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Validity Rules */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Distance-Based E-Way Bill Validity Schedule
              </h3>
              <p className="text-xs text-slate-500">
                How transit duration is calculated under amended CGST rules
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Standard Commercial Cargo</h4>
              <p className="font-mono text-sm font-bold text-teal-700">1 Day per 200 km</p>
              <p className="text-slate-600 text-xs leading-relaxed">
                For everyday road transport in normal trucks and carriers. For example, a 750 km journey receives 4 calendar days of legal validity (200 + 200 + 200 + 150 km).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Over Dimensional Cargo (ODC)</h4>
              <p className="font-mono text-sm font-bold text-teal-700">1 Day per 20 km</p>
              <p className="text-slate-600 text-xs leading-relaxed">
                For oversized heavy machinery carriers or multimodal journeys where at least one leg involves sea transit. A 100 km haul receives 5 calendar days.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Detention & Penalty Risks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Road Interception &amp; Section 129 Penalties
              </h3>
              <p className="text-xs text-slate-500">
                Statutory consequences of transporting without an active E-Way Bill
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <h4 className="font-bold text-amber-950">200% Tax Penalty (Section 129(1)(a))</h4>
              <p className="text-amber-900/90 text-xs leading-relaxed">
                If intercepted without a valid E-Way Bill or with an expired document, goods are detained. The transporter or owner must pay a mandatory penalty equal to <strong>200% of the tax payable</strong> to obtain provisional release.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Confiscation under Section 130</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                If the penalty is not discharged within 14 days of detention, authorities initiate confiscation proceedings and auction of both the consignment and the transport vehicle.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion CTA */}
        <div className="rounded-2xl border border-teal-200 bg-linear-to-r from-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Generate compliant GST invoices for transport</h3>
            <p className="mt-1 text-xs text-teal-200 max-w-xl">
              Create professional, audit-proof tax invoices with accurate HSN codes, Place of Supply, and CGST/SGST/IGST tax breakdowns in seconds.
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
            <h3 className="text-xl font-bold text-slate-900">E-Way Bill FAQs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Authoritative guidance on Rule 138 rules and transport compliance in India
            </p>
          </div>
          <FaqAccordion items={EWAY_FAQS} />
        </div>
      </div>
    </section>
  );
}
