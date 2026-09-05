"use client";

import { useState, useId } from "react";
import { MessageCircle, Copy, ExternalLink, X, Check, Share2, Phone } from "lucide-react";

export function WhatsAppShareModal({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  invoiceNo,
  formattedTotal,
  invoiceDate,
  sellerName,
  upiId,
}: {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  invoiceNo: string;
  formattedTotal: string;
  invoiceDate?: string;
  sellerName: string;
  upiId?: string;
}) {
  if (!isOpen) return null;

  return (
    <WhatsAppModalContent
      onClose={onClose}
      clientName={clientName}
      clientPhone={clientPhone}
      invoiceNo={invoiceNo}
      formattedTotal={formattedTotal}
      invoiceDate={invoiceDate}
      sellerName={sellerName}
      upiId={upiId}
    />
  );
}

function WhatsAppModalContent({
  onClose,
  clientName,
  clientPhone,
  invoiceNo,
  formattedTotal,
  sellerName,
  upiId,
}: {
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  invoiceNo: string;
  formattedTotal: string;
  invoiceDate?: string;
  sellerName: string;
  upiId?: string;
}) {
  const buyerName = clientName?.trim() || "Customer";
  const seller = sellerName?.trim() || "Our Studio";
  const upi = upiId?.trim() || "Mentioned in invoice";
  // Strip currency symbol if already present to prevent "₹₹"
  const cleanTotal = formattedTotal.replace(/^₹\s*/, "");

  // Required format: "Namaste {BuyerName}, your invoice #{InvoiceNo} of ₹{GrandTotal} from {SellerName} is ready. Pay via UPI ID: {UPI_ID}. Thank you!"
  const initialMessage = `Namaste ${buyerName}, your invoice #${invoiceNo} of ₹${cleanTotal} from ${seller} is ready. Pay via UPI ID: ${upi}. Thank you!`;

  // Parse initial 10-digit phone
  const [rawPhone, setRawPhone] = useState(() => {
    const cleaned = (clientPhone || "").replace(/[^0-9]/g, "");
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      return cleaned.slice(2);
    }
    if (cleaned.startsWith("0") && cleaned.length === 11) {
      return cleaned.slice(1);
    }
    return cleaned;
  });

  const countryCode = "91";
  const [message, setMessage] = useState(initialMessage);
  const [copied, setCopied] = useState(false);
  const phoneInputId = useId();

  const canWebShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  function getCleanedFullRecipient(): string {
    const digits = rawPhone.replace(/[^0-9]/g, "");
    if (!digits) return "";
    // If user already typed full number with country code
    if (digits.length === 12 && digits.startsWith(countryCode)) {
      return digits;
    }
    return `${countryCode}${digits}`;
  }

  function handleSendWhatsApp() {
    const recipient = getCleanedFullRecipient();
    const encoded = encodeURIComponent(message);
    const url = recipient
      ? `https://wa.me/${recipient}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  async function handleNativeShare() {
    if (canWebShare) {
      try {
        await navigator.share({
          title: `Invoice #${invoiceNo} - ${seller}`,
          text: message,
        });
        onClose();
      } catch {
        // User cancelled or aborted
      }
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  }

  const recipient = getCleanedFullRecipient();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 will-change-transform transform-gpu">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Share via WhatsApp</h3>
              <p className="text-xs text-slate-500">
                1-Click direct message with bill summary & UPI payment ID
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label htmlFor={phoneInputId} className="mb-1.5 block font-semibold text-slate-800">
              Recipient WhatsApp Number
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-700 font-semibold select-none shrink-0">
                <span className="mr-1">🇮🇳</span>
                <span>+{countryCode}</span>
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id={phoneInputId}
                  type="tel"
                  placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                  value={rawPhone}
                  onChange={(e) => setRawPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 placeholder:text-slate-400"
                />
              </div>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {rawPhone.trim()
                ? `Will send directly to +${countryCode} ${rawPhone}`
                : "Leave blank to pick a chat manually in WhatsApp Web or App."}
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="wa-preview" className="font-semibold text-slate-800">
                Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 active:scale-95 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy text
                  </>
                )}
              </button>
            </div>
            <textarea
              id="wa-preview"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 font-sans text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/20 transition leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <div>
            {canWebShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              >
                <Share2 className="h-3.5 w-3.5 text-slate-600" />
                Device Share
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs active:scale-95 transition"
            >
              <MessageCircle className="h-4 w-4" />
              {recipient ? "Send on WhatsApp" : "Open WhatsApp"}
              <ExternalLink className="h-3 w-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
