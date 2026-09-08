"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  FileText,
  HelpCircle,
  Landmark,
  Compass,
} from "lucide-react";
import { INDIAN_STATES, type IndianState } from "@/lib/indianStates";
import { useInvoiceStore } from "@/lib/store";

export default function GstStateCodesClient() {
  const router = useRouter();
  const setClient = useInvoiceStore((s) => s.setClient);

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "State" | "Union Territory">("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"code" | "name">("code");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filtered and sorted states
  const filteredStates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDIAN_STATES.filter((st) => {
      // Type filter
      if (filterType !== "all" && st.type !== filterType) return false;
      // Zone filter
      if (selectedZone !== "all" && st.zone !== selectedZone) return false;
      // Search query
      if (!q) return true;
      return (
        st.name.toLowerCase().includes(q) ||
        st.code.includes(q) ||
        st.capital.toLowerCase().includes(q) ||
        st.zone.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (sortBy === "code") {
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      }
      return a.name.localeCompare(b.name);
    });
  }, [query, filterType, selectedZone, sortBy]);

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore
    }
  }

  function handleCreateInvoiceForState(st: IndianState) {
    setClient({
      billingState: st.name,
      billingStateCode: st.code,
      placeOfSupply: st.name,
      placeOfSupplyCode: st.code,
    });
    router.push("/");
  }

  const stateCount = INDIAN_STATES.filter((s) => s.type === "State").length;
  const utCount = INDIAN_STATES.filter((s) => s.type === "Union Territory").length;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <MapPin className="h-3.5 w-3.5 text-teal-700" />
            Official CBIC 2-Digit GST Jurisdiction Directory
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Indian GST State Codes & Capitals Directory
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Searchable directory of all 37 Indian States, Union Territories, and central jurisdictions with official 2-digit GST codes, state capitals, 1-click copy, and instant GSTIN validation.
          </p>
        </div>

        {/* Quick CTA */}
        <Link
          href="/gstin-validator"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition active:scale-95"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>GSTIN Validator</span>
        </Link>
      </div>

      {/* Stats Counter Bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Operational Codes</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">37</p>
          <p className="mt-0.5 text-[11px] text-teal-700 font-medium">Codes 01 through 38, 97</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Full Indian States</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{stateCount}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">From 02 (HP) to 37 (AP)</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Union Territories</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{utCount}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Includes Delhi, J&K, Ladakh</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Special Territories</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">1</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Code 97 (Center / Offshore)</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by state name, 2-digit code (e.g. 27), or capital city (e.g. Mumbai, Bengaluru)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600/20"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* Filter Pills & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1">Filter:</span>
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                filterType === "all"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All (37)
            </button>
            <button
              type="button"
              onClick={() => setFilterType("State")}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                filterType === "State"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              States (28)
            </button>
            <button
              type="button"
              onClick={() => setFilterType("Union Territory")}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                filterType === "Union Territory"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Union Territories (8)
            </button>

            {/* Zone Selector */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 outline-none ml-2"
            >
              <option value="all">All Zones</option>
              <option value="Northern">Northern Zone</option>
              <option value="Southern">Southern Zone</option>
              <option value="Western">Western Zone</option>
              <option value="Eastern">Eastern Zone</option>
              <option value="Central">Central Zone</option>
              <option value="North-Eastern">North-Eastern Zone</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort:</span>
            <button
              type="button"
              onClick={() => setSortBy("code")}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                sortBy === "code"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              By Code (01-97)
            </button>
            <button
              type="button"
              onClick={() => setSortBy("name")}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                sortBy === "name"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              A to Z
            </button>
          </div>
        </div>
      </div>

      {/* Directory Table / Cards */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3.5">GST Code</th>
                <th className="px-4 py-3.5">State / Territory Name</th>
                <th className="px-4 py-3.5">Capital City</th>
                <th className="px-4 py-3.5">Jurisdiction</th>
                <th className="px-4 py-3.5">Zone</th>
                <th className="px-4 py-3.5 text-right">Instant Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.length > 0 ? (
                filteredStates.map((st) => {
                  const isCopied = copiedCode === st.code;
                  return (
                    <tr
                      key={st.code}
                      className="transition hover:bg-slate-50/80 group"
                    >
                      {/* Code + Copy Button */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-lg">
                            {st.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(st.code)}
                            title={`Copy code ${st.code}`}
                            className={`rounded-lg p-1.5 transition ${
                              isCopied
                                ? "bg-emerald-100 text-emerald-800 font-semibold"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* State Name */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900 text-sm">{st.name}</p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          GSTIN Prefix: {st.code}XXXXXXXXXX
                        </span>
                      </td>

                      {/* Capital City */}
                      <td className="px-4 py-3.5 text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Landmark className="h-3.5 w-3.5 text-slate-400" />
                          <span>{st.capital}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            st.type === "State"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : st.type === "Union Territory"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {st.type}
                        </span>
                      </td>

                      {/* Zone */}
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Compass className="h-3 w-3 text-slate-400" />
                          <span>{st.zone}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/gstin-validator?code=${st.code}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-teal-600 hover:text-teal-700 transition"
                          >
                            <ShieldCheck className="h-3 w-3 text-teal-600" />
                            <span>Validate GSTIN</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCreateInvoiceForState(st)}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-slate-800 transition"
                          >
                            <FileText className="h-3 w-3" />
                            <span>New Invoice</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No state or UT found matching &quot;{query}&quot;. Try searching with code (e.g. &quot;27&quot;) or state name.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive SEO Educational Guide & FAQ */}
      <section className="mt-12 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900">
            Why are 2-Digit GST State Codes Critical for Invoicing?
          </h2>
          <div className="mt-3 space-y-3 text-xs leading-relaxed text-slate-600">
            <p>
              In India, under the Central Goods and Services Tax Act, 2017, the first 2 digits of any 15-character GSTIN (Goods and Services Tax Identification Number) designate the administrative state or union territory where the business is registered.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <h3 className="font-semibold text-slate-900 text-xs">
                  1. Intra-State Supply (CGST + SGST)
                </h3>
                <p className="mt-1">
                  When the Supplier&apos;s State Code matches the Customer&apos;s Place of Supply (POS) State Code, the transaction is intra-state. Taxes are split equally into Central GST (CGST) and State GST (SGST).
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <h3 className="font-semibold text-slate-900 text-xs">
                  2. Inter-State Supply (IGST)
                </h3>
                <p className="mt-1">
                  When the Supplier&apos;s State Code differs from the Customer&apos;s Place of Supply State Code, Integrated GST (IGST) is levied in full and remitted to the Central Government for interstate distribution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-teal-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900">
                What happened to State Code 25 (Daman and Diu)?
              </h3>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Following the merger of Dadra & Nagar Haveli and Daman & Diu in January 2020, existing GSTINs starting with code 25 were migrated to code <strong>26</strong>. Today, 26 is the unified operational GST state code for Dadra and Nagar Haveli and Daman and Diu.
              </p>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900">
                What is GST State Code 38?
              </h3>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Following the Jammu and Kashmir Reorganisation Act, Ladakh was established as a separate Union Territory and assigned official GST State Code <strong>38</strong>, while Jammu and Kashmir retained State Code <strong>01</strong>.
              </p>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900">
                What is GST State Code 97 (Other Territory)?
              </h3>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Code <strong>97</strong> represents supplies occurring in territorial waters of India beyond the baseline or offshore oil extraction installations outside any specific state boundary.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Can I test any GSTIN using the state code?
              </h3>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Yes. Click &quot;Validate GSTIN&quot; next to any state code in the table above to test a 100% mathematically valid sample GSTIN generated with official MOD 36 checksum verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
