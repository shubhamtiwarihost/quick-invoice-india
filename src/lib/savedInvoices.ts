import type { InvoiceDraft, InvoiceStatus, SavedInvoice } from "@/types/invoice";
import { nextInvoiceNumber } from "@/lib/gstEngine";
import { todayISO } from "@/lib/format";

const STORAGE_KEY = "saved_invoices_history";
export const SAVED_INVOICES_EVENT = "quick-invoice:saved_invoices_updated";

export function getSavedInvoices(): SavedInvoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInvoiceToHistory(
  draft: InvoiceDraft,
  amount: number,
  status: InvoiceStatus = "Draft",
): SavedInvoice {
  const current = getSavedInvoices();
  const existingIndex = current.findIndex(
    (item) =>
      item.invoiceNo === draft.meta.invoiceNo &&
      item.draft.meta.invoiceDate === draft.meta.invoiceDate,
  );

  const entry: SavedInvoice = {
    id:
      existingIndex >= 0
        ? current[existingIndex].id
        : `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    savedAt: new Date().toISOString(),
    invoiceNo: draft.meta.invoiceNo || "Draft Invoice",
    clientName: draft.client.name || "Unnamed Client",
    date: draft.meta.invoiceDate || todayISO(),
    amount: Number.isFinite(amount) ? amount : 0,
    currency: draft.meta.currency || "INR",
    status: existingIndex >= 0 ? current[existingIndex].status : status,
    draft: JSON.parse(JSON.stringify(draft)),
  };

  let updated: SavedInvoice[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = entry;
  } else {
    updated = [entry, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(SAVED_INVOICES_EVENT));
  } catch (e) {
    console.error("Failed to save invoice to history", e);
  }

  return entry;
}

export function deleteSavedInvoice(id: string): void {
  const current = getSavedInvoices();
  const filtered = current.filter((inv) => inv.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event(SAVED_INVOICES_EVENT));
  } catch (e) {
    console.error("Failed to delete invoice from history", e);
  }
}

export function updateSavedInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): void {
  const current = getSavedInvoices();
  const updated = current.map((inv) =>
    inv.id === id ? { ...inv, status, savedAt: new Date().toISOString() } : inv,
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(SAVED_INVOICES_EVENT));
  } catch (e) {
    console.error("Failed to update invoice status", e);
  }
}

export function duplicateSavedInvoice(
  id: string,
  latestCounter: number,
): { newInvoice: SavedInvoice; draft: InvoiceDraft } | null {
  const current = getSavedInvoices();
  const original = current.find((inv) => inv.id === id);
  if (!original) return null;

  const nextCounter = latestCounter + 1;
  const nextNo = nextInvoiceNumber(nextCounter);
  const clonedDraft: InvoiceDraft = JSON.parse(JSON.stringify(original.draft));
  clonedDraft.meta.invoiceCounter = nextCounter;
  clonedDraft.meta.invoiceNo = nextNo;
  clonedDraft.meta.invoiceDate = todayISO();

  const newEntry = saveInvoiceToHistory(clonedDraft, original.amount, "Draft");
  return { newInvoice: newEntry, draft: clonedDraft };
}
