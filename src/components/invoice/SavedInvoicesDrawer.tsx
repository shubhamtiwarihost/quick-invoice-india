"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Copy,
  FolderOpen,
  History,
  Pencil,
  Search,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import type { InvoiceDraft, InvoiceStatus, SavedInvoice } from "@/types/invoice";
import {
  deleteSavedInvoice,
  duplicateSavedInvoice,
  getSavedInvoices,
  SAVED_INVOICES_EVENT,
  updateSavedInvoiceStatus,
} from "@/lib/savedInvoices";
import { formatCurrency, formatDateIN } from "@/lib/format";
import { useInvoiceStore } from "@/lib/store";

export function SavedInvoicesDrawer({
  isOpen,
  onClose,
  onLoadInvoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoadInvoice: (draft: InvoiceDraft) => void;
}) {
  const [invoices, setInvoices] = useState<SavedInvoice[]>(() => getSavedInvoices());
  const [search, setSearch] = useState("");
  const invoiceCounter = useInvoiceStore((s) => s.meta.invoiceCounter);
  const [feedback, setFeedback] = useState<string | null>(null);

  function reload() {
    setInvoices(getSavedInvoices());
  }

  useEffect(() => {
    window.addEventListener(SAVED_INVOICES_EVENT, reload);
    return () => {
      window.removeEventListener(SAVED_INVOICES_EVENT, reload);
    };
  }, []);

  function triggerFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.date.toLowerCase().includes(q),
    );
  }, [invoices, search]);

  function handleLoad(inv: SavedInvoice) {
    onLoadInvoice(inv.draft);
    onClose();
  }

  function handleDuplicate(inv: SavedInvoice) {
    const result = duplicateSavedInvoice(inv.id, invoiceCounter);
    if (result) {
      triggerFeedback(`Duplicated as ${result.newInvoice.invoiceNo}`);
      reload();
    }
  }

  function handleDelete(id: string, invoiceNo: string) {
    if (window.confirm(`Delete saved invoice ${invoiceNo}?`)) {
      deleteSavedInvoice(id);
      triggerFeedback(`Invoice ${invoiceNo} deleted`);
      reload();
    }
  }

  function handleStatusChange(id: string, status: InvoiceStatus) {
    updateSavedInvoiceStatus(id, status);
    reload();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Saved Invoices</h2>
              <p className="text-xs text-slate-500">
                {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"} in local history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback ? (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800 border border-teal-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
            <span>{feedback}</span>
          </div>
        ) : null}

        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice no or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs outline-none focus:border-teal-600 focus:bg-white"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {/* Invoices List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <FolderOpen className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                {search ? "No matching invoices" : "No saved invoices yet"}
              </p>
              <p className="mt-1 max-w-[240px] text-xs text-slate-400">
                {search
                  ? "Try searching for a different invoice number or client name."
                  : "Invoices you download as PDF or click 'Save' on will appear here."}
              </p>
            </div>
          ) : (
            filtered.map((inv) => (
              <div
                key={inv.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-teal-500 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 font-mono">
                      {inv.invoiceNo}
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-slate-700">
                      {inv.clientName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatDateIN(inv.date) || inv.date}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(inv.amount, inv.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={inv.status || "Draft"}
                    onChange={(e) =>
                      handleStatusChange(inv.id, e.target.value as InvoiceStatus)
                    }
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium border-0 cursor-pointer outline-none transition ${
                      inv.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : inv.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                {/* Actions Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleLoad(inv)}
                      className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                    >
                      <Pencil className="h-3 w-3" />
                      Load / Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(inv)}
                      title="Duplicate invoice"
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Copy className="h-3 w-3" />
                      Duplicate
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(inv.id, inv.invoiceNo)}
                    title="Delete invoice"
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 text-center text-[11px] text-slate-400">
          Saved locally in your browser storage.
        </div>
      </div>
    </div>
  );
}
