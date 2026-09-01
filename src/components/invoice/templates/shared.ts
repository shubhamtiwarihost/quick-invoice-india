import type { InvoiceDraft, InvoiceSummary } from "@/types/invoice";
import { cleanTerms, formatDateIN, formatCurrency } from "@/lib/format";

export interface TemplateProps {
  draft: InvoiceDraft;
  summary: InvoiceSummary;
  qrDataUrl: string;
}

export const money = formatCurrency;
export { formatCurrency, cleanTerms };

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
