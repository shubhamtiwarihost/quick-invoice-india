import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Client,
  InvoiceConfig,
  InvoiceDraft,
  InvoiceMeta,
  LineItem,
  Seller,
} from "@/types/invoice";
import { addDaysISO, newItemId, todayISO } from "@/lib/format";
import { nextInvoiceNumber } from "@/lib/gstEngine";

const today = todayISO();

const defaultSeller: Seller = {
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
    accountNumber: "50100123456789",
    ifsc: "HDFC0001234",
    accountHolder: "Aarav Crafts & Design Studio",
    upiId: "aaravcrafts@okhdfcbank",
  },
  signatoryName: "Aarav Mehta",
  signatureImage: "",
};

const defaultClient: Client = {
  name: "Bloom Boutique Pvt Ltd",
  gstin: "27AABCB1234C1Z8",
  billingAddress: "22, Linking Road, Bandra West",
  billingCity: "Mumbai",
  billingPincode: "400050",
  billingState: "Maharashtra",
  billingStateCode: "27",
  shippingSameAsBilling: true,
  shippingAddress: "22, Linking Road, Bandra West",
  shippingCity: "Mumbai",
  shippingPincode: "400050",
  shippingState: "Maharashtra",
  shippingStateCode: "27",
  placeOfSupply: "Maharashtra",
  placeOfSupplyCode: "27",
  phone: "+91 91234 56789",
  email: "accounts@bloomboutique.in",
};

const defaultItems: LineItem[] = [
  {
    id: "sample-1",
    description: "Brand identity & storefront design",
    hsnSac: "998314",
    quantity: 1,
    unit: "Hrs",
    rate: 18000,
    discountType: "percent",
    discountValue: 0,
    gstSlab: 18,
  },
  {
    id: "sample-2",
    description: "Printed lookbook (A4, 32 pages)",
    hsnSac: "491110",
    quantity: 50,
    unit: "Pcs",
    rate: 120,
    discountType: "percent",
    discountValue: 5,
    gstSlab: 12,
  },
  {
    id: "sample-3",
    description: "Organic cotton tote bags with print",
    hsnSac: "420222",
    quantity: 80,
    unit: "Nos",
    rate: 95,
    discountType: "flat",
    discountValue: 0,
    gstSlab: 5,
  },
];

const defaultMeta: InvoiceMeta = {
  invoiceNo: nextInvoiceNumber(12),
  invoiceCounter: 12,
  invoiceDate: today,
  dueDate: addDaysISO(today, 15),
  currency: "INR",
  notes: "Thank you for your business. Please quote the invoice number in all payments.",
  terms:
    "1. Goods once sold will not be taken back.\n2. Interest @ 18% p.a. will be charged on delayed payments.\n3. Subject to Mumbai jurisdiction.",
};

const defaultConfig: InvoiceConfig = {
  gstMode: "gst",
  reverseCharge: false,
  autoRoundOff: true,
  manualRoundOff: 0,
  template: "modern",
  accentColor: "#0f766e",
};

export const defaultDraft: InvoiceDraft = {
  seller: defaultSeller,
  client: defaultClient,
  items: defaultItems,
  meta: defaultMeta,
  config: defaultConfig,
};

type InvoiceStore = InvoiceDraft & {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setSeller: (patch: Partial<Seller>) => void;
  setBank: (patch: Partial<Seller["bank"]>) => void;
  setClient: (patch: Partial<Client>) => void;
  setMeta: (patch: Partial<InvoiceMeta>) => void;
  setConfig: (patch: Partial<InvoiceConfig>) => void;
  addItem: () => void;
  updateItem: (id: string, patch: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  resetDraft: () => void;
  newInvoice: () => void;
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      ...defaultDraft,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setSeller: (patch) => set({ seller: { ...get().seller, ...patch } }),
      setBank: (patch) =>
        set({
          seller: { ...get().seller, bank: { ...get().seller.bank, ...patch } },
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
        set({ client });
      },
      setMeta: (patch) => set({ meta: { ...get().meta, ...patch } }),
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
              unit: "Pcs",
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
            item.id === id ? { ...item, ...patch } : item,
          ),
        }),
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      resetDraft: () => set({ ...defaultDraft }),
      newInvoice: () => {
        const counter = get().meta.invoiceCounter + 1;
        set({
          ...defaultDraft,
          seller: get().seller,
          meta: {
            ...defaultDraft.meta,
            invoiceCounter: counter,
            invoiceNo: nextInvoiceNumber(counter),
            invoiceDate: todayISO(),
            dueDate: addDaysISO(todayISO(), 15),
          },
          items: [
            {
              id: newItemId(),
              description: "",
              hsnSac: "",
              quantity: 1,
              unit: "Pcs",
              rate: 0,
              discountType: "percent",
              discountValue: 0,
              gstSlab: 18,
            },
          ],
          client: {
            ...defaultDraft.client,
            name: "",
            gstin: "",
            billingAddress: "",
            billingCity: "",
            billingPincode: "",
            phone: "",
            email: "",
            shippingAddress: "",
            shippingCity: "",
            shippingPincode: "",
          },
        });
      },
    }),
    {
      name: "quick-invoice-india-draft",
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
