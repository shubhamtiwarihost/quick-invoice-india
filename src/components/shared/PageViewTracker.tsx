"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Exclude super admin routes from customer traffic metrics
    if (pathname && pathname.startsWith("/admin")) return;

    const page = pathname || window.location.pathname;
    const body = JSON.stringify({
      event_type: "PAGE_VIEW",
      page,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/track.php", blob);
      } else {
        fetch("/api/track.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking fire-and-forget
    }
  }, [pathname]);

  return null;
}
