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
import { formatCurrency, formatDateIN } from "@/lib/format";
import { computeInvoice } from "@/lib/gstEngine";
import {
  getSavedInvoices,
  SAVED_INVOICES_EVENT,
  saveInvoiceToHistory,
} from "@/lib/savedInvoices";
import { useInvoiceStore } from "@/lib/store";
import { getIndustryPreset, type IndustryKey } from "@/lib/industryPresets";
import type { InvoiceDraft } from "@/types/invoice";

export interface InvoiceWorkspaceProps {
  initialPreset?: IndustryKey;
  pageTitle?: string;
  badgeText?: string;
  childrenBelowWorkspace?: React.ReactNode;
}

export function InvoiceWorkspace({
  initialPreset,
  pageTitle,
  badgeText,
  childrenBelowWorkspace,
}: InvoiceWorkspaceProps = {}) {
  const store = useInvoiceStore();
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [busy, setBusy] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [toolsSheetOpen, setToolsSheetOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(() => getSavedInvoices().length);

  // Sync initial preset on page mount
  useEffect(() => {
    if (!store.hydrated) return;

    let targetPreset = initialPreset;
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPreset = urlParams.get("preset") as IndustryKey | null;
      if (
        queryPreset &&
        ["freelancer", "boutique", "kirana", "b2b"].includes(queryPreset)
      ) {
        targetPreset = queryPreset;
      }
    }

    if (targetPreset) {
      const currentActive = sessionStorage.getItem("qi_active_preset");
      if (currentActive !== targetPreset) {
        store.loadDraft(getIndustryPreset(targetPreset));
        sessionStorage.setItem("qi_active_preset", targetPreset);
      }
    }
  }, [store.hydrated, initialPreset, store]);

  useEffect(() => {
    function handleUpdate() {
      setSavedCount(getSavedInvoices().length);
    }
    window.addEventListener(SAVED_INVOICES_EVENT, handleUpdate);

    // Check if redirected from Quotation Maker
    if (typeof window !== "undefined") {
      const convertedQuote = sessionStorage.getItem("qi_converted_from");
      if (convertedQuote) {
        sessionStorage.removeItem("qi_converted_from");
        showToast(`Quotation ${convertedQuote} converted to Tax Invoice!`);
      }
    }

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
    if (tab === "form" && typeof window !== "undefined" && window.innerWidth < 1024) {
      setTab("preview");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    const el = document.getElementById("invoice-a4");
    if (!el) {
      showToast("Invoice preview could not be found.");
      return;
    }
    setBusy(true);
    try {
      // Auto-save to history on PDF download
      saveInvoiceToHistory(draft, summary.grandTotal);
      const safeInvoiceNo = draft.meta.invoiceNo.trim().replace(/[\\/:*?"<>|]/g, "-") || "invoice";
      const { downloadInvoicePdf } = await import("@/lib/exportPdf");
      await downloadInvoicePdf(el, `${safeInvoiceNo}.pdf`);
      showToast(`Downloaded PDF and saved ${draft.meta.invoiceNo} to history!`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("Failed to generate PDF. Please try again or use Print.");
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
      <div className="no-print flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-200 bg-white px-3.5 sm:px-4 lg:px-8 py-2 sm:py-3">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {pageTitle || "GST / Tax invoice generator"}
            </p>
            {badgeText && (
              <span className="inline-flex items-center rounded-md bg-teal-50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-teal-800 border border-teal-200">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {summary.supplyType === "intra"
              ? "Intra-state: CGST + SGST"
              : summary.supplyType === "inter"
                ? "Inter-state: IGST"
                : "Bill of supply (no GST columns)"}{" "}
            · Total <strong className="text-slate-800 font-sans tabular-nums">{formatCurrency(summary.grandTotal, draft.meta.currency)}</strong>
          </p>
        </div>
        {/* Mobile Quick Action Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 active:scale-95 transition"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>Saved</span>
            {savedCount > 0 ? (
              <span className="rounded-full bg-teal-100 px-1.5 text-[10px] font-bold text-teal-800">
                {savedCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => store.newInvoice()}
            title="Start New Invoice"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 active:scale-95 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-700" />
          </button>
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
            onClick={() => {
              if (initialPreset) {
                store.loadDraft(getIndustryPreset(initialPreset));
                showToast(`Reset to ${initialPreset} preset!`);
              } else {
                store.resetDraft();
                showToast("Loaded sample draft!");
              }
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {initialPreset ? "Reset sample" : "Load sample"}
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

      {/* Trust & Privacy Banner */}
      <div className="no-print border-b border-emerald-200/70 bg-emerald-50/90 px-3.5 sm:px-4 lg:px-8 py-1 sm:py-2 text-xs text-emerald-950 shadow-2xs">
        {/* Mobile 1-line sleek chip */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 text-[11px] py-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs select-none">🔒</span>
            <span className="font-bold text-emerald-900 whitespace-nowrap">100% Private:</span>
            <span className="text-emerald-800 truncate">No phone or login · Browser local only</span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 border border-emerald-300/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            No Spam
          </span>
        </div>

        {/* Desktop Banner */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm select-none">🔒</span>
            <span className="font-bold text-emerald-900">100% Private &amp; No Spam:</span>
            <span className="text-emerald-800">
              No phone number or login needed. All calculations happen locally in your browser.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
            <span>Zero Tele-calling</span>
            <span>·</span>
            <span>Zero Watermarks</span>
            <span>·</span>
            <span>Private &amp; Client-Side</span>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="invoice-workspace-grid w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8 flex-1">
        {/* Left Editor Panel (46%) */}
        <aside
          className={`no-print w-full lg:w-[46%] shrink-0 pb-28 lg:pb-0 ${tab === "form" ? "block" : "hidden"} lg:block`}
        >
          <InvoiceForm grandTotal={summary.grandTotal} />
        </aside>

        {/* Right Preview Panel (54%) */}
        <section
          className={`invoice-preview-section w-full lg:w-[54%] lg:flex-1 rounded-2xl bg-slate-100/80 border border-slate-200/70 p-3 sm:p-4 lg:p-6 pb-32 lg:pb-6 flex justify-center ${tab === "preview" ? "block" : "hidden"} lg:block`}
        >
          <div className="sticky top-6 flex justify-center w-full print:static will-change-transform transform-gpu">
            <div className="invoice-scale w-full flex justify-center">
              <InvoicePreview draft={draft} summary={summary} />
            </div>
          </div>
        </section>
      </div>

      {/* Rich SEO & Industry Content Below Workspace Fold */}
      {childrenBelowWorkspace ? (
        <div className="no-print w-full my-12 border-t border-slate-200 pt-10">
          {childrenBelowWorkspace}
        </div>
      ) : null}

      {/* Mobile Bottom Navigation Bar (Persistent Sticky Action Bar) */}
      <MobileBottomNav
        activeTab={tab}
        onTabChange={setTab}
        onDownloadPdf={onPdf}
        onShareWhatsApp={() => setWhatsappModalOpen(true)}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onOpenTools={() => setToolsSheetOpen(true)}
        savedCount={savedCount}
        isPdfBusy={busy}
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
        upiId={draft.seller.bank.upiId}
      />
    </div>
  );
}
