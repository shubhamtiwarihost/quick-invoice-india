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
import { downloadInvoicePdf } from "@/lib/exportPdf";
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
      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Loading quotation maker…
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
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col pb-16 md:pb-0">
      {/* Toast Notification */}
      {toast ? (
        <div className="no-print fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200 md:bottom-5 md:right-5">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Top Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 sm:py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-900">
              <FileCheck2 className="h-3 w-3" />
              Estimate & Quotation Maker
            </span>
            <p className="text-xs text-slate-500 hidden sm:inline">
              Valid until {formatDateIN(draft.meta.validUntil)} ({draft.meta.validityDays} Days)
            </p>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {summary.supplyType === "intra"
              ? "Intra-state: CGST + SGST"
              : summary.supplyType === "inter"
                ? "Inter-state: IGST"
                : "Non-GST Estimate"}{" "}
            · Estimated Total:{" "}
            <strong className="text-slate-800">
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
      <div className="invoice-workspace-grid grid flex-1 lg:grid-cols-[minmax(340px,440px)_1fr]">
        <aside
          className={`no-print overflow-y-auto bg-slate-50 p-3 pb-24 md:pb-3 ${
            tab === "form" ? "block" : "hidden"
          } lg:block`}
        >
          <QuotationForm grandTotal={summary.grandTotal} />
        </aside>

        <section
          className={`invoice-preview-section overflow-auto bg-slate-200/70 p-4 pb-36 md:pb-4 ${
            tab === "preview" ? "block" : "hidden"
          } lg:block`}
        >
          <div className="invoice-scale mx-auto w-fit">
            <QuotationPreview draft={draft} summary={summary} />
          </div>
        </section>
      </div>

      {/* Rich SEO & Editorial Content Below Workspace Fold */}
      {childrenBelowWorkspace ? (
        <div className="no-print w-full bg-white border-t border-slate-200">
          {childrenBelowWorkspace}
        </div>
      ) : null}

      {/* Mobile Floating Actions */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur-md md:hidden">
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
