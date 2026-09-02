"use client";

import { useState } from "react";
import { MessageCircle, Copy, ExternalLink, X, Check } from "lucide-react";

export function WhatsAppShareModal({
  isOpen,
  onClose,
  clientName,
  clientPhone,
  invoiceNo,
  formattedTotal,
  invoiceDate,
  sellerName,
}: {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  invoiceNo: string;
  formattedTotal: string;
  invoiceDate: string;
  sellerName: string;
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
    />
  );
}

function WhatsAppModalContent({
  onClose,
  clientName,
  clientPhone,
  invoiceNo,
  formattedTotal,
  invoiceDate,
  sellerName,
}: {
  onClose: () => void;
  clientName: string;
  clientPhone: string;
  invoiceNo: string;
  formattedTotal: string;
  invoiceDate: string;
  sellerName: string;
}) {
  const [phone, setPhone] = useState(() => {
    const cleaned = (clientPhone || "").replace(/[^0-9]/g, "");
    return cleaned.length === 10 ? `91${cleaned}` : cleaned;
  });

  const [message, setMessage] = useState(() => {
    const greetingName = clientName ? clientName.trim() : "Valued Customer";
    return `Hello ${greetingName}, here is your Tax Invoice ${invoiceNo} for ${formattedTotal} dated ${invoiceDate}. Bank/UPI payment details are mentioned in the bill. Thank you for your business!\n\n— ${sellerName}`;
  });

  const [copied, setCopied] = useState(false);

  function cleanPhoneNumber(input: string): string {
    const digitsOnly = input.replace(/[^0-9]/g, "");
    if (digitsOnly.length === 10) {
      return `91${digitsOnly}`;
    }
    return digitsOnly;
  }

  function handleSend() {
    const recipient = cleanPhoneNumber(phone);
    const encoded = encodeURIComponent(message);
    const url = recipient
      ? `https://wa.me/${recipient}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Share via WhatsApp</h3>
              <p className="text-xs text-slate-500">
                Send invoice summary directly to client on WhatsApp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Client WhatsApp Phone Number (optional)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210 or 919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>
            <span className="mt-1 block text-[11px] text-slate-400">
              Leave blank to pick a contact manually in WhatsApp.
            </span>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="font-medium text-slate-700">Message Preview</label>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy message
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 shadow-xs"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
            <ExternalLink className="h-3 w-3 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
