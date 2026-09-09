"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  Receipt,
  BarChart3,
  Settings,
  Lock,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ScanBarcode,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getActiveShift,
  startShift,
  closeShift,
  type Shift,
} from "@/lib/db/posDb";

interface NavModule {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MODULES: NavModule[] = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "POS Terminal",
    href: "/pos",
    icon: Store,
    badge: "Counter",
  },
  {
    name: "Stock Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Customer Khata",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Sales Ledger",
    href: "/analytics",
    icon: Receipt,
  },
  {
    name: "GST / Z-Report",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function BackOfficeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, lockScreen, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Live Shift Management in App Shell
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftMode, setShiftMode] = useState<"start" | "close">("start");
  const [shiftCashInput, setShiftCashInput] = useState("1000");
  const [shiftNotes, setShiftNotes] = useState("");
  const [shiftLoading, setShiftLoading] = useState(false);

  // Sync Shift status
  const refreshShift = React.useCallback(async () => {
    try {
      const s = await getActiveShift();
      setActiveShift(s);
    } catch {
      // offline fallback
    }
  }, []);

  useEffect(() => {
    refreshShift();
  }, [refreshShift]);

  // Monitor network status
  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleShiftSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShiftLoading(true);
    try {
      const val = parseFloat(shiftCashInput) || 0;
      if (shiftMode === "start") {
        const s = await startShift(val, shiftNotes || "Started from App Shell");
        setActiveShift(s);
      } else if (shiftMode === "close" && activeShift) {
        await closeShift(activeShift.id, val, shiftNotes || "Closed from App Shell");
        setActiveShift(null);
      }
      setIsShiftModalOpen(false);
      setShiftNotes("");
    } catch (err) {
      alert("Shift action error: " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setShiftLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. DESKTOP SIDEBAR (lg / xl)                         */}
      {/* ---------------------------------------------------- */}
      <aside
        className={`no-print hidden shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-300 lg:flex ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Brand & Store Header */}
          <div className="border-b border-slate-800/80 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-950/40">
                <Store className="h-5 w-5" />
              </span>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 animate-in fade-in duration-200">
                  <h2 className="text-sm font-extrabold tracking-tight text-white truncate">
                    {user?.businessName || "Swift Store"}
                  </h2>
                  <span className="inline-block text-[11px] font-semibold text-emerald-400 capitalize truncate">
                    Back-Office &bull; {user?.storeType || "Retail"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-3 py-4">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Merchant Workspace
              </div>
            )}

            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive =
                mod.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(mod.href);

              const isPos = mod.href === "/pos";

              return (
                <Link
                  key={mod.href + mod.name}
                  href={mod.href}
                  title={isCollapsed ? mod.name : undefined}
                  className={`group flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition active:scale-95 ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm font-bold shadow-emerald-950/20"
                      : isPos
                      ? "bg-slate-800/90 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 transition ${
                        isActive
                          ? "text-white"
                          : isPos
                          ? "text-emerald-400"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    {!isCollapsed && <span>{mod.name}</span>}
                  </div>

                  {!isCollapsed && mod.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {mod.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800/80 p-3 space-y-2">
          {!isCollapsed && (
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
              title="Open Public Tools Website"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Public Tools</span>
              </span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}

          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={lockScreen}
              className={`flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-amber-400 hover:bg-slate-700 transition active:scale-95 ${
                isCollapsed ? "w-full px-0" : "flex-1 px-2"
              }`}
              title="Lock POS Counter (PIN Protected)"
            >
              <Lock className="h-3.5 w-3.5" />
              {!isCollapsed && <span>Lock PIN</span>}
            </button>
            {!isCollapsed && (
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition active:scale-95"
                title="Logout from Store"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE WITH DESKTOP & MOBILE TOP BARS     */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* ================================================== */}
        {/* DESKTOP TOP UTILITY BAR (lg / xl)                 */}
        {/* ================================================== */}
        <header className="no-print sticky top-0 z-30 hidden h-14 items-center justify-between border-b border-slate-200/90 bg-white/95 px-6 backdrop-blur-md shadow-2xs lg:flex">
          {/* Left: Collapse toggle + Store Name + Cashier Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 truncate">
                {user?.businessName || "Store"}
              </span>
              <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                {user?.storeType || "Retail"}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            {/* Active Cashier Status Badge */}
            <div className="flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/80 px-3 py-1 text-xs text-slate-700">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Cashier: <strong className="font-semibold text-slate-900">{user?.ownerName || "Cashier 01"}</strong>
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Right: Shift Status + Sync Status + Quick POS CTA + Profile */}
          <div className="flex items-center gap-3">
            {/* Shift Status Badge / Button */}
            <button
              type="button"
              onClick={() => {
                if (activeShift) {
                  setShiftMode("close");
                  setShiftCashInput("");
                } else {
                  setShiftMode("start");
                  setShiftCashInput("1000");
                }
                setIsShiftModalOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                activeShift
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 shadow-2xs"
                  : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 shadow-2xs"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>
                {activeShift
                  ? `Shift Open (₹${activeShift.openingCash})`
                  : "Open Shift"}
              </span>
            </button>

            {/* Sync Status Dot */}
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600">
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{isOnline ? "Cloud Synced" : "Offline Active"}</span>
            </div>

            {/* Launch POS Terminal Quick CTA */}
            {pathname !== "/pos" && (
              <Link
                href="/pos"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm shadow-emerald-900/20 hover:bg-emerald-500 transition active:scale-95"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Launch POS</span>
              </Link>
            )}

            {/* Swift AI Quick Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-ai-agent"));
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
              title="Open Swift AI Assistant (Cmd+J)"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden xl:inline">Swift AI</span>
            </button>

            {/* Cashier Quick-Lock Button */}
            <button
              type="button"
              onClick={lockScreen}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              title="Lock POS Counter (PIN Required)"
            >
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>Lock</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                  {(user?.businessName || "S").charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">
                  {user?.ownerName || "Merchant"}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.businessName || "Store"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Cashier: <span className="font-semibold text-slate-700">{user?.ownerName || "Owner"}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1 space-y-1">
                    <Link
                      href="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>Store Settings &amp; PIN</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        lockScreen();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition text-left"
                    >
                      <Lock className="h-4 w-4 text-amber-600" />
                      <span>Lock POS Screen</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* NATIVE ANDROID APP TOP BAR (Mobile max-lg)         */}
        {/* ================================================== */}
        <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/90 bg-white/95 px-3.5 backdrop-blur-md shadow-2xs lg:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Drawer menu toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Store Initial / Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-sm shadow-sm shadow-emerald-950/20">
              {(user?.businessName || "S").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h1 className="text-sm font-black text-slate-900 truncate leading-tight">
                  {user?.businessName || "Store"}
                </h1>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[10px] font-semibold text-slate-500 truncate leading-tight">
                {user?.ownerName || "Merchant"} &bull; {user?.storeType || "Retail"}
              </p>
            </div>
          </div>

          {/* Right Header Status Badges & Quick Scan */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Shift Status Badge */}
            <button
              type="button"
              onClick={() => {
                if (activeShift) {
                  setShiftMode("close");
                  setShiftCashInput("");
                } else {
                  setShiftMode("start");
                  setShiftCashInput("1000");
                }
                setIsShiftModalOpen(true);
              }}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border transition active:scale-95 ${
                activeShift
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-amber-300 bg-amber-50 text-amber-800"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  activeShift ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{activeShift ? "Shift Open" : "Open Shift"}</span>
            </button>

            {/* Quick Scan Icon */}
            <Link
              href="/pos"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition active:scale-95 shadow-2xs"
              title="Launch POS Barcode Scanner"
            >
              <ScanBarcode className="h-4.5 w-4.5" />
            </Link>
          </div>
        </header>

        {/* Workspace Content with mobile bottom dock padding */}
        <main className="flex-1 overflow-x-hidden pb-24 lg:pb-8">{children}</main>

        {/* ================================================== */}
        {/* NATIVE ANDROID BOTTOM NAVIGATION BAR (App Dock)    */}
        {/* ================================================== */}
        <nav className="no-print fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-lg shadow-lg lg:hidden">
          {/* 1. Home / Overview */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-semibold transition active:scale-95 ${
              pathname === "/dashboard"
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Home</span>
            {pathname === "/dashboard" && (
              <span className="h-1 w-1 rounded-full bg-emerald-600 -mt-0.5" />
            )}
          </Link>

          {/* 2. POS Terminal */}
          <Link
            href="/pos"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-semibold transition active:scale-95 ${
              pathname.startsWith("/pos")
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Store className="h-5 w-5" />
            <span>POS</span>
            {pathname.startsWith("/pos") && (
              <span className="h-1 w-1 rounded-full bg-emerald-600 -mt-0.5" />
            )}
          </Link>

          {/* 3. Stock Inventory */}
          <Link
            href="/inventory"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-semibold transition active:scale-95 ${
              pathname.startsWith("/inventory")
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Stock</span>
            {pathname.startsWith("/inventory") && (
              <span className="h-1 w-1 rounded-full bg-emerald-600 -mt-0.5" />
            )}
          </Link>

          {/* 4. Khata Book */}
          <Link
            href="/customers"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-semibold transition active:scale-95 ${
              pathname.startsWith("/customers")
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Khata</span>
            {pathname.startsWith("/customers") && (
              <span className="h-1 w-1 rounded-full bg-emerald-600 -mt-0.5" />
            )}
          </Link>

          {/* 5. Profile / Settings */}
          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-semibold transition active:scale-95 ${
              pathname.startsWith("/settings")
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Profile</span>
            {pathname.startsWith("/settings") && (
              <span className="h-1 w-1 rounded-full bg-emerald-600 -mt-0.5" />
            )}
          </Link>
        </nav>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MOBILE SLIDE-OUT DRAWER                           */}
      {/* ---------------------------------------------------- */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />

          <div className="relative flex w-72 flex-col justify-between bg-slate-900 p-4 text-white shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold">
                    {(user?.businessName || "S").charAt(0).toUpperCase()}
                  </span>
                  <div className="truncate max-w-[160px]">
                    <h3 className="text-xs font-bold truncate">{user?.businessName || "Store"}</h3>
                    <p className="text-[10px] text-emerald-400">Merchant Workspace</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {MODULES.map((mod) => {
                  const Icon = mod.icon;
                  const isActive =
                    mod.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(mod.href);

                  return (
                    <Link
                      key={mod.href + mod.name}
                      href={mod.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                        isActive
                          ? "bg-emerald-600 text-white font-bold shadow-sm"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5" />
                        <span>{mod.name}</span>
                      </div>
                      {mod.badge && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
                          {mod.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  lockScreen();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-amber-400 active:scale-95"
              >
                <Lock className="h-4 w-4" />
                <span>Lock POS Counter</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-800/60 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/50 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. GLOBAL SHIFT MANAGEMENT MODAL                     */}
      {/* ---------------------------------------------------- */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${
                    shiftMode === "start"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {shiftMode === "start" ? "Open Cash Drawer Shift" : "Close Cash Drawer Shift"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {shiftMode === "start"
                      ? "Set opening cash float in till"
                      : "Count physical cash & reconcile till"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShiftModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleShiftSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {shiftMode === "start" ? "Opening Cash Float (₹)" : "Physical Closing Cash in Till (₹)"}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={shiftCashInput}
                  onChange={(e) => setShiftCashInput(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="e.g. Counter 1 Morning Shift"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shiftLoading}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold text-white shadow-sm transition active:scale-95 ${
                    shiftMode === "start"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20"
                      : "bg-amber-600 hover:bg-amber-500 shadow-amber-950/20"
                  }`}
                >
                  {shiftLoading
                    ? "Processing..."
                    : shiftMode === "start"
                    ? "Open Shift →"
                    : "Close Shift ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

