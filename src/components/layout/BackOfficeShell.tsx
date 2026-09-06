"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  BarChart3,
  Settings,
  Lock,
  LogOut,
  ChevronDown,
  Menu,
  X,
  WifiOff,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface NavModule {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MODULES: NavModule[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "POS Terminal",
    href: "/pos",
    icon: Store,
    badge: "Terminal",
  },
  {
    name: "Items & Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Customers & Khata",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Reports & GSTR-1",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Store Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function BackOfficeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, lockScreen, logout } = useAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* ---------------------------------------------------- */}
      {/* 1. DESKTOP SIDEBAR                                   */}
      {/* ---------------------------------------------------- */}
      <aside className="no-print hidden w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-300 md:flex">
        <div>
          {/* Brand & Store Header */}
          <div className="border-b border-slate-800/80 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-900/40">
                <Store className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold tracking-tight text-white truncate">
                  {user?.businessName || "Swift Store"}
                </h2>
                <span className="inline-block text-[11px] font-semibold text-teal-400 capitalize">
                  Back-Office &bull; {user?.storeType || "Retail"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-3 py-4">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Operations Menu
            </div>

            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive =
                mod.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(mod.href);

              const isPos = mod.href === "/pos";

              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-teal-700 text-white shadow-sm font-bold"
                      : isPos
                      ? "bg-slate-800/80 text-teal-400 hover:bg-slate-800 hover:text-teal-300"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition ${
                        isActive
                          ? "text-white"
                          : isPos
                          ? "text-teal-400"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    <span>{mod.name}</span>
                  </div>

                  {mod.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-teal-500/20 text-teal-300"
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
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Open Free Public GST Invoice Generator"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              <span>Public Tools</span>
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={lockScreen}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-2 py-2 text-xs font-semibold text-amber-400 hover:bg-slate-700 transition"
              title="Lock Screen (PIN Protected)"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Lock POS</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
              title="Logout from Store"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE WITH TOP HEADER                   */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Back-Office Top Bar */}
        <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md shadow-2xs">
          {/* Mobile hamburger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 text-white font-bold text-xs">
                <Store className="h-3.5 w-3.5" />
              </span>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[200px] sm:max-w-xs">
                  {user?.businessName || "Swift Store"}
                </h1>
                <p className="text-[10px] text-slate-500 leading-none hidden sm:block">
                  Back-Office &bull; {user?.phone || user?.email || "Retail Mode"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Status Badges & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline Status */}
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                isOnline
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
              title={isOnline ? "Connected & Synced" : "Operating in 100% Offline Mode"}
            >
              {isOnline ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-amber-600" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Launch POS Terminal Quick CTA */}
            {pathname !== "/pos" && (
              <Link
                href="/pos"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition active:scale-95"
              >
                <Zap className="h-3.5 w-3.5 text-teal-300" />
                <span>POS Terminal</span>
              </Link>
            )}

            {/* Cashier Quick-Lock Button */}
            <button
              type="button"
              onClick={lockScreen}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
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
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-900 font-bold text-xs">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <span className="max-w-[100px] truncate hidden md:inline">
                  {user?.ownerName || "Cashier"}
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
                      Cashier: <span className="font-semibold text-slate-700">{user?.ownerName || "Default Cashier"}</span>
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

        {/* Workspace Content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MOBILE SLIDE-OUT DRAWER                           */}
      {/* ---------------------------------------------------- */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-72 flex-col justify-between bg-slate-900 p-4 text-white shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
                    <Store className="h-4 w-4" />
                  </span>
                  <div className="truncate max-w-[160px]">
                    <h3 className="text-xs font-bold truncate">{user?.businessName || "Store"}</h3>
                    <p className="text-[10px] text-teal-400">Back-Office Menu</p>
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

              {/* Module Nav Links */}
              <nav className="mt-4 space-y-1">
                {MODULES.map((mod) => {
                  const Icon = mod.icon;
                  const isActive =
                    mod.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(mod.href);

                  return (
                    <Link
                      key={mod.href}
                      href={mod.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                        isActive
                          ? "bg-teal-700 text-white font-bold"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{mod.name}</span>
                      </div>
                      {mod.badge && (
                        <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] text-teal-300 font-bold">
                          {mod.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  lockScreen();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-amber-400"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-800/60 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
