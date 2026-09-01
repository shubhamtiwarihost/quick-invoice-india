"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { numberToWordsIndian } from "@/lib/numberToWordsIndian";
import { round2 } from "@/lib/gstEngine";

const RATES = [0, 5, 12, 18, 28];

export default function GstCalculatorPage() {
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold">GST calculator</h1>
      <p className="mt-1 text-sm text-slate-500">
        Forward (exclusive) or reverse (inclusive) GST with intra / inter-state split.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex gap-2">
          <Toggle active={mode === "forward"} onClick={() => setMode("forward")}>
            Exclusive → add GST
          </Toggle>
          <Toggle active={mode === "reverse"} onClick={() => setMode("reverse")}>
            Inclusive → remove GST
          </Toggle>
        </div>

        <label className="mt-4 block text-sm">
          <span className="text-xs font-medium text-slate-500">
            {mode === "forward" ? "Taxable amount (₹)" : "Amount including GST (₹)"}
          </span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600"
          />
        </label>

        <p className="mt-4 text-xs font-medium text-slate-500">GST rate</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {RATES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              className={`rounded-full px-3 py-1 text-sm ${
                rate === r ? "bg-teal-700 text-white" : "bg-slate-100"
              }`}
            >
              {r}%
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs font-medium text-slate-500">Supply type</p>
        <div className="mt-2 flex gap-2">
          <Toggle active={supply === "intra"} onClick={() => setSupply("intra")}>
            Intra-state (CGST + SGST)
          </Toggle>
          <Toggle active={supply === "inter"} onClick={() => setSupply("inter")}>
            Inter-state (IGST)
          </Toggle>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card label="Taxable value" value={result.taxable} />
        {supply === "intra" ? (
          <>
            <Card label={`CGST ${rate / 2}%`} value={result.cgst} />
            <Card label={`SGST ${rate / 2}%`} value={result.sgst} />
          </>
        ) : (
          <Card label={`IGST ${rate}%`} value={result.igst} />
        )}
        <Card label="Total GST" value={result.tax} />
        <Card label="Invoice total" value={result.total} accent />
      </div>
      <p className="mt-4 text-sm italic text-slate-600">{numberToWordsIndian(result.total)}</p>
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
      className={`rounded-full px-3 py-1.5 text-sm ${
        active ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-teal-700 bg-teal-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{formatCurrency(value)}</p>
    </div>
  );
}
