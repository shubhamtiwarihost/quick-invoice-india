"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  History,
  Maximize2,
  MessageCircle,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import dynamic from "next/dynamic";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { MobileBottomNav } from "@/components/invoice/MobileBottomNav";

const SavedInvoicesDrawer = dynamic(
  () =>
    import("@/components/invoice/SavedInvoicesDrawer").then(
      (mod) => mod.SavedInvoicesDrawer
    ),
  { ssr: false }
);
const WhatsAppShareModal = dynamic(
  () =>
    import("@/components/invoice/WhatsAppShareModal").then(
      (mod) => mod.WhatsAppShareModal
    ),
  { ssr: false }
);
const MobileToolsSheet = dynamic(
  () =>
    import("@/components/invoice/MobileToolsSheet").then(
      (mod) => mod.MobileToolsSheet
    ),
  { ssr: false }
);
import { formatCurrency, formatDateIN } from "@/lib/format";
import { computeInvoice } from "@/lib/gstEngine";
import { trackEvent } from "@/lib/tracker";
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
  const [zoomMode, setZoomMode] = useState<"fit" | "custom">("fit");
  const [customScale, setCustomScale] = useState(0.8);
  const [fitScale, setFitScale] = useState(0.72);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-fit A4 preview calculation based on container size
  useEffect(() => {
    function computeFit() {
      if (!previewContainerRef.current) return;
      const el = previewContainerRef.current;
      const availableWidth = el.clientWidth - 32;
      const availableHeight = el.clientHeight - 32;
      if (availableWidth <= 0 || availableHeight <= 0) return;

      const scaleW = availableWidth / 794;
      const scaleH = availableHeight / 1123;
      const optimal = Math.min(scaleW, scaleH);
      const clamped = Math.max(0.35, Math.min(1.1, Number(optimal.toFixed(2))));
      setFitScale(clamped);
    }

    computeFit();
    window.addEventListener("resize", computeFit);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(computeFit) : null;
    if (ro && previewContainerRef.current) {
      ro.observe(previewContainerRef.current);
    }
    return () => {
      window.removeEventListener("resize", computeFit);
      ro?.disconnect();
    };
  }, []);

  const currentScale = zoomMode === "fit" ? fitScale : customScale;

  function handleZoomIn() {
    setZoomMode("custom");
    setCustomScale(Math.min(1.5, Number((currentScale + 0.08).toFixed(2))));
  }

  function handleZoomOut() {
    setZoomMode("custom");
    setCustomScale(Math.max(0.4, Number((currentScale - 0.08).toFixed(2))));
  }

  function handleZoomFit() {
    setZoomMode("fit");
  }

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
      <div className="mx-auto flex w-full max-w-[1850px] 2xl:max-w-[2100px] flex-1 flex-col pb-16 md:pb-0 min-h-[850px]">
        {/* Top Action Bar (Pre-rendered for SEO & Googlebot crawlers) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-3.5 sm:px-4 lg:px-8 xl:px-10 py-2 sm:py-3 min-h-[57px]">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 truncate max-w-[280px] sm:max-w-none">
              {pageTitle || "SwiftGST — Free Retail POS & GST Billing Software"}
            </h1>
            {badgeText ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-800 border border-emerald-200">
                {badgeText}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-indigo-700 border border-indigo-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Live Editor
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-28 rounded-lg bg-teal-50 animate-pulse" />
          </div>
        </div>

        {/* Placeholder Privacy Banner */}
        <div className="no-print border-b border-emerald-200/70 bg-emerald-50/90 px-3.5 sm:px-4 lg:px-8 xl:px-10 py-1 sm:py-2 h-[38px] flex items-center justify-between">
          <div className="h-3.5 w-64 rounded bg-emerald-200/60 animate-pulse" />
          <div className="hidden sm:block h-3.5 w-48 rounded bg-emerald-200/60 animate-pulse" />
        </div>

        {/* Placeholder Workspace Grid */}
        <div className="invoice-workspace-grid w-full max-w-[1850px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-10 py-3 lg:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8 flex-1 min-h-[750px]">
          {/* Left Editor Skeleton */}
          <div className="no-print w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] lg:max-w-[760px] shrink-0 min-h-[600px] rounded-2xl border border-slate-200 bg-white p-5 space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-slate-100 rounded-md" />
            <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-28 w-full bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
          </div>

          {/* Right Preview Skeleton */}
          <div className="invoice-preview-section w-full lg:flex-1 lg:self-stretch min-w-0">
            <div className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-5.5rem)] rounded-2xl border border-slate-200/80 bg-slate-200/40 p-4 sm:p-6 flex flex-col justify-between animate-pulse min-h-[600px]">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-36 bg-slate-100 rounded" />
                  <div className="h-3 w-48 bg-slate-100 rounded" />
                </div>
                <div className="h-8 w-28 bg-slate-100 rounded" />
              </div>
              <div className="h-32 bg-slate-50 rounded-lg border border-slate-100" />
              <div className="flex justify-between items-end">
                <div className="h-16 w-32 bg-slate-50 rounded" />
                <div className="h-16 w-32 bg-slate-50 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Rich SEO & Industry Content Below Workspace Fold */}
        {childrenBelowWorkspace ? (
          <div className="no-print w-full my-12 border-t border-slate-200 pt-10">
            {childrenBelowWorkspace}
          </div>
        ) : null}
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

      // Telemetry tracking
      trackEvent("INVOICE_GENERATED", "public_invoice", {
        grandTotal: summary.grandTotal,
        clientName: draft.client.name,
        template: draft.config.template,
        action: "pdf_download",
      });
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
    <div className="mx-auto flex w-full max-w-[1850px] 2xl:max-w-[2100px] flex-1 flex-col pb-16 md:pb-0">
      {/* Toast Notification */}
      {toast ? (
        <div className="no-print fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200 md:bottom-5 md:right-5">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Top Action Bar (Desktop / Tablet) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3.5 sm:px-4 lg:px-8 xl:px-10 py-2.5 sm:py-3.5 shadow-2xs min-h-[60px]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 truncate max-w-[280px] sm:max-w-none">
              {pageTitle || "SwiftGST — Free Retail POS & GST Billing Software"}
            </h1>
            {badgeText ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-800 border border-emerald-200">
                {badgeText}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-indigo-700 border border-indigo-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Live Editor
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {summary.supplyType === "intra"
              ? "Intra-state: CGST + SGST"
              : summary.supplyType === "inter"
                ? "Inter-state: IGST"
                : "Bill of supply (no GST columns)"}{" "}
            · Total <strong className="text-slate-900 font-bold font-sans tabular-nums">{formatCurrency(summary.grandTotal, draft.meta.currency)}</strong>
          </p>
        </div>
        {/* Mobile Quick Action Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            aria-label="View saved invoices"
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 active:scale-95 transition"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span>Saved</span>
            {savedCount > 0 ? (
              <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold text-emerald-800">
                {savedCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => store.newInvoice()}
            title="Start New Invoice"
            aria-label="Start New Invoice"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 active:scale-95 transition"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </button>
        </div>

        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            Saved invoices
            {savedCount > 0 ? (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                {savedCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => store.newInvoice()}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
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
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            {initialPreset ? "Reset sample" : "Load sample"}
          </button>
          <button
            type="button"
            onClick={handleSaveManual}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition"
          >
            <Save className="h-3.5 w-3.5 text-slate-500" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setWhatsappModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 shadow-2xs active:scale-95 transition"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => {
              trackEvent("INVOICE_GENERATED", "public_invoice", {
                grandTotal: summary.grandTotal,
                clientName: draft.client.name,
                template: draft.config.template,
                action: "print",
              });
              window.print();
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            Print
          </button>
          <button
            type="button"
            onClick={onPdf}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-extrabold text-white disabled:opacity-60 shadow-md shadow-emerald-950/20 active:scale-95 transition"
          >
            <Download className="h-3.5 w-3.5" />
            {busy ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Modern Fintech Hero & Conversion Hooks Strip */}
      <div className="no-print border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-3.5 sm:px-6 lg:px-8 py-3 text-white shadow-xs min-h-[44px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Left: Authority & Trust Tagline */}
          <div className="flex flex-wrap items-center gap-2.5 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Free &amp; Secure
            </span>
            <span className="font-semibold text-slate-200">
              High-Speed GST Invoicing for Indian SMBs, Stores &amp; Freelancers
            </span>
          </div>

          {/* Right: Conversion Hooks */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1 font-semibold bg-white/10 rounded-full px-2.5 py-0.5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span> Zero Login Needed
            </span>
            <span className="inline-flex items-center gap-1 font-semibold bg-white/10 rounded-full px-2.5 py-0.5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span> Instant PDF Download
            </span>
            <span className="inline-flex items-center gap-1 font-semibold bg-white/10 rounded-full px-2.5 py-0.5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span> Zero Watermarks
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 font-semibold bg-white/10 rounded-full px-2.5 py-0.5 border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span> CBIC &amp; GSTR-1 Ready
            </span>
          </div>
        </div>
      </div>

      {/* Social Proof Bar (Stripe-Style) */}
      <div className="no-print border-b border-slate-200/70 bg-white px-4 sm:px-6 lg:px-8 py-2 min-h-[37px]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4 sm:gap-7 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">No signup</span>
              <span className="text-[11px] text-slate-500">Start billing instantly</span>
            </div>
            <div className="h-3 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">GST 2.0</span>
              <span className="text-[11px] text-slate-500">0 / 5 / 18 / 40% slabs</span>
            </div>
            <div className="h-3 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Private</span>
              <span className="text-[11px] text-slate-500">Data stays in your browser</span>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-semibold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Fast, Private &amp; Free Forever</span>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="invoice-workspace-grid w-full max-w-[1850px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-10 py-3 lg:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8 flex-1 min-h-[750px]">
        {/* Left Editor Panel */}
        <aside
          className={`no-print w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] lg:max-w-[760px] shrink-0 pb-28 lg:pb-0 min-h-[600px] ${tab === "form" ? "block" : "hidden"} lg:block`}
        >
          <InvoiceForm grandTotal={summary.grandTotal} />
        </aside>

        {/* Right Preview Studio Panel */}
        <section
          className={`invoice-preview-section w-full lg:flex-1 lg:self-stretch min-w-0 ${tab === "preview" ? "block" : "hidden"} lg:block`}
        >
          <div className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-5.5rem)] flex flex-col rounded-2xl border border-slate-200/90 bg-slate-200/50 shadow-xs overflow-hidden print:static print:h-auto print:border-0 print:bg-transparent">
            {/* Preview Studio Header Bar */}
            <div className="no-print flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white/95 px-3 sm:px-4 py-2 backdrop-blur-xs text-xs">
              {/* Left: Status & Template Picker */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs tracking-tight">Live A4 Preview</span>
                </div>

                {/* Template Quick Switcher */}
                <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-medium">
                  {(["modern", "classic", "creative"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => store.setConfig({ template: t })}
                      className={`capitalize rounded-lg px-2.5 py-0.5 transition ${
                        store.config.template === t
                          ? "bg-slate-900 text-white font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Zoom & Quick Action Controls */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom out"
                    aria-label="Zoom out"
                    className="flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomFit}
                    title="Click to reset to Fit"
                    aria-label="Reset zoom to fit"
                    className="px-2 py-1 text-[10px] font-semibold text-slate-700 min-w-[36px] text-center hover:text-indigo-600"
                  >
                    {zoomMode === "fit" ? "Fit" : `${Math.round(currentScale * 100)}%`}
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom in"
                    aria-label="Zoom in"
                    className="flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleZoomFit}
                  title="Fit to screen"
                  className={`hidden md:inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-[11px] font-semibold transition ${
                    zoomMode === "fit"
                      ? "bg-slate-900 text-white border-slate-900 font-bold shadow-2xs"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>Fit</span>
                </button>

                <div className="h-4 w-px bg-slate-200 mx-0.5 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => {
                    trackEvent("INVOICE_GENERATED", "public_invoice", {
                      grandTotal: summary.grandTotal,
                      clientName: draft.client.name,
                      template: draft.config.template,
                      action: "print",
                    });
                    window.print();
                  }}
                  title="Print Invoice"
                  className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={onPdf}
                  disabled={busy}
                  title="Download PDF"
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 disabled:opacity-60 transition shadow-xs active:scale-95"
                >
                  <Download className="h-3 w-3" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div
              ref={previewContainerRef}
              className="relative flex-1 w-full overflow-auto p-3 sm:p-4 md:p-6 flex items-start justify-center no-scrollbar select-none"
            >
              <div
                className="invoice-scale origin-top transition-transform duration-100 ease-out shrink-0 flex justify-center"
                style={{
                  transform: `scale(${currentScale})`,
                  transformOrigin: "top center",
                  width: 794,
                  marginBottom: currentScale < 1 ? `-${Math.round(1123 * (1 - currentScale))}px` : 0,
                }}
              >
                <InvoicePreview draft={draft} summary={summary} />
              </div>
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
