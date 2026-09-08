/**
 * SwiftGST Security & Input Sanitization Utilities
 * Prevents Cross-Site Scripting (XSS), script injection, and payload execution
 * across generated invoice PDFs, previews, HTML renderers, and templates.
 */

import type {
  BankDetails,
  Client,
  InvoiceDraft,
  InvoiceMeta,
  LineItem,
  Seller,
} from "@/types/invoice";

/**
 * Strips HTML tags, script elements, inline event handlers, and dangerous protocols.
 */
export function sanitizeText(val: unknown, maxLength: number = 2000): string {
  if (val === null || val === undefined) return "";
  let str = String(val);

  // 1. Strip null bytes and control characters (except newline, carriage return, tab)
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 2. Strip <script>...</script>, <style>...</style>, <iframe>...</iframe> and other active elements completely
  str = str.replace(/<\s*(?:script|style|iframe|object|embed|applet|form|input|button|svg|math)[^>]*>[\s\S]*?<\s*\/\s*(?:script|style|iframe|object|embed|applet|form|input|button|svg|math)\s*>/gi, "");

  // 3. Strip any remaining HTML tags (<...>)
  str = str.replace(/<[^>]*>/g, "");

  // 4. Strip dangerous pseudo-protocols (javascript:, vbscript:, data:text/html)
  str = str.replace(/(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, "");

  // 5. Strip inline event handlers that might have survived (e.g. onerror=, onload=)
  str = str.replace(/\bon\w+\s*=/gi, "");

  // 6. Enforce maximum length limit to mitigate DoS payloads
  if (maxLength > 0 && str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  return str.trim();
}

/**
 * Sanitizes multi-line text (such as invoice notes, terms & conditions, addresses)
 * preserving safe line breaks while stripping dangerous HTML/scripts.
 */
export function sanitizeMultilineText(val: unknown, maxLength: number = 4000): string {
  if (val === null || val === undefined) return "";
  const lines = String(val).split(/\r\n|\r|\n/);
  const sanitizedLines = lines.map((line) => sanitizeText(line, maxLength));
  return sanitizedLines.join("\n").slice(0, maxLength).trim();
}

/**
 * Validates and sanitizes image URLs (logos, signatures).
 * Strictly permits safe HTTP/HTTPS URLs, blob URLs, and base64 raster image data URIs.
 * Disallows SVG data URIs (which can contain embedded JS) and javascript: URLs.
 */
export function sanitizeImageUrl(url: unknown): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // 1. Safe raster base64 data URIs (PNG, JPEG, WebP, GIF)
  const safeDataUriPattern = /^data:image\/(png|jpe?g|webp|gif|bmp);base64,[A-Za-z0-9+/=]+$/i;
  if (safeDataUriPattern.test(trimmed)) {
    return trimmed;
  }

  // 2. Safe blob URLs
  if (/^blob:https?:\/\/[A-Za-z0-9.-]+(?::\d+)?\/[A-Za-z0-9-]+$/i.test(trimmed) || /^blob:[A-Za-z0-9-]+$/i.test(trimmed)) {
    return trimmed;
  }

  // 3. Safe HTTP/HTTPS URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // If it's a safe relative path like /logo.png
    if (/^\/[A-Za-z0-9_\-./]+\.(png|jpe?g|webp|gif|svg|ico)$/i.test(trimmed)) {
      return trimmed;
    }
  }

  // Any other URL scheme (javascript:, vbscript:, data:text/html, etc.) is rejected
  return "";
}

/**
 * Validates a number, returning a fallback if invalid or NaN.
 */
export function sanitizeNumber(val: unknown, fallback: number = 0, min?: number, max?: number): number {
  const num = typeof val === "number" ? val : parseFloat(String(val));
  if (!Number.isFinite(num) || Number.isNaN(num)) return fallback;
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  return num;
}

/**
 * Sanitizes Bank details object
 */
export function sanitizeBankDetails(bank: Partial<BankDetails> | undefined): BankDetails {
  return {
    bankName: sanitizeText(bank?.bankName, 100),
    accountNumber: sanitizeText(bank?.accountNumber, 50),
    ifsc: sanitizeText(bank?.ifsc, 20).toUpperCase(),
    accountHolder: sanitizeText(bank?.accountHolder, 150),
    upiId: sanitizeText(bank?.upiId, 100).toLowerCase(),
  };
}

/**
 * Sanitizes Seller profile
 */
export function sanitizeSeller(seller: Partial<Seller> | undefined): Seller {
  return {
    businessName: sanitizeText(seller?.businessName, 200),
    logo: sanitizeImageUrl(seller?.logo),
    gstin: sanitizeText(seller?.gstin, 20).toUpperCase(),
    pan: sanitizeText(seller?.pan, 15).toUpperCase(),
    address: sanitizeMultilineText(seller?.address, 300),
    city: sanitizeText(seller?.city, 100),
    pincode: sanitizeText(seller?.pincode, 15),
    state: sanitizeText(seller?.state, 100),
    stateCode: sanitizeText(seller?.stateCode, 5),
    phone: sanitizeText(seller?.phone, 30),
    email: sanitizeText(seller?.email, 100),
    bank: sanitizeBankDetails(seller?.bank),
    signatoryName: sanitizeText(seller?.signatoryName, 150),
    signatureImage: sanitizeImageUrl(seller?.signatureImage),
  };
}

/**
 * Sanitizes Client profile
 */
export function sanitizeClient(client: Partial<Client> | undefined): Client {
  return {
    name: sanitizeText(client?.name, 200),
    gstin: sanitizeText(client?.gstin, 20).toUpperCase(),
    billingAddress: sanitizeMultilineText(client?.billingAddress, 300),
    billingCity: sanitizeText(client?.billingCity, 100),
    billingPincode: sanitizeText(client?.billingPincode, 15),
    billingState: sanitizeText(client?.billingState, 100),
    billingStateCode: sanitizeText(client?.billingStateCode, 5),
    shippingSameAsBilling: Boolean(client?.shippingSameAsBilling),
    shippingAddress: sanitizeMultilineText(client?.shippingAddress, 300),
    shippingCity: sanitizeText(client?.shippingCity, 100),
    shippingPincode: sanitizeText(client?.shippingPincode, 15),
    shippingState: sanitizeText(client?.shippingState, 100),
    shippingStateCode: sanitizeText(client?.shippingStateCode, 5),
    placeOfSupply: sanitizeText(client?.placeOfSupply, 100),
    placeOfSupplyCode: sanitizeText(client?.placeOfSupplyCode, 5),
    phone: sanitizeText(client?.phone, 30),
    email: sanitizeText(client?.email, 100),
  };
}

/**
 * Sanitizes a single LineItem
 */
export function sanitizeLineItem(item: Partial<LineItem>): LineItem {
  return {
    id: sanitizeText(item.id, 50) || "item-" + Math.random().toString(36).slice(2, 9),
    description: sanitizeText(item.description, 500),
    hsnSac: sanitizeText(item.hsnSac, 20),
    quantity: sanitizeNumber(item.quantity, 1, 0),
    unit: (sanitizeText(item.unit, 20) || "Pcs") as LineItem["unit"],
    rate: sanitizeNumber(item.rate, 0, 0),
    discountType: item.discountType === "flat" ? "flat" : "percent",
    discountValue: sanitizeNumber(item.discountValue, 0, 0),
    gstSlab: (sanitizeNumber(item.gstSlab, 18) as LineItem["gstSlab"]),
  };
}

/**
 * Sanitizes Invoice Metadata
 */
export function sanitizeMeta(meta: Partial<InvoiceMeta> | undefined): InvoiceMeta {
  return {
    invoiceNo: sanitizeText(meta?.invoiceNo, 50),
    invoiceCounter: sanitizeNumber(meta?.invoiceCounter, 1, 1),
    invoiceDate: sanitizeText(meta?.invoiceDate, 30),
    dueDate: sanitizeText(meta?.dueDate, 30),
    currency: (sanitizeText(meta?.currency, 5) || "INR") as InvoiceMeta["currency"],
    notes: sanitizeMultilineText(meta?.notes, 2000),
    terms: sanitizeMultilineText(meta?.terms, 2000),
  };
}

/**
 * Comprehensive sanitization of an entire InvoiceDraft.
 */
export function sanitizeInvoiceDraft(draft: InvoiceDraft): InvoiceDraft {
  return {
    seller: sanitizeSeller(draft.seller),
    client: sanitizeClient(draft.client),
    items: (draft.items || []).map(sanitizeLineItem),
    meta: sanitizeMeta(draft.meta),
    config: {
      ...draft.config,
      accentColor: /^#[0-9a-fA-F]{3,8}$/.test(draft.config?.accentColor || "")
        ? draft.config.accentColor
        : "#0f766e",
    },
  };
}
