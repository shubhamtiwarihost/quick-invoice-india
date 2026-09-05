"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X, Zap, ShieldCheck, WifiOff } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone;

    if (isStandalone) {
      return;
    }

    // Check if user dismissed the prompt in this session
    const isDismissed = sessionStorage.getItem("swiftgst_pwa_dismissed");
    if (isDismissed) {
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    }

    function handleAppInstalled() {
      setIsVisible(false);
      setDeferredPrompt(null);
      sessionStorage.setItem("swiftgst_pwa_dismissed", "true");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsVisible(false);
      }
    } catch (err) {
      console.error("PWA Install error:", err);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  }

  function handleDismiss() {
    setIsVisible(false);
    sessionStorage.setItem("swiftgst_pwa_dismissed", "true");
  }

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Install App Prompt"
      className="no-print fixed bottom-20 left-3 right-3 z-50 mx-auto max-w-md rounded-2xl border border-emerald-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 md:bottom-6 md:left-auto md:right-6 md:w-96 select-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-600 shadow-sm">
            <Image
              src="/icon-192.png"
              alt="SwiftGST Logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Official Android PWA
              </p>
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              SwiftGST - Free POS &amp; Khata
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95 transition"
          aria-label="Dismiss prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
        Add SwiftGST to Home Screen for fast offline billing, barcode scan, and thermal printing.
      </p>

      {/* Feature chips */}
      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] font-semibold text-emerald-800">
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 border border-emerald-200/60">
          <WifiOff className="h-3 w-3" />
          Offline Ready
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 border border-emerald-200/60">
          <Zap className="h-3 w-3" />
          Zero Latency
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 border border-emerald-200/60">
          <ShieldCheck className="h-3 w-3" />
          100% Private
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-3.5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 px-4 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-800 active:scale-95 transition disabled:opacity-60"
        >
          <Download className="h-4 w-4 stroke-[2.5]" />
          <span>{isInstalling ? "Installing…" : "Install App"}</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 active:scale-95 transition"
        >
          Not Now
        </button>
      </div>
    </aside>
  );
}
