"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  IndianRupee,
  Wallet,
  QrCode,
  CreditCard,
  BookOpen,
  Calendar,
  Download,
  Package,
  Store,
  Users,
  Award,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import {
  getAllSales,
  getAllProducts,
  getAllCustomers,
  seedInitialInventoryIfEmpty,
  seedInitialCustomersIfEmpty,
  seedInitialSalesIfEmpty,
  type Sale,
  type Product,
  type Customer,
} from "@/lib/db/posDb";
import { AnalyticsComplianceGuide } from "@/components/analytics/AnalyticsComplianceGuide";

type DateRange = "today" | "7days" | "month" | "all";

export default function AnalyticsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  async function loadData() {
    setLoading(true);
    try {
      await seedInitialInventoryIfEmpty();
      await seedInitialCustomersIfEmpty();
      await seedInitialSalesIfEmpty();

      const [sList, pList, cList] = await Promise.all([
        getAllSales(),
        getAllProducts(),
        getAllCustomers(),
      ]);
      setSales(sList);
      setProducts(pList);
      setCustomers(cList);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
      showToast("Unable to load data from local database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Products map for quick cost price lookups
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => {
      map.set(p.id, p);
      if (p.name) map.set(p.name.toLowerCase().trim(), p);
    });
    return map;
  }, [products]);

  // Filter sales by selected date range
  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = startOfToday - 6 * 86400000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return sales.filter((s) => {
      if (s.status === "voided") return false;
      if (dateRange === "today") return s.timestamp >= startOfToday;
      if (dateRange === "7days") return s.timestamp >= sevenDaysAgo;
      if (dateRange === "month") return s.timestamp >= startOfMonth;
      return true; // "all"
    });
  }, [sales, dateRange]);

  // Today's Sales specifically (for Today's Pulse cards)
  const todaySales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return sales.filter((s) => s.timestamp >= startOfToday && s.status !== "voided");
  }, [sales]);

  // Today's Overview Metrics
  const todayMetrics = useMemo(() => {
    let gross = 0;
    let cash = 0;
    let upi = 0;
    let card = 0;
    let khata = 0;

    for (const s of todaySales) {
      gross += s.grandTotal || 0;
      if (s.paymentMode === "cash") cash += s.grandTotal || 0;
      else if (s.paymentMode === "upi") upi += s.grandTotal || 0;
      else if (s.paymentMode === "card") card += s.grandTotal || 0;
      else if (s.paymentMode === "khata") khata += s.grandTotal || 0;
      else if (s.paymentMode === "split") {
        cash += (s.grandTotal || 0) / 2;
        upi += (s.grandTotal || 0) / 2;
      }
    }

    return {
      gross,
      cash,
      upi,
      card,
      khata,
      invoiceCount: todaySales.length,
    };
  }, [todaySales]);

  // Range Metrics (Gross Profit, Sales, Taxes)
  const rangeMetrics = useMemo(() => {
    let totalSales = 0;
    let totalCost = 0;
    let totalTax = 0;
    let totalTaxable = 0;

    for (const s of filteredSales) {
      totalSales += s.grandTotal || 0;
      totalTax += s.taxTotal || 0;
      totalTaxable += s.subtotal || 0;

      for (const item of s.items || []) {
        const prod =
          productsMap.get(item.productId) ||
          productsMap.get(item.name?.toLowerCase().trim());
        const costPerUnit = prod ? prod.costPrice : item.price * 0.7; // default 30% margin fallback if unknown
        totalCost += costPerUnit * (item.qty || 1);
      }
    }

    const grossProfit = Math.max(0, totalSales - totalCost);
    const profitMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

    return {
      totalSales,
      totalCost,
      grossProfit,
      profitMargin,
      totalTax,
      totalTaxable,
      invoiceCount: filteredSales.length,
    };
  }, [filteredSales, productsMap]);

  // Current Inventory Asset Value
  const inventoryAssetValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.costPrice || 0) * (p.stock || 0), 0);
  }, [products]);

  // Outstanding Khata (Market Udhaar Due)
  const totalOutstandingKhata = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.creditBalance || 0), 0);
  }, [customers]);

  // Top 5 Best-Selling Products Leaderboard
  const topMovers = useMemo(() => {
    const itemMap = new Map<
      string,
      { name: string; category?: string; qty: number; revenue: number }
    >();

    for (const s of filteredSales) {
      for (const it of s.items || []) {
        const key = it.productId || it.name;
        const existing = itemMap.get(key);
        const prod = productsMap.get(it.productId) || productsMap.get(it.name?.toLowerCase().trim());
        const cat = prod?.category;

        if (existing) {
          existing.qty += it.qty || 1;
          existing.revenue += it.total || 0;
        } else {
          itemMap.set(key, {
            name: it.name,
            category: cat,
            qty: it.qty || 1,
            revenue: it.total || 0,
          });
        }
      }
    }

    const sorted = Array.from(itemMap.values()).sort((a, b) => b.qty - a.qty);
    const maxQty = sorted[0]?.qty || 1;

    return sorted.slice(0, 5).map((m, idx) => ({
      ...m,
      rank: idx + 1,
      sharePercent: Math.round((m.qty / maxQty) * 100),
    }));
  }, [filteredSales, productsMap]);

  // Payment Mode Breakdown
  const paymentBreakdown = useMemo(() => {
    const counts = {
      cash: { amount: 0, count: 0 },
      upi: { amount: 0, count: 0 },
      card: { amount: 0, count: 0 },
      khata: { amount: 0, count: 0 },
      split: { amount: 0, count: 0 },
    };

    let total = 0;
    for (const s of filteredSales) {
      const mode = s.paymentMode || "cash";
      if (!counts[mode]) {
        counts[mode] = { amount: 0, count: 0 };
      }
      counts[mode].amount += s.grandTotal || 0;
      counts[mode].count += 1;
      total += s.grandTotal || 0;
    }

    return {
      modes: [
        {
          key: "cash",
          label: "Cash in Drawer",
          icon: Wallet,
          color: "bg-emerald-500",
          textColor: "text-emerald-700",
          bgLight: "bg-emerald-50",
          borderColor: "border-emerald-200",
          amount: counts.cash.amount,
          count: counts.cash.count,
          percent: total > 0 ? (counts.cash.amount / total) * 100 : 0,
        },
        {
          key: "upi",
          label: "UPI Online",
          icon: QrCode,
          color: "bg-teal-500",
          textColor: "text-teal-700",
          bgLight: "bg-teal-50",
          borderColor: "border-teal-200",
          amount: counts.upi.amount,
          count: counts.upi.count,
          percent: total > 0 ? (counts.upi.amount / total) * 100 : 0,
        },
        {
          key: "card",
          label: "Card / EDC",
          icon: CreditCard,
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgLight: "bg-blue-50",
          borderColor: "border-blue-200",
          amount: counts.card.amount,
          count: counts.card.count,
          percent: total > 0 ? (counts.card.amount / total) * 100 : 0,
        },
        {
          key: "khata",
          label: "Khata (Udhaar)",
          icon: BookOpen,
          color: "bg-red-500",
          textColor: "text-red-700",
          bgLight: "bg-red-50",
          borderColor: "border-red-200",
          amount: counts.khata.amount,
          count: counts.khata.count,
          percent: total > 0 ? (counts.khata.amount / total) * 100 : 0,
        },
        {
          key: "split",
          label: "Split / Multi-tender",
          icon: ArrowUpRight,
          color: "bg-purple-500",
          textColor: "text-purple-700",
          bgLight: "bg-purple-50",
          borderColor: "border-purple-200",
          amount: counts.split.amount,
          count: counts.split.count,
          percent: total > 0 ? (counts.split.amount / total) * 100 : 0,
        },
      ].filter((m) => m.count > 0 || m.key === "cash" || m.key === "upi"),
      total,
    };
  }, [filteredSales]);

  // Export Sales Report / GSTR-1 CSV
  function handleExportGstr1Csv() {
    if (filteredSales.length === 0) {
      showToast("No sales to export in the selected date range.");
      return;
    }

    const headers = [
      "Invoice No",
      "Date",
      "Customer Name",
      "Customer Phone / GSTIN",
      "Taxable Value (INR)",
      "CGST (INR)",
      "SGST (INR)",
      "IGST (INR)",
      "Total Amount (INR)",
      "Payment Mode",
      "Payment Status",
    ];

    const rows = filteredSales.map((s) => {
      const dateStr = new Date(s.timestamp).toISOString().slice(0, 10);
      const taxable = (s.subtotal || s.grandTotal - (s.taxTotal || 0)).toFixed(2);
      const halfTax = ((s.taxTotal || 0) / 2).toFixed(2);
      const isKhata = s.paymentMode === "khata";

      return [
        `"${s.billNo}"`,
        `"${dateStr}"`,
        `"${(s.customerName || "Walk-in Customer").replace(/"/g, '""')}"`,
        `"${(s.customerPhone || "").replace(/"/g, '""')}"`,
        taxable,
        halfTax, // CGST
        halfTax, // SGST
        "0.00", // IGST (retail POS intra-state default)
        (s.grandTotal || 0).toFixed(2),
        `"${(s.paymentMode || "cash").toUpperCase()}"`,
        `"${isKhata ? "Unpaid (Khata)" : "Paid"}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `swiftgst_sales_report_gstr1_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredSales.length} invoices to GSTR-1 CSV report!`);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans select-none">
      {/* Toast Alert */}
      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      {/* Top Banner & Header */}
      <header className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-[1600px] px-4 py-4 md:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                  <BarChart3 className="h-4.5 w-4.5" />
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Business Analytics &amp; Profit Tracking
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  GSTR-1 Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time financial pulse, estimated gross profit margins, top-selling items, and CA tax export.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/pos"
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 shadow-2xs transition active:scale-95"
              >
                <Store className="h-3.5 w-3.5" />
                <span>POS Counter</span>
              </Link>

              {/* GSTR-1 CSV Export Button */}
              <button
                type="button"
                onClick={handleExportGstr1Csv}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Sales Report (GSTR-1 CSV)</span>
              </button>
            </div>
          </div>

          {/* TODAY'S SALES PULSE OVERVIEW (Always Today) */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-600" />
                <span>Today&apos;s Store Pulse</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {todayMetrics.invoiceCount} {todayMetrics.invoiceCount === 1 ? "Bill" : "Bills"} Generated Today
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Today Gross Sales */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Today Gross Sales
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                  ₹{todayMetrics.gross.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Cash in Drawer */}
              <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Cash in Drawer
                  </span>
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-900 font-mono tabular-nums">
                  ₹{todayMetrics.cash.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Online UPI Payments */}
              <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    Online UPI Payments
                  </span>
                  <QrCode className="h-4 w-4 text-teal-600" />
                </div>
                <p className="mt-1 text-2xl font-bold tracking-tight text-teal-900 font-mono tabular-nums">
                  ₹{todayMetrics.upi.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Today Invoices Count */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Bills Issued Today
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
                  {todayMetrics.invoiceCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Analytics Workspace */}
      <main className="mx-auto max-w-[1600px] px-4 pt-6 space-y-6">
        {/* Date Range Selector & Overall Financial Pulse */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Profit &amp; Inventory Financial Health
            </h2>
            <p className="text-xs text-slate-500">
              Derived from live cost prices and transactional sale records.
            </p>
          </div>

          {/* Date Range Selector Filter */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDateRange("today")}
              className={`rounded-lg px-3 py-1.5 transition ${
                dateRange === "today"
                  ? "bg-teal-700 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDateRange("7days")}
              className={`rounded-lg px-3 py-1.5 transition ${
                dateRange === "7days"
                  ? "bg-teal-700 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setDateRange("month")}
              className={`rounded-lg px-3 py-1.5 transition ${
                dateRange === "month"
                  ? "bg-teal-700 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setDateRange("all")}
              className={`rounded-lg px-3 py-1.5 transition ${
                dateRange === "all"
                  ? "bg-teal-700 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* 3 Major Financial Metric Cards: Estimated Gross Profit, Inventory Asset Value, Outstanding Khata */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Estimated Gross Profit */}
          <div className="rounded-2xl border border-emerald-200/90 bg-white p-5 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Estimated Gross Profit
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                +{rangeMetrics.profitMargin.toFixed(1)}% margin
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
              ₹{rangeMetrics.grossProfit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Total Revenue: <strong className="text-slate-800 font-mono">₹{rangeMetrics.totalSales.toFixed(2)}</strong> across {rangeMetrics.invoiceCount} invoices.
            </p>
          </div>

          {/* Current Inventory Asset Value */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Inventory Asset Value
              </span>
              <Package className="h-4.5 w-4.5 text-teal-700" />
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              ₹{inventoryAssetValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Valued at purchase cost across {products.length} catalog products in stock.
            </p>
          </div>

          {/* Outstanding Khata */}
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                Outstanding Khata (Market Due)
              </span>
              <BookOpen className="h-4.5 w-4.5 text-red-600" />
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-red-700 font-mono tabular-nums">
              ₹{totalOutstandingKhata.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Uncollected customer debt</span>
              <Link
                href="/customers"
                className="font-bold text-teal-700 hover:underline flex items-center gap-0.5"
              >
                <span>View Khata</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2 Column Visual Breakdown: Top Movers & Payment Modes */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Top 5 Best-Selling Products Leaderboard (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Top 5 Best-Selling Products Leaderboard
                </h3>
              </div>
              <span className="text-xs text-slate-400 capitalize">Filter: {dateRange}</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">Loading top movers...</div>
            ) : topMovers.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No items sold in this period.
              </div>
            ) : (
              <div className="space-y-3.5">
                {topMovers.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            item.rank === 1
                              ? "bg-amber-100 text-amber-800 font-extrabold"
                              : item.rank === 2
                              ? "bg-slate-200 text-slate-800"
                              : item.rank === 3
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{item.rank}
                        </span>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                        {item.category ? (
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500">
                            {item.category}
                          </span>
                        ) : null}
                      </div>

                      <div className="text-right font-mono">
                        <span className="font-bold text-slate-900">
                          {item.qty} {item.qty === 1 ? "unit" : "units"}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-2">
                          (₹{item.revenue.toFixed(2)})
                        </span>
                      </div>
                    </div>

                    {/* Progress visual bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.rank === 1 ? "bg-teal-600" : "bg-teal-400"
                        }`}
                        style={{ width: `${item.sharePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Modes Mini Bar Breakdown (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Payment Modes Breakdown</h3>
              <span className="text-xs font-mono font-bold text-teal-800">
                ₹{paymentBreakdown.total.toFixed(2)}
              </span>
            </div>

            {/* Segmented color-coded progress bar */}
            {paymentBreakdown.total > 0 ? (
              <div className="h-3.5 w-full flex overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                {paymentBreakdown.modes.map((m) =>
                  m.percent > 0 ? (
                    <div
                      key={m.key}
                      style={{ width: `${m.percent}%` }}
                      className={`h-full ${m.color} transition-all duration-500`}
                      title={`${m.label}: ${m.percent.toFixed(1)}%`}
                    />
                  ) : null
                )}
              </div>
            ) : null}

            {/* List breakdown cards */}
            <div className="divide-y divide-slate-100 text-xs">
              {paymentBreakdown.modes.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.key} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${m.bgLight} ${m.textColor}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{m.label}</p>
                        <p className="text-[10px] text-slate-500">{m.count} transactions</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono">
                        ₹{m.amount.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {m.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sales Transactions Register Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-100 gap-2 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Sales Register ({filteredSales.length} Transactions)
              </h3>
              <p className="text-xs text-slate-500">
                Compliant with Indian CBIC GST format for quarterly and monthly returns.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportGstr1Csv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100 shadow-2xs transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Bill No</th>
                  <th className="px-3 py-3">Date &amp; Time</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3 text-right">Taxable (₹)</th>
                  <th className="px-3 py-3 text-right">GST (₹)</th>
                  <th className="px-4 py-3 text-right">Grand Total (₹)</th>
                  <th className="px-4 py-3 text-center">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                      No invoices recorded for this time filter.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        #{s.billNo}
                      </td>
                      <td className="px-3 py-3 text-slate-500 text-[11px]">
                        {new Date(s.timestamp).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        ·{" "}
                        {new Date(s.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-800">
                        {s.customerName || "Walk-in Cash"}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-600">
                        ₹{(s.subtotal || s.grandTotal - (s.taxTotal || 0)).toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-teal-700 font-semibold">
                        ₹{(s.taxTotal || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-900">
                        ₹{(s.grandTotal || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            s.paymentMode === "khata"
                              ? "bg-red-100 text-red-800"
                              : s.paymentMode === "upi"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {s.paymentMode}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Educational & E-E-A-T Compliance Guide */}
      <AnalyticsComplianceGuide />
    </div>
  );
}
