"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem("swiftgst_cookie_consent");
  } catch {
    return "accepted";
  }
}

function getServerSnapshot(): string | null {
  return "accepted"; // Prevent rendering during SSR to avoid hydration mismatch
}

export function CookieConsent() {
  const storedConsent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  // If consent is already recorded or user dismissed in current session, do not render
  if (storedConsent || dismissed) {
    return null;
  }

  function handleAccept() {
    try {
      localStorage.setItem("swiftgst_cookie_consent", "accepted");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  function handleDecline() {
    try {
      localStorage.setItem("swiftgst_cookie_consent", "declined");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  return (
    <aside
      aria-label="Cookie and privacy consent banner"
      role="dialog"
      className="no-print fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm shrink-0 select-none">
            🍪
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span>Privacy &amp; Local Storage</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-800 normal-case">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              100% Private
            </span>
          </h3>
        </div>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Close banner"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
        SwiftGST does not track or sell your data. We use browser local storage solely to save your invoices and preferences on this device.
      </p>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <Link
          href="/privacy-policy"
          className="text-[11px] font-medium text-slate-500 hover:text-teal-700 underline decoration-slate-300 underline-offset-2 transition"
        >
          Learn more
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 active:scale-95 transition"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-xl bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs active:scale-95 transition"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
