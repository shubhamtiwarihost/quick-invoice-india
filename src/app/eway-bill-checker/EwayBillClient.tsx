"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  Package,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { INDIAN_STATES, getStateByCode } from "@/lib/indianStates";
import { formatCurrency } from "@/lib/format";

// States with ₹1,00,000 intra-state threshold
const HIGH_LIMIT_STATES: Record<string, string> = {
  "27": "Maharashtra",
  "07": "Delhi",
  "19": "West Bengal",
  "10": "Bihar",
  "33": "Tamil Nadu",
  "20": "Jharkhand",
  "08": "Rajasthan",
};

export default function EwayBillClient() {
  const [originCode, setOriginCode] = useState("27"); // Maharashtra
  const [destCode, setDestCode] = useState("27");
  const [movementType, setMovementType] = useState<"goods" | "services">("goods");
  const [consignmentValue, setConsignmentValue] = useState<number>(65000);

  const evaluation = useMemo(() => {
    const origin = getStateByCode(originCode);
    const dest = getStateByCode(destCode);
    const isInterState = originCode !== destCode;

    if (movementType === "services") {
      return {
        isRequired: false,
        isExempt: true,
        reason: "Services are completely exempt from E-Way Bill provisions under GST Rule 138.",
        threshold: 0,
        isInterState,
        origin,
        dest,
      };
    }

    // Goods movement
    let threshold = 50000;
    let thresholdLabel = "₹50,000 (Standard Central GST threshold)";

    if (!isInterState) {
      // Intra-state
      if (HIGH_LIMIT_STATES[originCode]) {
        threshold = 100000;
        thresholdLabel = `₹1,00,000 (State exemption notification for ${origin?.name || "State"})`;
      }
    } else {
      threshold = 50000;
      thresholdLabel = "₹50,000 (Mandatory Inter-State threshold across India)";
    }

    const isRequired = consignmentValue > threshold;

    return {
      isRequired,
      isExempt: !isRequired,
      threshold,
      thresholdLabel,
      isInterState,
      origin,
      dest,
      reason: isRequired
        ? `Consignment value of ${formatCurrency(consignmentValue)} exceeds the ${isInterState ? "inter-state" : "intra-state"} limit of ${formatCurrency(threshold)}.`
        : `Consignment value of ${formatCurrency(consignmentValue)} is within the exempt threshold limit of ${formatCurrency(threshold)}.`,
    };
  }, [originCode, destCode, movementType, consignmentValue]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          <Truck className="h-3.5 w-3.5" />
          Rule 138 GST Compliance
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          E-Way Bill Rule & Exemption Checker
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Verify whether your shipment requires an electronic waybill based on consignment value and state thresholds.
        </p>
      </div>

      {/* Main Form */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Movement Type */}
          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              Supply Type
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMovementType("goods")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                  movementType === "goods"
                    ? "border-teal-600 bg-teal-50/50 text-teal-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Package className="h-4 w-4" />
                Physical Goods
              </button>
              <button
                type="button"
                onClick={() => setMovementType("services")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                  movementType === "services"
                    ? "border-teal-600 bg-teal-50/50 text-teal-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileText className="h-4 w-4" />
                Services (Always Exempt)
              </button>
            </div>
          </div>

          {/* Origin State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Origin (Dispatch State)
            </label>
            <select
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Destination (Delivery State)
            </label>
            <select
              value={destCode}
              onChange={(e) => setDestCode(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Consignment Value */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">
              Total Invoice / Consignment Value (including GST)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-3 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min={0}
                value={consignmentValue || ""}
                onChange={(e) => setConsignmentValue(Number(e.target.value) || 0)}
                placeholder="e.g. 65000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-2.5 font-mono text-base font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20"
              />
            </div>
            <span className="mt-1.5 block text-[11px] text-slate-400">
              Consignment value includes Taxable Value + CGST/SGST/IGST + Cess.
            </span>
          </div>
        </div>
      </div>

      {/* Verdict Card */}
      <div
        className={`mt-6 rounded-2xl border p-6 ${
          evaluation.isRequired
            ? "border-amber-300 bg-amber-50/70 text-amber-950"
            : "border-emerald-200 bg-emerald-50/70 text-emerald-950"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              evaluation.isRequired
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {evaluation.isRequired ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <CheckCircle2 className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">
                {evaluation.isRequired
                  ? "E-Way Bill Generation is Mandatory"
                  : "Exempt from E-Way Bill Generation"}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  evaluation.isRequired
                    ? "bg-amber-200/80 text-amber-900"
                    : "bg-emerald-200/80 text-emerald-900"
                }`}
              >
                {evaluation.isInterState ? "Inter-State Movement" : "Intra-State Movement"}
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed opacity-90">
              {evaluation.reason}
            </p>

            {/* Threshold & Rule Details */}
            {movementType === "goods" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-xl bg-white/80 p-3.5 text-xs text-slate-800 border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block">Applicable Limit:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(evaluation.threshold)}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {evaluation.thresholdLabel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Route Classification:</span>
                  <span className="font-semibold text-slate-900">
                    {evaluation.origin?.name} → {evaluation.dest?.name}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {evaluation.isInterState ? "IGST applies" : "CGST + SGST applies"}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mandatory Documents & Compliance Guide */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
            <FileCheck2 className="h-4 w-4 text-teal-700" />
            <h3>Required Shipping Documents</h3>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-600 list-disc list-inside">
            <li><strong>Tax Invoice / Bill of Supply</strong>: Original invoice accompanying vehicle.</li>
            <li><strong>E-Way Bill Printout or EWB Number</strong>: 12-digit number for physical verification.</li>
            <li><strong>Transporter ID & Vehicle Reg No</strong>: In Part-B of E-Way Bill for transport over 50 km.</li>
            <li><strong>Delivery Challan</strong>: For job work, exhibitions, or goods sent for approval.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <h3>Common Statutory Exemptions</h3>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-600 list-disc list-inside">
            <li><strong>Services</strong>: Rule 138 applies exclusively to movable goods.</li>
            <li><strong>Exempted Goods</strong>: Fresh agricultural produce, milk, vegetables, LPG.</li>
            <li><strong>Non-motorized Conveyance</strong>: Hand carts or manual transport.</li>
            <li><strong>Port to CFS/ICD</strong>: Movement under customs supervision.</li>
          </ul>
        </div>
      </div>

      {/* Quick CTA */}
      <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Generate compliant GST invoices</h3>
          <p className="mt-1 text-xs text-slate-300">
            Create clean, print-ready GST invoices with auto-calculated taxes and QR codes in seconds.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 shadow-xs"
        >
          Create Invoice Now
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
