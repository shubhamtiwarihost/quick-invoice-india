"use client";

import { useMemo, useState } from "react";
import { searchHsn } from "@/lib/hsnCodes";
import { useInvoiceStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function HsnFinderClient({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const rows = useMemo(() => searchHsn(q), [q]);
  const addItem = useInvoiceStore((s) => s.addItem);
  const updateItem = useInvoiceStore((s) => s.updateItem);
  const items = useInvoiceStore((s) => s.items);
  const router = useRouter();

  function applyToInvoice(code: string, description: string, gst: number) {
    const slab =
      gst === 3
        ? 5
        : gst === 0 || gst === 5 || gst === 12 || gst === 18 || gst === 28
        ? gst
        : 18;
    const currentItems = useInvoiceStore.getState().items;
    const isSingleEmptyItem =
      currentItems.length === 1 &&
      !currentItems[0].description.trim() &&
      !currentItems[0].hsnSac.trim() &&
      currentItems[0].rate === 0;

    if (isSingleEmptyItem) {
      updateItem(currentItems[0].id, {
        description,
        hsnSac: code,
        gstSlab: slab as 0 | 5 | 12 | 18 | 28,
      });
    } else {
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
    }
    router.push("/");
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">HSN & SAC Code Finder</h1>
      <p className="mt-1 text-sm text-slate-500">
        Search 4 to 8 digit HSN codes for goods and SAC codes for services with official GST tax slabs. 1-click apply to your draft invoice.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search code or description — e.g. 9983, software, silk, atta, tote, tea"
        className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 shadow-xs font-medium"
      />
      <p className="mt-2 text-xs text-slate-400">
        {rows.length} results · {items.length} item{items.length === 1 ? "" : "s"} already on your draft invoice
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Typical GST</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.code + row.description} className="hover:bg-slate-50/70 transition">
                <td className="px-4 py-2.5 font-mono font-bold text-xs text-teal-700">{row.code}</td>
                <td className="px-4 py-2.5 text-xs text-slate-600 font-medium">{row.type}</td>
                <td className="px-4 py-2.5 text-xs text-slate-800">{row.description}</td>
                <td className="px-4 py-2.5 text-xs font-semibold text-slate-700">{row.typicalGst}%</td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => applyToInvoice(row.code, row.description, row.typicalGst)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    Add to invoice →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {children}
    </main>
  );
}
