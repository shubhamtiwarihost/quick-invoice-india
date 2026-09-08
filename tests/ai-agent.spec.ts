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

  test("POST /api/agent handles POS billing queries with function call", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "2 chai aur 1 samosa ka bill banao" },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.functionCall).toBeTruthy();
    expect(json.functionCall.name).toBe("pos_action");
    expect(json.functionCall.args.action).toBe("create_bill");
  });

  test("POST /api/agent handles Low Stock inventory query", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "Dukan me low stock items check karo" },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.functionCall).toBeTruthy();
    expect(json.functionCall.name).toBe("inventory_action");
    expect(json.functionCall.args.action).toBe("check_low_stock");
  });

  test("POST /api/agent handles Customer Khata ledger query", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "Ramesh Sharma ka khata balance kitna baaki hai?" },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.functionCall).toBeTruthy();
    expect(json.functionCall.name).toBe("khata_action");
    expect(json.functionCall.args.action).toBe("get_balance");
  });

  test("POST /api/agent handles Today Sales report query", async ({ request }) => {
    const res = await request.post("/api/agent", {
      data: { prompt: "Aaj ki total dukan ki sale kitni hui?" },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.functionCall).toBeTruthy();
    expect(json.functionCall.name).toBe("reports_action");
    expect(json.functionCall.args.action).toBe("daily_sales");
  });
});
