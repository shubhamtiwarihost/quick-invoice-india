"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { BankDetails } from "@/types/invoice";

export function BankDetailsForm({
  bank,
  onChange,
  amount,
  payeeName,
  invoiceNo,
}: {
  bank: BankDetails;
  onChange: (patch: Partial<BankDetails>) => void;
  amount: number;
  payeeName: string;
  invoiceNo?: string;
}) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    let cancelled = false;
    const upi = bank.upiId.trim();
    if (!upi) {
      Promise.resolve().then(() => {
        if (!cancelled) setQr("");
      });
      return () => {
        cancelled = true;
      };
    }
    const uri = buildUpiUri({
      upiId: bank.upiId,
      payeeName,
      amount,
      invoiceNo,
    });
    QRCode.toDataURL(uri, { margin: 1, width: 220, color: { dark: "#0f172a", light: "#ffffff" } })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        if (!cancelled) setQr("");
      });
    return () => {
      cancelled = true;
    };
  }, [bank.upiId, amount, payeeName, invoiceNo]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Bank name" value={bank.bankName} onChange={(v) => onChange({ bankName: v })} />
      <Field label="Account holder" value={bank.accountHolder} onChange={(v) => onChange({ accountHolder: v })} />
      <Field label="Account number" value={bank.accountNumber} onChange={(v) => onChange({ accountNumber: v })} />
      <Field label="IFSC" value={bank.ifsc.toUpperCase()} onChange={(v) => onChange({ ifsc: v.toUpperCase() })} />
      <Field
        label="UPI ID"
        value={bank.upiId}
        onChange={(v) => onChange({ upiId: v })}
        className="sm:col-span-2"
        hint="QR is generated from upi://pay automatically"
      />
      {qr ? (
        <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="UPI QR" className="h-20 w-20 rounded bg-white" />
          <p className="text-sm text-slate-600">
            Scan to pay <span className="font-medium text-slate-900">{bank.upiId}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-teal-600/20 focus:border-teal-600 focus:ring-2"
      />
      {hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function buildUpiUri({
  upiId,
  payeeName,
  amount,
  invoiceNo,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
  invoiceNo?: string;
}): string {
  const upi = upiId.trim();
  if (!upi) return "";
  const pn = encodeURIComponent(payeeName.trim() || "Merchant");
  const cu = "INR";
  let uri = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${pn}&cu=${cu}`;
  if (amount > 0) {
    uri += `&am=${amount.toFixed(2)}`;
  }
  if (invoiceNo && invoiceNo.trim()) {
    uri += `&tn=${encodeURIComponent(`Invoice ${invoiceNo.trim()}`)}`;
  }
  return uri;
}

export async function upiQrDataUrl(
  upiId: string,
  payeeName: string,
  amount: number,
  invoiceNo?: string,
): Promise<string> {
  const uri = buildUpiUri({ upiId, payeeName, amount, invoiceNo });
  if (!uri) return "";
  return QRCode.toDataURL(uri, {
    margin: 1,
    width: 240,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}
