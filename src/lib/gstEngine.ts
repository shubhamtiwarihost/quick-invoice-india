import type {
  InvoiceConfig,
  InvoiceDraft,
  InvoiceSummary,
  LineComputation,
  LineItem,
} from "@/types/invoice";
import { numberToWordsIndian } from "@/lib/numberToWordsIndian";

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function lineTaxable(item: LineItem): { taxable: number; discountAmount: number } {
  const qty = Number(item.quantity) || 0;
  const rate = Number(item.rate) || 0;
  const gross = qty * rate;
  const discountValue = Number(item.discountValue) || 0;
  const discountAmount =
    item.discountType === "percent" ? (gross * discountValue) / 100 : discountValue;
  const taxable = Math.max(0, gross - discountAmount);
  return { taxable: round2(taxable), discountAmount: round2(Math.min(discountAmount, gross)) };
}

export function isIntraState(sellerStateCode: string, placeOfSupplyCode: string): boolean {
  return Boolean(sellerStateCode) && sellerStateCode === placeOfSupplyCode;
}

export function computeInvoice(draft: InvoiceDraft): InvoiceSummary {
  const { seller, client, items, config, meta } = draft;
  const gstOn = config.gstMode === "gst";
  const intra = isIntraState(seller.stateCode, client.placeOfSupplyCode);
  const supplyType: InvoiceSummary["supplyType"] = !gstOn
    ? "none"
    : intra
      ? "intra"
      : "inter";

  const lines: LineComputation[] = items.map((item) =>
    computeLine(item, gstOn, intra),
  );

  const taxableValue = round2(lines.reduce((s, l) => s + l.taxable, 0));
  const cgst = round2(lines.reduce((s, l) => s + l.cgst, 0));
  const sgst = round2(lines.reduce((s, l) => s + l.sgst, 0));
  const igst = round2(lines.reduce((s, l) => s + l.igst, 0));
  const taxTotal = round2(cgst + sgst + igst);
  const rawTotal = round2(taxableValue + taxTotal);

  let roundOff = 0;
  if (config.autoRoundOff) {
    roundOff = round2(Math.round(rawTotal) - rawTotal);
  } else {
    roundOff = round2(Number(config.manualRoundOff) || 0);
  }

  const grandTotal = round2(rawTotal + roundOff);

  return {
    supplyType,
    taxableValue,
    cgst,
    sgst,
    igst,
    taxTotal,
    roundOff,
    grandTotal,
    amountInWords: numberToWordsIndian(grandTotal, meta.currency),
    lines,
  };
}

function computeLine(
  item: LineItem,
  gstOn: boolean,
  intra: boolean,
): LineComputation {
  const { taxable, discountAmount } = lineTaxable(item);
  if (!gstOn || !item.gstSlab) {
    return {
      id: item.id,
      taxable,
      discountAmount,
      cgst: 0,
      sgst: 0,
      igst: 0,
      tax: 0,
      lineTotal: taxable,
    };
  }

  const tax = round2((taxable * item.gstSlab) / 100);
  if (intra) {
    const half = round2(tax / 2);
    return {
      id: item.id,
      taxable,
      discountAmount,
      cgst: half,
      sgst: round2(tax - half),
      igst: 0,
      tax,
      lineTotal: round2(taxable + tax),
    };
  }

  return {
    id: item.id,
    taxable,
    discountAmount,
    cgst: 0,
    sgst: 0,
    igst: tax,
    tax,
    lineTotal: round2(taxable + tax),
  };
}

export function nextInvoiceNumber(counter: number): string {
  const year = new Date().getFullYear();
  return `QI/${year}/${String(counter).padStart(4, "0")}`;
}

export function emptyLineHint(_config: InvoiceConfig): string {
  return "Add at least one item to generate a tax invoice.";
}
