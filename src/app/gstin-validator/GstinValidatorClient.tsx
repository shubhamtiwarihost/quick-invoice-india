"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  CreditCard,
  Hash,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { parseAndValidateGstin, generateValidSampleGstin } from "@/lib/gstin";
import { useInvoiceStore } from "@/lib/store";

const SAMPLES = [
  { gstin: "27AAPCA1234A1Z5", label: "Maharashtra (Company)" },
  { gstin: "07AAAAA0000A1Z5", label: "Delhi (AOP)" },
  { gstin: "29AABCU9603R1ZM", label: "Karnataka (Proprietorship)" },
  { gstin: "33AABCT1332L1ZV", label: "Tamil Nadu (Trust)" },
];

export default function GstinValidatorClient() {
  const searchParams = useSearchParams();
  const initialValue = useMemo(() => {
    const paramGstin = searchParams.get("gstin");
    const paramCode = searchParams.get("code") || searchParams.get("stateCode");
    if (paramGstin) return paramGstin.toUpperCase();
    if (paramCode) return generateValidSampleGstin(paramCode);
    return "27AAPCA1234A1Z5";
  }, [searchParams]);

  const [input, setInput] = useState(initialValue);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const setClient = useInvoiceStore((s) => s.setClient);

  const breakdown = useMemo(() => parseAndValidateGstin(input), [input]);

  function handleCreateInvoice() {
    if (breakdown.formatted) {
      setClient({
        gstin: breakdown.formatted,
        billingState: breakdown.state?.name || "",
        billingStateCode: breakdown.stateCode || "",
        placeOfSupply: breakdown.state?.name || "",
        placeOfSupplyCode: breakdown.stateCode || "",
      });
      router.push("/");
    }
  }

  async function handleCopy() {
    if (!breakdown.formatted) return;
    try {
      await navigator.clipboard.writeText(breakdown.formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const isFull = breakdown.formatted.length === 15;
  const isAllValid = isFull && breakdown.isValidFormat && breakdown.isValidChecksum;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official MOD 36 Verification
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            GSTIN Validator & Breakdown
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Verify any 15-character Goods and Services Tax Identification Number (GSTIN) with structure decoding and check digit verification.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <label className="block">
          <span className="text-xs font-semibold text-slate-700">
            Enter 15-Digit Indian GSTIN
          </span>
          <div className="relative mt-1.5 flex items-center">
            <input
              type="text"
              maxLength={15}
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="e.g. 27AAPCA1234A1Z5"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-base font-semibold tracking-wider text-slate-900 uppercase outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/20 sm:text-lg"
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={!breakdown.formatted}
              title="Copy GSTIN"
              className="absolute right-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
            >
              {copied ? (
                <Check className="h-4 w-4 text-teal-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </label>

        {/* Sample Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Sample GSTINs:</span>
          {SAMPLES.map((s) => (
            <button
              key={s.gstin}
              type="button"
              onClick={() => setInput(s.gstin)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                input === s.gstin
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label} ({s.gstin.slice(0, 2)})
            </button>
          ))}
        </div>
      </div>

      {/* Validation Status Banner */}
      {breakdown.formatted ? (
        <div
          className={`mt-5 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
            isAllValid
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-900"
              : isFull
                ? "border-red-200 bg-red-50/80 text-red-900"
                : "border-amber-200 bg-amber-50/80 text-amber-900"
          }`}
        >
          <div className="flex items-start gap-3">
            {isAllValid ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : isFull ? (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {isAllValid
                  ? "Valid GSTIN Structure & Checksum"
                  : isFull
                    ? "Invalid GSTIN or Checksum Mismatch"
                    : `Incomplete GSTIN (${breakdown.formatted.length} / 15 characters)`}
              </p>
              <p className="mt-0.5 text-xs opacity-90">
                {isAllValid
                  ? `MOD 36 check digit (${breakdown.checksumChar}) matches calculated algorithm. State: ${breakdown.state?.name || "Valid"}.`
                  : breakdown.errors.length > 0
                    ? breakdown.errors[0]
                    : "Please provide all 15 characters to complete validation."}
              </p>
            </div>
          </div>

          {/* Quick CTA to Pre-fill Invoice */}
          <button
            type="button"
            onClick={handleCreateInvoice}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800 shadow-xs transition"
          >
            Create invoice with this GSTIN
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* Visual Structure Breakdown */}
      {breakdown.formatted ? (
        <div className="mt-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            GSTIN Component Breakdown
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. State Code */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Digits 1-2 · State Code</span>
                <MapPin className="h-4 w-4 text-teal-600" />
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                {breakdown.stateCode || "—"}
              </p>
              <p className="mt-1 text-sm font-semibold text-teal-700">
                {breakdown.state?.name || "Unknown / Invalid State"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Identifies registration jurisdiction in India.
              </p>
            </div>

            {/* 2. PAN Number */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Digits 3-12 · PAN Number</span>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                {breakdown.pan || "—"}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600">
                Permanent Account Number
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tied directly to the entity&apos;s Income Tax PAN.
              </p>
            </div>

            {/* 3. Entity Type */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Digit 4 of PAN (Char 6) · Entity</span>
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                {breakdown.entityCode || "—"}
              </p>
              <p className="mt-1 text-xs font-semibold text-amber-800">
                {breakdown.entityType?.title || "Unknown Entity Type"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {breakdown.entityType?.desc || "Indicates legal structure of the business."}
              </p>
            </div>

            {/* 4. Entity Registration Number */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Digit 13 · Entity Count</span>
                <Hash className="h-4 w-4 text-purple-600" />
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                {breakdown.entityRegistrationNumber || "—"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Registration index within the state (1 to 9, then A to Z).
              </p>
            </div>

            {/* 5. Default Z */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Digit 14 · Default Character</span>
                <Info className="h-4 w-4 text-slate-500" />
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                {breakdown.defaultZChar || "—"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Fixed alphabet &apos;Z&apos; by default under Indian GST Act.
              </p>
            </div>

            {/* 6. Checksum Character */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Digit 15 · MOD 36 Checksum</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-slate-900">
                  {breakdown.checksumChar || "—"}
                </span>
                {breakdown.calculatedChecksum ? (
                  <span className="text-xs text-slate-400">
                    (Computed: {breakdown.calculatedChecksum})
                  </span>
                ) : null}
              </div>
              <p
                className={`mt-1 text-xs font-semibold ${
                  breakdown.isValidChecksum
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                {breakdown.isValidChecksum
                  ? "Checksum Verified ✓"
                  : "Checksum Mismatch ✗"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Informational FAQ Guide */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-semibold text-slate-900">
          How is an Indian GSTIN structured?
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          A GSTIN (Goods and Services Tax Identification Number) is a 15-character alphanumeric identifier issued to every registered taxpayer in India under the GST framework:
        </p>
        <ul className="mt-3 space-y-2 text-xs text-slate-600 list-disc list-inside">
          <li><strong>First 2 digits (01-38)</strong>: Represent the state code as defined by Indian Census (e.g., 27 for Maharashtra, 07 for Delhi, 29 for Karnataka).</li>
          <li><strong>Next 10 digits</strong>: PAN (Permanent Account Number) of the registered business or individual.</li>
          <li><strong>13th digit</strong>: Represents the number of registrations the entity holds in the same state (1-9, then A-Z).</li>
          <li><strong>14th character</strong>: Set to &apos;Z&apos; by default.</li>
          <li><strong>15th character</strong>: Calculated using the MOD 36 algorithm across the first 14 characters to prevent manual typing errors.</li>
        </ul>
      </section>
    </main>
  );
}
