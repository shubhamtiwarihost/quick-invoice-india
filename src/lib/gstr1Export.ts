import type { SavedInvoice } from "@/types/invoice";
import { computeInvoice } from "@/lib/gstEngine";

export interface Gstr1ExportResult {
  success: boolean;
  recordsCount: number;
  filename: string;
  error?: string;
}

/**
 * Formats ISO date (YYYY-MM-DD) into GSTR-1 standard date format: DD-MMM-YYYY (e.g. 05-Sep-2026)
 */
function formatGstrDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day.padStart(2, "0")}-${months[monthIndex]}-${year}`;
    }
  }
  return dateStr;
}

/**
 * Escapes CSV field value conforming to RFC 4180
 */
function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports saved invoices to GSTR-1 Table 4 (B2B Taxable Outward Supplies) compliant CSV
 */
export function exportInvoicesToGstr1(invoices: SavedInvoice[]): Gstr1ExportResult {
  if (!invoices || invoices.length === 0) {
    return {
      success: false,
      recordsCount: 0,
      filename: "",
      error: "No invoices available in local history to export.",
    };
  }

  const headers = [
    "GSTIN/UIN of Recipient",
    "Receiver Name",
    "Invoice Number",
    "Invoice date",
    "Invoice Value",
    "Place Of Supply",
    "Reverse Charge",
    "Applicable % of Tax Rate",
    "Taxable Value",
    "Cess Amount",
  ];

  const rows: string[][] = [];

  for (const inv of invoices) {
    const draft = inv.draft;
    const summary = computeInvoice(draft);

    const recipientGstin = draft.client.gstin?.trim().toUpperCase() || "URP";
    const receiverName = draft.client.name?.trim() || "Unregistered Buyer";
    const invoiceNo = draft.meta.invoiceNo?.trim() || inv.invoiceNo;
    const invoiceDate = formatGstrDate(draft.meta.invoiceDate || inv.date);
    const invoiceValue = summary.grandTotal.toFixed(2);
    
    // Place of supply: formatted as StateCode-StateName (e.g. 27-Maharashtra)
    const posCode = draft.client.placeOfSupplyCode || draft.client.billingStateCode || "27";
    const posState = draft.client.placeOfSupply || draft.client.billingState || "Maharashtra";
    const placeOfSupply = `${posCode}-${posState}`;

    const reverseCharge = draft.config.reverseCharge ? "Y" : "N";
    const cessAmount = "0.00";

    // Group line taxable values by GST slab rate
    const slabTotals = new Map<number, number>();
    for (const item of draft.items) {
      const lineComp = summary.lines.find((l) => l.id === item.id);
      const taxable = lineComp ? lineComp.taxable : item.quantity * item.rate;
      const slab = item.gstSlab ?? 18;
      const current = slabTotals.get(slab) || 0;
      slabTotals.set(slab, current + taxable);
    }

    if (slabTotals.size === 0) {
      rows.push([
        recipientGstin,
        receiverName,
        invoiceNo,
        invoiceDate,
        invoiceValue,
        placeOfSupply,
        reverseCharge,
        "18%",
        summary.taxableValue.toFixed(2),
        cessAmount,
      ]);
    } else {
      // Create a GSTR-1 row for each distinct tax rate slab
      for (const [slab, taxableVal] of slabTotals.entries()) {
        rows.push([
          recipientGstin,
          receiverName,
          invoiceNo,
          invoiceDate,
          invoiceValue,
          placeOfSupply,
          reverseCharge,
          `${slab}%`,
          taxableVal.toFixed(2),
          cessAmount,
        ]);
      }
    }
  }

  // Construct CSV string with UTF-8 BOM
  const csvLines = [
    headers.map(escapeCsv).join(","),
    ...rows.map((r) => r.map(escapeCsv).join(",")),
  ];
  const csvContent = "\uFEFF" + csvLines.join("\r\n");

  const todayStr = new Date().toISOString().slice(0, 10);
  const filename = `GSTR1_Table4_B2B_Sales_${todayStr}.csv`;

  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      recordsCount: rows.length,
      filename,
    };
  } catch (err) {
    console.error("GSTR-1 CSV download failed:", err);
    return {
      success: false,
      recordsCount: rows.length,
      filename,
      error: "Browser blocked the download trigger.",
    };
  }
}
