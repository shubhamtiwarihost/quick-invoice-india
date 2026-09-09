import { test, expect } from "@playwright/test";

test.describe("AI Merchant Co-Pilot API & Tools", () => {
  test("POST /api/agent returns 400 on empty prompt", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "" },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Missing prompt");
  });

  test("POST /api/agent handles POS billing queries with function call or quota notice", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "2 chai aur 1 samosa ka bill banao" },
    });
    if (res.status() === 429) {
      const json = await res.json();
      expect(json.quotaExceeded).toBe(true);
      expect(json.text).toContain("Aaj ka AI free quota pura ho gaya hai");
    } else {
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.functionCall).toBeTruthy();
      expect(json.functionCall.name).toBe("pos_action");
      expect(json.functionCall.args.action).toBe("create_bill");
    }
  });

  test("POST /api/agent handles Low Stock inventory query or quota notice", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "Dukan me low stock items check karo" },
    });
    if (res.status() === 429) {
      const json = await res.json();
      expect(json.quotaExceeded).toBe(true);
      expect(json.text).toContain("Aaj ka AI free quota pura ho gaya hai");
    } else {
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.functionCall).toBeTruthy();
      expect(json.functionCall.name).toBe("inventory_action");
      expect(json.functionCall.args.action).toBe("check_low_stock");
    }
  });

  test("POST /api/agent handles Customer Khata ledger query or quota notice", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "Ramesh Sharma ka khata balance kitna baaki hai?" },
    });
    if (res.status() === 429) {
      const json = await res.json();
      expect(json.quotaExceeded).toBe(true);
      expect(json.text).toContain("Aaj ka AI free quota pura ho gaya hai");
    } else {
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.functionCall).toBeTruthy();
      expect(json.functionCall.name).toBe("khata_action");
      expect(json.functionCall.args.action).toBe("get_balance");
    }
  });

  test("POST /api/agent handles Today Sales report query or quota notice", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "Aaj ki total dukan ki sale kitni hui?" },
    });
    if (res.status() === 429) {
      const json = await res.json();
      expect(json.quotaExceeded).toBe(true);
      expect(json.text).toContain("Aaj ka AI free quota pura ho gaya hai");
    } else {
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.functionCall).toBeTruthy();
      expect(json.functionCall.name).toBe("reports_action");
      expect(json.functionCall.args.action).toBe("daily_sales");
    }
  });

  test("POST /api/agent offline fallback interpreter correctly parses Hindi queries without cloud API", async ({ request }) => {
    const res = await request.post("/api/agent", {
      headers: { "x-offline-fallback": "1" },
      data: { prompt: "2 chai aur 1 samosa ka bill banao" },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.source).toBe("local_fallback");
    expect(json.functionCall).toBeTruthy();
    expect(json.functionCall.name).toBe("pos_action");
    expect(json.functionCall.args.action).toBe("create_bill");
  });

  test("AI Co-Pilot button is visible on public homepage (/) and opens modal on click", async ({ page }) => {
    await page.goto("/");
    const agentButton = page.locator("button[aria-label='Open AI Merchant Co-Pilot']").first();
    await expect(agentButton).toBeVisible();
    await expect(agentButton).toContainText("AI Co-Pilot");

    // Click to open modal
    await agentButton.click();
    const modalTitle = page.locator("text=SwiftGST AI Co-Pilot");
    await expect(modalTitle.first()).toBeVisible();
  });

  test("AI Co-Pilot button is visible on POS counter page (/pos)", async ({ page }) => {
    await page.goto("/pos");
    const agentButton = page.locator("button[aria-label='Open AI Merchant Co-Pilot']").first();
    await expect(agentButton).toBeVisible();
  });
});
