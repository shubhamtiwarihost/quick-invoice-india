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
import { MobileBottomNav } from "@/components/invoice/MobileBottomNav";
import { MobileToolsSheet } from "@/components/invoice/MobileToolsSheet";
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
  const [toolsSheetOpen, setToolsSheetOpen] = useState(false);
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
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col pb-16 md:pb-0">
      {/* Toast Notification */}
      {toast ? (
        <div className="no-print fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200 md:bottom-5 md:right-5">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Top Action Bar (Desktop / Tablet) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 sm:py-3">
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
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 active:scale-95"
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
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New invoice
          </button>
          <button
            type="button"
            onClick={() => store.resetDraft()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Load sample
          </button>
          <button
            type="button"
            onClick={handleSaveManual}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 active:scale-95"
          >
            <Save className="h-3.5 w-3.5 text-slate-600" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setWhatsappModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 active:scale-95"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          <button
            type="button"
            onClick={onPdf}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-60 shadow-xs active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            {busy ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="invoice-workspace-grid grid flex-1 lg:grid-cols-[minmax(340px,420px)_1fr]">
        <aside
          className={`no-print overflow-y-auto bg-slate-50 p-3 pb-24 md:pb-3 ${tab === "form" ? "block" : "hidden"} lg:block`}
        >
          <InvoiceForm grandTotal={summary.grandTotal} />
        </aside>
        <section
          className={`invoice-preview-section overflow-auto bg-slate-200/70 p-4 pb-36 md:pb-4 ${tab === "preview" ? "block" : "hidden"} lg:block`}
        >
          <div className="invoice-scale mx-auto w-fit">
            <InvoicePreview draft={draft} summary={summary} />
          </div>
        </section>
      </div>

      {/* Floating Action Bar on Mobile Preview Mode */}
      {tab === "preview" && (
        <div className="no-print fixed bottom-16 left-3 right-3 z-30 flex items-center gap-2 rounded-2xl bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md md:hidden animate-in slide-in-from-bottom-2 duration-150">
          <button
            type="button"
            onClick={() => setWhatsappModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs active:scale-95 transition"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={onPdf}
            disabled={busy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white shadow-xs active:scale-95 transition disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {busy ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={tab}
        onTabChange={setTab}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onOpenTools={() => setToolsSheetOpen(true)}
        savedCount={savedCount}
      />

      {/* Mobile Slide-Up Tools Sheet */}
      <MobileToolsSheet
        isOpen={toolsSheetOpen}
        onClose={() => setToolsSheetOpen(false)}
      />

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
