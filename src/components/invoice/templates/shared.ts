import type { InvoiceDraft, InvoiceSummary } from "@/types/invoice";
import { cleanTerms, formatDateIN, formatCurrency } from "@/lib/format";
import { sanitizeImageUrl, sanitizeText } from "@/lib/sanitize";

export interface TemplateProps {
  draft: InvoiceDraft;
  summary: InvoiceSummary;
  qrDataUrl: string;
}

export const money = formatCurrency;
export { formatCurrency, cleanTerms, sanitizeImageUrl, sanitizeText };

export function sellerBlock(draft: InvoiceDraft) {
  const { seller } = draft;
  return [
    sanitizeText(seller.address),
    [sanitizeText(seller.city), sanitizeText(seller.pincode)].filter(Boolean).join(" - "),
    seller.state ? `${sanitizeText(seller.state)}${seller.stateCode ? ` (${sanitizeText(seller.stateCode)})` : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}

export function clientBlock(draft: InvoiceDraft) {
  const { client } = draft;
  return [
    sanitizeText(client.billingAddress),
    [sanitizeText(client.billingCity), sanitizeText(client.billingPincode)].filter(Boolean).join(" - "),
    client.billingState ? `${sanitizeText(client.billingState)}${client.billingStateCode ? ` (${sanitizeText(client.billingStateCode)})` : ""}` : "",
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
    sanitizeText(client.shippingAddress),
    [sanitizeText(client.shippingCity), sanitizeText(client.shippingPincode)].filter(Boolean).join(" - "),
    client.shippingState ? `${sanitizeText(client.shippingState)}${client.shippingStateCode ? ` (${sanitizeText(client.shippingStateCode)})` : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return formatted || "Same as billing address";
}

export { formatDateIN };
