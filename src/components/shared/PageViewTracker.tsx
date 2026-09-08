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
      const adminToken =
        typeof window !== "undefined"
          ? sessionStorage.getItem("swift_admin_secret_key") ||
            localStorage.getItem("swiftgst_auth_token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
      }

      if (adminToken || !navigator.sendBeacon) {
        fetch("/api/track.php", {
          method: "POST",
          headers,
          body,
          keepalive: true,
        }).catch(() => {});
      } else {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/track.php", blob);
      }
    } catch {
      // Non-blocking fire-and-forget
    }
  }, [pathname]);

  return null;
}
