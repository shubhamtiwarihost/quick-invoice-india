"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  Barcode,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  Banknote,
  Split,
  Printer,
  Package,
  History,
  CheckCircle2,
  X,
  RefreshCw,
  ArrowLeft,
  Receipt,
  Settings,
  Users,
  BookOpen,
  Coins,
  Gift,
  AlertCircle,
  UserPlus,
  Pause,
  Clock,
  Wallet,
  FileClock,
  RotateCcw,
  Check,
  Zap,
  Percent,
  IndianRupee,
  Share2,
  MessageCircle,
  Sparkles,
  Delete,
  Edit2,
} from "lucide-react";
import {
  getAllProducts,
  getProductByBarcode,
  recordSale,
  getNextBillNo,
  getAllSales,
  seedInitialInventoryIfEmpty,
  getAllCustomers,
  saveCustomer,
  seedInitialCustomersIfEmpty,
  getActiveShift,
  startShift,
  closeShift,
  getShiftSalesSummary,
  getHeldTickets,
  saveHeldTicket,
  deleteHeldTicket,
  voidSale,
  getDb,
  type Product,
  type Sale,
  type SaleItem,
  type PaymentMode,
  type Customer,
  type Shift,
  type HeldTicket,
} from "@/lib/db/posDb";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth/AuthContext";
import { trackEvent } from "@/lib/tracker";
import { PosComplianceGuide } from "@/components/pos/PosComplianceGuide";
import type { BusinessInfo } from "@/components/pos/ThermalReceipt";

const ThermalReceipt = dynamic(
  () => import("@/components/pos/ThermalReceipt").then((mod) => mod.ThermalReceipt),
  { ssr: false }
);
const ZReportReceipt = dynamic(
  () => import("@/components/pos/ZReportReceipt").then((mod) => mod.ZReportReceipt),
  { ssr: false }
);

const DEFAULT_STORE: BusinessInfo = {
  businessName: "",
  address: "",
  phone: "",
  gstin: "",
  upiId: "",
};

export default function PosCounterPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Cart & Customer State
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(false);

  // Loyverse Item Modifier Sheet State
  const [editingCartItem, setEditingCartItem] = useState<SaleItem | null>(null);
  const [modQty, setModQty] = useState<string>("1");
  const [modDiscountType, setModDiscountType] = useState<"percent" | "flat">("percent");
  const [modDiscountVal, setModDiscountVal] = useState<string>("0");
  const [modNotes, setModNotes] = useState<string>("");

  // Quick Add Customer Modal
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [quickCustName, setQuickCustName] = useState("");
  const [quickCustPhone, setQuickCustPhone] = useState("");

  // Store Settings (Saved in localStorage)
  const [storeSettings, setStoreSettings] = useState<BusinessInfo>(DEFAULT_STORE);
  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [splitCash, setSplitCash] = useState<string>("");
  const [splitOnline, setSplitOnline] = useState<string>("");
  const [upiQrUrl, setUpiQrUrl] = useState<string>("");

  // Completed Sale & Print State
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Loyverse Post-Payment Success Screen State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successSale, setSuccessSale] = useState<Sale | null>(null);
  const [successChangeDue, setSuccessChangeDue] = useState(0);
  const [autoResetCountdown, setAutoResetCountdown] = useState(4);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);

  // Shift Management State
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isStartShiftModalOpen, setIsStartShiftModalOpen] = useState(false);
  const [openingFloatInput, setOpeningFloatInput] = useState("0");
  const [shiftNotesInput, setShiftNotesInput] = useState("");
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [actualPhysicalCash, setActualPhysicalCash] = useState("");
  const [closeShiftNotes, setCloseShiftNotes] = useState("");
  const [currentShiftSummary, setCurrentShiftSummary] = useState({
    cashSales: 0,
    upiSales: 0,
    cardSales: 0,
    splitSales: 0,
    totalSales: 0,
    transactionCount: 0,
  });
  const [isZReportModalOpen, setIsZReportModalOpen] = useState(false);
  const [shiftForZReport, setShiftForZReport] = useState<Shift | null>(null);

  // Hold Bill & Open Tickets State
  const [heldTickets, setHeldTickets] = useState<HeldTicket[]>([]);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [holdTicketName, setHoldTicketName] = useState("");
  const [holdTicketNote, setHoldTicketNote] = useState("");
  const [isOpenTicketsDrawerOpen, setIsOpenTicketsDrawerOpen] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  // Load Inventory, Customers & Sales from IndexedDB
  async function loadData() {
    setLoading(true);
    try {
      if (typeof window !== "undefined" && (window.location.search.includes("testSeed=true") || (window as unknown as { __PLAYWRIGHT_TEST__?: boolean }).__PLAYWRIGHT_TEST__)) {
        const db = await getDb();
        const count = await db.count("products");
        if (count === 0) {
          await db.put("products", {
            id: "test_milk_1",
            name: "Fresh Cow Milk 1L",
            barcode: "1001001001",
            hsn: "0401",
            category: "Dairy",
            costPrice: 50,
            salePrice: 65,
            gstRate: 5,
            stock: 100,
            minStock: 10,
            unit: "LTR",
            updatedAt: Date.now(),
          });
          await db.put("products", {
            id: "test_rice_2",
            name: "Basmati Rice 5kg",
            barcode: "1001001002",
            hsn: "1006",
            category: "Grocery",
            costPrice: 400,
            salePrice: 500,
            gstRate: 0,
            stock: 50,
            minStock: 5,
            unit: "BAG",
            updatedAt: Date.now(),
          });
        }
      }
      await seedInitialInventoryIfEmpty();
      await seedInitialCustomersIfEmpty();
      const [productList, customerList, salesList, currentShift, openTickets] = await Promise.all([
        getAllProducts(),
        getAllCustomers(),
        getAllSales(),
        getActiveShift(),
        getHeldTickets(),
      ]);
      setProducts(productList);
      setCustomers(customerList);
      setRecentSales(salesList.slice(0, 25));
      setActiveShift(currentShift);
      setHeldTickets(openTickets);
    } catch (err) {
      console.error("Failed to load POS data:", err);
      showToast("Unable to load POS catalog.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // Load store settings from localStorage or user profile
    try {
      const saved = localStorage.getItem("swiftgst_pos_store_settings");
      if (saved) {
        setStoreSettings(JSON.parse(saved));
      } else if (user?.businessName) {
        setStoreSettings({
          businessName: user.businessName,
          address: user.address || "",
          phone: user.phone || "",
          gstin: user.gstin || "",
          upiId: user.upiId || "",
        });
      }
    } catch (e) {
      console.error("Failed to parse store settings:", e);
    }
  }, [user]);

  function saveStoreSettings(updated: BusinessInfo) {
    setStoreSettings(updated);
    try {
      localStorage.setItem("swiftgst_pos_store_settings", JSON.stringify(updated));
      showToast("Store details updated successfully.");
    } catch (e) {
      console.error("Failed to save store settings:", e);
    }
    setIsStoreSettingsOpen(false);
  }

  // Dynamic Category Dot Colors Map
  const CATEGORY_DOT_COLORS = [
    "bg-emerald-500",
    "bg-sky-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-lime-500",
  ];

  function getCategoryColor(cat: string): string {
    if (!cat || cat === "all") return "bg-teal-500";
    const lower = cat.toLowerCase().trim();
    if (lower.includes("groc") || lower.includes("kirana")) return "bg-emerald-500";
    if (lower.includes("dairy") || lower.includes("milk")) return "bg-sky-500";
    if (lower.includes("bev") || lower.includes("drink") || lower.includes("tea") || lower.includes("juice") || lower.includes("water")) return "bg-amber-500";
    if (lower.includes("snack") || lower.includes("biscuit") || lower.includes("bakery") || lower.includes("namkeen")) return "bg-orange-500";
    if (lower.includes("pers") || lower.includes("care") || lower.includes("beauty") || lower.includes("soap")) return "bg-purple-500";
    if (lower.includes("clean") || lower.includes("house") || lower.includes("wash") || lower.includes("detergent")) return "bg-rose-500";
    if (lower.includes("elect") || lower.includes("tech") || lower.includes("mobile")) return "bg-indigo-500";

    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
      hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CATEGORY_DOT_COLORS[Math.abs(hash) % CATEGORY_DOT_COLORS.length];
  }

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.hsn && p.hsn.toLowerCase().includes(q))
      );
    });
  }, [products, searchQuery, selectedCategory]);

  // Selected Customer lookup
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  function handleSelectCustomer(id: string) {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setRedeemPoints(false);
    }
  }

  // Quick register customer from cart
  async function handleQuickAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!quickCustName.trim() || !quickCustPhone.trim()) {
      showToast("Customer Name and Phone are required.");
      return;
    }

    try {
      const newId = await saveCustomer({
        id: "",
        name: quickCustName.trim(),
        phone: quickCustPhone.trim(),
        creditBalance: 0,
        loyaltyPoints: 0,
      });

      const updatedCusts = await getAllCustomers();
      setCustomers(updatedCusts);
      handleSelectCustomer(newId);
      setQuickCustName("");
      setQuickCustPhone("");
      setIsQuickCustomerOpen(false);
      showToast(`Registered "${quickCustName}" successfully!`);
    } catch (err) {
      console.error("Failed to quick register customer:", err);
      showToast("Failed to create customer.");
    }
  }

  // Cart Calculations with Loyalty Points & Indian Round Off
  const {
    subtotal,
    taxTotal,
    exactTotal,
    loyaltyDiscount,
    roundOff,
    grandTotal,
    totalUnits,
    pointsAwarded,
  } = useMemo(() => {
    let sub = 0;
    let tax = 0;
    let exact = 0;
    let units = 0;

    for (const it of cart) {
      exact += it.total;
      tax += it.taxAmount;
      sub += it.total - it.taxAmount;
      units += it.qty;
    }

    // Loyalty points discount (1 Point = ₹1)
    let discount = 0;
    if (redeemPoints && selectedCustomer && selectedCustomer.loyaltyPoints > 0) {
      discount = Math.min(exact, selectedCustomer.loyaltyPoints);
    }

    const net = Math.max(0, exact - discount);
    const rounded = Math.round(net);
    const ro = Number((rounded - net).toFixed(2));

    // Points earned on non-khata sales: 1 point per ₹100 spent
    const earned = paymentMode !== "khata" ? Math.floor(rounded / 100) : 0;

    return {
      subtotal: sub,
      taxTotal: tax,
      exactTotal: exact,
      loyaltyDiscount: discount,
      roundOff: ro,
      grandTotal: rounded,
      totalUnits: units,
      pointsAwarded: earned,
    };
  }, [cart, redeemPoints, selectedCustomer, paymentMode]);

  // Add Item to Cart with Stock Check and multi-tap increment
  function addToCart(product: Product) {
    if (product.stock <= 0) {
      showToast(`"${product.name}" is currently out of stock.`);
      return;
    }

    const existing = cart.find((it) => it.productId === product.id);
    const currentQtyInCart = existing ? existing.qty : 0;

    if (currentQtyInCart + 1 > product.stock) {
      showToast(`Stock limit reached: Only ${product.stock} units available in inventory!`);
      return;
    }

    setCart((prev) => {
      const gstRate = product.gstRate || 0;
      const salePrice = product.salePrice || 0;
      const idx = prev.findIndex((item) => item.productId === product.id);

      if (idx !== -1) {
        const updated = [...prev];
        const item = updated[idx];
        const newQty = item.qty + 1;
        const gross = salePrice * newQty;
        let discountAmt = 0;
        if (item.discount && item.discount > 0) {
          if (item.discountType === "percent") {
            discountAmt = (gross * Math.min(100, item.discount)) / 100;
          } else {
            discountAmt = Math.min(gross, item.discount);
          }
        }
        const total = Number(Math.max(0, gross - discountAmt).toFixed(2));
        const taxAmount = Number(((total * gstRate) / (100 + gstRate)).toFixed(2));

        updated[idx] = {
          ...item,
          qty: newQty,
          total,
          taxAmount,
        };
        return updated;
      } else {
        const qty = 1;
        const total = Number((salePrice * qty).toFixed(2));
        const taxAmount = Number(((total * gstRate) / (100 + gstRate)).toFixed(2));

        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            hsn: product.hsn,
            price: salePrice,
            gstRate,
            qty,
            taxAmount,
            total,
          },
        ];
      }
    });
  }

  // Update Item Quantity with Stock Validation
  function updateQty(productId: string, delta: number) {
    const product = products.find((p) => p.id === productId);
    const item = cart.find((it) => it.productId === productId);
    if (!item || !product) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (delta > 0 && newQty > product.stock) {
      showToast(`Stock limit: Only ${product.stock} units of "${product.name}" available!`);
      return;
    }

    setCart((prev) =>
      prev.map((it) => {
        if (it.productId === productId) {
          const gross = it.price * newQty;
          let discountAmt = 0;
          if (it.discount && it.discount > 0) {
            if (it.discountType === "percent") {
              discountAmt = (gross * Math.min(100, it.discount)) / 100;
            } else {
              discountAmt = Math.min(gross, item.discount || 0);
            }
          }
          const total = Number(Math.max(0, gross - discountAmt).toFixed(2));
          const taxAmount = Number(((total * it.gstRate) / (100 + it.gstRate)).toFixed(2));
          return { ...it, qty: newQty, total, taxAmount };
        }
        return it;
      })
    );
  }

  // Loyverse Item Modifier Handlers
  function openItemModifier(item: SaleItem) {
    setEditingCartItem(item);
    setModQty(String(item.qty));
    setModDiscountType(item.discountType || "percent");
    setModDiscountVal(item.discount ? String(item.discount) : "0");
    setModNotes(item.notes || "");
  }

  function handleKeypadPress(val: string) {
    if (val === "C") {
      setModQty("1");
      return;
    }
    if (val === "backspace") {
      setModQty((prev) => (prev.length > 1 ? prev.slice(0, -1) : "1"));
      return;
    }
    setModQty((prev) => {
      if (prev === "0" || prev === "1") return val;
      if (prev.length >= 3) return prev;
      return prev + val;
    });
  }

  function handleSaveModifier() {
    if (!editingCartItem) return;
    const product = products.find((p) => p.id === editingCartItem.productId);
    const newQty = Math.max(1, parseInt(modQty, 10) || 1);

    if (product && newQty > product.stock) {
      showToast(`Stock limit: Only ${product.stock} units of "${product.name}" in stock!`);
      return;
    }

    const discountVal = Math.max(0, parseFloat(modDiscountVal) || 0);
    const gross = editingCartItem.price * newQty;
    let discountAmt = 0;
    if (modDiscountType === "percent") {
      discountAmt = (gross * Math.min(100, discountVal)) / 100;
    } else {
      discountAmt = Math.min(gross, discountVal);
    }
    const netTotal = Number(Math.max(0, gross - discountAmt).toFixed(2));
    const gstRate = editingCartItem.gstRate || 0;
    const taxAmount = Number(((netTotal * gstRate) / (100 + gstRate)).toFixed(2));

    setCart((prev) =>
      prev.map((it) => {
        if (it.productId === editingCartItem.productId) {
          return {
            ...it,
            qty: newQty,
            discount: discountVal > 0 ? discountVal : undefined,
            discountType: discountVal > 0 ? modDiscountType : undefined,
            notes: modNotes.trim() || undefined,
            total: netTotal,
            taxAmount,
          };
        }
        return it;
      })
    );

    setEditingCartItem(null);
    showToast(`Updated "${editingCartItem.name}"`);
  }

  function handleDeleteFromModifier() {
    if (!editingCartItem) return;
    removeFromCart(editingCartItem.productId);
    setEditingCartItem(null);
    showToast(`Removed "${editingCartItem.name}" from cart`);
  }

  // WhatsApp Bill Sharing
  function handleShareWhatsApp() {
    const sale = successSale || completedSale;
    if (!sale) return;
    const phone = sale.customerPhone || customerPhone || "";
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    const storeName = storeSettings.businessName || "Store";
    const lines: string[] = [];
    lines.push(`🧾 *${storeName} - Bill #${sale.billNo}*`);
    lines.push(`📅 Date: ${new Date(sale.timestamp).toLocaleDateString("en-IN")}`);
    if (sale.customerName) {
      lines.push(`👤 Customer: ${sale.customerName}`);
    }
    lines.push(`--------------------------------`);
    sale.items.forEach((it) => {
      const disc = it.discount ? ` (${it.discountType === "percent" ? `-${it.discount}%` : `-₹${it.discount}`})` : "";
      lines.push(`• ${it.name} x ${it.qty} = ₹${it.total.toFixed(2)}${disc}`);
    });
    lines.push(`--------------------------------`);
    lines.push(`*Total Amount: ₹${sale.grandTotal.toFixed(2)}*`);
    lines.push(`Payment Mode: ${sale.paymentMode.toUpperCase()}`);
    if (successChangeDue > 0 && sale.paymentMode === "cash") {
      lines.push(`Change Returned: ₹${successChangeDue.toFixed(2)}`);
    }
    lines.push(`--------------------------------`);
    lines.push(`Thank you for shopping with us! Visit again. 🙏`);

    const text = encodeURIComponent(lines.join("\n"));
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, "_blank");
  }

  // Auto-reset Countdown Timer for Post-Payment Success Screen
  useEffect(() => {
    if (!isSuccessModalOpen || isCountdownPaused) return;

    const timer = setInterval(() => {
      setAutoResetCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSuccessModalOpen(false);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccessModalOpen, isCountdownPaused]);

  function handleStartNewSale() {
    setIsSuccessModalOpen(false);
    clearCart();
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((it) => it.productId !== productId));
  }

  function clearCart() {
    setCart([]);
    setSelectedCustomerId("");
    setCustomerName("");
    setCustomerPhone("");
    setRedeemPoints(false);
    setCashTendered("");
    setSplitCash("");
    setSplitOnline("");
  }

  // --- Shift Management Handlers ---
  async function handleStartShift(e: React.FormEvent) {
    e.preventDefault();
    const floatNum = parseFloat(openingFloatInput) || 0;
    try {
      const s = await startShift(floatNum, shiftNotesInput.trim());
      setActiveShift(s);
      setIsStartShiftModalOpen(false);
      setOpeningFloatInput("1000");
      setShiftNotesInput("");
      showToast(`Shift started with ₹${floatNum.toFixed(2)} opening cash float!`);
    } catch (err) {
      console.error("Failed to start shift:", err);
      showToast("Failed to start shift.");
    }
  }

  async function openEndShiftModal() {
    if (!activeShift) return;
    try {
      const summary = await getShiftSalesSummary(activeShift.startTime);
      setCurrentShiftSummary(summary);
      const expected = (activeShift.openingCash || 0) + summary.cashSales;
      setActualPhysicalCash(String(expected));
      setCloseShiftNotes("");
      setIsEndShiftModalOpen(true);
    } catch (err) {
      console.error("Failed to calculate shift summary:", err);
      showToast("Unable to tally shift sales.");
    }
  }

  async function handleCloseShift(printZReportAfter = true) {
    if (!activeShift) return;
    const counted = parseFloat(actualPhysicalCash) || 0;
    try {
      const closed = await closeShift(activeShift.id, counted, closeShiftNotes.trim());
      setActiveShift(null);
      setIsEndShiftModalOpen(false);
      setShiftForZReport(closed);
      if (printZReportAfter) {
        setIsZReportModalOpen(true);
      }
      showToast(`Shift closed! Expected: ₹${(closed.expectedCash || 0).toFixed(2)}, Actual: ₹${counted.toFixed(2)}`);
    } catch (err) {
      console.error("Failed to close shift:", err);
      showToast("Failed to close shift.");
    }
  }

  // --- Hold Bill & Open Tickets Handlers ---
  function openHoldModal() {
    if (cart.length === 0) {
      showToast("Cart is empty! Add products first.");
      return;
    }
    const defaultName = selectedCustomer?.name
      ? selectedCustomer.name
      : `Ticket #${heldTickets.length + 1}`;
    setHoldTicketName(defaultName);
    setHoldTicketNote("");
    setIsHoldModalOpen(true);
  }

  async function handleConfirmHold(e: React.FormEvent) {
    e.preventDefault();
    if (!holdTicketName.trim()) return;
    try {
      await saveHeldTicket({
        name: holdTicketName.trim(),
        items: [...cart],
        customerId: selectedCustomerId || undefined,
        customerName: selectedCustomer ? selectedCustomer.name : customerName.trim() || undefined,
        customerPhone: selectedCustomer ? selectedCustomer.phone : customerPhone.trim() || undefined,
        note: holdTicketNote.trim() || undefined,
      });
      const updated = await getHeldTickets();
      setHeldTickets(updated);
      clearCart();
      setIsHoldModalOpen(false);
      showToast(`Bill held as "${holdTicketName.trim()}"!`);
    } catch (err) {
      console.error("Failed to hold bill:", err);
      showToast("Failed to hold bill.");
    }
  }

  async function handleRestoreTicket(ticket: HeldTicket) {
    if (cart.length > 0) {
      if (!window.confirm("Restoring this ticket will overwrite current cart. Continue?")) {
        return;
      }
    }
    try {
      setCart([...ticket.items]);
      if (ticket.customerId) {
        handleSelectCustomer(ticket.customerId);
      } else {
        setSelectedCustomerId("");
        setCustomerName(ticket.customerName || "");
        setCustomerPhone(ticket.customerPhone || "");
      }
      await deleteHeldTicket(ticket.id);
      const updated = await getHeldTickets();
      setHeldTickets(updated);
      setIsOpenTicketsDrawerOpen(false);
      showToast(`Restored "${ticket.name}" to cart!`);
    } catch (err) {
      console.error("Failed to restore ticket:", err);
      showToast("Failed to restore ticket.");
    }
  }

  async function handleDeleteHeldTicket(ticketId: string, ticketName: string) {
    try {
      await deleteHeldTicket(ticketId);
      const updated = await getHeldTickets();
      setHeldTickets(updated);
      showToast(`Discarded ticket "${ticketName}".`);
    } catch (err) {
      console.error("Failed to delete held ticket:", err);
      showToast("Failed to discard ticket.");
    }
  }

  async function handleVoidSale(sale: Sale) {
    if (
      !window.confirm(
        `Are you sure you want to void Bill #${sale.billNo}? This will restore all product stock and reverse customer Khata balance.`
      )
    ) {
      return;
    }
    try {
      await voidSale(sale.id, "Customer returned / voided at counter");
      await loadData();
      showToast(`Bill #${sale.billNo} voided! Stock restored.`);
    } catch (err) {
      console.error("Failed to void sale:", err);
      showToast("Failed to void sale.");
    }
  }

  // Process barcode input
  async function processScannedBarcode(code: string) {
    if (!code) return;
    try {
      const match = await getProductByBarcode(code);
      if (match) {
        addToCart(match);
        showToast(`Scanned: "${match.name}" (₹${match.salePrice.toFixed(2)})`);
      } else {
        showToast(`Item not found for barcode: ${code}`);
      }
    } catch (err) {
      console.error("Barcode lookup failed:", err);
      showToast("Barcode search error.");
    }
  }

  function handleBarcodeFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    processScannedBarcode(barcodeInput.trim());
    setBarcodeInput("");
  }

  // Persistent hardware USB/Bluetooth barcode scanner listener
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    function handleGlobalKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if (isInput && target !== barcodeInputRef.current) {
        return;
      }

      const now = Date.now();
      if (now - lastKeyTime > 120) {
        buffer = "";
      }
      lastKeyTime = now;

      if (e.key === "Enter") {
        if (buffer.length >= 3) {
          e.preventDefault();
          processScannedBarcode(buffer.trim());
          buffer = "";
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [products, cart]);

  // Open Checkout Modal
  function openCheckout() {
    if (cart.length === 0) {
      showToast("Cart is empty! Add products first.");
      return;
    }

    // Check if any cart item exceeds available stock
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && item.qty > prod.stock) {
        showToast(
          `Cannot checkout: "${item.name}" quantity (${item.qty}) exceeds available stock (${prod.stock}).`
        );
        return;
      }
    }

    setPaymentMode("cash");
    setCashTendered(String(grandTotal));
    setSplitCash(String(Math.floor(grandTotal / 2)));
    setSplitOnline(String(grandTotal - Math.floor(grandTotal / 2)));
    setIsCheckoutOpen(true);
  }

  // Generate UPI QR Code on demand
  useEffect(() => {
    if (!isCheckoutOpen || grandTotal <= 0 || !storeSettings.upiId) {
      setUpiQrUrl("");
      return;
    }

    const upiAmount =
      paymentMode === "split"
        ? parseFloat(splitOnline) || 0
        : grandTotal;

    if (upiAmount <= 0) {
      setUpiQrUrl("");
      return;
    }

    const upiUri = `upi://pay?pa=${encodeURIComponent(storeSettings.upiId)}&pn=${encodeURIComponent(
      storeSettings.businessName
    )}&am=${upiAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("POS Store Bill")}`;

    let active = true;
    import("qrcode")
      .then((mod) => {
        const QRCode = mod.default || mod;
        return QRCode.toDataURL(upiUri, {
          width: 180,
          margin: 1,
          color: { dark: "#0f172a", light: "#ffffff" },
        });
      })
      .then((url) => {
        if (active) setUpiQrUrl(url);
      })
      .catch((err) => console.error("UPI QR Generation Error:", err));

    return () => {
      active = false;
    };
  }, [isCheckoutOpen, paymentMode, grandTotal, splitOnline, storeSettings]);

  // Cash Tendered Calculations
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeToReturn = Math.max(0, tenderedNum - grandTotal);
  const balanceDue = Math.max(0, grandTotal - tenderedNum);

  // Quick cash preset denominations (Loyverse style: [Exact Cash], [Nearest ₹50], [Nearest ₹100], [Nearest ₹500])
  const quickCashDenominations = useMemo(() => {
    const list: { label: string; amount: number }[] = [];
    list.push({ label: `Exact (₹${grandTotal})`, amount: grandTotal });

    // Nearest 50
    const n50 = Math.ceil(grandTotal / 50) * 50;
    const next50 = n50 === grandTotal ? grandTotal + 50 : n50;
    if (!list.some((d) => d.amount === next50)) {
      list.push({ label: `Nearest ₹50 (₹${next50})`, amount: next50 });
    }

    // Nearest 100
    const n100 = Math.ceil(grandTotal / 100) * 100;
    const next100 = n100 === grandTotal ? grandTotal + 100 : n100;
    if (!list.some((d) => d.amount === next100)) {
      list.push({ label: `Nearest ₹100 (₹${next100})`, amount: next100 });
    }

    // Nearest 500
    const n500 = Math.ceil(grandTotal / 500) * 500;
    const next500 = n500 === grandTotal ? grandTotal + 500 : n500;
    if (!list.some((d) => d.amount === next500)) {
      list.push({ label: `Nearest ₹500 (₹${next500})`, amount: next500 });
    }

    // High notes if grandTotal is below 2000
    [500, 1000, 2000].forEach((note) => {
      if (note > grandTotal && !list.some((d) => d.amount === note)) {
        list.push({ label: `₹${note}`, amount: note });
      }
    });

    return list.slice(0, 6);
  }, [grandTotal]);

  // Complete Sale & Trigger Loyverse Success Flow
  async function handleCompleteSale() {
    if (paymentMode === "khata" && !selectedCustomerId) {
      showToast("Please select a registered customer for Khata (Udhaar) billing!");
      return;
    }

    setIsCheckingOut(true);
    try {
      const billNo = await getNextBillNo();
      const newSale: Sale = {
        id: "",
        billNo,
        items: [...cart],
        subtotal,
        taxTotal,
        grandTotal,
        paymentMode,
        timestamp: Date.now(),
        customerId: selectedCustomer ? selectedCustomer.id : undefined,
        customerName: selectedCustomer ? selectedCustomer.name : customerName.trim() || undefined,
        customerPhone: selectedCustomer ? selectedCustomer.phone : customerPhone.trim() || undefined,
        loyaltyPointsRedeemed: redeemPoints ? loyaltyDiscount : 0,
        loyaltyDiscount: redeemPoints ? loyaltyDiscount : 0,
        loyaltyPointsAwarded: pointsAwarded,
      };

      // 1. Record order in IndexedDB, update stock, and update customer Khata / Loyalty
      await recordSale(newSale, true);

      // 2. Compute change due
      const changeDueAmt = paymentMode === "cash" ? Math.max(0, tenderedNum - grandTotal) : 0;

      // 3. Update local state & open Loyverse Success Screen
      setCompletedSale(newSale);
      setSuccessSale(newSale);
      setSuccessChangeDue(changeDueAmt);
      setIsCheckoutOpen(false);
      setIsSuccessModalOpen(true);
      setAutoResetCountdown(4);
      setIsCountdownPaused(false);

      // Telemetry tracking
      trackEvent(
        "POS_SALE_COMPLETED",
        "pos_counter",
        { grandTotal, itemsCount: cart.length, paymentMode },
        user
          ? { id: user.id, businessName: user.businessName }
          : { businessName: storeSettings.businessName }
      );

      // 4. Clear cart and reload stock & customers in background
      clearCart();
      await loadData();

      const bonusMsg =
        paymentMode === "khata"
          ? `Added ₹${grandTotal.toFixed(2)} to ${selectedCustomer?.name}'s Khata.`
          : pointsAwarded > 0
          ? `Awarded +${pointsAwarded} loyalty points!`
          : "";

      showToast(`Bill #${billNo} completed! ${bonusMsg}`);
    } catch (err) {
      console.error("Sale transaction failed:", err);
      showToast("Transaction failed. Please check local database.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16 select-none font-sans">
      {/* Toast Alert */}
      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      {/* POS Top Header */}
      <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs will-change-transform transform-gpu">
        <div className="mx-auto max-w-[1850px] 2xl:max-w-[2100px] w-full px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs"
                title="Back to Back-Office Dashboard"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back-Office</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
                  <Store className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base leading-tight">
                    {storeSettings.businessName}
                  </h1>
                  <p className="text-[10px] text-slate-500 leading-none">
                    Swift POS Counter · GSTIN: {storeSettings.gstin || "Unregistered"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Barcode Scanner Input */}
            <form onSubmit={handleBarcodeFormSubmit} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan USB/Bluetooth barcode or press Enter..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-1.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 shadow-2xs transition"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Shift / Cash Drawer Status */}
              {activeShift ? (
                <button
                  type="button"
                  onClick={openEndShiftModal}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 shadow-2xs transition active:scale-95"
                  title="Shift is Active · Click to Close Shift / Print Z-Report"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>Shift: Open</span>
                  <span className="hidden xl:inline text-emerald-700 font-normal">
                    (₹{activeShift.openingCash})
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsStartShiftModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-2xs transition active:scale-95"
                  title="Start Cash Drawer Shift & Set Float"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  <span>Start Shift</span>
                </button>
              )}

              {/* Open Tickets Counter Button (Loyverse Style) */}
              <button
                type="button"
                data-testid="open-tickets-button"
                onClick={() => setIsOpenTicketsDrawerOpen(true)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-black transition active:scale-95 shadow-2xs ${
                  heldTickets.length > 0
                    ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 ring-2 ring-amber-300/40"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                title="View Open Tickets / Parked Bills"
              >
                <FileClock className={`h-4 w-4 ${heldTickets.length > 0 ? "text-amber-700" : "text-slate-500"}`} />
                <span>Open Tickets</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-black ${
                    heldTickets.length > 0 ? "bg-amber-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {heldTickets.length}
                </span>
              </button>

              <Link
                href="/customers"
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100 shadow-2xs transition"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Khata &amp; CRM</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-95"
              >
                <History className="h-3.5 w-3.5 text-slate-500" />
                <span>Bills ({recentSales.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStoreSettingsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                title="POS Store Settings & Receipt Header"
              >
                <Settings className="h-3.5 w-3.5 text-slate-500" />
              </button>

              <Link
                href="/inventory"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
              >
                <Package className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden md:inline">Stock Master</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* POS Workspace: Split 65% Catalog / 35% Cart */}
      <main className="no-print mx-auto max-w-[1850px] 2xl:max-w-[2100px] w-full px-4 sm:px-6 lg:px-8 pt-3.5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* LEFT 65%: Product Catalog & Search Grid */}
          <section className="lg:col-span-8 space-y-3">
            {/* Search & Dynamic Category Tabs Dock */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, barcode, HSN..."
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                {/* Loyverse Dynamic Category Dock with Colored Dots */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                      selectedCategory === "all"
                        ? "bg-slate-900 text-white shadow-xs ring-1 ring-slate-900"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-400 shrink-0" />
                    <span>All Items</span>
                    <span className={`text-[10px] ${selectedCategory === "all" ? "text-slate-300" : "text-slate-400"}`}>
                      ({products.length})
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-xs ring-1 ring-slate-900"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${getCategoryColor(cat)}`} />
                        <span>{cat}</span>
                        <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Tiles Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs min-h-[540px]">
              {loading ? (
                <div className="flex items-center justify-center py-28 text-slate-400 text-xs">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading product catalog...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="py-24 text-center px-4 max-w-md mx-auto">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-sm border border-emerald-100/60 mb-3">
                    📦
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No items in stock yet</h3>
                  <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Start scanning barcodes or add your first product to begin billing.
                  </p>
                  <Link
                    href="/inventory"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition"
                  >
                    <span>+ Add First Product</span>
                  </Link>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-24 text-center px-4">
                  <Package className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-600">No matching products found</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
                  >
                    Clear search filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = p.stock <= 0;
                    const isLowStock = p.stock > 0 && p.stock <= p.minStock;
                    const inCartItem = cart.find((c) => c.productId === p.id);
                    const qtyInCart = inCartItem?.qty || 0;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        data-testid="product-card"
                        onClick={() => addToCart(p)}
                        disabled={isOutOfStock}
                        className={`group flex flex-col justify-between rounded-2xl border p-3 text-left shadow-2xs transition-all duration-150 active:scale-95 select-none relative min-h-[118px] cursor-pointer ${
                          isOutOfStock
                            ? "border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed"
                            : qtyInCart > 0
                            ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/30 shadow-xs"
                            : "border-slate-200/90 bg-white hover:border-emerald-400 hover:shadow-xs"
                        }`}
                        title={isOutOfStock ? "Out of stock" : "Tap to add / increment in cart"}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                              <span className={`h-2 w-2 rounded-full shrink-0 ${getCategoryColor(p.category || "")}`} />
                              <span className="truncate">{p.category || "General"}</span>
                            </span>
                            {qtyInCart > 0 ? (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs animate-in zoom-in-75">
                                <span>{qtyInCart} in cart</span>
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-1 text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {p.name}
                          </h3>
                        </div>

                        <div className="mt-2.5 flex items-end justify-between border-t border-slate-100 pt-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              GST {p.gstRate}%
                            </span>
                            <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
                              ₹{p.salePrice.toFixed(2)}
                            </span>
                          </div>

                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums font-mono ${
                              isOutOfStock
                                ? "bg-red-100 text-red-700"
                                : isLowStock
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isOutOfStock ? "Out of Stock" : `${p.stock} left`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT 35%: Live Order Cart & Customer Selection */}
          <section className="lg:col-span-4 sticky top-16 space-y-3 will-change-transform transform-gpu">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden flex flex-col">
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-teal-700" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Order Cart ({totalUnits} {totalUnits === 1 ? "unit" : "units"})
                  </h2>
                </div>
                {cart.length > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={openHoldModal}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900 transition active:scale-95 shadow-2xs"
                      title="Park active cart as an open ticket"
                    >
                      <Pause className="h-3 w-3 text-amber-700" />
                      <span>Hold Bill</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 transition px-1.5 py-0.5"
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </div>

              {/* QUICK SELECT / ADD CUSTOMER STRIP */}
              <div className="p-3 border-b border-slate-100 bg-slate-50/40 space-y-2">
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                  >
                    <option value="">👤 Walk-in Customer (Unregistered)</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) {c.creditBalance > 0 ? `· Due: ₹${c.creditBalance}` : ""}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsQuickCustomerOpen(true)}
                    title="Register New Customer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 shrink-0 shadow-2xs transition"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                </div>

                {/* Selected Customer Active Info Pill */}
                {selectedCustomer ? (
                  <div className="rounded-xl border border-teal-200 bg-white p-2.5 text-xs shadow-2xs space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{selectedCustomer.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">{selectedCustomer.phone}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      {selectedCustomer.creditBalance > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          Udhaar Due: ₹{selectedCustomer.creditBalance.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          No pending balance ✓
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                        <Coins className="h-3 w-3 text-amber-600" />
                        <span>{selectedCustomer.loyaltyPoints} pts</span>
                      </span>
                    </div>

                    {/* Redeem Loyalty Points Checkbox */}
                    {selectedCustomer.loyaltyPoints > 0 && cart.length > 0 ? (
                      <label className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-teal-900 cursor-pointer border-t border-slate-100">
                        <input
                          type="checkbox"
                          checked={redeemPoints}
                          onChange={(e) => setRedeemPoints(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-500 h-3.5 w-3.5"
                        />
                        <span>
                          Redeem {Math.min(exactTotal, selectedCustomer.loyaltyPoints)} Points (Save ₹
                          {Math.min(exactTotal, selectedCustomer.loyaltyPoints)})
                        </span>
                      </label>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Walk-in Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                )}
              </div>

              {/* Cart Items List or Empty State */}
              <div className="max-h-[300px] min-h-[160px] overflow-y-auto divide-y divide-slate-100 p-3">
                {cart.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 mb-2.5">
                      <Barcode className="h-6 w-6" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">Cart is Empty</h3>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Scan barcodes via USB/Bluetooth scanner or tap product tiles on the left to start billing.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.productId}
                      data-testid="cart-item"
                      onClick={() => openItemModifier(item)}
                      className="group flex items-center justify-between py-2 px-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer gap-2"
                      title="Tap to modify quantity, discount or notes"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition">
                            {item.name}
                          </p>
                          <Edit2 className="h-3 w-3 text-slate-300 group-hover:text-emerald-600 shrink-0 transition" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-mono">
                            ₹{item.price.toFixed(2)} {item.gstRate ? `· GST ${item.gstRate}%` : ""}
                          </span>
                          {item.discount && item.discount > 0 ? (
                            <span className="inline-flex items-center rounded-md bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800 font-mono">
                              {item.discountType === "percent" ? `-${item.discount}%` : `-₹${item.discount}`}
                            </span>
                          ) : null}
                        </div>
                        {item.notes ? (
                          <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
                            Note: {item.notes}
                          </p>
                        ) : null}
                      </div>

                      {/* Quantity Stepper */}
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition active:scale-95"
                          title="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span
                          data-testid="cart-item-qty"
                          className="w-6 text-center font-bold text-xs font-mono tabular-nums"
                        >
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition active:scale-95"
                          title="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0 min-w-[3.5rem]">
                        <span className="font-bold text-xs font-mono text-slate-900">
                          ₹{item.total.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.productId);
                        }}
                        className="text-slate-300 hover:text-red-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Real-Time Total Summary */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST Tax Included:</span>
                  <span className="font-mono text-teal-700 font-semibold">
                    ₹{taxTotal.toFixed(2)}
                  </span>
                </div>
                {loyaltyDiscount > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Loyalty Points Discount:</span>
                    <span className="font-mono">-₹{loyaltyDiscount.toFixed(2)}</span>
                  </div>
                ) : null}
                {roundOff !== 0 ? (
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Round Off:</span>
                    <span className="font-mono">
                      {roundOff > 0 ? `+₹${roundOff.toFixed(2)}` : `-₹${Math.abs(roundOff).toFixed(2)}`}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Grand Total:</span>
                  <span className="text-xl font-mono text-teal-800 tabular-nums">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Actions: Hold Bill & Authentic Loyverse CHARGE Button */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    data-testid="hold-bill-button"
                    onClick={openHoldModal}
                    disabled={cart.length === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 py-3.5 text-xs font-bold text-amber-900 transition active:scale-95 disabled:opacity-40"
                    title="Park active cart items as open ticket"
                  >
                    <Pause className="h-3.5 w-3.5 text-amber-700" />
                    <span>Hold Bill</span>
                  </button>

                  <button
                    type="button"
                    data-testid="charge-button"
                    onClick={openCheckout}
                    disabled={cart.length === 0}
                    className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 active:scale-95 transition disabled:opacity-40 ring-2 ring-emerald-500/25 uppercase tracking-wide"
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    <span>CHARGE ₹{grandTotal.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FAST CHECKOUT & PAYMENT MODAL */}
      {isCheckoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Loyverse Fast Checkout
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-500">Total Amount to Pay:</span>
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
                {selectedCustomer ? (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <strong className="text-slate-800">{selectedCustomer.name}</strong> ({selectedCustomer.phone})
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Select Payment Mode
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMode("cash")}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 border transition ${
                    paymentMode === "cash"
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Banknote className="h-4 w-4" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("upi")}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 border transition ${
                    paymentMode === "upi"
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("card")}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 border transition ${
                    paymentMode === "card"
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("split")}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 border transition ${
                    paymentMode === "split"
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Split className="h-4 w-4" />
                  <span>Split</span>
                </button>

                {/* KHATA (UDHAAR) TAB */}
                <button
                  type="button"
                  onClick={() => setPaymentMode("khata")}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 border transition ${
                    paymentMode === "khata"
                      ? "border-red-600 bg-red-700 text-white shadow-xs"
                      : "border-red-200 bg-red-50 text-red-900 hover:bg-red-100"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Khata</span>
                </button>
              </div>
            </div>

            {/* KHATA (UDHAAR) PAYMENT MODE DETAILS */}
            {paymentMode === "khata" ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                  <BookOpen className="h-4 w-4 text-red-700" />
                  <span>Khata / Udhaar Register Transaction</span>
                </div>

                {selectedCustomer ? (
                  <div className="rounded-xl border border-red-200 bg-white p-3 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{selectedCustomer.name} ({selectedCustomer.phone})</p>
                    <div className="flex justify-between text-slate-600">
                      <span>Existing Udhaar:</span>
                      <span className="font-mono font-bold text-red-700">₹{selectedCustomer.creditBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold border-t border-slate-100 pt-1">
                      <span>New Outstanding Due:</span>
                      <span className="font-mono text-red-800 text-sm">
                        ₹{(selectedCustomer.creditBalance + grandTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>Please select a registered customer to record this bill on Khata.</span>
                    </div>

                    <select
                      value={selectedCustomerId}
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900"
                    >
                      <option value="">Select Customer...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) - Due: ₹{c.creditBalance}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ) : null}

            {/* CASH CALCULATOR (When Cash Mode is Active) */}
            {paymentMode === "cash" ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cash Tendered by Customer (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="1"
                      data-testid="cash-tender-input"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder={String(grandTotal)}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2.5 text-base font-bold font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Cash Preset Denomination Buttons (Loyverse Style) */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Quick Cash Tender
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {quickCashDenominations.map((denom) => (
                      <button
                        key={denom.label}
                        type="button"
                        onClick={() => setCashTendered(String(denom.amount))}
                        className={`rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono border transition active:scale-95 ${
                          tenderedNum === denom.amount
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {denom.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Change Due (Wapas kitne paise dene hain) */}
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                      Change Due (Wapas kitne dene hain)
                    </span>
                    <p
                      data-testid="change-due-amount"
                      className="text-2xl font-black text-emerald-700 font-mono tabular-nums"
                    >
                      ₹{changeToReturn.toFixed(2)}
                    </p>
                  </div>
                  {balanceDue > 0 ? (
                    <span className="rounded-xl bg-red-100 border border-red-300 px-3 py-1.5 text-xs font-bold text-red-800">
                      Balance Due: ₹{balanceDue.toFixed(2)}
                    </span>
                  ) : (
                    <span className="rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Exact Covered
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            {/* UPI QR PAYMENT */}
            {paymentMode === "upi" ? (
              <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50/50 p-4 text-center flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                  Scan &amp; Pay ₹{grandTotal.toFixed(2)}
                </span>
                {upiQrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={upiQrUrl}
                    alt="UPI Payment QR"
                    width={180}
                    height={180}
                    className="aspect-square rounded-xl border border-slate-300 bg-white p-2 shadow-xs"
                  />
                ) : (
                  <div className="h-44 w-44 flex items-center justify-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                    Generating QR...
                  </div>
                )}
                <p className="mt-2 text-xs font-mono font-bold text-slate-800">
                  {storeSettings.upiId}
                </p>
                <p className="text-[11px] text-slate-500">
                  Instant confirmation upon receiving customer payment.
                </p>
              </div>
            ) : null}

            {/* CARD MODE */}
            {paymentMode === "card" ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center space-y-1">
                <CreditCard className="mx-auto h-8 w-8 text-slate-500" />
                <h4 className="text-xs font-bold text-slate-900">Card / EDC POS Machine</h4>
                <p className="text-[11px] text-slate-500">
                  Swipe or tap card on your merchant EDC machine for ₹{grandTotal.toFixed(2)}.
                </p>
              </div>
            ) : null}

            {/* SPLIT PAYMENT MODE */}
            {paymentMode === "split" ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cash Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSplitCash(val);
                        const c = parseFloat(val) || 0;
                        setSplitOnline(String(Math.max(0, grandTotal - c)));
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      UPI / Card Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={splitOnline}
                      onChange={(e) => setSplitOnline(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 font-mono font-bold"
                    />
                  </div>
                </div>

                {upiQrUrl && parseFloat(splitOnline) > 0 ? (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={upiQrUrl}
                      alt="UPI QR"
                      width={70}
                      height={70}
                      className="aspect-square border border-slate-200 rounded-lg p-1"
                    />
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-900">Scan UPI for ₹{splitOnline}</p>
                      <p className="font-mono text-slate-500">{storeSettings.upiId}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Loyalty Points Earn Notice */}
            {selectedCustomer && pointsAwarded > 0 ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-amber-600" />
                  <span>Loyalty Reward on this Sale:</span>
                </div>
                <span className="font-bold font-mono">+{pointsAwarded} pts</span>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition"
              >
                Back to Cart
              </button>

              <button
                type="button"
                data-testid="checkout-charge-button"
                onClick={handleCompleteSale}
                disabled={
                  isCheckingOut ||
                  (paymentMode === "cash" && balanceDue > 0) ||
                  (paymentMode === "khata" && !selectedCustomerId)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 active:scale-95 transition disabled:opacity-40 ring-2 ring-emerald-500/25"
              >
                <Zap className="h-4 w-4 fill-current" />
                <span>{isCheckingOut ? "Processing..." : `CHARGE ₹${grandTotal.toFixed(2)}`}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* LOYVERSE ITEM MODIFIER SHEET */}
      {editingCartItem ? (
        <div
          data-testid="modifier-sheet"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <Edit2 className="h-3 w-3 text-emerald-700" />
                  <span>Item Modifier</span>
                </span>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-1">
                  {editingCartItem.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono">
                  <span>Price: ₹{editingCartItem.price.toFixed(2)}</span>
                  <span>· GST {editingCartItem.gstRate}%</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCartItem(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quantity Stepper & Display */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setModQty((prev) => String(Math.max(1, (parseInt(prev, 10) || 1) + 5)))}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700 transition font-mono"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setModQty((prev) => String(Math.max(1, (parseInt(prev, 10) || 1) + 10)))}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700 transition font-mono"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModQty((prev) => String(Math.max(1, (parseInt(prev, 10) || 1) - 1)))}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition active:scale-95 shrink-0"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="flex-1 rounded-2xl border border-slate-300 bg-white py-2 px-3 text-center">
                  <span className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                    {modQty}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModQty((prev) => String((parseInt(prev, 10) || 1) + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition active:scale-95 shrink-0"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Numeric Keypad for fast quantity change */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5">
              <div className="grid grid-cols-3 gap-1.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeypadPress(k === "⌫" ? "backspace" : k)}
                    aria-label={k === "⌫" ? "Backspace" : k}
                    data-testid={k === "⌫" ? "keypad-backspace" : undefined}
                    className={`min-h-[44px] min-w-[44px] h-11 rounded-xl text-base font-bold transition active:scale-95 flex items-center justify-center select-none touch-manipulation ${
                      k === "C"
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        : k === "⌫"
                        ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                        : "bg-white border border-slate-200 text-slate-900 hover:border-emerald-500 shadow-2xs font-mono"
                    }`}
                  >
                    {k === "⌫" ? <Delete className="h-4 w-4" /> : k}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Discount Toggle (% or Flat) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Discount
                </label>
                {/* Toggle Type */}
                <div className="inline-flex rounded-xl bg-slate-100 p-0.5">
                  <button
                    type="button"
                    onClick={() => setModDiscountType("percent")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      modDiscountType === "percent"
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    % Percent
                  </button>
                  <button
                    type="button"
                    onClick={() => setModDiscountType("flat")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      modDiscountType === "flat"
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ₹ Flat Amount
                  </button>
                </div>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(modDiscountType === "percent" ? [0, 5, 10, 15, 20, 25] : [0, 10, 20, 50, 100]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setModDiscountVal(String(preset))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold font-mono border transition ${
                      parseFloat(modDiscountVal) === preset
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {modDiscountType === "percent" ? `${preset}%` : `₹${preset}`}
                  </button>
                ))}
              </div>

              {/* Custom Discount Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                  {modDiscountType === "percent" ? "%" : "₹"}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  max={modDiscountType === "percent" ? 100 : undefined}
                  value={modDiscountVal}
                  onChange={(e) => setModDiscountVal(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs font-bold font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Item Note / Instructions
              </label>
              <input
                type="text"
                value={modNotes}
                onChange={(e) => setModNotes(e.target.value)}
                placeholder="e.g. Gift wrap, Extra cold, Specific batch"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Computed Calculation Preview */}
            {(() => {
              const q = Math.max(1, parseInt(modQty, 10) || 1);
              const gross = editingCartItem.price * q;
              const dVal = Math.max(0, parseFloat(modDiscountVal) || 0);
              const dAmt =
                modDiscountType === "percent"
                  ? (gross * Math.min(100, dVal)) / 100
                  : Math.min(gross, dVal);
              const net = Math.max(0, gross - dAmt);

              return (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">
                      Subtotal: ₹{gross.toFixed(2)}{dAmt > 0 ? ` · Disc: -₹${dAmt.toFixed(2)}` : ""}
                    </span>
                    <span className="font-bold text-slate-900 text-sm font-mono">
                      Net: ₹{net.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    GST Included
                  </span>
                </div>
              );
            })()}

            {/* Actions: Remove & Save */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                data-testid="modifier-delete-button"
                onClick={handleDeleteFromModifier}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 text-xs font-bold text-red-700 transition active:scale-95"
                title="Remove item completely from cart"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                data-testid="modifier-save-button"
                onClick={handleSaveModifier}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition"
              >
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* LOYVERSE POST-PAYMENT SUCCESS SCREEN */}
      {isSuccessModalOpen && successSale ? (
        <div
          data-testid="success-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => {
            // Clicking backdrop starts a new clean sale immediately
            handleStartNewSale();
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Checkmark */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 shadow-inner">
              <Check className="h-10 w-10 stroke-[3] animate-in zoom-in-50 duration-300" />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-900 tracking-tight">
              Payment Successful!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bill #{successSale.billNo} · ₹{successSale.grandTotal.toFixed(2)} Paid ({successSale.paymentMode.toUpperCase()})
            </p>

            {/* Change Due Card (Prominent Loyverse feature for cashiers) */}
            {successSale.paymentMode === "cash" ? (
              <div className="my-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Change Due (Wapas kitne paise dene hain)
                </span>
                <div className="mt-1 text-3xl font-black text-emerald-700 font-mono tracking-tight">
                  ₹{successChangeDue.toFixed(2)}
                </div>
                <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                  {successChangeDue > 0
                    ? "Please return change to the customer."
                    : "Exact payment received. No change required."}
                </p>
              </div>
            ) : (
              <div className="my-5 rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Transaction Recorded
                </span>
                <div className="mt-1 text-2xl font-black text-teal-900 font-mono">
                  ₹{successSale.grandTotal.toFixed(2)}
                </div>
                <p className="mt-1 text-[11px] text-teal-700 font-medium">
                  {successSale.paymentMode === "upi"
                    ? "UPI payment confirmed instantly."
                    : successSale.paymentMode === "card"
                    ? "Card EDC transaction logged."
                    : successSale.paymentMode === "khata"
                    ? "Recorded in customer's credit ledger (Udhaar)."
                    : "Split payment completed."}
                </p>
              </div>
            )}

            {/* 3 Prominent Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {/* 1. Print Receipt */}
              <button
                type="button"
                data-testid="print-receipt-button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setIsReceiptModalOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-3 text-xs font-bold text-slate-800 transition active:scale-95 shadow-2xs"
              >
                <Printer className="h-5 w-5 text-teal-700" />
                <span>Print Receipt</span>
              </button>

              {/* 2. WhatsApp Bill */}
              <button
                type="button"
                data-testid="whatsapp-bill-button"
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 p-3 text-xs font-bold text-emerald-800 transition active:scale-95 shadow-2xs"
              >
                <Share2 className="h-5 w-5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              {/* 3. New Sale */}
              <button
                type="button"
                data-testid="new-sale-button"
                onClick={handleStartNewSale}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-3 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-emerald-600/20"
              >
                <Zap className="h-5 w-5 fill-current" />
                <span>New Sale</span>
              </button>
            </div>

            {/* Auto-reset countdown timer banner */}
            <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {isCountdownPaused
                    ? "Auto-reset paused"
                    : `Auto-resetting in ${autoResetCountdown}s...`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCountdownPaused((prev) => !prev)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
              >
                {isCountdownPaused ? "Resume" : "Pause Timer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* QUICK ADD CUSTOMER MODAL */}
      {isQuickCustomerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-teal-700" />
                <span>Quick Register Customer</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsQuickCustomerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={quickCustName}
                  onChange={(e) => setQuickCustName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full rounded-xl border border-slate-300 p-2 font-medium text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={quickCustPhone}
                  onChange={(e) => setQuickCustPhone(e.target.value)}
                  placeholder="e.g. 9810012345"
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsQuickCustomerOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-1.5 font-bold text-white shadow-xs"
                >
                  Save &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* COMPLETED SALE THERMAL RECEIPT MODAL */}
      {isReceiptModalOpen && completedSale ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="no-print flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Bill #{completedSale.billNo} Created
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Thermal Receipt Print Component */}
            <ThermalReceipt
              sale={completedSale}
              business={storeSettings}
              showControls={true}
            />

            <div className="no-print mt-5 border-t border-slate-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-bold text-white shadow-xs transition"
              >
                Start Next Sale
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* RECENT SALES HISTORY DRAWER */}
      {isHistoryOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-teal-700" />
                <span>Recent POS Transactions ({recentSales.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {recentSales.length === 0 ? (
              <p className="py-12 text-center text-xs text-slate-400">
                No recorded sales in local database yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {recentSales.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span>#{s.billNo}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-semibold ${
                            s.paymentMode === "khata"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {s.paymentMode}
                        </span>
                        {s.status === "voided" ? (
                          <span className="rounded bg-red-600 text-white px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                            Voided
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {new Date(s.timestamp).toLocaleString("en-IN")} · {s.items.length} items
                        {s.customerName ? ` · Cust: ${s.customerName}` : ""}
                        {s.voidReason ? ` · Note: ${s.voidReason}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm font-mono ${s.status === "voided" ? "line-through text-slate-400" : "text-slate-900"}`}>
                        ₹{s.grandTotal.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCompletedSale(s);
                          setIsHistoryOpen(false);
                          setIsReceiptModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Receipt
                      </button>
                      {s.status !== "voided" ? (
                        <button
                          type="button"
                          onClick={() => handleVoidSale(s)}
                          className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                          title="Void bill & restore inventory"
                        >
                          Void
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* STORE SETTINGS MODAL */}
      {isStoreSettingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Store className="h-4 w-4 text-teal-700" />
                <span>Store &amp; Thermal Receipt Settings</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsStoreSettingsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                saveStoreSettings({
                  businessName: (fd.get("businessName") as string).trim() || DEFAULT_STORE.businessName,
                  address: (fd.get("address") as string).trim(),
                  phone: (fd.get("phone") as string).trim(),
                  gstin: (fd.get("gstin") as string).trim(),
                  upiId: (fd.get("upiId") as string).trim() || DEFAULT_STORE.upiId,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Store / Business Name *
                </label>
                <input
                  name="businessName"
                  defaultValue={storeSettings.businessName}
                  required
                  className="w-full rounded-xl border border-slate-300 p-2 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store Address</label>
                <input
                  name="address"
                  defaultValue={storeSettings.address}
                  className="w-full rounded-xl border border-slate-300 p-2 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    name="phone"
                    defaultValue={storeSettings.phone}
                    className="w-full rounded-xl border border-slate-300 p-2 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN</label>
                  <input
                    name="gstin"
                    defaultValue={storeSettings.gstin}
                    className="w-full rounded-xl border border-slate-300 p-2 font-mono text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store UPI ID (For Scan &amp; Pay QR) *</label>
                <input
                  name="upiId"
                  defaultValue={storeSettings.upiId}
                  required
                  placeholder="e.g. yourstore@upi"
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono font-semibold text-teal-900"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStoreSettingsOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-1.5 font-bold text-white shadow-xs"
                >
                  Save Store Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* 1. HOLD BILL MODAL */}
      {isHoldModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Pause className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hold Active Bill</h3>
                  <p className="text-[11px] text-slate-500">Park current cart items to serve next customer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHoldModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmHold} className="space-y-3.5 text-xs">
              <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-3 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Cart Items ({totalUnits}):</span>
                  <span className="font-mono text-teal-800">₹{grandTotal.toFixed(2)}</span>
                </div>
                {selectedCustomer ? (
                  <p className="text-[11px] text-amber-900">
                    Customer: <strong>{selectedCustomer.name}</strong> ({selectedCustomer.phone})
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ticket Reference / Table Name *
                </label>
                <input
                  type="text"
                  required
                  data-testid="hold-ticket-name-input"
                  value={holdTicketName}
                  onChange={(e) => setHoldTicketName(e.target.value)}
                  placeholder="e.g. Table 4, Ramesh Bhai, Blue Shirt Customer"
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-medium text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Note
                </label>
                <input
                  type="text"
                  value={holdTicketNote}
                  onChange={(e) => setHoldTicketNote(e.target.value)}
                  placeholder="e.g. Customer stepped out to fetch cash from ATM"
                  className="w-full rounded-xl border border-slate-300 p-2 font-medium text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsHoldModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="confirm-hold-button"
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2 font-bold text-white shadow-xs"
                >
                  Hold Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* 2. OPEN TICKETS / SAVED BILLS MODAL */}
      {isOpenTicketsDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileClock className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Open Bills / Parked Tickets ({heldTickets.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenTicketsDrawerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {heldTickets.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <FileClock className="h-10 w-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No open bills on hold</p>
                  <p className="text-[11px] text-slate-400">
                    Use the &quot;Hold Bill&quot; button in the cart panel to temporarily save an ongoing order.
                  </p>
                </div>
              ) : (
                heldTickets.map((t) => {
                  const total = t.items.reduce((sum, it) => sum + (it.total || 0), 0);
                  const itemCount = t.items.reduce((sum, it) => sum + (it.qty || 0), 0);
                  const timeStr = new Date(t.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={t.id}
                      className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:border-amber-300 hover:bg-amber-50/70 shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 truncate">{t.name}</span>
                          <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.2">
                            {timeStr}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                          <span className="font-mono font-bold text-teal-800">₹{total.toFixed(2)}</span>
                          {t.customerName ? ` · 👤 ${t.customerName}` : ""}
                        </p>

                        {t.note ? (
                          <p className="text-[11px] text-slate-500 italic truncate">
                            Note: {t.note}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          data-testid="restore-ticket-button"
                          onClick={() => handleRestoreTicket(t)}
                          className="inline-flex items-center gap-1 rounded-xl bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs active:scale-95 transition"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Restore</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHeldTicket(t.id, t.name)}
                          className="rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 p-2 text-slate-400 transition"
                          title="Discard Ticket"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. START SHIFT MODAL */}
      {isStartShiftModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Start Cash Drawer Shift</h3>
                  <p className="text-[11px] text-slate-500">Record opening cash float in the till</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStartShiftModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleStartShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Opening Cash Float in Drawer (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    min="0"
                    value={openingFloatInput}
                    onChange={(e) => setOpeningFloatInput(e.target.value)}
                    placeholder="1000"
                    className="w-full rounded-xl border border-slate-300 pl-7 pr-3 py-2.5 font-mono text-base font-bold text-teal-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                {/* Quick denomination buttons */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setOpeningFloatInput(String(amt))}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 transition"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Shift Notes / Cashier Name
                </label>
                <input
                  type="text"
                  value={shiftNotesInput}
                  onChange={(e) => setShiftNotesInput(e.target.value)}
                  placeholder="e.g. Morning Shift - Cashier Ramesh"
                  className="w-full rounded-xl border border-slate-300 p-2 font-medium text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed rounded-xl bg-slate-50 border border-slate-100 p-2.5">
                💡 <strong>Drawer Accounting:</strong> This opening float is retained as baseline cash. During shift closure, your expected drawer balance will equal <em>Opening Float + Cash Sales</em>.
              </p>

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStartShiftModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-700 hover:bg-teal-800 px-5 py-2 font-bold text-white shadow-xs"
                >
                  Start Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* 4. END SHIFT / Z-REPORT MODAL */}
      {isEndShiftModalOpen && activeShift ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Wallet className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Close Shift &amp; Cash Drawer Reconciliation</h3>
                  <p className="text-[11px] text-slate-500">
                    Shift started at {new Date(activeShift.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEndShiftModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cash Drawer Calculation Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>(+) Opening Cash Float:</span>
                <span className="font-mono font-semibold">₹{(activeShift.openingCash || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>(+) Cash Sales in Shift:</span>
                <span className="font-mono font-semibold text-emerald-700">₹{currentShiftSummary.cashSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 text-sm">
                <span>(=) Expected Cash in Drawer:</span>
                <span className="font-mono text-teal-800">
                  ₹{((activeShift.openingCash || 0) + currentShiftSummary.cashSales).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Other Payment Tender Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-2.5">
                <span className="text-[11px] text-teal-700 block">UPI Collections</span>
                <span className="text-sm font-bold font-mono text-teal-900">
                  ₹{currentShiftSummary.upiSales.toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-2.5">
                <span className="text-[11px] text-blue-700 block">Card / EDC</span>
                <span className="text-sm font-bold font-mono text-blue-900">
                  ₹{currentShiftSummary.cardSales.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actual Cash Input & Difference calculation */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-900">
                Actual Physical Cash Counted in Till (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  value={actualPhysicalCash}
                  onChange={(e) => setActualPhysicalCash(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-300 pl-7 pr-3 py-2 font-mono text-base font-bold text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              {/* Shortage / Surplus Indicator */}
              {(() => {
                const expected = (activeShift.openingCash || 0) + currentShiftSummary.cashSales;
                const counted = parseFloat(actualPhysicalCash) || 0;
                const diff = counted - expected;

                if (Math.abs(diff) < 0.01) {
                  return (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Cash drawer is perfectly balanced! Zero discrepancy.</span>
                    </div>
                  );
                } else if (diff > 0) {
                  return (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-2.5 text-xs text-blue-800 font-semibold flex items-center gap-2">
                      <span className="font-bold font-mono">+₹{diff.toFixed(2)}</span>
                      <span>Cash Surplus (Extra physical cash in drawer).</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 font-semibold flex items-center gap-2">
                      <span className="font-bold font-mono">-₹{Math.abs(diff).toFixed(2)}</span>
                      <span>Cash Shortage (Physical cash is less than expected).</span>
                    </div>
                  );
                }
              })()}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Handover Notes / Discrepancy Reason (Optional)
              </label>
              <input
                type="text"
                value={closeShiftNotes}
                onChange={(e) => setCloseShiftNotes(e.target.value)}
                placeholder="e.g. Handed over till to Evening Cashier"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium text-slate-900 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsEndShiftModalOpen(false)}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCloseShift(false)}
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800"
              >
                Close (No Print)
              </button>
              <button
                type="button"
                onClick={() => handleCloseShift(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-5 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Z-Report &amp; Close</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 5. PRINTABLE Z-REPORT MODAL */}
      {isZReportModalOpen && shiftForZReport ? (
        <ZReportReceipt
          shift={shiftForZReport}
          business={storeSettings}
          onClose={() => setIsZReportModalOpen(false)}
        />
      ) : null}

      {/* Educational & E-E-A-T Compliance Guide */}
      <PosComplianceGuide />
    </div>
  );
}
