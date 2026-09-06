"use client";

import { useState, useEffect } from "react";
import {
  Store,
  KeyRound,
  CheckCircle2,
  Lock,
  LogOut,
  Save,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function SettingsPage() {
  const { user, updateUser, lockScreen, logout } = useAuth();

  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [ownerName, setOwnerName] = useState(user?.ownerName || "");
  const [storeType, setStoreType] = useState(user?.storeType || "retail");
  const [phone, setPhone] = useState(user?.phone || "");
  const [cashierPin, setCashierPin] = useState(user?.cashierPin || "1234");

  // Receipt specific extra settings
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [upiId, setUpiId] = useState("");
  const [receiptFooter, setReceiptFooter] = useState("Thank you for your visit! Please come again.");

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || "");
      setOwnerName(user.ownerName || "");
      setStoreType(user.storeType || "retail");
      setPhone(user.phone || "");
      setCashierPin(user.cashierPin || "1234");
    }

    try {
      const stored = localStorage.getItem("swiftpos_store_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.gstin) setGstin(parsed.gstin);
        if (parsed.upiId) setUpiId(parsed.upiId);
        if (parsed.receiptFooter) setReceiptFooter(parsed.receiptFooter);
      }
    } catch {
      // Ignore
    }
  }, [user]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // 1. Update Auth User
    updateUser({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      storeType,
      phone: phone.trim(),
      cashierPin: cashierPin.trim() || "1234",
    });

    // 2. Save POS Store settings for thermal printing
    try {
      const posSettings = {
        businessName: businessName.trim() || "Swift Store",
        address: address.trim(),
        phone: phone.trim(),
        gstin: gstin.trim(),
        upiId: upiId.trim(),
        receiptFooter: receiptFooter.trim(),
      };
      localStorage.setItem("swiftpos_store_settings", JSON.stringify(posSettings));
      localStorage.setItem("swiftgst_pos_store_settings", JSON.stringify(posSettings));
    } catch {
      // Ignore
    }

    setToast("Store settings & Cashier PIN updated successfully!");
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-100/90 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-teal-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          Store Settings &amp; Cashier PINs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure business details, thermal slip branding, and POS cashier locks
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Store & Identity */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="h-4 w-4 text-teal-700" />
            <span>Store Profile &amp; Manager</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Store or Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Owner / Primary Cashier Name
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Store Category
              </label>
              <select
                value={storeType}
                onChange={(e) => setStoreType(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              >
                <option value="kirana">Kirana, Grocery &amp; FMCG</option>
                <option value="apparel">Apparel &amp; Boutique</option>
                <option value="cafe">Restaurant &amp; Cafe</option>
                <option value="electronics">Electronics &amp; Repair</option>
                <option value="pharmacy">Pharmacy &amp; Chemist</option>
                <option value="hardware">Hardware &amp; Electrical</option>
                <option value="retail">General Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Cashier Quick-PIN */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-600" />
              <span>Cashier Quick-PIN Lock</span>
            </h2>
            <button
              type="button"
              onClick={lockScreen}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>Test Lock Screen</span>
            </button>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              4-Digit Cashier PIN (Default: 1234)
            </label>
            <input
              type="text"
              maxLength={4}
              pattern="[0-9]{4}"
              value={cashierPin}
              onChange={(e) => setCashierPin(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-base tracking-widest text-slate-900 font-bold focus:bg-white focus:border-teal-600 focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-slate-500 leading-tight">
              Cashiers use this PIN on the counter to lock and resume billing without sharing passwords.
            </p>
          </div>
        </div>

        {/* Card 3: POS Thermal Slip Branding */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Receipt className="h-4 w-4 text-teal-700" />
            <span>Thermal Roll Receipt Branding (58mm / 80mm)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shop Address (Printed on Slip)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No. 12, Main Market, City - 110001"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27AAAAA0000A1Z5"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                UPI ID (For Dynamic QR Code on Bill)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="merchant@okhdfcbank"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Receipt Footer Message
              </label>
              <input
                type="text"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-700 px-7 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Store Settings</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </form>
    </div>
  );
}
