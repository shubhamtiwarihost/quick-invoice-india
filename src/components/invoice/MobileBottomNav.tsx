"use client";

import {
  Edit3,
  Eye,
  Download,
  MessageCircle,
  History,
  LayoutGrid,
} from "lucide-react";

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onDownloadPdf,
  onShareWhatsApp,
  onOpenSaved,
  onOpenTools,
  savedCount,
  isPdfBusy = false,
}: {
  activeTab: "form" | "preview";
  onTabChange: (tab: "form" | "preview") => void;
  onDownloadPdf: () => void;
  onShareWhatsApp: () => void;
  onOpenSaved: () => void;
  onOpenTools: () => void;
  savedCount: number;
  isPdfBusy?: boolean;
}) {
  return (
    <nav
      aria-label="Mobile Invoice Actions"
      className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-3 py-2 backdrop-blur-md md:hidden select-none pb-[calc(env(safe-area-inset-bottom)+8px)] shadow-2xl will-change-transform transform-gpu"
    >
      <div className="flex items-center gap-1.5 max-w-lg mx-auto">
        {/* 1. Toggle Tab Button (Preview A4 <-> Edit Form) */}
        <button
          type="button"
          onClick={() => onTabChange(activeTab === "form" ? "preview" : "form")}
          className={`flex flex-1 min-w-0 items-center justify-center gap-1 rounded-xl border py-2 px-1.5 text-xs font-semibold transition active:scale-95 h-11 ${
            activeTab === "form"
              ? "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
              : "border-teal-300 bg-teal-50 text-teal-900 hover:bg-teal-100"
          }`}
        >
          {activeTab === "form" ? (
            <>
              <Eye className="h-4 w-4 text-teal-700 shrink-0" />
              <span className="truncate">Preview</span>
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 text-teal-700 shrink-0" />
              <span className="truncate">Edit</span>
            </>
          )}
        </button>

        {/* 2. Download PDF Button - DISTINCT PRIMARY EMPHASIS */}
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isPdfBusy}
          className="flex flex-[1.35] min-w-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 py-2 px-2 text-xs font-bold text-white shadow-md hover:from-teal-800 hover:to-teal-900 active:scale-95 transition disabled:opacity-60 h-11 ring-2 ring-teal-600/30"
        >
          <Download className="h-4 w-4 shrink-0 stroke-[2.5]" />
          <span className="truncate">{isPdfBusy ? "Preparing…" : "Download PDF"}</span>
        </button>

        {/* 3. Share via WhatsApp Button */}
        <button
          type="button"
          onClick={onShareWhatsApp}
          className="flex flex-1 min-w-0 items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 px-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition h-11"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </button>

        {/* 4. Saved Invoices Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenSaved}
          title="Saved Invoices History"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition"
        >
          <History className="h-4.5 w-4.5" />
          {savedCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-teal-700 px-1 text-[10px] font-bold text-white shadow-xs">
              {savedCount}
            </span>
          ) : null}
        </button>

        {/* 5. Tools Sheet Trigger */}
        <button
          type="button"
          onClick={onOpenTools}
          title="All Tools & Utilities"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition"
        >
          <LayoutGrid className="h-4.5 w-4.5" />
        </button>
      </div>
    </nav>
  );
}
