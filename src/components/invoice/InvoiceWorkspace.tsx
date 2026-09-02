"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  History,
  MessageCircle,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { SavedInvoicesDrawer } from "@/components/invoice/SavedInvoicesDrawer";
import { WhatsAppShareModal } from "@/components/invoice/WhatsAppShareModal";
import { downloadInvoicePdf } from "@/lib/exportPdf";
import { formatCurrency, formatDateIN } from "@/lib/format";
import { computeInvoice } from "@/lib/gstEngine";
import {
  getSavedInvoices,
  SAVED_INVOICES_EVENT,
  saveInvoiceToHistory,
} from "@/lib/savedInvoices";
import { useInvoiceStore } from "@/lib/store";
import type { InvoiceDraft } from "@/types/invoice";

export function InvoiceWorkspace() {
  const store = useInvoiceStore();
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [busy, setBusy] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(() => getSavedInvoices().length);

  useEffect(() => {
    function handleUpdate() {
      setSavedCount(getSavedInvoices().length);
    }
    window.addEventListener(SAVED_INVOICES_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(SAVED_INVOICES_EVENT, handleUpdate);
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

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

  function handleSaveManual() {
    saveInvoiceToHistory(draft, summary.grandTotal);
    showToast(`Invoice ${draft.meta.invoiceNo} saved to history!`);
  }

  async function onPdf() {
    const el = document.getElementById("invoice-a4");
    if (!el) return;
    setBusy(true);
    try {
      // Auto-save to history on PDF download
      saveInvoiceToHistory(draft, summary.grandTotal);
      await downloadInvoicePdf(el, `${draft.meta.invoiceNo.replaceAll("/", "-")}.pdf`);
      showToast(`Downloaded PDF and saved ${draft.meta.invoiceNo} to history!`);
    } finally {
      setBusy(false);
    }
  }

  function handleLoadSavedInvoice(loadedDraft: InvoiceDraft) {
    store.loadDraft(loadedDraft);
    showToast(`Loaded invoice ${loadedDraft.meta.invoiceNo}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
      {/* Toast Notification */}
      {toast ? (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Top Action Bar */}
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            Saved invoices
            {savedCount > 0 ? (
              <span className="rounded-full bg-teal-100 px-1.5 py-0.2 text-[10px] font-semibold text-teal-800">
                {savedCount}
              </span>
            ) : null}
          </button>
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
          <button
            type="button"
            onClick={handleSaveManual}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
          >
            <Save className="h-3.5 w-3.5 text-slate-600" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setWhatsappModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            WhatsApp
          </button>
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
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-60 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            {busy ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
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

      {/* Workspace Grid */}
      <div className="invoice-workspace-grid grid flex-1 lg:grid-cols-[minmax(340px,420px)_1fr]">
        <aside
          className={`no-print overflow-y-auto bg-slate-50 p-3 ${tab === "form" ? "block" : "hidden"} lg:block`}
        >
          <InvoiceForm grandTotal={summary.grandTotal} />
        </aside>
        <section
          className={`invoice-preview-section overflow-auto bg-slate-200/70 p-4 ${tab === "preview" ? "block" : "hidden"} lg:block`}
        >
          <div className="invoice-scale mx-auto w-fit">
            <InvoicePreview draft={draft} summary={summary} />
          </div>
        </section>
      </div>

      {/* Saved Invoices History Drawer */}
      <SavedInvoicesDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        onLoadInvoice={handleLoadSavedInvoice}
      />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
        clientName={draft.client.name}
        clientPhone={draft.client.phone}
        invoiceNo={draft.meta.invoiceNo}
        formattedTotal={formatCurrency(summary.grandTotal, draft.meta.currency)}
        invoiceDate={formatDateIN(draft.meta.invoiceDate) || draft.meta.invoiceDate}
        sellerName={draft.seller.businessName}
      />
    </div>
  );
}
