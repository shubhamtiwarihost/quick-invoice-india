"use client";

import Link from "next/link";
import { X, ChevronRight, Sparkles, Package, Store, Users, BarChart3 } from "lucide-react";
import { ALL_TOOLS } from "@/components/shared/Navbar";

export function MobileToolsSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  // Filter out the home invoice generator since user is already in invoice
  const tools = ALL_TOOLS.filter((t) => t.href !== "/");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 md:hidden">
      <div
        className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200"
        style={{ touchAction: "pan-y" }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FREE UTILITY SUITE</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">GST &amp; Business Tools</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick POS & Inventory Mobile Launchers */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/inventory"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 p-3 transition active:scale-95 hover:bg-teal-100 shadow-2xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs shrink-0">
              <Package className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-teal-950 truncate">Inventory</p>
              <p className="text-[10px] text-teal-700 font-medium truncate">Stock Master</p>
            </div>
          </Link>

          <Link
            href="/pos"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 p-3 transition active:scale-95 hover:bg-teal-100 shadow-2xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs shrink-0">
              <Store className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-teal-950 truncate">POS Counter</p>
              <p className="text-[10px] text-teal-700 font-medium truncate">Thermal Bill</p>
            </div>
          </Link>

          <Link
            href="/customers"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 p-3 transition active:scale-95 hover:bg-teal-100 shadow-2xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs shrink-0">
              <Users className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-teal-950 truncate">Khata CRM</p>
              <p className="text-[10px] text-teal-700 font-medium truncate">Udhaar Ledger</p>
            </div>
          </Link>

          <Link
            href="/analytics"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 p-3 transition active:scale-95 hover:bg-teal-100 shadow-2xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs shrink-0">
              <BarChart3 className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-teal-950 truncate">Analytics</p>
              <p className="text-[10px] text-teal-700 font-medium truncate">GSTR-1 & Profit</p>
            </div>
          </Link>
        </div>

        {/* Tools List */}
        <div className="mt-4 space-y-2.5">
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition active:scale-[0.98] active:bg-teal-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.label}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-500 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
