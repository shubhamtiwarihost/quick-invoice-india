"use client";

import { useMemo, useState } from "react";
import { Download, MessageCircle, Printer, RotateCcw, Sparkles } from "lucide-react";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { downloadInvoicePdf, whatsappInvoiceText } from "@/lib/exportPdf";
import { formatCurrency } from "@/lib/format";
import { computeInvoice } from "@/lib/gstEngine";
import { useInvoiceStore } from "@/lib/store";

export function InvoiceWorkspace() {
  const store = useInvoiceStore();
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [busy, setBusy] = useState(false);

  const draft = useMemo(
    () => ({
      seller: store.seller,
      client: store.client,
      items: store.items,
      meta: store.meta,
      config: store.config,
    }),
    [store.seller, store.client, store.items, store.meta, store.config],
  );

  const summary = useMemo(() => computeInvoice(draft), [draft]);

  if (!store.hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Loading your draft…
      </div>
    );
  }

  async function onPdf() {
    const el = document.getElementById("invoice-a4");
    if (!el) return;
    setBusy(true);
    try {
      await downloadInvoicePdf(el, `${draft.meta.invoiceNo.replaceAll("/", "-")}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  const wa = whatsappInvoiceText({
    seller: draft.seller.businessName,
    invoiceNo: draft.meta.invoiceNo,
    buyer: draft.client.name,
    total: formatCurrency(summary.grandTotal, draft.meta.currency),
    dueDate: draft.meta.dueDate,
  });

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">GST / Tax invoice generator</p>
          <p className="text-xs text-slate-500">
            {summary.supplyType === "intra"
              ? "Intra-state: CGST + SGST"
              : summary.supplyType === "inter"
                ? "Inter-state: IGST"
                : "Bill of supply (no GST columns)"}{" "}
            · Total {formatCurrency(summary.grandTotal, draft.meta.currency)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => store.newInvoice()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New invoice
          </button>
          <button
            type="button"
            onClick={() => store.resetDraft()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Load sample
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          <button
            type="button"
            onClick={onPdf}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" />
            {busy ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="no-print grid grid-cols-2 gap-1 p-2 lg:hidden">
        <button
          type="button"
          onClick={() => setTab("form")}
          className={`rounded-lg py-2 text-sm ${tab === "form" ? "bg-teal-700 text-white" : "bg-white"}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`rounded-lg py-2 text-sm ${tab === "preview" ? "bg-teal-700 text-white" : "bg-white"}`}
        >
          Preview
        </button>
      </div>

      <div className="grid flex-1 lg:grid-cols-[minmax(340px,420px)_1fr]">
        <aside
          className={`no-print overflow-y-auto bg-slate-50 p-3 ${tab === "form" ? "block" : "hidden"} lg:block`}
        >
          <InvoiceForm grandTotal={summary.grandTotal} />
        </aside>
        <section
          className={`overflow-auto bg-slate-200/70 p-4 ${tab === "preview" ? "block" : "hidden"} lg:block`}
        >
          <div className="invoice-scale mx-auto w-fit">
            <InvoicePreview draft={draft} summary={summary} />
          </div>
        </section>
      </div>
    </div>
  );
}
