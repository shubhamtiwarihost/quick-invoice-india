"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { numberToWordsIndian } from "@/lib/numberToWordsIndian";
import { round2 } from "@/lib/gstEngine";

const RATES = [0, 5, 12, 18, 28];

export default function GstCalculatorClient({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [supply, setSupply] = useState<"intra" | "inter">("intra");

  const result = useMemo(() => {
    const r = rate / 100;
    let taxable = 0;
    let tax = 0;
    let total = 0;
    if (mode === "forward") {
      taxable = round2(amount);
      tax = round2(taxable * r);
      total = round2(taxable + tax);
    } else {
      total = round2(amount);
      taxable = round2(total / (1 + r));
      tax = round2(total - taxable);
    }
    const cgst = supply === "intra" ? round2(tax / 2) : 0;
    const sgst = supply === "intra" ? round2(tax - cgst) : 0;
    const igst = supply === "inter" ? tax : 0;
    return { taxable, tax, total, cgst, sgst, igst };
  }, [amount, rate, mode, supply]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">GST Calculator (Inclusive & Exclusive)</h1>
      <p className="mt-1 text-sm text-slate-500">
        Forward (exclusive) or reverse (inclusive) GST with intra-state (CGST + SGST) and inter-state (IGST) split for 0%, 5%, 12%, 18%, 28% slabs.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex gap-2">
          <Toggle active={mode === "forward"} onClick={() => setMode("forward")}>
            Exclusive → Add GST
          </Toggle>
          <Toggle active={mode === "reverse"} onClick={() => setMode("reverse")}>
            Inclusive → Remove GST
          </Toggle>
        </div>

        <label className="mt-4 block text-sm">
          <span className="text-xs font-medium text-slate-600">
            {mode === "forward" ? "Taxable Amount (₹)" : "Amount Including GST (₹)"}
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={amount === 0 ? "" : amount}
            placeholder="0"
            onChange={(e) => {
              const v = e.target.value;
              setAmount(v === "" ? 0 : Number(v));
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-teal-600 text-sm font-medium"
          />
        </label>

        <p className="mt-4 text-xs font-semibold text-slate-700">GST Rate Slabs</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {RATES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                rate === r ? "bg-teal-700 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {r}%
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs font-semibold text-slate-700">Supply Type</p>
        <div className="mt-2 flex gap-2">
          <Toggle active={supply === "intra"} onClick={() => setSupply("intra")}>
            Intra-State (CGST + SGST)
          </Toggle>
          <Toggle active={supply === "inter"} onClick={() => setSupply("inter")}>
            Inter-State (IGST)
          </Toggle>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card label="Taxable Value" value={result.taxable} />
        {supply === "intra" ? (
          <>
            <Card label={`CGST (${rate / 2}%)`} value={result.cgst} />
            <Card label={`SGST (${rate / 2}%)`} value={result.sgst} />
          </>
        ) : (
          <Card label={`IGST (${rate}%)`} value={result.igst} />
        )}
        <Card label="Total GST Amount" value={result.tax} />
        <Card label="Final Invoice Total" value={result.total} accent />
      </div>
      <p className="mt-4 text-xs italic text-slate-500 font-medium">
        Amount in Words: {numberToWordsIndian(result.total)}
      </p>
      {children}
    </main>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
        active
          ? "bg-teal-700 text-white shadow-xs"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-xs ${
        accent ? "border-teal-700 bg-teal-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(value)}</p>
    </div>
  );
}
