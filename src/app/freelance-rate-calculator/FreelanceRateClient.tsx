"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useInvoiceStore } from "@/lib/store";
import type { CurrencyCode } from "@/types/invoice";

export default function FreelanceRateClient() {
  const router = useRouter();
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  // Inputs
  const [incomeMode, setIncomeMode] = useState<"monthly" | "annual">("monthly");
  const [targetIncome, setTargetIncome] = useState<number>(100000); // 1 Lakh/month default
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(25);
  const [vacationWeeks, setVacationWeeks] = useState<number>(4);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(15000);
  const [taxAndBufferPercent, setTaxAndBufferPercent] = useState<number>(20);

  // Project Estimator Inputs
  const [projectHours, setProjectHours] = useState<number>(40);
  const [markupPercent, setMarkupPercent] = useState<number>(10);

  const calculations = useMemo(() => {
    const annualTargetIncome =
      incomeMode === "annual" ? targetIncome : targetIncome * 12;
    const annualExpenses = monthlyExpenses * 12;
    const taxRate = Math.min(Math.max(taxAndBufferPercent, 0), 90) / 100;

    // Gross revenue needed before tax
    const totalRequiredGross = (annualTargetIncome + annualExpenses) / (1 - taxRate || 1);

    const workingWeeks = Math.max(52 - vacationWeeks, 1);
    const totalAnnualBillableHours = workingWeeks * Math.max(billableHoursPerWeek, 1);

    const hourlyRate = Math.round(totalRequiredGross / totalAnnualBillableHours);
    const dailyRate = Math.round(hourlyRate * 6); // standard 6 billable hours/day
    const weeklyRetainer = Math.round(hourlyRate * billableHoursPerWeek);
    const monthlyRetainer = Math.round((hourlyRate * totalAnnualBillableHours) / 12);

    // Project estimate
    const baseProjectCost = projectHours * hourlyRate;
    const projectTotal = Math.round(baseProjectCost * (1 + markupPercent / 100));

    return {
      annualTargetIncome,
      annualExpenses,
      totalRequiredGross,
      workingWeeks,
      totalAnnualBillableHours,
      hourlyRate,
      dailyRate,
      weeklyRetainer,
      monthlyRetainer,
      baseProjectCost,
      projectTotal,
    };
  }, [
    incomeMode,
    targetIncome,
    billableHoursPerWeek,
    vacationWeeks,
    monthlyExpenses,
    taxAndBufferPercent,
    projectHours,
    markupPercent,
  ]);

  function handleCreateInvoice() {
    // Add item into store with hourly rate and redirect to /
    const addItem = useInvoiceStore.getState().addItem;
    const updateItem = useInvoiceStore.getState().updateItem;
    const setMeta = useInvoiceStore.getState().setMeta;

    setMeta({ currency });

    // Set the first item or add a new one
    const currentItems = useInvoiceStore.getState().items;
    if (currentItems.length > 0) {
      updateItem(currentItems[0].id, {
        description: "Freelance Consulting / Development Services",
        quantity: projectHours,
        unit: "Hrs",
        rate: calculations.hourlyRate,
        gstSlab: 18,
      });
    } else {
      addItem();
    }
    router.push("/");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            <Calculator className="h-3.5 w-3.5" />
            Pricing Strategy & Rate Engine
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Freelance Rate & Income Calculator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Find out your sustainable minimum hourly rate, retainers, and project estimates to meet your financial goals.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`rounded-lg px-3 py-1.5 transition ${
              currency === "INR"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            ₹ INR
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`rounded-lg px-3 py-1.5 transition ${
              currency === "USD"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Inputs Form (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Target Take-home Income */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                1. Desired Take-Home Income
              </span>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setIncomeMode("monthly")}
                  className={`rounded-md px-2.5 py-1 ${
                    incomeMode === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIncomeMode("annual")}
                  className={`rounded-md px-2.5 py-1 ${
                    incomeMode === "annual" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="mt-3">
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-semibold text-slate-400">
                  {currency === "INR" ? "₹" : "$"}
                </span>
                <input
                  type="number"
                  min={0}
                  value={targetIncome || ""}
                  onChange={(e) => setTargetIncome(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-2.5 font-mono text-base font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                {incomeMode === "monthly"
                  ? `Equivalent to ${formatCurrency(targetIncome * 12, currency)} / year in net income.`
                  : `Equivalent to ${formatCurrency(Math.round(targetIncome / 12), currency)} / month in net income.`}
              </p>
            </div>
          </div>

          {/* Time & Billable Capacity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              2. Working Capacity & Time Off
            </span>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Billable Hours / Week
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={billableHoursPerWeek}
                  onChange={(e) => setBillableHoursPerWeek(Number(e.target.value) || 1)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  Typical sweet spot: 20-30 hrs (remainder for sales & admin).
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Vacation / Sick Weeks / Year
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={vacationWeeks}
                  onChange={(e) => setVacationWeeks(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                />
                <span className="mt-1 block text-[11px] text-slate-400">
                  Leaves {calculations.workingWeeks} active billing weeks per year.
                </span>
              </div>
            </div>
          </div>

          {/* Overhead & Taxes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              3. Expenses & Tax Buffer
            </span>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Monthly Business Expenses
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">
                    {currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={monthlyExpenses || ""}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <span className="mt-1 block text-[11px] text-slate-400">
                  Software, laptop, internet, co-working, CPA.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Taxes + Contingency Buffer (%)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={taxAndBufferPercent}
                    onChange={(e) => setTaxAndBufferPercent(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
                </div>
                <span className="mt-1 block text-[11px] text-slate-400">
                  Income tax (Section 44ADA/slab) & dry-spell cushion.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Project Estimator (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Main Rate Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Recommended Minimum Rate
              </span>
              <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
                Sustainable Target
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-extrabold tracking-tight sm:text-5xl">
                {formatCurrency(calculations.hourlyRate, currency, 0)}
              </span>
              <span className="text-base text-slate-400">/ hour</span>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Based on {calculations.totalAnnualBillableHours} billable hrs/yr to cover {formatCurrency(calculations.totalRequiredGross, currency, 0)} gross target.
            </p>

            {/* Retainer Tiers */}
            <div className="mt-6 space-y-2.5 border-t border-slate-800 pt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Daily Rate (6 hrs):</span>
                <span className="font-mono font-semibold text-white">
                  {formatCurrency(calculations.dailyRate, currency, 0)} / day
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Weekly Retainer ({billableHoursPerWeek} hrs):</span>
                <span className="font-mono font-semibold text-white">
                  {formatCurrency(calculations.weeklyRetainer, currency, 0)} / wk
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Retainer:</span>
                <span className="font-mono font-semibold text-teal-300">
                  {formatCurrency(calculations.monthlyRetainer, currency, 0)} / mo
                </span>
              </div>
            </div>
          </div>

          {/* Project Cost Estimator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-teal-700" />
              <h3 className="text-sm font-semibold text-slate-900">
                Fixed-Price Project Estimator
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="flex items-center justify-between text-xs text-slate-600">
                  <span>Estimated Project Hours:</span>
                  <span className="font-semibold text-slate-900">{projectHours} hrs</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={5}
                  value={projectHours}
                  onChange={(e) => setProjectHours(Number(e.target.value))}
                  className="mt-1.5 w-full accent-teal-700"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs text-slate-600">
                  <span>Complexity / Risk Markup (%):</span>
                  <span className="font-semibold text-slate-900">{markupPercent}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={5}
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="mt-1.5 w-full accent-teal-700"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Base quote ({projectHours} hrs @ {formatCurrency(calculations.hourlyRate, currency, 0)}):</span>
                  <span>{formatCurrency(calculations.baseProjectCost, currency, 0)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-500">
                  <span>Markup ({markupPercent}%):</span>
                  <span>+{formatCurrency(calculations.projectTotal - calculations.baseProjectCost, currency, 0)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
                  <span>Suggested Project Quote:</span>
                  <span className="font-mono text-base text-teal-700">
                    {formatCurrency(calculations.projectTotal, currency, 0)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateInvoice}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-xs font-semibold text-white hover:bg-teal-800 shadow-xs transition"
              >
                Generate Freelance Invoice
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
