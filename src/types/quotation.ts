import type { Client, CurrencyCode, InvoiceConfig, LineItem, Seller } from "./invoice";

export interface QuotationMeta {
  quotationNo: string;
  quotationCounter: number;
  quotationDate: string;
  validUntil: string;
  validityDays: number;
  currency: CurrencyCode;
  subject: string;
  notes: string;
  terms: string;
}

export interface QuotationDraft {
  seller: Seller;
  client: Client;
  items: LineItem[];
  meta: QuotationMeta;
  config: InvoiceConfig;
}
