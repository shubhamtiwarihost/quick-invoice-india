"use client";

import { useEffect, useRef } from "react";

interface AdBannerSlotProps {
  slotId?: string;
  client?: string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}

/**
 * AdBannerSlot
 * Compliant, non-intrusive Google AdSense banner container.
 * Features:
 * - Clear, subtle 'ADVERTISEMENT' micro-tag for policy transparency.
 * - Minimum height reservation to prevent Cumulative Layout Shifts (CLS).
 * - Safe spacing away from interactive checkout/print/download triggers.
 */
export function AdBannerSlot({
  slotId,
  client = "ca-pub-XXXXXXXXXXXXXXXX",
  format = "auto",
  className = "",
}: AdBannerSlotProps) {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Attempt to push ad to window.adsbygoogle only in client environment if ad script is present
    try {
      if (typeof window !== "undefined" && slotId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        if (win.adsbygoogle) {
          win.adsbygoogle.push({});
        }
      }
    } catch {
      // Gracefully handle ad blocker or uninitialized script
    }
  }, [slotId]);

  return (
    <aside
      aria-label="Sponsored Advertisement"
      className={`w-full my-8 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-full max-w-4xl rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center transition">
        {/* Subtle Policy Label */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-slate-200" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 select-none">
            Advertisement
          </span>
          <span className="h-px w-8 bg-slate-200" />
        </div>

        {/* Ad Container Box */}
        <div
          ref={adRef}
          className="mx-auto flex min-h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden rounded-xl bg-slate-100/50"
        >
          {slotId ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "100%" }}
              data-ad-client={client}
              data-ad-slot={slotId}
              data-ad-format={format}
              data-full-width-responsive="true"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-4 px-3 text-slate-400 select-none">
              <span className="text-xs font-medium text-slate-500">
                SwiftGST Free Retail Suite
              </span>
              <span className="text-[11px] text-slate-400">
                100% Free &amp; Client-Side Secure · Zero Subscription Fees
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
