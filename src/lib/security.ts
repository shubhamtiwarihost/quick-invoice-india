/**
 * Client-side Web Security Utilities for SwiftGST (swiftgst.in)
 * Zero-dependency input sanitization, XSS defense, rate-limiting & honeypot anti-spam.
 */

/**
 * HTML Entity Map for character escaping
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Sanitizes raw string input to eliminate Cross-Site Scripting (XSS) vectors,
 * control character injection, and runaway payload sizing.
 *
 * @param raw Input string from user
 * @param maxLength Maximum allowed length (defaults to 1000)
 * @param allowNewlines Whether to preserve standard \n newlines (defaults to false)
 */
export function sanitizeInput(
  raw: unknown,
  maxLength = 1000,
  allowNewlines = false
): string {
  if (typeof raw !== "string") return "";

  // 1. Remove unicode zero-width and invisible control characters
  // Preserves \t, \n, \r if allowNewlines is true
  const stripped = raw
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
    .replace(
      // eslint-disable-next-line no-control-regex
      allowNewlines ? /[^\x20-\x7E\t\r\n]/g : /[^\x20-\x7E]/g,
      ""
    );

  // 2. Remove known dangerous script/injection patterns case-insensitively
  const neutralized = stripped
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/on\w+\s*=/gi, ""); // Strips onerror=, onclick=, onload=

  // 3. HTML Entity Encode critical delimiters
  const escaped = neutralized.replace(/[&<>"'/]/g, (s) => HTML_ESCAPE_MAP[s] || s);

  // 4. Enforce strict character bounds
  return escaped.trim().slice(0, maxLength);
}

/**
 * Validates email format according to RFC standard structure and length bounds.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (email.length > 254) return false;

  // Standard safe regex for email address syntax
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  return emailRegex.test(email.trim());
}

/**
 * Client-Side Throttling & Rate-Limiting using localStorage.
 * Prevents automated form flooding and spam loops from the same browser.
 */
interface RateLimitConfig {
  minIntervalSeconds?: number; // Minimum cooldown between consecutive submissions
  maxPerHour?: number; // Maximum submissions allowed in a rolling 1-hour window
}

interface RateLimitResult {
  allowed: boolean;
  remainingSeconds?: number;
  error?: string;
}

const STORAGE_PREFIX = "swiftgst_rate_";

export function checkRateLimit(
  actionKey: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const { minIntervalSeconds = 60, maxPerHour = 5 } = config;

  if (typeof window === "undefined" || !window.localStorage) {
    return { allowed: true };
  }

  const key = `${STORAGE_PREFIX}${actionKey}`;
  const now = Date.now();

  try {
    const raw = window.localStorage.getItem(key);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];

    // Filter to last 1 hour
    const oneHourAgo = now - 60 * 60 * 1000;
    const recent = timestamps.filter((t) => t > oneHourAgo);

    // Check minimum interval from last submission
    if (recent.length > 0) {
      const last = recent[recent.length - 1];
      const elapsedSec = Math.floor((now - last) / 1000);
      if (elapsedSec < minIntervalSeconds) {
        const remaining = minIntervalSeconds - elapsedSec;
        return {
          allowed: false,
          remainingSeconds: remaining,
          error: `Please wait ${remaining} second${remaining === 1 ? "" : "s"} before sending another message.`,
        };
      }
    }

    // Check max requests per hour
    if (recent.length >= maxPerHour) {
      return {
        allowed: false,
        remainingSeconds: 3600,
        error: "Too many messages sent. Please try again later or email support@swiftgst.in directly.",
      };
    }

    return { allowed: true };
  } catch {
    // If localStorage quota or JSON parsing fails, fail open gracefully
    return { allowed: true };
  }
}

/**
 * Records a successful action timestamp in localStorage for rate limiting.
 */
export function recordActionTimestamp(actionKey: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;

  const key = `${STORAGE_PREFIX}${actionKey}`;
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  try {
    const raw = window.localStorage.getItem(key);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const updated = [...timestamps.filter((t) => t > oneHourAgo), now];
    window.localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // Ignore storage write errors (e.g. private browsing restrictions)
  }
}

/**
 * Honeypot Anti-Spam Field Identifier
 * Hidden input that should always remain blank for human users.
 * Automated form scrapers usually fill all inputs they discover.
 */
export const HONEYPOT_FIELD_NAME = "website_trap_verify";
