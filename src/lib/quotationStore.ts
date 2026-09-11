import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client, InvoiceConfig, InvoiceDraft, LineItem, Seller } from "@/types/invoice";
import type { QuotationDraft, QuotationMeta } from "@/types/quotation";
import { addDaysISO, newItemId, todayISO } from "@/lib/format";
import {
  sanitizeBankDetails,
  sanitizeClient,
  sanitizeLineItem,
  sanitizeMultilineText,
  sanitizeSeller,
  sanitizeText,
} from "@/lib/sanitize";

const today = todayISO();

export const defaultQuotationSeller: Seller = {
  businessName: "Aarav Crafts & Design Studio",
  logo: "",
  gstin: "27AAPCA1234A1Z5",
  pan: "AAPCA1234A",
  address: "14, Kala Ghoda Lane, Fort",
  city: "Mumbai",
  pincode: "400001",
  state: "Maharashtra",
  stateCode: "27",
  phone: "+91 98765 43210",
  email: "hello@aaravcrafts.in",
  bank: {
    bankName: "HDFC Bank",
    accountNumber: "123456789012",
    ifsc: "HDFC0000000",
    accountHolder: "Aarav Crafts & Design Studio",
    upiId: "aaravcrafts@okhdfcbank",
  },
  signatoryName: "Aarav Mehta",
  signatureImage: "",
};

export const defaultQuotationClient: Client = {
  name: "Horizon Enterprises Ltd",
  gstin: "27AAACH1234P1Z2",
  billingAddress: "404, Tech Park, Powai",
  billingCity: "Mumbai",
  billingPincode: "400076",
  billingState: "Maharashtra",
  billingStateCode: "27",
  shippingSameAsBilling: true,
  shippingAddress: "404, Tech Park, Powai",
  shippingCity: "Mumbai",
  shippingPincode: "400076",
  shippingState: "Maharashtra",
  shippingStateCode: "27",
  placeOfSupply: "Maharashtra",
  placeOfSupplyCode: "27",
  phone: "+91 98200 12345",
  email: "procurement@horizonenterprises.in",
};

export const defaultQuotationItems: LineItem[] = [
  {
    id: "quote-1",
    description: "Custom Web Application UI/UX Design (Figma Prototype)",
    hsnSac: "998314",
    quantity: 1,
    unit: "Nos",
    rate: 45000,
    discountType: "percent",
    discountValue: 10,
    gstSlab: 18,
  },
  {
    id: "quote-2",
    description: "Frontend Development & Responsive Integration (Next.js & Tailwind)",
    hsnSac: "998313",
    quantity: 1,
    unit: "Nos",
    rate: 65000,
    discountType: "percent",
    discountValue: 5,
    gstSlab: 18,
  },
  {
    id: "quote-3",
    description: "Cloud Architecture Setup & Production Deployment Support",
    hsnSac: "998319",
    quantity: 1,
    unit: "Nos",
    rate: 15000,
    discountType: "flat",
    discountValue: 0,
    gstSlab: 18,
  },
];

export const defaultQuotationMeta: QuotationMeta = {
  quotationNo: "QT-2026-001",
  quotationCounter: 1,
  quotationDate: today,
  validityDays: 15,
  validUntil: addDaysISO(today, 15),
  currency: "INR",
  subject: "Quotation for Web Application Design & Engineering",
  notes: "We are pleased to submit this formal price quotation for your project. Please review the itemized scope and terms below.",
  terms: "1. Quotation Validity: Valid for 15 days from date of issue.\n2. Milestone Payments: 50% advance to initiate work, 50% upon milestone delivery.\n3. GST: Levied at statutory rates as applicable.\n4. Revisions: Includes 2 rounds of iterative feedback and client adjustments.",
};

export const defaultQuotationConfig: InvoiceConfig = {
  gstMode: "gst",
  reverseCharge: false,
  autoRoundOff: true,
  manualRoundOff: 0,
  template: "modern",
  accentColor: "#DEBA5F",
};

export const defaultQuotationDraft: QuotationDraft = {
  seller: defaultQuotationSeller,
  client: defaultQuotationClient,
  items: defaultQuotationItems,
  meta: defaultQuotationMeta,
  config: defaultQuotationConfig,
};

type QuotationStore = QuotationDraft & {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setSeller: (patch: Partial<Seller>) => void;
  setBank: (patch: Partial<Seller["bank"]>) => void;
  setClient: (patch: Partial<Client>) => void;
  setMeta: (patch: Partial<QuotationMeta>) => void;
  setConfig: (patch: Partial<InvoiceConfig>) => void;
  setValidityDays: (days: number) => void;
  addItem: () => void;
  updateItem: (id: string, patch: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  resetDraft: () => void;
  newQuotation: () => void;
  importFromInvoice: (invoiceDraft: InvoiceDraft) => void;
};

export const useQuotationStore = create<QuotationStore>()(
  persist(
    (set, get) => ({
      ...defaultQuotationDraft,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setSeller: (patch) =>
        set({ seller: sanitizeSeller({ ...get().seller, ...patch }) }),
      setBank: (patch) =>
        set({
          seller: {
            ...get().seller,
            bank: sanitizeBankDetails({ ...get().seller.bank, ...patch }),
          },
        }),
      setClient: (patch) => {
        const client = { ...get().client, ...patch };
        if (client.shippingSameAsBilling) {
          client.shippingAddress = client.billingAddress;
          client.shippingCity = client.billingCity;
          client.shippingPincode = client.billingPincode;
          client.shippingState = client.billingState;
          client.shippingStateCode = client.billingStateCode;
        }
        set({ client: sanitizeClient(client) });
      },
      setMeta: (patch) => {
        const current = get().meta;
        const updated = {
          ...current,
          ...patch,
          quotationNo:
            patch.quotationNo !== undefined
              ? sanitizeText(patch.quotationNo, 64)
              : current.quotationNo,
          subject:
            patch.subject !== undefined
              ? sanitizeText(patch.subject, 200)
              : current.subject,
          notes:
            patch.notes !== undefined
              ? sanitizeMultilineText(patch.notes, 2000)
              : current.notes,
          terms:
            patch.terms !== undefined
              ? sanitizeMultilineText(patch.terms, 3000)
              : current.terms,
        };
        if (patch.quotationDate && !patch.validUntil) {
          updated.validUntil = addDaysISO(patch.quotationDate, updated.validityDays);
        }
        set({ meta: updated });
      },
      setValidityDays: (days: number) => {
        const quoteDate = get().meta.quotationDate || todayISO();
        set({
          meta: {
            ...get().meta,
            validityDays: Math.max(1, Math.min(365, Number(days) || 15)),
            validUntil: addDaysISO(quoteDate, days),
          },
        });
      },
      setConfig: (patch) => set({ config: { ...get().config, ...patch } }),
      addItem: () =>
        set({
          items: [
            ...get().items,
            {
              id: newItemId(),
              description: "",
              hsnSac: "",
              quantity: 1,
              unit: "Nos",
              rate: 0,
              discountType: "percent",
              discountValue: 0,
              gstSlab: 18,
            },
          ],
        }),
      updateItem: (id, patch) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? sanitizeLineItem({ ...item, ...patch }) : item,
          ),
        }),
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      resetDraft: () => set({ ...defaultQuotationDraft }),
      newQuotation: () => {
        const nextCounter = get().meta.quotationCounter + 1;
        const currentYear = new Date().getFullYear();
        const numStr = String(nextCounter).padStart(3, "0");
        const nextNo = `QT-${currentYear}-${numStr}`;
        const newToday = todayISO();
        set({
          ...defaultQuotationDraft,
          seller: get().seller,
          meta: {
            ...defaultQuotationDraft.meta,
            quotationCounter: nextCounter,
            quotationNo: nextNo,
            quotationDate: newToday,
            validUntil: addDaysISO(newToday, 15),
          },
          items: [
            {
              id: newItemId(),
              description: "",
              hsnSac: "",
              quantity: 1,
              unit: "Nos",
              rate: 0,
              discountType: "percent",
              discountValue: 0,
              gstSlab: 18,
            },
          ],
          client: {
            ...defaultQuotationDraft.client,
            name: "",
            gstin: "",
            billingAddress: "",
            billingCity: "",
            billingPincode: "",
            phone: "",
            email: "",
          },
        });
      },
      importFromInvoice: (invoiceDraft: InvoiceDraft) => {
        set({
          seller: { ...invoiceDraft.seller },
          client: { ...invoiceDraft.client },
          items: invoiceDraft.items.map((it) => ({ ...it, id: newItemId() })),
          config: { ...invoiceDraft.config },
        });
      },
    }),
    {
      name: "quick-invoice-india-quotation-draft",
      skipHydration: true,
      partialize: (state) => ({
        seller: state.seller,
        client: state.client,
        items: state.items,
        meta: state.meta,
        config: state.config,
      }),
    },
  ),
);
