"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";

type BusinessType = "trader" | "manufacturer" | "restaurant" | "services";

const BUSINESS_CONFIGS: Record<
  BusinessType,
  { label: string; rate: number; limit: number; desc: string }
> = {
  trader: {
    label: "Trader (Goods)",
    rate: 1, // 1% (0.5% CGST + 0.5% SGST)
    limit: 15000000, // 1.5 Cr
    desc: "1% flat on turnover of taxable goods (Turnover limit: ₹1.5 Cr)",
  },
  manufacturer: {
    label: "Manufacturer",
    rate: 1, // 1%
    limit: 15000000, // 1.5 Cr
    desc: "1% flat on total turnover (Turnover limit: ₹1.5 Cr)",
  },
  restaurant: {
    label: "Restaurant (Non-alcoholic)",
    rate: 5, // 5%
    limit: 15000000, // 1.5 Cr
    desc: "5% flat on turnover (Turnover limit: ₹1.5 Cr)",
  },
  services: {
    label: "Service Provider (Sec 10(2A))",
    rate: 6, // 6%
    limit: 5000000, // 50 Lakhs
    desc: "6% flat on turnover (Turnover limit: ₹50 Lakhs)",
  },
};

export default function CompositionClient({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [turnover, setTurnover] = useState<number>(4000000); // 40 Lakhs default
  const [businessType, setBusinessType] = useState<BusinessType>("trader");
  const [regularGstRate, setRegularGstRate] = useState<number>(18);
  const [purchases, setPurchases] = useState<number>(2000000); // 20 Lakhs purchases
  const [purchaseGstRate, setPurchaseGstRate] = useState<number>(18);
  const complianceCostAnnual = 36000; // CA / accountant fees average estimate

  const calculation = useMemo(() => {
    const config = BUSINESS_CONFIGS[businessType];
    const isEligible = turnover <= config.limit;

    // Composition Scheme Computations
    const compositionTaxRate = config.rate;
    const compositionTaxPayable = (turnover * compositionTaxRate) / 100;
    const compositionItcClaimed = 0; // No ITC in composition
    const compositionComplianceEstimated = 12000; // Simplified quarterly filing CMP-08
    const compositionTotalCost = compositionTaxPayable + compositionComplianceEstimated;

    // Regular Scheme Computations
    const regularOutputTax = (turnover * regularGstRate) / 100;
    const regularItcAvailable = (purchases * purchaseGstRate) / 100;
    const regularNetTaxPayable = Math.max(regularOutputTax - regularItcAvailable, 0);
    const regularComplianceEstimated = complianceCostAnnual;
    const regularTotalCost = regularNetTaxPayable + regularComplianceEstimated;

    // Difference in Net Outflow (from dealer's pocket)
    // Note: Under Regular scheme, output tax is collected from buyer (if B2B),
    // whereas under Composition, tax is paid out of dealer's own margin without collecting from buyer.
    const difference = regularTotalCost - compositionTotalCost;

    return {
      isEligible,
      config,
      compositionTaxRate,
      compositionTaxPayable,
      compositionItcClaimed,
      compositionComplianceEstimated,
      compositionTotalCost,
      regularOutputTax,
      regularItcAvailable,
      regularNetTaxPayable,
      regularComplianceEstimated,
      regularTotalCost,
      difference,
    };
  }, [turnover, businessType, regularGstRate, purchases, purchaseGstRate, complianceCostAnnual]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          <Scale className="h-3.5 w-3.5" />
          Section 10 GST Scheme Analysis
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Composition Scheme vs Regular GST Calculator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Compare flat-rate Composition Scheme against Regular GST with Input Tax Credit (ITC) to optimize cash flow and compliance overhead.
        </p>
      </div>

      {/* Main Inputs Card */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Business Type */}
          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              Business Category
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(BUSINESS_CONFIGS) as BusinessType[]).map((key) => {
                const b = BUSINESS_CONFIGS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBusinessType(key)}
                    className={`rounded-xl border p-3 text-left transition ${
                      businessType === key
                        ? "border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-900">
                      {b.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-teal-700 font-semibold">
                      {b.rate}% Flat Tax
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {calculation.config.desc}
            </p>
          </div>

          {/* Annual Turnover */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Annual Expected Turnover (₹)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                value={turnover || ""}
                onChange={(e) => setTurnover(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-2 font-mono text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Regular Output GST Rate */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Applicable Output GST Rate under Regular Scheme
            </label>
            <select
              value={regularGstRate}
              onChange={(e) => setRegularGstRate(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
            >
              <option value={5}>5% (Basic goods / restaurants)</option>
              <option value={12}>12% (Processed foods / business items)</option>
              <option value={18}>18% (Standard services / manufacturing)</option>
              <option value={28}>28% (Luxury / automobiles)</option>
            </select>
          </div>

          {/* Annual Purchases */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Annual B2B Purchases / Inward Supplies (₹)
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                value={purchases || ""}
                onChange={(e) => setPurchases(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-2 font-mono text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Purchase ITC Rate */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Average GST Rate on Inward Purchases
            </label>
            <select
              value={purchaseGstRate}
              onChange={(e) => setPurchaseGstRate(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
            >
              <option value={5}>5% Inward Rate</option>
              <option value={12}>12% Inward Rate</option>
              <option value={18}>18% Inward Rate</option>
              <option value={28}>28% Inward Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Eligibility Warning */}
      {!calculation.isEligible ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p>
            <strong>Turnover exceeds eligibility threshold:</strong> Turnover of {formatCurrency(turnover)} exceeds the statutory limit of {formatCurrency(calculation.config.limit)} for {calculation.config.label}. You must register under the <strong>Regular GST Scheme</strong>.
          </p>
        </div>
      ) : null}

      {/* Side-by-Side Comparison */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Composition Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              Option A · Simplified
            </span>
            <span className="font-mono text-xs font-bold text-slate-900">
              {calculation.compositionTaxRate}% Flat Rate
            </span>
          </div>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Composition Scheme
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Ideal for B2C retailers, small restaurants, and local service providers.
          </p>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Gross Turnover:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(turnover)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Flat Tax Rate:</span>
              <span className="font-semibold text-teal-700">{calculation.compositionTaxRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Net Tax Payable:</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(calculation.compositionTaxPayable)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Input Tax Credit (ITC):</span>
              <span className="text-slate-400">₹0 (Not Permitted)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Est. Annual Compliance / CA Fee:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(calculation.compositionComplianceEstimated)}
              </span>
            </div>
          </div>

          {/* Pros/Cons List */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Only quarterly payment (CMP-08) & 1 annual return (GSTR-4)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>No requirement to maintain granular HSN book-keeping</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <X className="h-4 w-4 text-red-500 shrink-0" />
              <span>Cannot issue Tax Invoices (Cannot pass GST credit to B2B buyers)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <X className="h-4 w-4 text-red-500 shrink-0" />
              <span>Cannot make inter-state outward supplies of goods</span>
            </div>
          </div>
        </div>

        {/* Regular Scheme Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Option B · Standard
            </span>
            <span className="font-mono text-xs font-bold text-slate-900">
              {regularGstRate}% Output Tax
            </span>
          </div>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Regular GST Scheme
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Mandatory for inter-state sellers, e-commerce, and heavy B2B suppliers.
          </p>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Output Tax Collected ({regularGstRate}%):</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(calculation.regularOutputTax)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Less: Input Tax Credit (ITC Claim):</span>
              <span className="font-semibold text-emerald-600">
                -{formatCurrency(calculation.regularItcAvailable)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Net Tax Payable to Government:</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(calculation.regularNetTaxPayable)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Est. Annual Compliance / CA Fee:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(calculation.regularComplianceEstimated)}
              </span>
            </div>
          </div>

          {/* Pros/Cons List */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Can claim 100% ITC on raw materials, software, and services</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Issue Tax Invoices so B2B clients can claim full input credit</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Permitted to sell across states (inter-state) & e-commerce</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <X className="h-4 w-4 text-red-500 shrink-0" />
              <span>Monthly return filing (GSTR-1, GSTR-3B) and invoice matching</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Decision Matrix */}
      <div className="mt-8 rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-400" />
          <h3 className="text-base font-bold">Which scheme should you choose?</h3>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-slate-300">
          <div className="rounded-2xl bg-slate-800/80 p-4">
            <h4 className="font-semibold text-teal-300">Choose Composition Scheme if:</h4>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-300">
              <li>90%+ of your sales are to end consumers (B2C) who don&apos;t ask for GST credit.</li>
              <li>You want minimal compliance, lower accounting expenses, and no invoice matching.</li>
              <li>Your purchases are from local/unregistered suppliers where ITC is negligible.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-800/80 p-4">
            <h4 className="font-semibold text-blue-300">Choose Regular GST Scheme if:</h4>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-300">
              <li>You sell to other registered businesses (B2B) who require GST invoices.</li>
              <li>You purchase substantial high-GST inputs or capital goods (laptops, machinery).</li>
              <li>You sell across state borders or via Amazon/Flipkart/e-commerce.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5">
          <p className="text-xs text-slate-400">
            Need to generate compliant Tax Invoices or Bills of Supply?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500"
          >
            Create GST Invoice Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      {children}
    </main>
  );
}
