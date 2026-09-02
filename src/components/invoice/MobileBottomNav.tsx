"use client";

import { Edit3, Eye, History, LayoutGrid } from "lucide-react";

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onOpenSaved,
  onOpenTools,
  savedCount,
}: {
  activeTab: "form" | "preview";
  onTabChange: (tab: "form" | "preview") => void;
  onOpenSaved: () => void;
  onOpenTools: () => void;
  savedCount: number;
}) {
  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 py-1.5 backdrop-blur-lg md:hidden select-none pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {/* 1. Edit Tab */}
      <button
        type="button"
        onClick={() => onTabChange("form")}
        className={`flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-medium transition active:scale-95 ${
          activeTab === "form"
            ? "font-semibold text-teal-700"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <div
          className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
            activeTab === "form" ? "bg-teal-50 text-teal-700" : "text-slate-500"
          }`}
        >
          <Edit3 className="h-4 w-4" />
        </div>
        <span className="mt-0.5">Edit Form</span>
      </button>

      {/* 2. Preview Tab */}
      <button
        type="button"
        onClick={() => onTabChange("preview")}
        className={`flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-medium transition active:scale-95 ${
          activeTab === "preview"
            ? "font-semibold text-teal-700"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <div
          className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
            activeTab === "preview" ? "bg-teal-50 text-teal-700" : "text-slate-500"
          }`}
        >
          <Eye className="h-4 w-4" />
        </div>
        <span className="mt-0.5">A4 Preview</span>
      </button>

      {/* 3. Saved Invoices */}
      <button
        type="button"
        onClick={onOpenSaved}
        className="relative flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-medium text-slate-500 transition hover:text-slate-900 active:scale-95"
      >
        <div className="relative flex h-7 w-12 items-center justify-center rounded-full text-slate-500">
          <History className="h-4 w-4" />
          {savedCount > 0 ? (
            <span className="absolute right-2 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-teal-700 px-1 text-[9px] font-bold text-white shadow-xs">
              {savedCount}
            </span>
          ) : null}
        </div>
        <span className="mt-0.5">Saved</span>
      </button>

      {/* 4. Tools Sheet */}
      <button
        type="button"
        onClick={onOpenTools}
        className="flex flex-1 flex-col items-center justify-center py-1 text-[11px] font-medium text-slate-500 transition hover:text-slate-900 active:scale-95"
      >
        <div className="flex h-7 w-12 items-center justify-center rounded-full text-slate-500">
          <LayoutGrid className="h-4 w-4" />
        </div>
        <span className="mt-0.5">Tools</span>
      </button>
    </nav>
  );
}
