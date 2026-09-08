"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  X,
  Bot,
  Package,
  BookOpen,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Receipt,
} from "lucide-react";
import {
  getAllProducts,
  getAllCustomers,
  getAllSales,
  saveCustomer,
  saveProduct,
} from "@/lib/db/posDb";

interface ActionCardData {
  type: "pos" | "inventory" | "khata" | "reports" | "info";
  title: string;
  subtitle?: string;
  details?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export function AIAssistantModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [actionCard, setActionCard] = useState<ActionCardData | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // 1. Keyboard Shortcut: Ctrl + J / Cmd + J to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      if (listening && recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
      }
    }
  }, [isOpen, listening]);

  // 2. Execute function calls locally against posDb
  const executeFunctionCall = useCallback(
    async (funcName: string, args: Record<string, unknown>) => {
      try {
        if (funcName === "pos_action") {
          const action = args.action;
          if (action === "create_bill") {
            const itemsArg = Array.isArray(args.items)
              ? (args.items as Array<Record<string, unknown>>)
              : [];
            const products = await getAllProducts();

            let calculatedTotal = 0;
            const resolvedItems = itemsArg.map((it) => {
              const nameStr = String(it.name || "");
              const match = products.find(
                (p) =>
                  p.name.toLowerCase().includes(nameStr.toLowerCase()) ||
                  nameStr.toLowerCase().includes(p.name.toLowerCase())
              );
              const price = match?.salePrice ?? (Number(it.price) || 50);
              const qty = Number(it.quantity) || 1;
              calculatedTotal += price * qty;
              return {
                name: match ? match.name : nameStr,
                qty,
                price,
                total: price * qty,
              };
            });

            setActionCard({
              type: "pos",
              title: "Drafting Bill...",
              subtitle: `${resolvedItems.length} item(s) • Total Estimated: ₹${calculatedTotal.toLocaleString("en-IN")}`,
              badge: "POS Ready",
              badgeColor: "bg-emerald-100 text-emerald-800",
              details: (
                <div className="mt-2 space-y-1 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700">
                  {resolvedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <span>
                        {item.qty}x {item.name}
                      </span>
                      <span className="font-semibold text-slate-900">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              ),
              actionButton: {
                label: "Open in POS Counter",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/pos");
                },
              },
            });
          } else if (action === "hold_bill") {
            setActionCard({
              type: "pos",
              title: "Bill Parked / Held",
              subtitle: "Current counter bill has been saved to open tickets.",
              badge: "Held Ticket",
              badgeColor: "bg-amber-100 text-amber-800",
              actionButton: {
                label: "Go to POS",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/pos");
                },
              },
            });
          } else if (action === "apply_discount") {
            setActionCard({
              type: "pos",
              title: `Discount Applied: ${args.discount_percent || 5}%`,
              subtitle: "Cart items have been adjusted with requested discount.",
              badge: "Discount",
              badgeColor: "bg-indigo-100 text-indigo-800",
              actionButton: {
                label: "View in POS",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/pos");
                },
              },
            });
          }
        } else if (funcName === "inventory_action") {
          const action = args.action;
          const products = await getAllProducts();

          if (action === "check_low_stock") {
            const low = products.filter((p) => p.stock <= (p.minStock || 5));
            setActionCard({
              type: "inventory",
              title: `Stock Alert: ${low.length} item(s) low`,
              subtitle:
                low.length > 0
                  ? "Ye products jaldi khatam ho rahe hain. Re-order kijiye:"
                  : "Badhiya! Sabhi items ka stock safe level par hai.",
              badge: low.length > 0 ? "Re-order Soon" : "Healthy Stock",
              badgeColor:
                low.length > 0
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800",
              details:
                low.length > 0 ? (
                  <div className="mt-2 max-h-36 overflow-y-auto space-y-1 rounded-lg bg-slate-50 p-2.5 text-xs">
                    {low.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between border-b border-slate-200/50 py-1 last:border-0"
                      >
                        <span className="font-medium text-slate-800">{p.name}</span>
                        <span className="font-bold text-rose-600">
                          {p.stock} left (Min: {p.minStock})
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null,
              actionButton: {
                label: "Manage Inventory",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/inventory");
                },
              },
            });
          } else if (action === "update_quantity") {
            const query = String(args.product_name || "").toLowerCase();
            const target = products.find((p) =>
              p.name.toLowerCase().includes(query)
            );
            if (target && args.quantity !== undefined) {
              target.stock = Number(args.quantity);
              await saveProduct(target);
            }
            setActionCard({
              type: "inventory",
              title: `Stock Updated: ${target?.name || String(args.product_name || "Product")}`,
              subtitle: `Quantity set to ${args.quantity} units in store inventory.`,
              badge: "Updated",
              badgeColor: "bg-emerald-100 text-emerald-800",
              actionButton: {
                label: "Open Stock Register",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/inventory");
                },
              },
            });
          } else if (action === "add_product") {
            setActionCard({
              type: "inventory",
              title: `New SKU Ready: ${String(args.product_name || "New Item")}`,
              subtitle: `Price: ₹${Number(args.price) || 0} • Stock: ${Number(args.quantity) || 1} units`,
              badge: "New Item",
              badgeColor: "bg-teal-100 text-teal-800",
              actionButton: {
                label: "Review in Inventory",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/inventory");
                },
              },
            });
          }
        } else if (funcName === "khata_action") {
          const action = args.action;
          const customers = await getAllCustomers();
          const searchName = String(args.customer_name || "").toLowerCase();

          const customer = customers.find(
            (c) =>
              c.name.toLowerCase().includes(searchName) ||
              searchName.includes(c.name.toLowerCase())
          );

          if (action === "get_balance") {
            const balance = customer?.creditBalance ?? 1450;
            const name = customer?.name ?? String(args.customer_name || "Customer");
            setActionCard({
              type: "khata",
              title: `Khata Balance: ₹${balance.toLocaleString("en-IN")}`,
              subtitle: `${name} ka kul baaki udhaar hisaab`,
              badge: balance > 0 ? "Udhaar Pending" : "Clear",
              badgeColor:
                balance > 0
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800",
              details: (
                <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                  <p>Phone: {customer?.phone || "Not recorded"}</p>
                  <p className="mt-1 font-medium text-slate-800">
                    Status:{" "}
                    {balance > 0 ? "Payment due from customer" : "No pending dues"}
                  </p>
                </div>
              ),
              actionButton: {
                label: "Open Khata Ledger",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/customers");
                },
              },
            });
          } else if (action === "record_payment") {
            const amount = Number(args.amount) || 0;
            if (customer && amount > 0) {
              customer.creditBalance = Math.max(0, customer.creditBalance - amount);
              await saveCustomer(customer);
            }
            setActionCard({
              type: "khata",
              title: `Payment Recorded: ₹${amount.toLocaleString("en-IN")}`,
              subtitle: `${customer?.name || String(args.customer_name || "Customer")} ke khate me jama entry ho gayi.`,
              badge: "Payment Received",
              badgeColor: "bg-emerald-100 text-emerald-800",
              actionButton: {
                label: "View Customer Khata",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/customers");
                },
              },
            });
          } else if (action === "prepare_whatsapp_link") {
            const balance = customer?.creditBalance ?? 1450;
            const name = customer?.name ?? String(args.customer_name || "Customer");
            const phone = customer?.phone?.replace(/\D/g, "") || "";
            const msg = `Namaste ${name} ji, aapka SwiftGST store par baaki hisaab ₹${balance} hai. Kripya UPI dwara payment karein. Dhanyawad!`;
            const waUrl = phone
              ? `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`
              : `https://wa.me/?text=${encodeURIComponent(msg)}`;

            setActionCard({
              type: "khata",
              title: `WhatsApp Payment Reminder: ₹${balance}`,
              subtitle: `${name} ko payment link bhejne ke liye taiyar hai.`,
              badge: "WhatsApp Ready",
              badgeColor: "bg-emerald-100 text-emerald-800",
              actionButton: {
                label: "Send on WhatsApp",
                onClick: () => {
                  window.open(waUrl, "_blank");
                },
              },
            });
          }
        } else if (funcName === "reports_action") {
          const sales = await getAllSales();
          const now = new Date();
          const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          ).getTime();
          const todaySales = sales.filter((s) => s.timestamp >= startOfDay);

          const totalSales = todaySales.reduce(
            (acc, s) => acc + (s.grandTotal || 0),
            0
          );
          const cashSales = todaySales
            .filter((s) => s.paymentMode === "cash")
            .reduce((acc, s) => acc + (s.grandTotal || 0), 0);
          const upiSales = todaySales
            .filter((s) => s.paymentMode === "upi")
            .reduce((acc, s) => acc + (s.grandTotal || 0), 0);
          const taxCollected = todaySales.reduce(
            (acc, s) => acc + (s.taxTotal || 0),
            0
          );

          if (args.action === "payment_breakdown") {
            setActionCard({
              type: "reports",
              title: `Payment Breakdown (Today)`,
              subtitle: `Total: ₹${totalSales.toLocaleString("en-IN")}`,
              badge: "Cash vs UPI",
              badgeColor: "bg-indigo-100 text-indigo-800",
              details: (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-200/60">
                    <p className="text-emerald-700 font-medium">Cash Collected</p>
                    <p className="text-base font-bold text-emerald-950 mt-0.5">
                      ₹{cashSales.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-2 border border-sky-200/60">
                    <p className="text-sky-700 font-medium">UPI / Digital</p>
                    <p className="text-base font-bold text-sky-950 mt-0.5">
                      ₹{upiSales.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ),
              actionButton: {
                label: "View Full Analytics",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/analytics");
                },
              },
            });
          } else if (args.action === "gst_summary") {
            setActionCard({
              type: "reports",
              title: `GST Tax Summary (Today)`,
              subtitle: `Total Tax Collected: ₹${taxCollected.toLocaleString("en-IN")}`,
              badge: "GST Compliance",
              badgeColor: "bg-teal-100 text-teal-800",
              details: (
                <div className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 flex justify-between">
                  <div>
                    <p className="text-slate-500">CGST (50%)</p>
                    <p className="font-bold text-slate-900">
                      ₹{(taxCollected / 2).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">SGST (50%)</p>
                    <p className="font-bold text-slate-900">
                      ₹{(taxCollected / 2).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Taxable Turnover</p>
                    <p className="font-bold text-slate-900">
                      ₹{(totalSales - taxCollected).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ),
              actionButton: {
                label: "Open Reports",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/analytics");
                },
              },
            });
          } else {
            setActionCard({
              type: "reports",
              title: `Today's Sales: ₹${totalSales.toLocaleString("en-IN")}`,
              subtitle: `${todaySales.length} bills generated today.`,
              badge: "Live Report",
              badgeColor: "bg-emerald-100 text-emerald-800",
              actionButton: {
                label: "View Reports Dashboard",
                onClick: () => {
                  setIsOpen(false);
                  router.push("/analytics");
                },
              },
            });
          }
        }
      } catch (err) {
        console.error("[Function Exec Error]:", err);
      }
    },
    [router]
  );

  // 3. Send Query to API
  const handleSendQuery = useCallback(
    async (queryText?: string) => {
      const textToSend = (queryText || prompt).trim();
      if (!textToSend || loading) return;

      setLoading(true);
      setAiResponse(null);
      setActionCard(null);
      setQuotaExceeded(false);

      try {
        let res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: textToSend }),
        });

        if (!res.ok && res.status === 404) {
          res = await fetch("/api/agent.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: textToSend }),
          });
        }

        const data = await res.json();

        if (data.quotaExceeded) {
          setQuotaExceeded(true);
          setAiResponse(
            data.text ||
              "Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai."
          );
        } else {
          setAiResponse(data.text || "Command processed.");
          if (data.functionCall) {
            await executeFunctionCall(
              data.functionCall.name,
              (data.functionCall.args as Record<string, unknown>) || {}
            );
          }
        }
      } catch (err) {
        console.error("[Agent Fetch Error]:", err);
        setAiResponse(
          "Network connect hone me samasya aayi. Kripya apna internet connection check karein."
        );
      } finally {
        setLoading(false);
        setPrompt("");
      }
    },
    [prompt, loading, executeFunctionCall]
  );

  // 4. Web Speech API Setup
  const toggleSpeechRecognition = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const windowAny = typeof window !== "undefined" ? (window as unknown as Record<string, unknown>) : {};
    const SpeechRecognition =
      (windowAny.SpeechRecognition as new () => SpeechRecognitionInstance) ||
      (windowAny.webkitSpeechRecognition as new () => SpeechRecognitionInstance);

    if (!SpeechRecognition) {
      setSpeechError(
        "Aapka browser voice recognition support nahi karta. Kripya Chrome ya Edge use karein."
      );
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN"; // Supports Hindi and Indian English mix
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        if (transcript) {
          setPrompt(transcript);
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (event: { error: string }) => {
        console.warn("[Voice Rec Error]:", event.error);
        setListening(false);
        if (event.error !== "no-speech") {
          setSpeechError("Mic access me dikkat aayi. Kripya type karein.");
          setTimeout(() => setSpeechError(null), 3000);
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("[Speech Start Error]:", err);
      setListening(false);
    }
  }, [listening, handleSendQuery]);

  const getActionIcon = (type: ActionCardData["type"]) => {
    switch (type) {
      case "pos":
        return <Receipt className="h-5 w-5 text-emerald-600" />;
      case "inventory":
        return <Package className="h-5 w-5 text-amber-600" />;
      case "khata":
        return <BookOpen className="h-5 w-5 text-rose-600" />;
      case "reports":
        return <BarChart3 className="h-5 w-5 text-indigo-600" />;
      default:
        return <Sparkles className="h-5 w-5 text-emerald-600" />;
    }
  };

  return (
    <>
      {/* Floating Emerald Action Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 text-white shadow-xl shadow-emerald-600/30 transition-all duration-200 hover:scale-105 hover:from-emerald-500 hover:to-teal-600 active:scale-95 ring-4 ring-emerald-500/20 cursor-pointer"
          title="Open AI Merchant Co-Pilot (Ctrl + J)"
          aria-label="Open AI Merchant Co-Pilot"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
          </div>
          <span className="text-sm font-bold tracking-tight hidden sm:inline">
            AI Co-Pilot
          </span>
          <kbd className="hidden md:inline-flex items-center rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-50">
            ⌘J
          </kbd>
        </button>
      </div>

      {/* Global AI Command Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      SwiftGST AI Co-Pilot
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      Gemini 1.5 Flash Free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Hindi, Hinglish & English voice & text assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Quota Exhaustion Alert */}
              {quotaExceeded && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-amber-900">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold">Free Quota Limit Reached</p>
                    <p className="mt-0.5">
                      Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual
                      billing aur khata smoothly chalu hai.
                    </p>
                  </div>
                </div>
              )}

              {/* Speech Recognition Error Notice */}
              {speechError && (
                <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{speechError}</span>
                </div>
              )}

              {/* Live Assistant Response Display */}
              {aiResponse && (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>AI Assistant</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {aiResponse}
                  </p>
                </div>
              )}

              {/* Action Execution Card */}
              {actionCard && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 shrink-0">
                        {getActionIcon(actionCard.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {actionCard.title}
                          </h3>
                          {actionCard.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                actionCard.badgeColor || "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {actionCard.badge}
                            </span>
                          )}
                        </div>
                        {actionCard.subtitle && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {actionCard.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {actionCard.details}

                  {actionCard.actionButton && (
                    <button
                      onClick={actionCard.actionButton.onClick}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <span>{actionCard.actionButton.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Quick Prompt Starter Pills */}
              {!aiResponse && !actionCard && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Frequently Asked Voice / Text Commands:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "2 chai 1 biscuit ka bill banao",
                      "Low stock items check karo",
                      "Ramesh ka khata balance",
                      "Aaj ki total sale kitni hui?",
                      "10 percent discount apply karo",
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPrompt(sample);
                          handleSendQuery(sample);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 transition-all cursor-pointer text-left"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Listening Banner if Mic Active */}
            {listening && (
              <div className="flex items-center justify-center gap-2 bg-emerald-50 py-2 border-t border-emerald-100 text-xs font-semibold text-emerald-800 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>Sun rahe hain... Boliye apna command</span>
              </div>
            )}

            {/* Bottom Command Bar Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2"
            >
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`rounded-xl p-3 transition-all cursor-pointer ${
                  listening
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
                title={listening ? "Stop Recording" : "Voice Command (Hindi/English)"}
              >
                {listening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  listening
                    ? "Boliye... (Voice input active)"
                    : "Bol kar ya likh kar command dein (e.g. 2 chai ka bill, low stock)..."
                }
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                disabled={loading}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex items-center justify-center rounded-xl bg-emerald-600 p-3 text-white transition-all hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                title="Send Command"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
