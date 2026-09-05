"use client";

import { useEffect, useState, forwardRef } from "react";
import { Printer } from "lucide-react";
import type { Sale } from "@/lib/db/posDb";

export interface BusinessInfo {
  businessName: string;
  address?: string;
  phone?: string;
  gstin?: string;
  fssai?: string;
  upiId?: string;
}

export interface ThermalReceiptProps {
  sale: Sale;
  business?: BusinessInfo;
  rollWidth?: "58mm" | "80mm";
  onPrint?: () => void;
  showControls?: boolean;
}

const DEFAULT_BUSINESS: BusinessInfo = {
  businessName: "Swift Retail Store",
  address: "Main Market, Sector 14, New Delhi - 110001",
  phone: "+91 98765 43210",
  gstin: "07AAAAA0000A1Z5",
  upiId: "swiftretail@upi",
};

export const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(
  function ThermalReceipt(
    {
      sale,
      business = DEFAULT_BUSINESS,
      rollWidth: initialRollWidth = "80mm",
      onPrint,
      showControls = true,
    },
    ref
  ) {
    const [rollWidth, setRollWidth] = useState<"58mm" | "80mm">(initialRollWidth);
    const [qrDataUrl, setQrDataUrl] = useState<string>("");

    // Generate dynamic UPI QR Code on-demand
    useEffect(() => {
      let active = true;
      if (!business.upiId || !sale.grandTotal) {
        setQrDataUrl("");
        return;
      }

      const upiUri = `upi://pay?pa=${encodeURIComponent(business.upiId)}&pn=${encodeURIComponent(
        business.businessName
      )}&am=${sale.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
        `Bill-${sale.billNo}`
      )}`;

      import("qrcode")
        .then((mod) => {
          const QRCode = mod.default || mod;
          return QRCode.toDataURL(upiUri, {
            width: rollWidth === "58mm" ? 140 : 160,
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" },
          });
        })
        .then((url) => {
          if (active) setQrDataUrl(url);
        })
        .catch((err) => {
          console.error("Failed to generate thermal UPI QR:", err);
        });

      return () => {
        active = false;
      };
    }, [business.upiId, business.businessName, sale.grandTotal, sale.billNo, rollWidth]);

    function handlePrint() {
      if (onPrint) {
        onPrint();
      } else {
        window.print();
      }
    }

    // Group items for GST Tax Breakup
    const gstBreakup: {
      [rate: number]: { taxable: number; cgst: number; sgst: number; totalTax: number };
    } = {};

    for (const it of sale.items || []) {
      const rate = it.gstRate || 0;
      if (!gstBreakup[rate]) {
        gstBreakup[rate] = { taxable: 0, cgst: 0, sgst: 0, totalTax: 0 };
      }
      const itemTax = it.taxAmount || 0;
      const itemTaxable = it.total - itemTax;
      gstBreakup[rate].taxable += itemTaxable;
      gstBreakup[rate].cgst += itemTax / 2;
      gstBreakup[rate].sgst += itemTax / 2;
      gstBreakup[rate].totalTax += itemTax;
    }

    const dateStr = new Date(sale.timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = new Date(sale.timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const is58mm = rollWidth === "58mm";

    return (
      <div className="flex flex-col items-center">
        {/* On-screen control bar (Hidden during print) */}
        {showControls ? (
          <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs w-full max-w-[420px]">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRollWidth("58mm")}
                className={`px-2.5 py-1 rounded-md transition ${
                  is58mm ? "bg-white text-teal-800 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                58mm (2-inch)
              </button>
              <button
                type="button"
                onClick={() => setRollWidth("80mm")}
                className={`px-2.5 py-1 rounded-md transition ${
                  !is58mm ? "bg-white text-teal-800 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                80mm (3-inch)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        ) : null}

        {/* Printable Thermal Receipt Container */}
        <div
          ref={ref}
          id="thermal-receipt-printable"
          style={{
            width: is58mm ? "58mm" : "80mm",
            maxWidth: is58mm ? "58mm" : "80mm",
          }}
          className="bg-white text-black font-mono text-[11px] leading-tight p-3 border border-slate-300 shadow-md mx-auto select-none print:p-0 print:border-none print:shadow-none print:w-full"
        >
          {/* Header */}
          <div className="text-center space-y-0.5">
            <h2 className="text-sm font-bold uppercase tracking-tight">
              {business.businessName}
            </h2>
            {business.address ? (
              <p className="text-[10px] leading-snug">{business.address}</p>
            ) : null}
            {business.phone ? <p className="text-[10px]">Ph: {business.phone}</p> : null}
            {business.gstin ? (
              <p className="text-[10px] font-bold">GSTIN: {business.gstin}</p>
            ) : null}
            {business.fssai ? (
              <p className="text-[10px]">FSSAI Lic: {business.fssai}</p>
            ) : null}
          </div>

          <div className="my-2 border-b border-dashed border-black" />

          {/* Receipt Meta */}
          <div className="flex justify-between text-[10px]">
            <span>Bill: #{sale.billNo}</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Mode: {sale.paymentMode.toUpperCase()}</span>
            <span>{timeStr}</span>
          </div>
          {sale.customerName ? (
            <div className="text-[10px] truncate">
              Cust: {sale.customerName} {sale.customerPhone ? `(${sale.customerPhone})` : ""}
            </div>
          ) : null}

          <div className="my-2 border-b border-dashed border-black" />

          {/* Item Table Header */}
          <div className="flex justify-between font-bold text-[10px] border-b border-black pb-0.5">
            <span className="flex-1">Item</span>
            <span className="w-12 text-center">Qty</span>
            <span className="w-14 text-right">Amt</span>
          </div>

          {/* Line Items */}
          <div className="divide-y divide-dashed divide-black/40 py-1">
            {sale.items?.map((it, idx) => (
              <div key={idx} className="py-1">
                <div className="font-semibold">{it.name}</div>
                <div className="flex justify-between text-[10px] text-black/90">
                  <span>
                    ₹{it.price.toFixed(2)} x {it.qty}
                    {it.gstRate ? ` [${it.gstRate}%]` : ""}
                  </span>
                  <span className="font-bold">₹{it.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="my-1.5 border-b border-dashed border-black" />

          {/* Summary */}
          <div className="space-y-0.5 text-[11px]">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span>₹{sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.taxTotal > 0 ? (
              <div className="flex justify-between">
                <span>Total GST:</span>
                <span>₹{sale.taxTotal.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-xs font-bold border-t border-b border-black py-1 my-1">
              <span>NET PAYABLE:</span>
              <span>₹{sale.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* GST Slabs Tax Breakup */}
          {Object.keys(gstBreakup).length > 0 && sale.taxTotal > 0 ? (
            <div className="mt-2 text-[9px] border border-black/60 p-1">
              <div className="font-bold text-center border-b border-black/40 pb-0.5 mb-1 uppercase tracking-wider">
                GST Tax Summary
              </div>
              <div className="grid grid-cols-4 font-bold border-b border-black/30 pb-0.5 text-center">
                <span>GST%</span>
                <span>Taxable</span>
                <span>CGST</span>
                <span>SGST</span>
              </div>
              {Object.entries(gstBreakup).map(([rate, vals]) => (
                <div key={rate} className="grid grid-cols-4 text-center py-0.5">
                  <span>{rate}%</span>
                  <span>{vals.taxable.toFixed(1)}</span>
                  <span>{vals.cgst.toFixed(1)}</span>
                  <span>{vals.sgst.toFixed(1)}</span>
                </div>
              ))}
            </div>
          ) : null}

          {/* Dynamic UPI QR Code for Instant Scan */}
          {qrDataUrl ? (
            <div className="mt-3 flex flex-col items-center text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1">
                Scan &amp; Pay via UPI
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Thermal UPI QR"
                width={is58mm ? 120 : 140}
                height={is58mm ? 120 : 140}
                className="aspect-square border border-black p-1 bg-white"
              />
              <p className="mt-1 text-[9px] font-bold">{business.upiId}</p>
            </div>
          ) : null}

          {/* Footer message */}
          <div className="mt-3 text-center text-[10px] space-y-0.5 border-t border-dashed border-black pt-2">
            <p className="font-bold uppercase tracking-wider">Thank You! Visit Again</p>
            <p className="text-[8px] text-black/70">Powered by SwiftGST · Free POS Engine</p>
            <p className="text-[8px] font-mono tracking-widest pt-1">*** END OF RECEIPT ***</p>
          </div>
        </div>

        {/* Print Stylesheet injection for thermal roll widths */}
        <style jsx global>{`
          @media print {
            body {
              background: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .no-print {
              display: none !important;
            }
            #thermal-receipt-printable {
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 auto !important;
              width: ${is58mm ? "58mm" : "80mm"} !important;
              max-width: ${is58mm ? "58mm" : "80mm"} !important;
            }
            @page {
              size: ${is58mm ? "58mm" : "80mm"} auto;
              margin: 2mm 0mm;
            }
          }
        `}</style>
      </div>
    );
  }
);
