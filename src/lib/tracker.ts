/**
 * SwiftGST Event & Activity Tracking Utility
 * Non-blocking client-side telemetry to /api/track.php
 */

export interface TrackPayload {
  userId?: string | null;
  storeName?: string | null;
  event_type: string;
  feature?: string;
  details?: Record<string, unknown> | null;
}

export function trackActivity(
  eventType: string,
  feature: string = "general",
  details?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  try {
    let userId: string | null = null;
    let storeName: string | null = null;

    try {
      const storedUser = localStorage.getItem("swiftpos_auth_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userId = parsed.id || null;
        storeName = parsed.businessName || null;
      }
    } catch {
      // ignore storage parse errors
    }

    const payload: TrackPayload = {
      userId,
      storeName,
      event_type: eventType,
      feature,
      details: details || null,
    };

    const body = JSON.stringify(payload);

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
    // Analytics failures must never interfere with core app functions
  }
}
