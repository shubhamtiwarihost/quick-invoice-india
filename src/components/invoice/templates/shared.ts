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
    seller.state ? `${seller.state}${seller.stateCode ? ` (${seller.stateCode})` : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}

export function clientBlock(draft: InvoiceDraft) {
  const { client } = draft;
  return [
    client.billingAddress,
    [client.billingCity, client.billingPincode].filter(Boolean).join(" - "),
    client.billingState ? `${client.billingState}${client.billingStateCode ? ` (${client.billingStateCode})` : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}

export function clientShippingBlock(draft: InvoiceDraft) {
  const { client } = draft;
  if (client.shippingSameAsBilling) {
    return "Same as billing address";
  }
  const formatted = [
    client.shippingAddress,
    [client.shippingCity, client.shippingPincode].filter(Boolean).join(" - "),
    client.shippingState ? `${client.shippingState}${client.shippingStateCode ? ` (${client.shippingStateCode})` : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return formatted || "Same as billing address";
}

export { formatDateIN };
