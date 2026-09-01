import type { InvoiceDraft, InvoiceSummary } from "@/types/invoice";
import { currencySymbol, formatDateIN, formatIndianNumber } from "@/lib/format";

export interface TemplateProps {
  draft: InvoiceDraft;
  summary: InvoiceSummary;
  qrDataUrl: string;
}

export function money(n: number, currency: InvoiceDraft["meta"]["currency"]) {
  return `${currencySymbol(currency)}${formatIndianNumber(n)}`;
}

export function sellerBlock(draft: InvoiceDraft) {
  const { seller } = draft;
  return [
    seller.address,
    [seller.city, seller.pincode].filter(Boolean).join(" - "),
    `${seller.state} (${seller.stateCode})`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function clientBlock(draft: InvoiceDraft) {
  const { client } = draft;
  return [
    client.billingAddress,
    [client.billingCity, client.billingPincode].filter(Boolean).join(" - "),
    `${client.billingState} (${client.billingStateCode})`,
  ]
    .filter(Boolean)
    .join(", ");
}

export { formatDateIN };
