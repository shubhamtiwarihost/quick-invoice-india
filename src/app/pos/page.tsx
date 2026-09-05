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
  type Product,
  type Sale,
  type SaleItem,
  type PaymentMode,
  type Customer,
} from "@/lib/db/posDb";
import { ThermalReceipt, type BusinessInfo } from "@/components/pos/ThermalReceipt";

const DEFAULT_STORE: BusinessInfo = {
  businessName: "Swift Retail Store",
  address: "Main Market, Sector 14, New Delhi - 110001",
  phone: "+91 98765 43210",
  gstin: "07AAAAA0000A1Z5",
  upiId: "swiftretail@upi",
};

export default function PosCounterPage() {
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
      await seedInitialInventoryIfEmpty();
      await seedInitialCustomersIfEmpty();
      const [productList, customerList, salesList] = await Promise.all([
        getAllProducts(),
        getAllCustomers(),
        getAllSales(),
      ]);
      setProducts(productList);
      setCustomers(customerList);
      setRecentSales(salesList.slice(0, 25));
    } catch (err) {
      console.error("Failed to load POS data:", err);
      showToast("Unable to load POS catalog.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // Load store settings from localStorage
    try {
      const saved = localStorage.getItem("swiftgst_pos_store_settings");
      if (saved) {
        setStoreSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse store settings:", e);
    }
  }, []);

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

  // Add Item to Cart with Stock Check
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
        const total = salePrice * newQty;
        const taxAmount = (total * gstRate) / (100 + gstRate); // GST inclusive calculation

        updated[idx] = {
          ...item,
          qty: newQty,
          total,
          taxAmount,
        };
        return updated;
      } else {
        const qty = 1;
        const total = salePrice * qty;
        const taxAmount = (total * gstRate) / (100 + gstRate);

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
          const total = it.price * newQty;
          const taxAmount = (total * it.gstRate) / (100 + it.gstRate);
          return { ...it, qty: newQty, total, taxAmount };
        }
        return it;
      })
    );
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

  // Quick cash preset denominations
  const cashPresets = useMemo(() => {
    const presets = [grandTotal];
    const notes = [50, 100, 200, 500, 1000, 2000];
    notes.forEach((n) => {
      if (n >= grandTotal && !presets.includes(n)) {
        presets.push(n);
      }
    });
    return presets.slice(0, 5);
  }, [grandTotal]);

  // Complete Sale & Print Receipt
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

      // 2. Update local state
      setCompletedSale(newSale);
      setIsCheckoutOpen(false);
      setIsReceiptModalOpen(true);

      // 3. Clear cart and reload stock & customers in background
      clearCart();
      await loadData();

      // 4. Prompt print
      setTimeout(() => {
        window.print();
      }, 350);

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
      <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto max-w-[1600px] px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <Link
                href="/inventory"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                title="Back to Stock Master"
              >
                <ArrowLeft className="h-4 w-4" />
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
      <main className="no-print mx-auto max-w-[1600px] px-4 pt-3.5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          {/* LEFT 65%: Product Catalog & Search Grid */}
          <section className="lg:col-span-8 space-y-3">
            {/* Search & Category Tabs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full sm:w-72">
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

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === "all"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All Items ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? "bg-teal-700 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
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
              ) : filteredProducts.length === 0 ? (
                <div className="py-28 text-center">
                  <Package className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-600">No matching products</p>
                  <Link
                    href="/inventory"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
                  >
                    + Add products in Stock Master
                  </Link>
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
                        onClick={() => addToCart(p)}
                        disabled={isOutOfStock}
                        className={`group flex flex-col justify-between rounded-xl border p-3 text-left shadow-2xs transition active:scale-[0.98] relative min-h-[110px] ${
                          isOutOfStock
                            ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                            : inCartItem
                            ? "border-teal-500 bg-teal-50/40 ring-1 ring-teal-500/30"
                            : "border-slate-200/90 bg-white hover:border-teal-400 hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 truncate">
                              {p.category || "Item"}
                            </span>
                            {qtyInCart > 0 ? (
                              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-teal-700 px-1 text-[10px] font-bold text-white shadow-xs">
                                {qtyInCart}
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-0.5 text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {p.name}
                          </h3>
                        </div>

                        <div className="mt-2.5 flex items-end justify-between border-t border-slate-100 pt-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              GST {p.gstRate}%
                            </span>
                            <span className="text-sm font-bold text-slate-900 font-mono">
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
          <section className="lg:col-span-4 sticky top-16 space-y-3">
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
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 transition"
                  >
                    Clear Cart
                  </button>
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
                      className="flex items-center justify-between py-2 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          ₹{item.price.toFixed(2)} {item.gstRate ? `· GST ${item.gstRate}%` : ""}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition active:scale-95"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs font-mono tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition active:scale-95"
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
                        onClick={() => removeFromCart(item.productId)}
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

                {/* Open Fast Checkout Modal Button */}
                <button
                  type="button"
                  onClick={openCheckout}
                  disabled={cart.length === 0}
                  className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 py-3 text-sm font-bold text-white shadow-md active:scale-95 transition disabled:opacity-40 ring-2 ring-teal-600/20"
                >
                  <Receipt className="h-4 w-4 stroke-[2.5]" />
                  <span>Checkout (₹{grandTotal.toFixed(2)})</span>
                </button>
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
                <h3 className="text-base font-bold text-slate-900">
                  Payment &amp; Thermal Checkout
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Payable: <strong className="text-teal-800 font-mono">₹{grandTotal.toFixed(2)}</strong></span>
                  {selectedCustomer ? (
                    <span>· Bill to: <strong>{selectedCustomer.name}</strong></span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
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
                      ? "border-teal-600 bg-teal-700 text-white shadow-xs"
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
                      ? "border-teal-600 bg-teal-700 text-white shadow-xs"
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
                      ? "border-teal-600 bg-teal-700 text-white shadow-xs"
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
                      ? "border-teal-600 bg-teal-700 text-white shadow-xs"
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
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder={String(grandTotal)}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2.5 text-base font-bold font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cash Preset Denomination Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {cashPresets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTendered(String(amt))}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold font-mono border transition ${
                        tenderedNum === amt
                          ? "bg-teal-700 text-white border-teal-700"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {amt === grandTotal ? `Exact (₹${amt})` : `₹${amt}`}
                    </button>
                  ))}
                </div>

                {/* Change to Return Calculation */}
                <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Change to Return
                    </span>
                    <p className="text-xl font-bold text-emerald-600 font-mono tabular-nums">
                      ₹{changeToReturn.toFixed(2)}
                    </p>
                  </div>
                  {balanceDue > 0 ? (
                    <span className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700">
                      Balance Due: ₹{balanceDue.toFixed(2)}
                    </span>
                  ) : (
                    <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      Amount Covered ✓
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
                onClick={handleCompleteSale}
                disabled={
                  isCheckingOut ||
                  (paymentMode === "cash" && balanceDue > 0) ||
                  (paymentMode === "khata" && !selectedCustomerId)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition disabled:opacity-40"
              >
                <Printer className="h-4 w-4" />
                <span>{isCheckingOut ? "Processing..." : "Print & Complete Sale"}</span>
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
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {new Date(s.timestamp).toLocaleString("en-IN")} · {s.items.length} items
                        {s.customerName ? ` · Cust: ${s.customerName}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm font-mono text-slate-900">
                        ₹{s.grandTotal.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCompletedSale(s);
                          setIsHistoryOpen(false);
                          setIsReceiptModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Receipt
                      </button>
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
    </div>
  );
}
