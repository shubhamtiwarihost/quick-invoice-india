import type { CurrencyCode } from "@/types/invoice";

const SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
};

export function currencySymbol(code: CurrencyCode): string {
  return SYMBOLS[code];
}

export function formatIndianNumber(value: number, decimals = 2): string {
  const safe = Number.isFinite(value) ? Math.abs(value) : 0;
  const [intPart, frac = ""] = safe.toFixed(decimals).split(".");
  const lastThree = intPart.slice(-3);
  const other = intPart.slice(0, -3);
  const grouped = other
    ? `${other.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
  return decimals > 0 ? `${grouped}.${frac}` : grouped;
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode = "INR",
  decimals = 2,
): string {
  const safe = Number.isFinite(value) ? value : 0;
  const sign = safe < 0 ? "-" : "";
  const symbol = currencySymbol(currency) || "₹";
  return `${sign}${symbol}${formatIndianNumber(safe, decimals)}`;
}

export const formatMoney = formatCurrency;

export function cleanTerms(text: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trim().replace(/\.{2,}/g, "."))
    .join("\n")
    .trim()
    .replace(/\.{2,}/g, ".");
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDateIN(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function newItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
