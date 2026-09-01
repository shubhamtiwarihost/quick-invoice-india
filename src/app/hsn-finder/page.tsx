"use client";

import { useMemo, useState } from "react";
import { searchHsn } from "@/lib/hsnCodes";
import { useInvoiceStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function HsnFinderPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => searchHsn(q), [q]);
  const addItem = useInvoiceStore((s) => s.addItem);
  const updateItem = useInvoiceStore((s) => s.updateItem);
  const items = useInvoiceStore((s) => s.items);
  const router = useRouter();

  function applyToInvoice(code: string, description: string, gst: number) {
    const slab = gst === 3 ? 5 : gst === 0 || gst === 5 || gst === 12 || gst === 18 || gst === 28 ? gst : 18;
    addItem();
    const latest = useInvoiceStore.getState().items;
    const created = latest[latest.length - 1];
    if (created) {
      updateItem(created.id, {
        description,
        hsnSac: code,
        gstSlab: slab as 0 | 5 | 12 | 18 | 28,
      });
    }
    router.push("/");
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold">HSN / SAC finder</h1>
      <p className="mt-1 text-sm text-slate-500">
        Search a starter directory of common goods (HSN) and services (SAC). Confirm the latest rate on the GST portal for filing.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search code or description — e.g. tote, 9983, tea"
        className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
      />
      <p className="mt-2 text-xs text-slate-400">{rows.length} results · {items.length} items already on your draft invoice</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Typical GST</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code + row.description} className="border-t border-slate-100">
                <td className="px-4 py-2 font-mono text-xs">{row.code}</td>
                <td className="px-4 py-2">{row.type}</td>
                <td className="px-4 py-2">{row.description}</td>
                <td className="px-4 py-2">{row.typicalGst}%</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => applyToInvoice(row.code, row.description, row.typicalGst)}
                    className="text-xs font-medium text-teal-700 hover:underline"
                  >
                    Add to invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
