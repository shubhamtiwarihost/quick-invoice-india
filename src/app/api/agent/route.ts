import { NextResponse } from "next/server";

// In-memory rate-limiter: Max 10 requests per minute per IP to preserve Google Gemini Free Tier quota
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const record = rateLimitMap.get(ip);

  if (process.env.NODE_ENV === "test") {
    return true;
  }

  // Clean up stale entries every 100 calls
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= 10) {
    return false;
  }

  record.count += 1;
  return true;
}

// Function Declarations for Gemini Function Calling
const FUNCTION_DECLARATIONS = [
  {
    name: "pos_action",
    description:
      "Perform billing and Point-of-Sale actions: create bill, hold bill, search item, or apply discount.",
    parameters: {
      type: "OBJECT",
      properties: {
        action: {
          type: "STRING",
          enum: ["create_bill", "hold_bill", "search_item", "apply_discount"],
          description: "Specific POS action to execute",
        },
        items: {
          type: "ARRAY",
          description: "List of products/items to add to bill",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING", description: "Product name" },
              quantity: { type: "NUMBER", description: "Quantity count (default 1)" },
              price: { type: "NUMBER", description: "Unit price if mentioned" },
            },
            required: ["name"],
          },
        },
        customer_name: { type: "STRING", description: "Customer name" },
        discount_percent: { type: "NUMBER", description: "Discount percentage to apply" },
        search_query: { type: "STRING", description: "Product search term or barcode" },
      },
      required: ["action"],
    },
  },
  {
    name: "inventory_action",
    description:
      "Manage store stock inventory: check low stock, update quantity, or add new product SKU.",
    parameters: {
      type: "OBJECT",
      properties: {
        action: {
          type: "STRING",
          enum: ["check_low_stock", "update_quantity", "add_product"],
          description: "Inventory action to perform",
        },
        product_name: { type: "STRING", description: "Name of the product" },
        barcode: { type: "STRING", description: "Product barcode or SKU" },
        quantity: { type: "NUMBER", description: "Quantity to add or set" },
        price: { type: "NUMBER", description: "Product sale price in INR" },
        threshold: { type: "NUMBER", description: "Low stock alert threshold" },
      },
      required: ["action"],
    },
  },
  {
    name: "khata_action",
    description:
      "Manage customer Khata & credit ledger: check balance, record credit payment, or prepare WhatsApp reminder link.",
    parameters: {
      type: "OBJECT",
      properties: {
        action: {
          type: "STRING",
          enum: ["get_balance", "record_payment", "prepare_whatsapp_link"],
          description: "Khata credit action",
        },
        customer_name: { type: "STRING", description: "Customer name" },
        customer_phone: { type: "STRING", description: "Customer mobile number" },
        amount: { type: "NUMBER", description: "Payment or balance amount in INR" },
        notes: { type: "STRING", description: "Remarks or payment reference" },
      },
      required: ["action"],
    },
  },
  {
    name: "reports_action",
    description:
      "Calculate store analytics: daily sales, cash vs UPI breakdown, or GST tax summary.",
    parameters: {
      type: "OBJECT",
      properties: {
        action: {
          type: "STRING",
          enum: ["daily_sales", "payment_breakdown", "gst_summary"],
          description: "Reporting metric to compute",
        },
        date_range: {
          type: "STRING",
          enum: ["today", "yesterday", "this_week", "this_month"],
          description: "Time range for calculations",
        },
      },
      required: ["action"],
    },
  },
];

const SYSTEM_PROMPT =
  "You are Swift AI Assistant. Interpret Hindi/Hinglish/English store queries accurately. Call matching functions with validated parameters. Return concise, shopkeeper-friendly responses.";

// Graceful offline fallback rules when GEMINI_API_KEY is not configured
function localFallbackInterpreter(prompt: string) {
  const lower = prompt.toLowerCase();

  // 1. POS Actions
  if (lower.includes("bill") || lower.includes("parchi") || lower.includes("kaat") || lower.includes("chalan")) {
    if (lower.includes("hold") || lower.includes("park") || lower.includes("rok")) {
      return {
        text: "Bill ko hold pe daal diya gaya hai. Aap naya bill bana sakte hain.",
        functionCall: {
          name: "pos_action",
          args: { action: "hold_bill" },
        },
      };
    }
    // Try to extract items like "2 chai 1 biscuit"
    const items: Array<{ name: string; quantity: number }> = [];
    const itemMatches = lower.matchAll(/(\d+)\s+([a-zA-Z\s]{2,20})/g);
    for (const match of itemMatches) {
      const qty = parseInt(match[1], 10);
      const name = match[2].trim().replace(/\b(ka|aur|ko|banao|add)\b/gi, "").trim();
      if (name) items.push({ name, quantity: qty });
    }

    return {
      text: items.length > 0
        ? `Bill draft taiyar hai ${items.map((i) => `${i.quantity}x ${i.name}`).join(", ")} ke saath.`
        : "Naya bill draft shuru kiya ja raha hai.",
      functionCall: {
        name: "pos_action",
        args: {
          action: "create_bill",
          items: items.length > 0 ? items : [{ name: prompt, quantity: 1 }],
        },
      },
    };
  }

  if (lower.includes("discount") || lower.includes("chhut") || lower.includes("kam kar")) {
    const num = parseInt(lower.match(/\d+/)?.[0] || "5", 10);
    return {
      text: `Cart me ${num}% discount apply kar diya gaya hai.`,
      functionCall: {
        name: "pos_action",
        args: { action: "apply_discount", discount_percent: num },
      },
    };
  }

  // 2. Inventory Actions
  if (lower.includes("stock") || lower.includes("khatam") || lower.includes("maal") || lower.includes("inventory")) {
    if (lower.includes("update") || lower.includes("kardo") || lower.includes("badhao")) {
      const qty = parseInt(lower.match(/\d+/)?.[0] || "10", 10);
      return {
        text: `Stock quantity update request taiyar hai (${qty} units).`,
        functionCall: {
          name: "inventory_action",
          args: { action: "update_quantity", quantity: qty, product_name: prompt },
        },
      };
    }
    return {
      text: "Low stock items ki list check ki ja rahi hai.",
      functionCall: {
        name: "inventory_action",
        args: { action: "check_low_stock" },
      },
    };
  }

  // 3. Khata Actions
  if (lower.includes("khata") || lower.includes("udhar") || lower.includes("udhaar") || lower.includes("balance")) {
    if (lower.includes("whatsapp") || lower.includes("link") || lower.includes("message")) {
      return {
        text: "Customer ke liye WhatsApp payment reminder link banaya ja raha hai.",
        functionCall: {
          name: "khata_action",
          args: { action: "prepare_whatsapp_link", customer_name: prompt },
        },
      };
    }
    if (lower.includes("jama") || lower.includes("diya") || lower.includes("payment")) {
      const amount = parseInt(lower.match(/\d+/)?.[0] || "0", 10);
      return {
        text: `Khata me payment jama karne ki entry taiyar hai (₹${amount}).`,
        functionCall: {
          name: "khata_action",
          args: { action: "record_payment", amount, customer_name: prompt },
        },
      };
    }
    return {
      text: "Customer ka Khata balance check kiya ja raha hai.",
      functionCall: {
        name: "khata_action",
        args: { action: "get_balance", customer_name: prompt },
      },
    };
  }

  // 4. Reports Actions
  if (lower.includes("sale") || lower.includes("bikri") || lower.includes("kamai") || lower.includes("report") || lower.includes("hisaab")) {
    if (lower.includes("cash") || lower.includes("upi")) {
      return {
        text: "Cash aur UPI payment mode ka hisaab nikala ja raha hai.",
        functionCall: {
          name: "reports_action",
          args: { action: "payment_breakdown", date_range: "today" },
        },
      };
    }
    if (lower.includes("gst") || lower.includes("tax")) {
      return {
        text: "Today's GST summary aur tax calculation check kiya ja raha hai.",
        functionCall: {
          name: "reports_action",
          args: { action: "gst_summary", date_range: "today" },
        },
      };
    }
    return {
      text: "Aaj ki total bikri aur sales report calculate ho rahi hai.",
      functionCall: {
        name: "reports_action",
        args: { action: "daily_sales", date_range: "today" },
      },
    };
  }

  // Default assistance
  return {
    text: "Namaste! Main Swift AI Assistant hoon. Aap mujhse bol kar ya likh kar bill bana sakte hain, stock check kar sakte hain, ya customer ka khata hisaab dekh sakte hain.",
    functionCall: null,
  };
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check (Max 10 calls per minute per IP)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message:
            "Aap bohot jaldi queries bhej rahe hain. Free quota bachaane ke liye kripya 1 minute rukiye.",
          quotaExceeded: false,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt", message: "Kripya apna sawal ya command likhiye." },
        { status: 400 }
      );
    }

    // 2. Read GEMINI_API_KEY from process.env
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // 3. Graceful Fallback if GEMINI_API_KEY is not configured or offline test header requested
    const useOffline = !apiKey || req.headers.get("x-offline-fallback") === "1";
    if (useOffline) {
      const fallback = localFallbackInterpreter(prompt);
      return NextResponse.json({
        success: true,
        source: "local_fallback",
        text: fallback.text,
        functionCall: fallback.functionCall,
        note: !apiKey
          ? "Set GEMINI_API_KEY in .env.local to activate Gemini 1.5 Flash cloud reasoning."
          : undefined,
      });
    }

    // 4. Call Google Gemini API with Function Calling
    // Uses gemini-3.7-flash as primary, with automatic fallback to 3.6-flash / 3.5-flash if needed.
    const modelsToTry = [
      process.env.GEMINI_MODEL?.trim() || "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
    ].filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      tools: [
        {
          function_declarations: FUNCTION_DECLARATIONS,
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    };

    interface GeminiApiResponse {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
            functionCall?: {
              name: string;
              args?: Record<string, unknown>;
            };
          }>;
        };
      }>;
      error?: {
        code?: number;
        status?: string;
        message?: string;
      };
    }

    let geminiRes: Response | null = null;
    let geminiData: GeminiApiResponse | null = null;
    let successfulModel = "";

    for (const model of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload),
          signal: AbortSignal.timeout(8000),
        });

        // Friendly Handling for HTTP 429 / Quota Exhausted from Google
        if (res.status === 429) {
          return NextResponse.json(
            {
              error: "Quota exceeded",
              quotaExceeded: true,
              text: "Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai.",
              message:
                "Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai.",
              functionCall: null,
            },
            { status: 429 }
          );
        }

        const data = await res.json();

        // Check for quota error inside JSON response body
        if (
          data?.error?.code === 429 ||
          data?.error?.status === "RESOURCE_EXHAUSTED"
        ) {
          return NextResponse.json(
            {
              error: "Quota exceeded",
              quotaExceeded: true,
              text: "Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai.",
              message:
                "Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai.",
              functionCall: null,
            },
            { status: 429 }
          );
        }

        if (res.ok) {
          geminiRes = res;
          geminiData = data;
          successfulModel = model;
          break;
        }

        // If 404 (model not found / deprecated for this key), try next candidate
        console.warn(`[Gemini API Warning on ${model}]:`, data?.error?.message);
      } catch (networkErr) {
        console.warn(`[Gemini Network Error on ${model}]:`, networkErr);
      }
    }

    if (!geminiRes || !geminiData) {
      const fallback = localFallbackInterpreter(prompt);
      return NextResponse.json({
        success: true,
        source: "local_fallback",
        text: fallback.text,
        functionCall: fallback.functionCall,
      });
    }

    // 6. Parse Gemini Candidate & Tool Function Calls
    const candidate = geminiData.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    let textResponse = "";
    let functionCall: { name: string; args: Record<string, unknown> } | null = null;

    for (const part of parts) {
      if (part.text) {
        textResponse += part.text;
      }
      if (part.functionCall) {
        functionCall = {
          name: part.functionCall.name,
          args: (part.functionCall.args as Record<string, unknown>) || {},
        };
      }
    }

    // If Gemini returned a functionCall without descriptive text, provide a shopkeeper-friendly summary
    if (functionCall && !textResponse) {
      switch (functionCall.name) {
        case "pos_action":
          textResponse = "POS bill command pehchana gaya. Processing...";
          break;
        case "inventory_action":
          textResponse = "Inventory stock command pehchana gaya. Processing...";
          break;
        case "khata_action":
          textResponse = "Customer Khata command pehchana gaya. Processing...";
          break;
        case "reports_action":
          textResponse = "Sales & Analytics reports command pehchana gaya. Processing...";
          break;
        default:
          textResponse = "Command pehchana gaya. Processing...";
      }
    }

    return NextResponse.json({
      success: true,
      source: successfulModel || "gemini_flash",
      text: textResponse.trim(),
      functionCall,
    });
  } catch (err: unknown) {
    console.error("[Agent API Error]:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Kuch takneeki kharabi aayi. Kripya thodi der baad koshish karein.",
      },
      { status: 500 }
    );
  }
}
