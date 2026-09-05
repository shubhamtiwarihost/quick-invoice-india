"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  MessageCircle,
  FileText,
  IndianRupee,
  Coins,
  History,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  Trash2,
  Edit2,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Store,
  RefreshCw,
} from "lucide-react";
import {
  getAllCustomers,
  saveCustomer,
  deleteCustomer,
  getLedgerByCustomerId,
  recordCustomerPayment,
  seedInitialCustomersIfEmpty,
  type Customer,
  type LedgerEntry,
  type PaymentMode,
} from "@/lib/db/posDb";
import { type BusinessInfo } from "@/components/pos/ThermalReceipt";

const DEFAULT_STORE: BusinessInfo = {
  businessName: "Swift Retail Store",
  address: "Main Market, Sector 14, New Delhi - 110001",
  phone: "+91 98765 43210",
  gstin: "07AAAAA0000A1Z5",
  upiId: "swiftretail@upi",
};

export default function CustomersKhataPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOutstandingOnly, setShowOutstandingOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Store Settings (for WhatsApp & Store details)
  const [storeSettings, setStoreSettings] = useState<BusinessInfo>(DEFAULT_STORE);

  // Add / Edit Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gstin: "",
    creditBalance: "0",
    loyaltyPoints: "0",
  });

  // Khata Ledger & Settle Modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);

  // Payment Settlement Form State
  const [paymentAmount, setPaymentAmount] = useState("");
  const [settlementMode, setSettlementMode] = useState<PaymentMode>("cash");
  const [settlementNotes, setSettlementNotes] = useState("");

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  async function loadData() {
    setLoading(true);
    try {
      await seedInitialCustomersIfEmpty();
      const list = await getAllCustomers();
      setCustomers(list);
    } catch (err) {
      console.error("Failed to load customers:", err);
      showToast("Unable to load customers from local storage.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    try {
      const saved = localStorage.getItem("swiftgst_pos_store_settings");
      if (saved) {
        setStoreSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse store settings:", e);
    }
  }, []);

  // Filter Customers
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return customers.filter((c) => {
      if (showOutstandingOnly && c.creditBalance <= 0) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.gstin && c.gstin.toLowerCase().includes(q))
      );
    });
  }, [customers, searchQuery, showOutstandingOnly]);

  // CRM Summary KPIs
  const kpis = useMemo(() => {
    const totalCustomers = customers.length;
    const totalOutstanding = customers.reduce((sum, c) => sum + (c.creditBalance || 0), 0);
    const totalPoints = customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);
    const debtorsCount = customers.filter((c) => c.creditBalance > 0).length;
    return { totalCustomers, totalOutstanding, totalPoints, debtorsCount };
  }, [customers]);

  // Open Ledger & load entries
  async function openLedger(customer: Customer) {
    setSelectedCustomer(customer);
    setPaymentAmount(String(customer.creditBalance > 0 ? customer.creditBalance : ""));
    setSettlementNotes("Balance settlement");
    setIsLedgerLoading(true);
    try {
      const entries = await getLedgerByCustomerId(customer.id);
      setLedgerEntries(entries);
    } catch (err) {
      console.error("Failed to load ledger:", err);
      showToast("Error loading ledger records.");
    } finally {
      setIsLedgerLoading(false);
    }
  }

  // Record Payment / Settle Balance
  async function handleSettlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomer) return;

    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0) {
      showToast("Please enter a valid payment amount.");
      return;
    }

    try {
      await recordCustomerPayment(
        selectedCustomer.id,
        amt,
        settlementMode,
        settlementNotes || "Payment received"
      );

      // Refresh customer list & ledger
      await loadData();
      const updatedEntries = await getLedgerByCustomerId(selectedCustomer.id);
      setLedgerEntries(updatedEntries);

      // Update selected customer credit
      const updatedCust = {
        ...selectedCustomer,
        creditBalance: Math.max(0, selectedCustomer.creditBalance - amt),
      };
      setSelectedCustomer(updatedCust);
      setPaymentAmount("");
      showToast(`Recorded ₹${amt.toFixed(2)} payment for ${selectedCustomer.name}.`);
    } catch (err) {
      console.error("Failed to settle balance:", err);
      showToast("Payment recording error.");
    }
  }

  // Send WhatsApp Reminder
  function sendWhatsAppReminder(customer: Customer) {
    if (customer.creditBalance <= 0) {
      showToast(`${customer.name} has no outstanding balance.`);
      return;
    }

    let cleanPhone = customer.phone.replace(/[^\d]/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    const message = `Dear ${customer.name}, your outstanding balance at ${storeSettings.businessName} is ₹${customer.creditBalance.toFixed(
      2
    )}. Please clear via UPI: ${storeSettings.upiId}. Thank you!`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  // Modal Open Handlers
  function openAddModal() {
    setEditingCustomer(null);
    setFormData({
      name: "",
      phone: "",
      gstin: "",
      creditBalance: "0",
      loyaltyPoints: "0",
    });
    setIsAddModalOpen(true);
  }

  function openEditModal(c: Customer) {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      gstin: c.gstin || "",
      creditBalance: String(c.creditBalance || 0),
      loyaltyPoints: String(c.loyaltyPoints || 0),
    });
    setIsAddModalOpen(true);
  }

  // Save Customer Form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast("Customer Name and Phone are required.");
      return;
    }

    const toSave: Customer = {
      id: editingCustomer ? editingCustomer.id : "",
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      gstin: formData.gstin.trim() || undefined,
      creditBalance: parseFloat(formData.creditBalance) || 0,
      loyaltyPoints: parseInt(formData.loyaltyPoints, 10) || 0,
    };

    try {
      await saveCustomer(toSave);
      await loadData();
      setIsAddModalOpen(false);
      showToast(
        editingCustomer
          ? `Updated details for "${toSave.name}".`
          : `Added customer "${toSave.name}".`
      );
    } catch (err) {
      console.error("Save customer error:", err);
      showToast("Failed to save customer.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete customer "${name}" from your Khata records?`)) return;
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast(`Removed "${name}" from customer list.`);
    } catch (err) {
      console.error("Delete customer error:", err);
      showToast("Failed to delete customer.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* Toast Alert */}
      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-[1600px] px-4 py-4 md:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                  <Users className="h-4.5 w-4.5" />
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Customer Khata &amp; Loyalty CRM
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  Udhaar Register
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track customer credit balances, record bill payments, reward loyalty points, and send 1-click WhatsApp reminders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/pos"
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 active:scale-95 transition shadow-2xs"
              >
                <Store className="h-3.5 w-3.5" />
                <span>Open POS Counter</span>
              </Link>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* CRM Summary KPI Cards */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Total Market Outstanding */}
            <div className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 to-white p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                  Total Market Outstanding (Udhaar Due)
                </span>
                <span className="rounded-md bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.2">
                  {kpis.debtorsCount} {kpis.debtorsCount === 1 ? "Customer" : "Customers"}
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-red-700 tabular-nums font-mono">
                ₹{kpis.totalOutstanding.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Active Customers */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Registered Customers
              </span>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 tabular-nums font-sans">
                {kpis.totalCustomers}
              </p>
            </div>

            {/* Total Loyalty Points */}
            <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Loyalty Points in Circulation
                </span>
                <Coins className="h-4 w-4 text-teal-600" />
              </div>
              <p className="mt-1 text-2xl font-bold tracking-tight text-teal-900 tabular-nums font-mono">
                {kpis.totalPoints.toLocaleString("en-IN")} <span className="text-xs font-normal text-teal-700">(≈ ₹{kpis.totalPoints})</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Table Workspace */}
      <main className="mx-auto max-w-[1600px] px-4 pt-6">
        {/* Search & Filter Bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, or GSTIN..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-2xs"
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOutstandingOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition active:scale-95 shadow-2xs ${
                showOutstandingOnly
                  ? "border-red-300 bg-red-50 text-red-900 font-bold"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <IndianRupee className="h-3.5 w-3.5 text-red-500" />
              <span>With Outstanding Balance Only ({kpis.debtorsCount})</span>
            </button>
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-xs">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              <span>Loading customer records...</span>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">No customers found</h3>
              <p className="mt-1 text-xs text-slate-500">
                {searchQuery || showOutstandingOnly
                  ? "Try resetting your search query."
                  : "Add your first regular customer to start tracking Udhaar & Loyalty."}
              </p>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-800"
                >
                  + Add First Customer
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-3 py-3">Phone Number</th>
                    <th className="px-3 py-3">GSTIN</th>
                    <th className="px-4 py-3 text-right">Outstanding (Udhaar)</th>
                    <th className="px-4 py-3 text-center">Loyalty Points</th>
                    <th className="px-4 py-3 text-right">Khata &amp; Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((c) => {
                    const hasDue = c.creditBalance > 0;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        {/* Name */}
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {c.name}
                        </td>

                        {/* Phone */}
                        <td className="px-3 py-3 font-mono text-slate-600">
                          {c.phone}
                        </td>

                        {/* GSTIN */}
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                          {c.gstin || "—"}
                        </td>

                        {/* Outstanding Balance */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {hasDue ? (
                            <span className="inline-flex items-center rounded-lg bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-bold text-red-700 font-mono">
                              ₹{c.creditBalance.toFixed(2)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              Cleared ✓
                            </span>
                          )}
                        </td>

                        {/* Loyalty Points */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800 font-mono">
                            <Coins className="h-3 w-3 text-amber-600" />
                            <span>{c.loyaltyPoints || 0} pts</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Khata Ledger Button */}
                            <button
                              type="button"
                              onClick={() => openLedger(c)}
                              className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 hover:bg-teal-100 transition shadow-2xs active:scale-95"
                            >
                              <History className="h-3 w-3" />
                              <span>Khata Ledger</span>
                            </button>

                            {/* WhatsApp Reminder Button */}
                            {hasDue ? (
                              <button
                                type="button"
                                onClick={() => sendWhatsAppReminder(c)}
                                title="Send WhatsApp Payment Reminder"
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white transition shadow-2xs active:scale-95"
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span>Remind</span>
                              </button>
                            ) : null}

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => openEditModal(c)}
                              title="Edit customer details"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(c.id, c.name)}
                              title="Delete customer"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* KHATA LEDGER & SETTLEMENT MODAL */}
      {selectedCustomer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedCustomer.name}&apos;s Khata Ledger
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    ({selectedCustomer.phone})
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span>
                    Current Udhaar Due:{" "}
                    <strong
                      className={`font-mono ${
                        selectedCustomer.creditBalance > 0
                          ? "text-red-600"
                          : "text-emerald-700"
                      }`}
                    >
                      ₹{selectedCustomer.creditBalance.toFixed(2)}
                    </strong>
                  </span>
                  <span>·</span>
                  <span className="text-amber-800 font-semibold">
                    {selectedCustomer.loyaltyPoints} Loyalty Points
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Record Payment / Settle Balance Box */}
            <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-2 flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-teal-700" />
                <span>Record Payment / Settle Udhaar</span>
              </h4>

              <form onSubmit={handleSettlePayment} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Amount Received (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 font-mono font-bold text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mode
                  </label>
                  <select
                    value={settlementMode}
                    onChange={(e) => setSettlementMode(e.target.value as PaymentMode)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 font-semibold text-slate-900 focus:border-teal-600 focus:outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card / NetBanking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={settlementNotes}
                    onChange={(e) => setSettlementNotes(e.target.value)}
                    placeholder="e.g. GPay ref #1234"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </div>

            {/* Ledger Transactions History */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Transaction History
              </h4>

              <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {isLedgerLoading ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Loading transactions...
                  </div>
                ) : ledgerEntries.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No transactions recorded in this ledger yet.
                  </div>
                ) : (
                  ledgerEntries.map((entry) => {
                    const isSale = entry.type === "sale";
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                              isSale
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {isSale ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {isSale
                                ? `Bill #${entry.billNo || "POS"}`
                                : `Payment via ${(entry.paymentMode || "cash").toUpperCase()}`}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {new Date(entry.timestamp).toLocaleString("en-IN")} ·{" "}
                              {entry.notes || (isSale ? "Purchased on Khata" : "Payment received")}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`font-mono font-bold ${
                            isSale ? "text-red-600" : "text-emerald-700"
                          }`}
                        >
                          {isSale ? "+" : "-"}₹{entry.amount.toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
              {selectedCustomer.creditBalance > 0 ? (
                <button
                  type="button"
                  onClick={() => sendWhatsAppReminder(selectedCustomer)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs active:scale-95 transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Send WhatsApp Reminder</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold">
                  Zero Outstanding Balance ✓
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {isAddModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-700" />
                <span>{editingCustomer ? "Edit Customer" : "Add New Customer"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9810012345"
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="15-digit GSTIN if registered"
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono uppercase text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Opening Udhaar (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.creditBalance}
                    onChange={(e) => setFormData({ ...formData, creditBalance: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 p-2 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Loyalty Points
                  </label>
                  <input
                    type="number"
                    value={formData.loyaltyPoints}
                    onChange={(e) => setFormData({ ...formData, loyaltyPoints: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 p-2 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-1.5 font-bold text-white shadow-xs"
                >
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
