"use client";

import { useEffect, useState } from "react";
import type { QuotationDraft } from "@/types/quotation";
import type { InvoiceSummary } from "@/types/invoice";
import { formatDateIN, formatCurrency } from "@/lib/format";
import { upiQrDataUrl } from "@/components/invoice/BankDetailsForm";
import { Calendar, ShieldCheck } from "lucide-react";

export function QuotationPreview({
  draft,
  summary,
}: {
  draft: QuotationDraft;
  summary: InvoiceSummary;
}) {
  const [qr, setQr] = useState("");
  const { seller, client, items, meta, config } = draft;
  const gst = config.gstMode === "gst";
  const color = config.accentColor;

  const payee = seller.bank.accountHolder || seller.businessName;
  const upi = seller.bank.upiId;
  const total = summary.grandTotal;
  const quoteNo = meta.quotationNo;

  useEffect(() => {
    let cancelled = false;
    upiQrDataUrl(upi, payee, total, quoteNo).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [upi, payee, total, quoteNo]);

  return (
    <div className="invoice-print-root flex justify-center w-full">
      <div
        id="quotation-a4"
        className="invoice-a4 origin-top bg-white shadow-2xl rounded-sm text-slate-800 w-[794px] lg:w-full lg:max-w-[820px] aspect-[1/1.414]"
        style={{ padding: "32px 36px" }}
      >
        {/* Top Accent Strip */}
        <div className="h-2 -mx-8 -mt-8 mb-6" style={{ backgroundColor: color }} />

        {/* Header Block */}
        <header className="flex items-start justify-between gap-6 border-b border-slate-200 pb-5">
          <div className="flex items-start gap-4">
            {seller.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={seller.logo}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 aspect-square rounded-xl object-contain border border-slate-100 p-1"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-xs"
                style={{ backgroundColor: color }}
              >
                {seller.businessName.slice(0, 1) || "Q"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {seller.businessName || "Your Business Name"}
              </h1>
              <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-slate-500">
                {[seller.address, seller.city, seller.state, seller.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-slate-600">
                {seller.phone ? <span>Tel: {seller.phone}</span> : null}
                {seller.email ? <span>Email: {seller.email}</span> : null}
              </div>
              {gst && seller.gstin ? (
                <p className="mt-1 text-[11px] font-semibold text-teal-800">
                  GSTIN: {seller.gstin}
                </p>
              ) : null}
              {seller.pan ? (
                <p className="text-[11px] text-slate-500">PAN: {seller.pan}</p>
              ) : null}
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs" style={{ backgroundColor: color }}>
              Formal Quotation
            </div>
            <p className="mt-2 font-mono text-xl font-bold text-slate-900">
              {meta.quotationNo}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Date: <span className="font-medium text-slate-700">{formatDateIN(meta.quotationDate)}</span>
            </p>

            {/* Validity Badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50/90 px-2.5 py-1 text-xs font-semibold text-amber-900">
              <Calendar className="h-3.5 w-3.5 text-amber-700" />
              <span>Valid Until: {formatDateIN(meta.validUntil)}</span>
            </div>
          </div>
        </header>

        {/* Subject Line if present */}
        {meta.subject ? (
          <div className="mt-4 rounded-lg bg-slate-50 px-3.5 py-2 border border-slate-200/80 text-xs">
            <span className="font-semibold text-slate-700">Subject: </span>
            <span className="text-slate-800 font-medium">{meta.subject}</span>
          </div>
        ) : null}

        {/* Client & Supply Info */}
        <section className="mt-4 grid grid-cols-2 gap-4 text-[11px]">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quotation Prepared For
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {client.name || "Prospective Client Name"}
            </p>
            <p className="mt-1 leading-relaxed text-slate-600">
              {[client.billingAddress, client.billingCity, client.billingState, client.billingPincode]
                .filter(Boolean)
                .join(", ") || "Client Address"}
            </p>
            {client.gstin ? (
              <p className="mt-1 font-semibold text-slate-700">GSTIN: {client.gstin}</p>
            ) : null}
            <div className="mt-1 flex flex-wrap gap-x-3 text-slate-500">
              {client.phone ? <span>Phone: {client.phone}</span> : null}
              {client.email ? <span>Email: {client.email}</span> : null}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimate Parameters
            </p>
            <div className="mt-1.5 space-y-1 text-slate-600">
              <p>
                <span className="text-slate-400">Place of Supply:</span>{" "}
                <span className="font-medium text-slate-800">
                  {client.placeOfSupply} ({client.placeOfSupplyCode})
                </span>
              </p>
              <p>
                <span className="text-slate-400">Tax Type:</span>{" "}
                <span className="font-medium text-slate-800">
                  {summary.supplyType === "intra"
                    ? "Intra-state (CGST + SGST)"
                    : summary.supplyType === "inter"
                      ? "Inter-state (IGST)"
                      : "Non-GST Quotation"}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Validity Period:</span>{" "}
                <span className="font-medium text-amber-800">
                  {meta.validityDays} Days from date of issuance
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Scope of Work / Line Items Table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr style={{ backgroundColor: color }} className="text-white">
                <th className="px-3 py-2.5 text-left font-semibold">#</th>
                <th className="px-3 py-2.5 text-left font-semibold">Scope of Work / Deliverables</th>
                <th className="px-3 py-2.5 text-center font-semibold">HSN/SAC</th>
                <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Qty</th>
                <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Rate</th>
                <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Disc.</th>
                {gst ? (
                  <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">GST</th>
                ) : null}
                <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const line = summary.lines.find((l) => l.id === item.id);
                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-200 odd:bg-white even:bg-slate-50/60 text-slate-900"
                  >
                    <td className="px-3 py-2.5 text-slate-800 font-mono">{index + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">
                      {item.description || "Scope item description"}
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-800 font-mono">
                      {item.hsnSac || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap text-slate-900 font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap text-slate-900 font-mono font-medium">
                      {formatCurrency(item.rate, meta.currency)}
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap text-slate-800 font-mono">
                      {item.discountValue > 0
                        ? item.discountType === "percent"
                          ? `${item.discountValue}%`
                          : formatCurrency(item.discountValue, meta.currency)
                        : "—"}
                    </td>
                    {gst ? (
                      <td className="px-3 py-2.5 text-right whitespace-nowrap text-slate-800 font-medium">
                        {item.gstSlab}%
                      </td>
                    ) : null}
                    <td className="px-3 py-2.5 text-right font-bold whitespace-nowrap text-slate-900 font-mono">
                      {formatCurrency(line ? line.lineTotal : 0, meta.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary & Bank/QR Area */}
        <div className="mt-4 grid grid-cols-2 gap-5 text-[11px]">
          {/* Left Column: Bank & UPI QR for Advance */}
          <div className="space-y-3">
            {seller.bank.bankName || seller.bank.upiId ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Payment Details for Advance / Confirmation
                </p>
                <div className="mt-2.5 flex items-start gap-3.5">
                  {qr ? (
                    <div className="h-20 w-20 aspect-square shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qr}
                        alt="UPI QR Code"
                        width={80}
                        height={80}
                        className="h-20 w-20 aspect-square rounded-lg border border-slate-200 bg-white p-[2px] shadow-2xs"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-0.5 text-[10px] text-slate-700">
                    {seller.bank.bankName ? (
                      <p>
                        <span className="text-slate-400">Bank:</span>{" "}
                        <strong className="text-slate-900">{seller.bank.bankName}</strong>
                      </p>
                    ) : null}
                    {seller.bank.accountNumber ? (
                      <p>
                        <span className="text-slate-400">A/C:</span>{" "}
                        <strong className="font-mono text-slate-900">{seller.bank.accountNumber}</strong>
                      </p>
                    ) : null}
                    {seller.bank.ifsc ? (
                      <p>
                        <span className="text-slate-400">IFSC:</span>{" "}
                        <strong className="font-mono text-slate-900">{seller.bank.ifsc}</strong>
                      </p>
                    ) : null}
                    {seller.bank.accountHolder ? (
                      <p>
                        <span className="text-slate-400">Holder:</span>{" "}
                        <strong className="text-slate-900">{seller.bank.accountHolder}</strong>
                      </p>
                    ) : null}
                    {seller.bank.upiId ? (
                      <p>
                        <span className="text-slate-400">UPI ID:</span>{" "}
                        <strong className="font-mono text-teal-800">{seller.bank.upiId}</strong>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Note about quotation nature */}
            <div className="rounded-lg bg-teal-50/80 p-2.5 text-[10px] text-teal-900 border border-teal-200 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-teal-700 mt-0.5" />
              <p>
                This quotation is an estimate of project costs and deliverables. Official GST Tax Invoice will be issued upon formal acceptance and payment.
              </p>
            </div>
          </div>

          {/* Right Column: Financial Totals */}
          <div>
            <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Subtotal:</span>
                <span className="font-medium font-mono text-slate-900">
                  {formatCurrency(summary.taxableValue, meta.currency)}
                </span>
              </div>
              {gst && summary.supplyType === "intra" ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST:</span>
                    <span className="font-mono">{formatCurrency(summary.cgst, meta.currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST:</span>
                    <span className="font-mono">{formatCurrency(summary.sgst, meta.currency)}</span>
                  </div>
                </>
              ) : null}
              {gst && summary.supplyType === "inter" ? (
                <div className="flex justify-between text-slate-600">
                  <span>IGST:</span>
                  <span className="font-mono">{formatCurrency(summary.igst, meta.currency)}</span>
                </div>
              ) : null}
              {summary.roundOff !== 0 ? (
                <div className="flex justify-between text-slate-500">
                  <span>Round off:</span>
                  <span className="font-mono">
                    {summary.roundOff > 0 ? `+${summary.roundOff}` : summary.roundOff}
                  </span>
                </div>
              ) : null}
              <div
                className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900"
                style={{ color }}
              >
                <span>Estimated Grand Total:</span>
                <span className="text-base font-mono">
                  {formatCurrency(summary.grandTotal, meta.currency)}
                </span>
              </div>
            </div>

            {/* Amount in Words clean bar */}
            <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-2 text-[10px] text-slate-800">
              <span className="font-bold text-slate-900">Amount in Words: </span>
              <span className="font-medium italic text-slate-800">{summary.amountInWords}</span>
            </div>
          </div>
        </div>

        {/* Client Terms & Conditions */}
        {meta.terms ? (
          <section className="mt-5 border-t border-slate-200 pt-3 text-[10px]">
            <p className="font-bold uppercase tracking-wider text-slate-500">
              Quotation Terms & Conditions
            </p>
            <div className="mt-1 whitespace-pre-line text-slate-600 leading-relaxed font-sans">
              {meta.terms}
            </div>
          </section>
        ) : null}

        {/* Notes if present */}
        {meta.notes ? (
          <div className="mt-2 text-[10px] text-slate-500 italic">
            <span className="font-semibold not-italic">Notes: </span>
            {meta.notes}
          </div>
        ) : null}

        {/* Acceptance and Signatures Block */}
        <footer className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-200 pt-4 text-[10px]">
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-400">
              Client Acceptance & Authorization
            </p>
            <p className="mt-1 text-slate-500">
              Sign below to accept and confirm this quotation:
            </p>
            <div className="mt-8 border-b border-dashed border-slate-300 w-48" />
            <p className="mt-1 text-slate-600 font-medium">Authorized Signature & Date</p>
          </div>

          <div className="text-right flex flex-col items-end">
            <p className="font-bold uppercase tracking-wider text-slate-400">
              For {seller.businessName || "Service Provider"}
            </p>
            {seller.signatureImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={seller.signatureImage}
                alt="Signature"
                height={40}
                className="mt-2 h-10 max-w-[160px] object-contain"
              />
            ) : (
              <div className="mt-10" />
            )}
            <p className="mt-1 font-semibold text-slate-800">
              {seller.signatoryName || "Authorized Signatory"}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
