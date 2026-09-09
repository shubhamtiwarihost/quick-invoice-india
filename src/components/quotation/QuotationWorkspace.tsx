"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  Import,
  MessageCircle,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useQuotationStore } from "@/lib/quotationStore";
import { useInvoiceStore } from "@/lib/store";
import { QuotationForm } from "./QuotationForm";
import { QuotationPreview } from "./QuotationPreview";
import { computeInvoice } from "@/lib/gstEngine";
import { formatCurrency, formatDateIN, todayISO, addDaysISO } from "@/lib/format";
import type { InvoiceDraft } from "@/types/invoice";

export function QuotationWorkspace({
  childrenBelowWorkspace,
}: {
  childrenBelowWorkspace?: React.ReactNode;
} = {}) {
  const router = useRouter();
  const quoteStore = useQuotationStore();
  const invoiceStore = useInvoiceStore();
  const setHydrated = quoteStore.setHydrated;

  const [tab, setTab] = useState<"form" | "preview">("form");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  const draft = useMemo(
    () => ({
      seller: quoteStore.seller,
      client: quoteStore.client,
      items: quoteStore.items,
      meta: quoteStore.meta,
      config: quoteStore.config,
    }),
    [
      quoteStore.seller,
      quoteStore.client,
      quoteStore.items,
      quoteStore.meta,
      quoteStore.config,
    ],
  );

  // Compute summary by converting draft to invoice format
  const summary = useMemo(() => {
    const invDraft: InvoiceDraft = {
      seller: draft.seller,
      client: draft.client,
      items: draft.items,
      config: draft.config,
      meta: {
        invoiceNo: draft.meta.quotationNo,
        invoiceCounter: draft.meta.quotationCounter,
        invoiceDate: draft.meta.quotationDate,
        dueDate: draft.meta.validUntil,
        currency: draft.meta.currency,
        notes: draft.meta.notes,
        terms: draft.meta.terms,
      },
    };
    return computeInvoice(invDraft);
  }, [draft]);

  if (!quoteStore.hydrated) {
    return (
      <div className="mx-auto flex w-full max-w-[1850px] 2xl:max-w-[2100px] flex-1 flex-col pb-16 md:pb-0 min-h-[850px]">
        {/* Placeholder Top Action Bar */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-3.5 sm:px-4 lg:px-8 xl:px-10 py-2 sm:py-3 h-[57px]">
          <div className="h-5 w-48 rounded-md bg-slate-100 animate-pulse" />
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-28 rounded-lg bg-teal-50 animate-pulse" />
          </div>
        </div>

        {/* Placeholder Workspace Grid */}
        <div className="invoice-workspace-grid w-full max-w-[1850px] 2xl:max-w-[2100px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-10 py-3 lg:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8 flex-1 min-h-[750px]">
          {/* Left Editor Skeleton (44%) */}
          <div className="no-print w-full lg:w-[47%] xl:w-[45%] 2xl:w-[44%] shrink-0 min-h-[600px] rounded-2xl border border-slate-200 bg-white p-5 space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-slate-100 rounded-md" />
            <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-28 w-full bg-slate-50 rounded-xl border border-slate-100" />
          </div>

          {/* Right Preview Skeleton (56%) */}
          <div className="invoice-preview-section w-full lg:w-[53%] xl:w-[55%] 2xl:w-[56%] lg:flex-1 rounded-2xl bg-slate-100/80 border border-slate-200/70 p-3 sm:p-4 lg:p-6 min-h-[600px] flex justify-center">
            <div className="w-full flex justify-center min-h-[600px]">
              <div className="bg-white shadow-xl rounded-sm w-[794px] lg:w-full lg:max-w-[820px] aspect-[1/1.414] min-h-[600px] border border-slate-200/60 p-8 flex flex-col justify-between animate-pulse">
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
        </div>

        {/* Rich SEO & Editorial Content Below Workspace Fold */}
        {childrenBelowWorkspace ? (
          <div className="no-print w-full my-12 border-t border-slate-200 pt-10">
            {childrenBelowWorkspace}
          </div>
        ) : null}
      </div>
    );
  }

  // 1-Click Convert to Invoice
  function handleConvertToInvoice() {
    const nextCounter = (invoiceStore.meta.invoiceCounter || 12) + 1;
    const invNo = `INV-${new Date().getFullYear()}-${String(nextCounter).padStart(3, "0")}`;

    const newInvoiceDraft: InvoiceDraft = {
      seller: { ...draft.seller },
      client: { ...draft.client },
      items: draft.items.map((it) => ({ ...it })),
      config: { ...draft.config },
      meta: {
        invoiceCounter: nextCounter,
        invoiceNo: invNo,
        invoiceDate: todayISO(),
        dueDate: addDaysISO(todayISO(), 15),
        currency: draft.meta.currency,
        notes: draft.meta.notes
          ? `${draft.meta.notes}\n[Converted from Quotation #${draft.meta.quotationNo}]`
          : `Converted from Quotation #${draft.meta.quotationNo}`,
        terms: draft.meta.terms,
      },
    };

    invoiceStore.loadDraft(newInvoiceDraft);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("qi_converted_from", draft.meta.quotationNo);
    }

    router.push("/?converted=true");
  }

  async function onPdf() {
    const el = document.getElementById("quotation-a4");
    if (!el) {
      showToast("Quotation preview not found.");
      return;
    }
    setBusy(true);
    try {
      const safeNo = draft.meta.quotationNo.trim().replace(/[\\/:*?"<>|]/g, "-") || "quotation";
      const { downloadInvoicePdf } = await import("@/lib/exportPdf");
      await downloadInvoicePdf(el, `${safeNo}.pdf`);
      showToast(`Downloaded quotation ${draft.meta.quotationNo}!`);
    } catch (err) {
      console.error("Quotation PDF generation failed:", err);
      showToast("Failed to generate PDF. Please try again or use Print.");
    } finally {
      setBusy(false);
    }
  }

  function handleShareWhatsApp() {
    const phone = draft.client.phone.replace(/[^0-9]/g, "");
    const formattedTotal = formatCurrency(summary.grandTotal, draft.meta.currency);
    const validUntilStr = formatDateIN(draft.meta.validUntil) || draft.meta.validUntil;

    const message = `Hello ${draft.client.name || "Sir/Madam"},\n\nPlease find our formal quotation *#${draft.meta.quotationNo}* from *${draft.seller.businessName}*.\n\n*Estimated Total:* ${formattedTotal}\n*Quotation Validity:* Valid until ${validUntilStr}\n\nPlease let us know if you have any questions or approval to proceed with the invoice.\n\nThank you!`;

    const encoded = encodeURIComponent(message);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  }

  function handleImportFromInvoice() {
    if (confirm("Import company details, client info, and items from your active Invoice draft?")) {
      quoteStore.importFromInvoice({
        seller: invoiceStore.seller,
        client: invoiceStore.client,
        items: invoiceStore.items,
        config: invoiceStore.config,
        meta: invoiceStore.meta,
      });
      showToast("Imported active invoice data into quotation!");
    }
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

      {/* Top Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-200 bg-white px-3.5 sm:px-4 lg:px-8 xl:px-10 py-2 sm:py-3">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900">
              <FileCheck2 className="h-3 w-3" />
              Estimate & Quotation Maker
            </span>
            <p className="text-xs text-slate-500 hidden sm:inline">
              Valid until {formatDateIN(draft.meta.validUntil)} ({draft.meta.validityDays} Days)
            </p>
          </div>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
            {summary.supplyType === "intra"
              ? "Intra-state: CGST + SGST"
              : summary.supplyType === "inter"
                ? "Inter-state: IGST"
                : "Non-GST Estimate"}{" "}
            · Estimated Total:{" "}
            <strong className="text-slate-800 font-sans tabular-nums">
              {formatCurrency(summary.grandTotal, draft.meta.currency)}
            </strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          {/* CONVERT TO INVOICE - Standout CTA */}
          <button
            type="button"
            onClick={handleConvertToInvoice}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-teal-800 hover:to-emerald-800 active:scale-95 transition"
            title="Convert this quotation directly into an official GST Tax Invoice"
          >
            <span>Convert to Invoice</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleImportFromInvoice}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 active:scale-95"
            title="Import company and client info from your current invoice draft"
          >
            <Import className="h-3.5 w-3.5 text-slate-500" />
            Import Invoice
          </button>

          <button
            type="button"
            onClick={() => quoteStore.newQuotation()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-slate-500" />
            New Quote
          </button>

          <button
            type="button"
            onClick={() => quoteStore.resetDraft()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            Sample
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            Print
          </button>

          <button
            type="button"
            onClick={onPdf}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-60 shadow-xs active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            {busy ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="invoice-workspace-grid w-full max-w-[1850px] 2xl:max-w-[2100px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-10 py-3 lg:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8 flex-1 min-h-[750px]">
        {/* Left Editor Panel (44%-47%) */}
        <aside
          className={`no-print w-full lg:w-[47%] xl:w-[45%] 2xl:w-[44%] shrink-0 pb-28 lg:pb-0 min-h-[600px] ${
            tab === "form" ? "block" : "hidden"
          } lg:block`}
        >
          <QuotationForm grandTotal={summary.grandTotal} />
        </aside>

        {/* Right Preview Panel (53%-56%) */}
        <section
          className={`invoice-preview-section w-full lg:w-[53%] xl:w-[55%] 2xl:w-[56%] lg:flex-1 lg:self-stretch rounded-2xl bg-slate-100/80 border border-slate-200/70 p-3 sm:p-4 lg:p-6 pb-32 lg:pb-6 flex justify-center min-h-[600px] ${
            tab === "preview" ? "block" : "hidden"
          } lg:block`}
        >
          <div className="lg:sticky lg:top-20 flex justify-center w-full print:static will-change-transform transform-gpu max-h-none lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto no-scrollbar">
            <div className="invoice-scale w-full flex justify-center min-h-[600px]">
              <QuotationPreview draft={draft} summary={summary} />
            </div>
          </div>
        </section>
      </div>

      {/* Rich SEO & Editorial Content Below Workspace Fold */}
      {childrenBelowWorkspace ? (
        <div className="no-print w-full my-12 border-t border-slate-200 pt-10">
          {childrenBelowWorkspace}
        </div>
      ) : null}

      {/* Mobile Floating Actions */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-md md:hidden pb-[calc(env(safe-area-inset-bottom)+8px)] will-change-transform transform-gpu">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab("form")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              tab === "form"
                ? "bg-teal-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Edit Quote
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              tab === "preview"
                ? "bg-teal-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Preview A4
          </button>
        </div>

        <button
          type="button"
          onClick={handleConvertToInvoice}
          className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm"
        >
          <span>To Invoice</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
