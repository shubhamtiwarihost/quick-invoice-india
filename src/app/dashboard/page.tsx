"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Zap,
  TrendingUp,
  Receipt,
  AlertTriangle,
  Wallet,
  Plus,
  Clock,
  Users,
  FileText,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAllSales,
  getAllProducts,
  getAllCustomers,
  getActiveShift,
  startShift,
  seedInitialInventoryIfEmpty,
  seedInitialCustomersIfEmpty,
  type Sale,
  type Product,
  type Customer,
  type Shift,
} from "@/lib/db/posDb";

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [todaySales, setTodaySales] = useState<Sale[]>([]);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [customersWithDebt, setCustomersWithDebt] = useState<Customer[]>([]);
  const [totalKhataDue, setTotalKhataDue] = useState(0);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);

  // Quick Start Shift Modal
  const [isStartShiftOpen, setIsStartShiftOpen] = useState(false);
  const [floatAmount, setFloatAmount] = useState("1000");

  async function loadDashboardData() {
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
      setActiveShift(shift);

      // Filter today's sales
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startMs = startOfToday.getTime();

      const todays = sales.filter((s) => s.timestamp >= startMs && s.status !== "voided");
      setTodaySales(todays);

      // Low stock items
      const lowStock = products.filter((p) => p.stock <= p.minStock);
      setLowStockProducts(lowStock);

      // Khata debt
      const owing = customers.filter((c) => c.creditBalance > 0);
      const totalDue = owing.reduce((acc, c) => acc + c.creditBalance, 0);
      setCustomersWithDebt(owing);
      setTotalKhataDue(totalDue);
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate stats
  const todayGrossRevenue = todaySales.reduce((acc, s) => acc + s.grandTotal, 0);
  const todayBillCount = todaySales.length;
  const avgBillValue = todayBillCount > 0 ? todayGrossRevenue / todayBillCount : 0;

  async function handleStartShiftSubmit(e: React.FormEvent) {
    e.preventDefault();
    const floatNum = parseFloat(floatAmount) || 0;
    const newShift = await startShift(floatNum, "Started from Back-Office Dashboard");
    setActiveShift(newShift);
    setIsStartShiftOpen(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading Back-Office Pulse...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ---------------------------------------------------- */}
      {/* 1. WELCOME CARD & PRIMARY POS CTA                   */}
      {/* ---------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-500/30 px-3 py-1 text-xs font-semibold text-teal-300">
              <Store className="h-3.5 w-3.5" />
              <span>Back-Office Overview &bull; {user?.storeType || "Retail Store"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {user?.businessName || "Welcome to Your Store"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Cashier: <span className="font-semibold text-white">{user?.ownerName || "Manager"}</span> &bull; 
              All data persists offline and automatically syncs with your high-speed POS terminal.
            </p>

            {/* Shift Indicator inside Welcome Card */}
            <div className="pt-1">
              {activeShift ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold">Cash Drawer Shift Active</span>
                  <span className="text-emerald-400/80">(Float: ₹{activeShift.openingCash})</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-1.5 text-xs text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Cash Drawer Closed</span>
                  <button
                    type="button"
                    onClick={() => setIsStartShiftOpen(true)}
                    className="ml-1 font-bold text-teal-400 hover:text-teal-300 underline underline-offset-2"
                  >
                    Start Shift Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="shrink-0">
            <Link
              href="/pos"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-teal-500 px-6 py-4 text-sm font-extrabold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:bg-teal-400 active:scale-95"
            >
              <Zap className="h-5 w-5 fill-current" />
              <span>Launch POS Terminal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Subtle decorative background graphic */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. FOUR QUICK STAT CARDS                             */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today's Gross Sales */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Gross Sales
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              ₹{todayGrossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              From {todayBillCount} bill{todayBillCount === 1 ? "" : "s"} today
            </p>
          </div>
        </div>

        {/* Card 2: Total Invoices Today */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Invoices
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Receipt className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              {todayBillCount}{" "}
              <span className="text-sm font-semibold text-slate-500">Receipts</span>
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Avg Bill: ₹{avgBillValue.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Card 3: Low Stock Alert */}
        <Link
          href="/inventory"
          className="group block rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
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
            <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-900">
              {lowStockProducts.length}{" "}
              <span className="text-sm font-semibold text-slate-500">SKUs</span>
            </h3>
            <p className="mt-1 text-xs text-amber-600 font-medium flex items-center gap-1">
              <span>Items below minimum stock</span>
              <ArrowUpRight className="h-3 w-3" />
            </p>
          </div>
        </Link>

        {/* Card 4: Total Khata Balance Due */}
        <Link
          href="/customers"
          className="group block rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-rose-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-700 transition">
              Khata Udhaar Due
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700 group-hover:bg-rose-100 transition">
              <Wallet className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-900">
              ₹{totalKhataDue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </h3>
            <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <span>{customersWithDebt.length} customer ledgers pending</span>
              <ArrowUpRight className="h-3 w-3" />
            </p>
          </div>
        </Link>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. QUICK ACTIONS TOOLBAR                            */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Operational Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Add Product */}
          <Link
            href="/inventory"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-bold text-slate-800 transition hover:bg-teal-50 hover:border-teal-200 hover:text-teal-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white shrink-0">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <p className="leading-tight">+ Add Product</p>
              <p className="text-[10px] text-slate-500 font-normal">Manage SKU catalog</p>
            </div>
          </Link>

          {/* Shift Management */}
          <button
            type="button"
            onClick={() => setIsStartShiftOpen(true)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-bold text-slate-800 transition hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900 text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="leading-tight">{activeShift ? "Shift Active" : "Start Shift"}</p>
              <p className="text-[10px] text-slate-500 font-normal">Cash drawer float</p>
            </div>
          </button>

          {/* Customer Ledger */}
          <Link
            href="/customers"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-bold text-slate-800 transition hover:bg-blue-50 hover:border-blue-200 hover:text-blue-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="leading-tight">Customer Ledger</p>
              <p className="text-[10px] text-slate-500 font-normal">Khata &amp; reminders</p>
            </div>
          </Link>

          {/* Export Z-Report */}
          <Link
            href="/analytics"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-bold text-slate-800 transition hover:bg-purple-50 hover:border-purple-200 hover:text-purple-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="leading-tight">Export Z-Report</p>
              <p className="text-[10px] text-slate-500 font-normal">GSTR-1 &amp; registers</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. RECENT BILLS / SALES ACTIVITY TABLE               */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Completed Invoices</h2>
            <p className="text-xs text-slate-500">Live feed from local POS billing counter</p>
          </div>
          <Link
            href="/analytics"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {allSales.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Receipt className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs font-semibold">No sales transactions recorded yet.</p>
            <Link
              href="/pos"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-800"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Make Your First Sale on POS</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2.5 rounded-l-xl">Bill No</th>
                  <th className="px-3 py-2.5">Date &amp; Time</th>
                  <th className="px-3 py-2.5">Customer</th>
                  <th className="px-3 py-2.5">Items</th>
                  <th className="px-3 py-2.5">Payment</th>
                  <th className="px-3 py-2.5 text-right rounded-r-xl">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allSales.slice(0, 6).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {sale.billNo}
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {new Date(sale.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="ml-1 text-[10px] text-slate-400">
                        {new Date(sale.timestamp).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-800">
                      {sale.customerName || "Walk-in Guest"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {sale.items.length} item{sale.items.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          sale.paymentMode === "cash"
                            ? "bg-emerald-100 text-emerald-800"
                            : sale.paymentMode === "upi"
                            ? "bg-blue-100 text-blue-800"
                            : sale.paymentMode === "khata"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {sale.paymentMode}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-slate-900 font-mono">
                      ₹{sale.grandTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. START SHIFT MODAL DIALOG                          */}
      {/* ---------------------------------------------------- */}
      {isStartShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Start Cash Drawer Shift</h3>
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
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
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
                  className="flex-1 rounded-2xl bg-teal-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800"
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
