export type GstMode = "gst" | "non-gst";
export type DiscountType = "percent" | "flat";
export type InvoiceTemplate = "modern" | "classic" | "creative";
export type CurrencyCode = "INR" | "USD" | "EUR";
export type ItemUnit = "Pcs" | "Mtrs" | "Hrs" | "Nos" | "Bags" | "Kgs";
// 12 and 28 are legacy slabs (removed by GST 2.0 on 22 Sep 2025) kept so older saved invoices still load.
export type GstSlab = 0 | 3 | 5 | 12 | 18 | 28 | 40;

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  upiId: string;
}

export interface Seller {
  businessName: string;
  logo: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  stateCode: string;
  phone: string;
  email: string;
  bank: BankDetails;
  signatoryName: string;
  signatureImage: string;
}

export interface Client {
  name: string;
  gstin: string;
  billingAddress: string;
  billingCity: string;
  billingPincode: string;
  billingState: string;
  billingStateCode: string;
  shippingSameAsBilling: boolean;
  shippingAddress: string;
  shippingCity: string;
  shippingPincode: string;
  shippingState: string;
  shippingStateCode: string;
  placeOfSupply: string;
  placeOfSupplyCode: string;
  phone: string;
  email: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  unit: ItemUnit;
  rate: number;
  discountType: DiscountType;
  discountValue: number;
  gstSlab: GstSlab;
}

export interface InvoiceMeta {
  invoiceNo: string;
  invoiceCounter: number;
  invoiceDate: string;
  dueDate: string;
  currency: CurrencyCode;
  notes: string;
  terms: string;
}

export interface InvoiceConfig {
  gstMode: GstMode;
  reverseCharge: boolean;
  autoRoundOff: boolean;
  manualRoundOff: number;
  template: InvoiceTemplate;
  accentColor: string;
}

export interface LineComputation {
  id: string;
  taxable: number;
  discountAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  tax: number;
  lineTotal: number;
}

export interface InvoiceSummary {
  supplyType: "intra" | "inter" | "none";
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  lines: LineComputation[];
}

export interface InvoiceDraft {
  seller: Seller;
  client: Client;
  items: LineItem[];
  meta: InvoiceMeta;
  config: InvoiceConfig;
}

export type InvoiceStatus = "Draft" | "Pending" | "Paid";

export interface SavedInvoice {
  id: string;
  savedAt: string;
  invoiceNo: string;
  clientName: string;
  date: string;
  amount: number;
  currency: CurrencyCode;
  status: InvoiceStatus;
  draft: InvoiceDraft;
}
