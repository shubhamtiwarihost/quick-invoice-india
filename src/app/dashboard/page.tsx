"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  Zap,
  TrendingUp,
  TrendingDown,
  Receipt,
  AlertTriangle,
  Wallet,
  Plus,
  Clock,
  Users,
  ArrowRight,
  ArrowUpRight,
  Printer,
  MessageCircle,
  CheckCircle2,
  ScanBarcode,
  Package,
  BarChart3,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAllSales,
  getAllProducts,
  getAllCustomers,
  getActiveShift,
  startShift,
  adjustStock,
  seedInitialInventoryIfEmpty,
  seedInitialCustomersIfEmpty,
  type Sale,
  type Product,
  type Customer,
  type Shift,
} from "@/lib/db/posDb";
import { ThermalReceipt, type BusinessInfo } from "@/components/pos/ThermalReceipt";

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);

  // Quick Start Shift Modal
  const [isStartShiftOpen, setIsStartShiftOpen] = useState(false);
  const [floatAmount, setFloatAmount] = useState("1000");

  // Instant Print Receipt Modal
  const [selectedSaleForPrint, setSelectedSaleForPrint] = useState<Sale | null>(null);

  // Thermal Print Preference Toggle (Persistent in localStorage)
  const [thermalPrintEnabled, setThermalPrintEnabled] = useState(true);

  // Restock Visual Feedback Notification
  const [restockNotice, setRestockNotice] = useState<string | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("swiftpos_thermal_active");
      if (saved !== null) {
        setThermalPrintEnabled(saved === "true");
      }
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await seedInitialInventoryIfEmpty();
      await seedInitialCustomersIfEmpty();

      const [sales, products, customers, shift] = await Promise.all([
        getAllSales(),
        getAllProducts(),
        getAllCustomers(),
        getActiveShift(),
      ]);

      setAllSales(sales);
      setAllProducts(products);
      setAllCustomers(customers);
      setActiveShift(shift);
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ----------------------------------------------------
  // METRICS & AGGREGATIONS
  // ----------------------------------------------------
  const {
    todaySales,
    todayGrossRevenue,
    trendPercent,
    isPositiveTrend,
    todayCashSales,
    todayUpiSales,
    cashDrawerBalance,
    totalKhataDue,
    customersWithDebt,
    lowStockProducts,
    recentSales,
  } = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startMs = startOfToday.getTime();
    const startOfYesterday = startMs - 86400000;

    const todays = allSales.filter((s) => s.timestamp >= startMs && s.status !== "voided");
    const yesterdays = allSales.filter(
      (s) => s.timestamp >= startOfYesterday && s.timestamp < startMs && s.status !== "voided"
    );

    const todayGross = todays.reduce((acc, s) => acc + s.grandTotal, 0);
    const yesterdayGross = yesterdays.reduce((acc, s) => acc + s.grandTotal, 0);

    let trend: number | null = null;
    let positive = true;
    if (yesterdayGross > 0) {
      trend = ((todayGross - yesterdayGross) / yesterdayGross) * 100;
      positive = trend >= 0;
    } else if (todayGross > 0) {
      trend = 100;
      positive = true;
    }

    const cash = todays
      .filter((s) => s.paymentMode === "cash")
      .reduce((acc, s) => acc + s.grandTotal, 0);

    const upi = todays
      .filter((s) => s.paymentMode === "upi")
      .reduce((acc, s) => acc + s.grandTotal, 0);

    const floatNum = activeShift?.openingCash || 0;
    const drawerBalance = floatNum + cash;

    const owing = allCustomers.filter((c) => c.creditBalance > 0);
    const due = owing.reduce((acc, c) => acc + c.creditBalance, 0);

    const lowStock = allProducts.filter((p) => p.stock <= p.minStock);

    const recent = [...allSales]
      .filter((s) => s.status !== "voided")
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    return {
      todaySales: todays,
      yesterdaySales: yesterdays,
      todayGrossRevenue: todayGross,
      yesterdayGrossRevenue: yesterdayGross,
      trendPercent: trend,
      isPositiveTrend: positive,
      todayCashSales: cash,
      todayUpiSales: upi,
      cashDrawerBalance: drawerBalance,
      totalKhataDue: due,
      customersWithDebt: owing,
      lowStockProducts: lowStock,
      recentSales: recent,
    };
  }, [allSales, allProducts, allCustomers, activeShift]);

  // Start shift modal submit
  async function handleStartShiftSubmit(e: React.FormEvent) {
    e.preventDefault();
    const floatNum = parseFloat(floatAmount) || 0;
    const newShift = await startShift(floatNum, "Started from Merchant Workspace");
    setActiveShift(newShift);
    setIsStartShiftOpen(false);
  }

  // Instant Restock Action (+5 or +10 units)
  async function handleQuickRestock(productId: string, delta: number) {
    try {
      await adjustStock(productId, delta);
      setAllProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: (p.stock || 0) + delta } : p))
      );
      setRestockNotice(`+${delta} stock units added successfully!`);
      setTimeout(() => setRestockNotice(null), 3000);
    } catch (err) {
      alert("Restock error: " + (err instanceof Error ? err.message : "Failed"));
    }
  }

  // WhatsApp receipt instant action
  function handleWhatsAppShare(sale: Sale) {
    const storeName = user?.businessName || "Swift Store";
    const itemsText = sale.items
      .map((it) => `• ${it.name} x ${it.qty} = ₹${it.total.toFixed(2)}`)
      .join("\n");
    const msg = `*TAX INVOICE: ${sale.billNo}*\n*Store: ${storeName}*\nDate: ${new Date(
      sale.timestamp
    ).toLocaleString("en-IN")}\n------------------\n${itemsText}\n------------------\n*Total Amount: ₹${sale.grandTotal.toFixed(
      2
    )}*\nPayment Mode: ${sale.paymentMode.toUpperCase()}\n\n_Thank you for visiting ${storeName}!_`;

    const rawPhone = sale.customerPhone?.replace(/[^0-9]/g, "") || "";
    const phone = rawPhone.length === 10 ? "91" + rawPhone : rawPhone;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  const businessInfo: BusinessInfo = useMemo(() => {
    let storedAddress = user?.address || "";
    let storedGstin = user?.gstin || "";
    let storedUpiId = user?.upiId || "";

    if (typeof window !== "undefined") {
      try {
        const raw =
          localStorage.getItem("swiftpos_store_settings") ||
          localStorage.getItem("swiftgst_pos_store_settings");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.address) storedAddress = parsed.address;
          if (parsed.gstin) storedGstin = parsed.gstin;
          if (parsed.upiId) storedUpiId = parsed.upiId;
        }
      } catch {
        // ignore
      }
    }

    return {
      businessName: user?.businessName || "My Store",
      address: storedAddress,
      phone: user?.phone || "",
      gstin: storedGstin,
      upiId: storedUpiId,
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading Merchant Workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 p-3 sm:p-6 lg:p-8 space-y-6">
      {/* Visual Restock Floating Toast Notification */}
      {restockNotice && (
        <div className="fixed top-16 right-6 z-50 rounded-2xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-950/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-200" />
          <span>{restockNotice}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* MOBILE ONLY (max-lg): PROMINENT TODAY'S SALES HERO   */}
      {/* ==================================================== */}
      <section className="lg:hidden space-y-4">
        {/* Sales Hero Gradient Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 p-5 text-white shadow-xl border border-emerald-500/20">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  Today&apos;s Gross Sales
                </span>
              </div>
              {trendPercent !== null && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isPositiveTrend
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {isPositiveTrend ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{trendPercent >= 0 ? `+${trendPercent.toFixed(1)}%` : `${trendPercent.toFixed(1)}%`}</span>
                </span>
              )}
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                ₹{todayGrossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="mt-1 text-xs text-slate-300 font-medium">
                From {todaySales.length} bill{todaySales.length === 1 ? "" : "s"} today &bull; Avg ticket: ₹
                {todaySales.length > 0 ? (todayGrossRevenue / todaySales.length).toFixed(0) : "0"}
              </p>
            </div>

            {/* Split Sub-Metrics: Cash vs Online UPI */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cash Collected
                </span>
                <div className="mt-1 text-base font-black text-emerald-300 font-mono">
                  ₹{todayCashSales.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Online UPI
                </span>
                <div className="mt-1 text-base font-black text-sky-300 font-mono">
                  ₹{todayUpiSales.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
        </div>

        {/* 4 Quick Tiles Grid (Android Style) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tile 1: POS Billing */}
          <Link
            href="/pos"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-white shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                Fast Bill
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-black tracking-tight">POS Billing</h3>
              <p className="text-[11px] text-emerald-100 font-medium">1-Tap Barcode Checkout</p>
            </div>
          </Link>

          {/* Tile 2: Stock Master */}
          <Link
            href="/inventory"
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <Package className="h-5 w-5" />
              </div>
              {lowStockProducts.length > 0 && (
                <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  {lowStockProducts.length} Low
                </span>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-extrabold text-slate-900">Stock Master</h3>
              <p className="text-[11px] text-slate-500 font-medium">Add / Scan Items</p>
            </div>
          </Link>

          {/* Tile 3: Khata Book */}
          <Link
            href="/customers"
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Users className="h-5 w-5" />
              </div>
              {totalKhataDue > 0 && (
                <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                  ₹{totalKhataDue.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-extrabold text-slate-900">Khata Book</h3>
              <p className="text-[11px] text-slate-500 font-medium">Grahak Udhar</p>
            </div>
          </Link>

          {/* Tile 4: Daily Z-Report */}
          <Link
            href="/analytics"
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm active:scale-95 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                GSTR-1
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-extrabold text-slate-900">Daily Z-Report</h3>
              <p className="text-[11px] text-slate-500 font-medium">Day Closing &amp; Tax</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ==================================================== */}
      {/* DESKTOP (lg / xl): HIGH-VISIBILITY KPI ROW (4 Cards) */}
      {/* ==================================================== */}
      <section className="hidden lg:grid lg:grid-cols-4 gap-5">
        {/* KPI Card 1: Today's Gross Sales */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Gross Sales
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
              ₹{todayGrossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{todaySales.length} bill{todaySales.length === 1 ? "" : "s"} today</span>
              {trendPercent !== null && (
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    isPositiveTrend ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {isPositiveTrend ? "+" : ""}
                  {trendPercent.toFixed(1)}% vs yesterday
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI Card 2: Cash Drawer Balance */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cash Drawer Balance
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Wallet className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
              ₹{cashDrawerBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Float ₹{activeShift?.openingCash || 0} + Cash ₹{todayCashSales.toFixed(0)}</span>
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  activeShift ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeShift ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                {activeShift ? "Shift Active" : "Shift Closed"}
              </span>
            </div>
          </div>
        </div>

        {/* KPI Card 3: Pending Khata Udhar */}
        <Link
          href="/customers"
          className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-purple-700 transition">
              Pending Khata Udhar
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-100 transition">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-purple-900 font-mono">
              ₹{totalKhataDue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{customersWithDebt.length} customer ledgers pending</span>
              <span className="text-purple-700 font-bold flex items-center gap-0.5">
                <span>View Khata</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </Link>

        {/* KPI Card 4: Low Stock Alert */}
        <Link
          href="/inventory"
          className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition active:scale-95"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-amber-700 transition">
              Low Stock Alert
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-amber-900 font-mono">
              {lowStockProducts.length}{" "}
              <span className="text-sm font-semibold text-slate-500">SKUs</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span className="text-amber-700 font-semibold">Stock at/below min threshold</span>
              <span className="text-amber-700 font-bold flex items-center gap-0.5">
                <span>Restock</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ==================================================== */}
      {/* DESKTOP (lg / xl): MAIN HERO POS COUNTER LAUNCH CARD */}
      {/* ==================================================== */}
      <section className="hidden lg:block relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <Store className="h-3.5 w-3.5" />
              <span>Retail Billing Counter &bull; {user?.storeType || "Retail Store"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Launch High-Speed POS Counter
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Offline-ready retail billing terminal with barcode scanner auto-focus, cash change calculation,
              instant UPI QR codes, and automated thermal receipt printing.
            </p>

            {/* Badges & Toggles: Barcode USB Ready + Thermal Print Toggle */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Barcode USB Ready Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
                <ScanBarcode className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold">Barcode USB Ready</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Thermal Print Mode Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !thermalPrintEnabled;
                  setThermalPrintEnabled(next);
                  localStorage.setItem("swiftpos_thermal_active", next ? "true" : "false");
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border transition active:scale-95 ${
                  thermalPrintEnabled
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-700 bg-slate-800/80 text-slate-400"
                }`}
                title="Toggle default receipt printing mode"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>
                  Thermal Slip (80mm/58mm): {thermalPrintEnabled ? "ENABLED" : "A4 INVOICE"}
                </span>
              </button>

              {/* Shift Float Shortcut */}
              <button
                type="button"
                onClick={() => setIsStartShiftOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition"
              >
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>{activeShift ? `Shift Float: ₹${activeShift.openingCash}` : "Set Shift Float"}</span>
              </button>
            </div>
          </div>

          {/* Primary Launch POS CTA Button */}
          <div className="shrink-0">
            <Link
              href="/pos"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-emerald-950/40 hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <Zap className="h-5 w-5 fill-current" />
              <span>Launch POS Terminal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      </section>

      {/* ==================================================== */}
      {/* TWO-COLUMN SPLIT: RECENT INVOICES & QUICK RESTOCK    */}
      {/* ==================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Recent 5 Completed Invoices (lg:col-span-7) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Recent Completed Invoices</h3>
                <p className="text-xs text-slate-500">Live transactions with instant WhatsApp &amp; Print actions</p>
              </div>
              <Link
                href="/analytics"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>Sales Ledger</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentSales.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Receipt className="mx-auto h-9 w-9 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No completed sales records yet today.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Start your first billing transaction on the POS counter.</p>
                <Link
                  href="/pos"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 active:scale-95 transition"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Make First Bill Now</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-3 py-2.5 rounded-l-xl">Bill No</th>
                      <th className="px-3 py-2.5">Time</th>
                      <th className="px-3 py-2.5">Customer</th>
                      <th className="px-3 py-2.5">Mode</th>
                      <th className="px-3 py-2.5 text-right">Total</th>
                      <th className="px-3 py-2.5 text-center rounded-r-xl">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-3 py-3 font-mono font-bold text-slate-900">
                          {sale.billNo}
                        </td>
                        <td className="px-3 py-3 text-slate-500">
                          {new Date(sale.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-800">
                          <span className="block truncate max-w-[120px]">
                            {sale.customerName || "Walk-in Guest"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              sale.paymentMode === "cash"
                                ? "bg-emerald-100 text-emerald-800"
                                : sale.paymentMode === "upi"
                                ? "bg-sky-100 text-sky-800"
                                : sale.paymentMode === "khata"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {sale.paymentMode}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-black text-slate-900">
                          ₹{sale.grandTotal.toFixed(2)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            {/* Instant Print Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedSaleForPrint(sale)}
                              className="rounded-lg p-1.5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                              title="Print Thermal Receipt"
                            >
                              <Printer className="h-4 w-4" />
                            </button>

                            {/* Instant WhatsApp Button */}
                            <button
                              type="button"
                              onClick={() => handleWhatsAppShare(sale)}
                              className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                              title="Send WhatsApp Receipt"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Product Restock List (lg:col-span-5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>Quick Product Restock</span>
                  {lowStockProducts.length > 0 && (
                    <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.2 text-[10px] font-bold">
                      {lowStockProducts.length} low
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">1-Tap stock replenishment for fast counters</p>
              </div>
              <Link
                href="/inventory"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>Stock Master</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-800">All Inventory Healthy!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Every catalog item is safely above reorder threshold.</p>
                <Link
                  href="/inventory"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Product SKU</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 mt-3">
                {lowStockProducts.slice(0, 5).map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md">
                          {prod.stock} in stock
                        </span>
                        <span className="text-[10px] text-slate-400">Min: {prod.minStock}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          ₹{prod.salePrice.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(prod.id, 5)}
                        className="rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-500 active:scale-95 transition"
                        title="Add +5 Stock Units"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(prod.id, 10)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                        title="Add +10 Stock Units"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4">
            <Link
              href="/inventory"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition"
            >
              <Package className="h-4 w-4" />
              <span>Manage Full Catalog &amp; Barcodes &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* MOBILE ONLY: FLOATING ACTION BUTTON (+ Bill)         */}
      {/* ==================================================== */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <Link
          href="/pos"
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-950/40 hover:bg-emerald-500 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5 stroke-[3]" />
          <span>+ Bill</span>
        </Link>
      </div>

      {/* ==================================================== */}
      {/* MODAL: INSTANT THERMAL RECEIPT PREVIEW & PRINT       */}
      {/* ==================================================== */}
      {selectedSaleForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Thermal Receipt Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSaleForPrint(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3">
              <ThermalReceipt
                sale={selectedSaleForPrint}
                business={businessInfo}
                rollWidth={thermalPrintEnabled ? "80mm" : "58mm"}
                showControls={true}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleWhatsAppShare(selectedSaleForPrint)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSaleForPrint(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: START SHIFT QUICK DIALOG                      */}
      {/* ==================================================== */}
      {isStartShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Start Cash Drawer Shift</h3>
                <p className="text-xs text-slate-500">Set cash drawer opening float</p>
              </div>
            </div>

            <form onSubmit={handleStartShiftSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Opening Cash Float (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={floatAmount}
                  onChange={(e) => setFloatAmount(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStartShiftOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition"
                >
                  Open Shift &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
