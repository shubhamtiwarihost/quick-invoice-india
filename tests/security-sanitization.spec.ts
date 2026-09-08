import { test, expect } from "@playwright/test";
import {
  sanitizeText,
  sanitizeMultilineText,
  sanitizeImageUrl,
  sanitizeNumber,
  sanitizeInvoiceDraft,
} from "../src/lib/sanitize";
import { defaultDraft } from "../src/lib/store";

test.describe("Security & Input Sanitization", () => {
  test("sanitizeText removes HTML tags, script payloads, and event handlers", () => {
    expect(sanitizeText("<script>alert('xss')</script>Hello")).toBe("Hello");
    expect(sanitizeText("<img src=x onerror=alert('xss')>Photo")).toBe("Photo");
    expect(sanitizeText("javascript:alert(1)")).toBe("alert(1)");
    expect(sanitizeText("Safe Business Name Ltd.")).toBe("Safe Business Name Ltd.");
    expect(sanitizeText("Null\x00Byte\x08Test")).toBe("NullByteTest");
  });

  test("sanitizeMultilineText preserves newlines while removing malicious payloads", () => {
    const raw = "Line 1 <script>alert(1)</script>\nLine 2 <b onmouseover=evil()>bold</b>\nLine 3";
    const sanitized = sanitizeMultilineText(raw);
    expect(sanitized).toBe("Line 1\nLine 2 bold\nLine 3");
  });

  test("sanitizeImageUrl permits safe raster images and rejects XSS vectors", () => {
    // Valid raster base64
    const validBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    expect(sanitizeImageUrl(validBase64)).toBe(validBase64);

    // Valid HTTPS URL
    expect(sanitizeImageUrl("https://swiftgst.in/logo.png")).toBe("https://swiftgst.in/logo.png");

    // Safe relative asset
    expect(sanitizeImageUrl("/logo.png")).toBe("/logo.png");

    // Unsafe vectors MUST be stripped / returned empty
    expect(sanitizeImageUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeImageUrl("data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+")).toBe("");
    expect(sanitizeImageUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  test("sanitizeNumber handles invalid inputs safely", () => {
    expect(sanitizeNumber("abc", 0)).toBe(0);
    expect(sanitizeNumber(NaN, 10)).toBe(10);
    expect(sanitizeNumber(50, 0, 0, 100)).toBe(50);
    expect(sanitizeNumber(-5, 0, 0, 100)).toBe(0);
    expect(sanitizeNumber(150, 0, 0, 100)).toBe(100);
  });

  test("sanitizeInvoiceDraft thoroughly sanitizes all fields", () => {
    const maliciousDraft = {
      ...defaultDraft,
      seller: {
        ...defaultDraft.seller,
        businessName: "Acme Corp <script>alert('pwn')</script>",
        logo: "javascript:alert('evil')",
        signatureImage: "data:image/svg+xml;utf8,<svg onload=alert(1)>",
      },
      client: {
        ...defaultDraft.client,
        name: "Client <img src=x onerror=alert(2)>",
        billingAddress: "123 Street<script>alert(3)</script>\nSecond line",
      },
      items: [
        {
          id: "item-1",
          description: "Widget <iframe src='https://attacker.com'></iframe>",
          hsnSac: "998311",
          quantity: 2,
          unit: "Pcs" as const,
          rate: 100,
          discountType: "percent" as const,
          discountValue: 0,
          gstSlab: 18 as const,
        },
      ],
      meta: {
        ...defaultDraft.meta,
        notes: "Notes <script>alert(4)</script>\nSafe line",
      },
    };

    const clean = sanitizeInvoiceDraft(maliciousDraft);
    expect(clean.seller.businessName).toBe("Acme Corp");
    expect(clean.seller.logo).toBe("");
    expect(clean.seller.signatureImage).toBe("");
    expect(clean.client.name).toBe("Client");
    expect(clean.client.billingAddress).toBe("123 Street\nSecond line");
    expect(clean.items[0].description).toBe("Widget");
    expect(clean.meta.notes).toBe("Notes\nSafe line");
  });
});
