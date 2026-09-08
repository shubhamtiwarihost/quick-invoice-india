"use client";

import { useState } from "react";
import { Printer, X } from "lucide-react";
import type { Shift } from "@/lib/db/posDb";
import type { BusinessInfo } from "./ThermalReceipt";

export interface ZReportReceiptProps {
  shift: Shift;
  business: BusinessInfo;
  onClose: () => void;
  rollWidth?: "58mm" | "80mm";
}

export function ZReportReceipt({
  shift,
  business,
  onClose,
  rollWidth: initialRollWidth = "80mm",
}: ZReportReceiptProps) {
  const [rollWidth, setRollWidth] = useState<"58mm" | "80mm">(initialRollWidth);
  const is58mm = rollWidth === "58mm";

  const expectedCash = (shift.openingCash || 0) + (shift.cashSales || 0);
  const actualCash = shift.closingCash ?? expectedCash;
  const difference = actualCash - expectedCash;

  function handlePrint() {
    window.print();
  }

  const startDate = new Date(shift.startTime).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const endDate = shift.endTime
    ? new Date(shift.endTime).toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[95vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Controls (no-print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Roll:</span>
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setRollWidth("58mm")}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  is58mm ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                58mm
              </button>
              <button
                type="button"
                onClick={() => setRollWidth("80mm")}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  !is58mm ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                80mm
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 active:scale-95 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex justify-center">
          <div
            id="thermal-receipt-printable"
            className={`bg-white p-4 font-mono text-black shadow-md border border-slate-200 ${
              is58mm ? "w-[240px] text-[10px]" : "w-[320px] text-xs"
            }`}
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            {/* Header */}
            <div className="text-center pb-2 border-b border-dashed border-black">
              <p className="font-bold text-sm tracking-wider">*** Z-REPORT ***</p>
              <p className="font-bold text-xs uppercase pt-0.5">{business.businessName}</p>
              {business.gstin ? (
                <p className="text-[9px] pt-0.5">GSTIN: {business.gstin}</p>
              ) : null}
              {business.phone ? (
                <p className="text-[9px]">Ph: {business.phone}</p>
              ) : null}
            </div>

            {/* Shift Timestamps */}
            <div className="py-2 border-b border-dashed border-black text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>Shift ID:</span>
                <span className="font-bold">{shift.id.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between">
                <span>Opened:</span>
                <span>{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Closed:</span>
                <span>{endDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="uppercase font-bold">{shift.status}</span>
              </div>
            </div>

            {/* Cash Drawer Reconciliation */}
            <div className="py-2 border-b border-dashed border-black space-y-1">
              <p className="font-bold text-center uppercase tracking-wider text-[11px] pb-1">
                CASH DRAWER TALLY
              </p>
              <div className="flex justify-between text-[11px]">
                <span>(+) Opening Float:</span>
                <span>₹{(shift.openingCash || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>(+) Cash Sales:</span>
                <span>₹{(shift.cashSales || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-dotted border-black pt-1 text-[11px]">
                <span>(=) Expected Cash:</span>
                <span>₹{expectedCash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[11px]">
                <span>Actual In Drawer:</span>
                <span>₹{actualCash.toFixed(2)}</span>
              </div>
              <div
                className={`flex justify-between font-bold text-[11px] border-t border-dotted border-black pt-0.5 ${
                  difference === 0
                    ? "text-black"
                    : difference > 0
                    ? "text-black"
                    : "text-black"
                }`}
              >
                <span>Difference:</span>
                <span>
                  {difference === 0
                    ? "₹0.00 (Balanced)"
                    : difference > 0
                    ? `+₹${difference.toFixed(2)} (Over)`
                    : `-₹${Math.abs(difference).toFixed(2)} (Short)`}
                </span>
              </div>
            </div>

            {/* Sales Tender Breakdown */}
            <div className="py-2 border-b border-dashed border-black space-y-1">
              <p className="font-bold text-center uppercase tracking-wider text-[11px] pb-1">
                TENDER BREAKDOWN
              </p>
              <div className="flex justify-between text-[11px]">
                <span>Cash Sales:</span>
                <span>₹{(shift.cashSales || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>UPI Online:</span>
                <span>₹{(shift.upiSales || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Card / EDC:</span>
                <span>₹{(shift.cardSales || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-black pt-1">
                <span>TOTAL REVENUE:</span>
                <span>₹{(shift.totalSales || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Notes if present */}
            {shift.notes ? (
              <div className="py-2 border-b border-dashed border-black text-[10px]">
                <p className="font-bold">Shift Notes:</p>
                <p className="italic text-black/80">{shift.notes}</p>
              </div>
            ) : null}

            {/* Signatures */}
            <div className="pt-6 pb-2 space-y-6 text-[10px]">
              <div className="flex justify-between border-t border-black pt-1">
                <span>Cashier Signature</span>
                <span>Manager Signature</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 text-[9px] text-black/70">
              <p>SwiftGST POS · End of Day Audit</p>
              <p className="font-mono pt-0.5">*** END OF Z-REPORT ***</p>
            </div>
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
    </div>
  );
}
