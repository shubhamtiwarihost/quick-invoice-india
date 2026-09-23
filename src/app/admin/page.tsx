"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  KeyRound,
  Lock,
  RefreshCw,
  Store,
  FileText,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Search,
  LogOut,
  X,
  Code2,
  Users,
  Eye,
  Calendar,
  Clock,
  Layers,
} from "lucide-react";

interface ActivityLog {
  id: number | string;
  user_id?: string | null;
  store_name?: string | null;
  event_type: string;
  feature_used: string;
  details_json?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

interface StatsMetrics {
  todayUniqueVisitors: number;
  todayPageHits: number;
  totalStores: number;
  publicInvoices: number;
  posBills: number;
  pdfTools?: number;
}

const STORAGE_KEY = "swift_admin_master_key";

export default function SuperAdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Dashboard Data State
  const [metrics, setMetrics] = useState<StatsMetrics>({
    todayUniqueVisitors: 0,
    todayPageHits: 0,
    totalStores: 0,
    publicInvoices: 0,
    posBills: 0,
    pdfTools: 0,
  });
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<"all" | "pos" | "invoice" | "pdf">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "7days" | "custom">("all");
  const [customDate, setCustomDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // 1. Fetch metrics and logs from /api/stats.php
  const fetchStats = useCallback(async (key: string) => {
    if (!key) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/stats.php", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      });
      const json = await res.json();

      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "Failed to load telemetry stats");
      }

      setMetrics(json.data.metrics || { totalStores: 0, publicInvoices: 0, posBills: 0, pdfTools: 0 });
      setLogs(json.data.logs || []);
      setLastUpdated(new Date());
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, key);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Access denied or connection failure.";
      setErrorMsg(msg);
      setIsAuthenticated(false);
      sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initialize from session on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setAdminKey(savedKey);
      fetchStats(savedKey);
    }
  }, [fetchStats]);

  // 3. Auto-refresh polling every 15 seconds
  useEffect(() => {
    if (!isAuthenticated || !adminKey || !autoRefresh) return;

    const interval = setInterval(() => {
      fetchStats(adminKey);
    }, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated, adminKey, autoRefresh, fetchStats]);

  // Handle Login / Unlock
  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!inputKey.trim()) {
      setErrorMsg("Please enter the Super Admin Secret Key.");
      return;
    }
    setAdminKey(inputKey.trim());
    fetchStats(inputKey.trim());
  }

  // Handle Logout
  function handleLock() {
    setIsAuthenticated(false);
    setAdminKey("");
    setInputKey("");
    sessionStorage.removeItem(STORAGE_KEY);
  }

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Tab filter
      if (filterTab === "pos" && log.feature_used !== "pos_counter") return false;
      if (filterTab === "invoice" && log.feature_used !== "public_invoice") return false;
      if (filterTab === "pdf" && !(log.feature_used === "pdf_tools" || log.feature_used?.startsWith("pdf_"))) return false;

      // Date filter
      if (dateFilter !== "all") {
        const logDate = new Date(log.created_at);
        if (!isNaN(logDate.getTime())) {
          const pad = (n: number) => String(n).padStart(2, "0");
          const logDateStr = `${logDate.getFullYear()}-${pad(logDate.getMonth() + 1)}-${pad(logDate.getDate())}`;
          const now = new Date();
          const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

          if (dateFilter === "today" && logDateStr !== todayStr) return false;
          if (dateFilter === "yesterday") {
            const yDate = new Date();
            yDate.setDate(yDate.getDate() - 1);
            const yStr = `${yDate.getFullYear()}-${pad(yDate.getMonth() + 1)}-${pad(yDate.getDate())}`;
            if (logDateStr !== yStr) return false;
          }
          if (dateFilter === "7days") {
            const diffMs = now.getTime() - logDate.getTime();
            if (diffMs < 0 || diffMs > 7 * 24 * 60 * 60 * 1000) return false;
          }
          if (dateFilter === "custom" && customDate && logDateStr !== customDate) return false;
        }
      }

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const store = (log.store_name || "").toLowerCase();
      const ip = (log.ip_address || "").toLowerCase();
      const event = (log.event_type || "").toLowerCase();
      const details = (log.details_json || "").toLowerCase();

      return store.includes(q) || ip.includes(q) || event.includes(q) || details.includes(q);
    });
  }, [logs, filterTab, dateFilter, customDate, searchQuery]);

  // Parsed detail helper
  function formatDetailsSummary(detailsJson?: string | null) {
    if (!detailsJson) return "No payload details";
    try {
      const d = JSON.parse(detailsJson);
      const parts: string[] = [];
      if (d.billAmount !== undefined) parts.push(`₹${Number(d.billAmount).toFixed(2)}`);
      if (d.totalAmount !== undefined) parts.push(`₹${Number(d.totalAmount).toFixed(2)}`);
      if (d.itemCount !== undefined) parts.push(`${d.itemCount} items`);
      if (d.itemsCount !== undefined) parts.push(`${d.itemsCount} items`);
      if (d.paymentMode) parts.push(`via ${d.paymentMode.toUpperCase()}`);
      if (d.template) parts.push(`Theme: ${d.template}`);
      if (d.clientName) parts.push(`Client: ${d.clientName}`);
      if (d.action) parts.push(`Action: ${d.action}`);
      if (d.tool) parts.push(`Tool: ${String(d.tool).replace(/_/g, " ")}`);
      if (d.pageCount !== undefined) parts.push(`${d.pageCount} pages`);
      if (d.fileCount !== undefined && Number(d.fileCount) > 1) parts.push(`${d.fileCount} files`);
      if (d.durationMs !== undefined) parts.push(`${d.durationMs}ms`);
      if (d.status) parts.push(d.status === "success" ? "Success" : `Failed: ${d.errorMessage || ""}`);

      return parts.length > 0 ? parts.join(" • ") : detailsJson;
    } catch {
      return detailsJson;
    }
  }

  // ==========================================
  // UNLOCKED VIEW: SUPER ADMIN DASHBOARD
  // ==========================================
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
              title="Return to Public Website"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Website</span>
            </Link>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>SwiftGST Super Admin</span>
                  <span className="rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 text-[10px] font-mono font-semibold uppercase">
                    Root
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Hostinger Cloud MySQL • Live Telemetry</span>
                  {lastUpdated && (
                    <span className="hidden sm:inline text-slate-500 font-mono">
                      (Synced {lastUpdated.toLocaleTimeString()})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition ${
                autoRefresh
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              Auto-Refresh: {autoRefresh ? "ON (15s)" : "OFF"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => fetchStats(adminKey)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-teal-400 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 active:scale-95 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1850px] 2xl:max-w-[2100px] w-full mx-auto space-y-6">
          {/* Top Metrics Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Card 1: Today's Unique Visitors */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/60 p-5 shadow-xl shadow-indigo-950/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Today&apos;s Unique Visitors
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {metrics.todayUniqueVisitors.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-200/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Live unique IP visitors</span>
                </div>
              </div>
            </div>

            {/* Card 2: Today's Page Views / Hits */}
            <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-slate-900/60 p-5 shadow-xl shadow-sky-950/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Today&apos;s Page Views / Hits
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {metrics.todayPageHits.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-sky-200/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>Total browsing interactions</span>
                </div>
              </div>
            </div>

            {/* Total Stores Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Stores
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Store className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {metrics.totalStores.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  <span>Onboarded Merchants</span>
                </div>
              </div>
            </div>

            {/* Public Invoices Generated */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Invoices Generated
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {metrics.publicInvoices.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>Public Generator &amp; PDFs</span>
                </div>
              </div>
            </div>

            {/* POS Counter Transactions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  POS Transactions
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {metrics.posBills.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Retail Bills &amp; Sales</span>
                </div>
              </div>
            </div>

            {/* Card 6: PDF Tools Executions */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-900/60 p-5 shadow-xl shadow-purple-950/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  PDF Tools Used
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Layers className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {(metrics.pdfTools || 0).toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-purple-200/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span>Suite Operations</span>
                </div>
              </div>
            </div>
          </section>

          {/* Live Activity Feed Table Card */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-2xl space-y-4">
            {/* Header & Filter Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Live Activity Stream</span>
                  <span className="rounded-full bg-teal-500/20 text-teal-400 px-2 py-0.5 text-xs font-mono font-bold">
                    {filteredLogs.length} events
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time events captured via /api/track.php with date &amp; time tracking
                </p>
              </div>

              {/* Tabs, Date Filter, and Search Bar */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search store, event, IP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {/* Date Filter Quick Pills */}
                <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setDateFilter("all")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      dateFilter === "all" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter("today")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      dateFilter === "today" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter("yesterday")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      dateFilter === "yesterday" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter("7days")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      dateFilter === "7days" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    7 Days
                  </button>
                </div>

                {/* Date Picker Input */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      setCustomDate(e.target.value);
                      setDateFilter("custom");
                    }}
                    className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer font-mono"
                    title="Select a specific date to filter"
                  />
                  {dateFilter === "custom" && (
                    <button
                      onClick={() => {
                        setCustomDate("");
                        setDateFilter("all");
                      }}
                      className="text-[10px] text-slate-400 hover:text-white font-bold ml-1 cursor-pointer"
                      title="Clear date"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Feature Filter Tabs */}
                <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFilterTab("all")}
                    className={`rounded-lg px-3 py-1 transition ${
                      filterTab === "all"
                        ? "bg-teal-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All ({logs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("pos")}
                    className={`rounded-lg px-3 py-1 transition ${
                      filterTab === "pos"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    POS Billing ({logs.filter((l) => l.feature_used === "pos_counter").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("invoice")}
                    className={`rounded-lg px-3 py-1 transition ${
                      filterTab === "invoice"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Public Invoices ({logs.filter((l) => l.feature_used === "public_invoice").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("pdf")}
                    className={`rounded-lg px-3 py-1 transition ${
                      filterTab === "pdf"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    PDF Tools ({logs.filter((l) => l.feature_used === "pdf_tools" || l.feature_used?.startsWith("pdf_")).length})
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 uppercase text-[10px] font-bold tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Date &amp; Time</th>
                    <th className="px-4 py-3">Store / User</th>
                    <th className="px-4 py-3">Feature</th>
                    <th className="px-4 py-3">Event Type</th>
                    <th className="px-4 py-3">Details Summary</th>
                    <th className="px-4 py-3">IP Address</th>
                    <th className="px-4 py-3 text-right">Raw</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                        No activity records found matching your current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isPos = log.feature_used === "pos_counter";
                      const isInvoice = log.feature_used === "public_invoice";
                      const isPdf = log.feature_used === "pdf_tools" || log.feature_used?.startsWith("pdf_");

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Date & Time */}
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px]">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-teal-400 shrink-0" />
                              <span>
                                {new Date(log.created_at).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 pl-4">
                              <Clock className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                              <span>
                                {new Date(log.created_at).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          </td>

                          {/* Store / User */}
                          <td className="px-4 py-3">
                            <div className="font-bold text-white max-w-[180px] truncate">
                              {log.store_name || "Guest Visitor"}
                            </div>
                            {log.user_id && (
                              <div className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                                ID: {log.user_id}
                              </div>
                            )}
                          </td>

                          {/* Feature Badge */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {isPos ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                POS Counter
                              </span>
                            ) : isInvoice ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                                Public Invoice
                              </span>
                            ) : isPdf ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                                PDF Tools
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                                {log.feature_used || "general"}
                              </span>
                            )}
                          </td>

                          {/* Event Type */}
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-teal-300 font-semibold">
                            {log.event_type}
                          </td>

                          {/* Details Summary */}
                          <td className="px-4 py-3 text-slate-300 max-w-[260px] truncate">
                            {formatDetailsSummary(log.details_json)}
                          </td>

                          {/* IP Address */}
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                            {log.ip_address || "127.0.0.1"}
                          </td>

                          {/* Raw Details Modal Button */}
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedLog(log)}
                              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-teal-300 hover:border-teal-500/50 transition"
                              title="Inspect JSON Payload"
                            >
                              <Code2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Payload Inspector Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-teal-400" />
                  <h3 className="text-sm font-bold text-white font-mono">
                    Log Entry #{selectedLog.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500">Event: </span>
                    <span className="text-teal-300 font-bold">{selectedLog.event_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Feature: </span>
                    <span className="text-white">{selectedLog.feature_used}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Time: </span>
                    <span className="text-slate-300">{selectedLog.created_at}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">IP: </span>
                    <span className="text-slate-300">{selectedLog.ip_address}</span>
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="text-slate-500">User Agent: </span>
                    <span className="text-slate-400">{selectedLog.user_agent}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Payload Details (JSON)
                  </label>
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-56">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedLog.details_json || "{}"), null, 2);
                      } catch {
                        return selectedLog.details_json || "{}";
                      }
                    })()}
                  </pre>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // LOCKED VIEW: SECRET KEY AUTHENTICATION
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-teal-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex justify-between items-center text-xs">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to SwiftGST</span>
          </Link>
          <span className="font-mono text-slate-500 text-[11px]">Restricted Zone</span>
        </div>

        {/* Lock Screen Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3 shadow-inner">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Super Admin Terminal
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter the Secret Master Key to access live telemetry metrics and event streams.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Secret Master Key
              </label>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter swift master key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-slate-600 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Terminal</span>
                  <Shield className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Direct connection to Hostinger MySQL u932835494_alpha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
