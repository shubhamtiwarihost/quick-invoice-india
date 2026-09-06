"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  User,
  Mail,
  Lock,
  Phone,
  Tag,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Zap,
  WifiOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const STORE_CATEGORIES = [
  { value: "kirana", label: "Kirana, Grocery & Daily FMCG" },
  { value: "apparel", label: "Apparel, Boutique & Footwear" },
  { value: "cafe", label: "Restaurant, Cafe & Food Counter" },
  { value: "electronics", label: "Electronics, Mobile & IT Services" },
  { value: "pharmacy", label: "Pharmacy & Medical Chemist" },
  { value: "hardware", label: "Hardware, Electrical & Sanitary" },
  { value: "salon", label: "Salon, Spa & Personal Care" },
  { value: "wholesale", label: "Wholesale & Distribution" },
  { value: "services", label: "Freelance & Professional Services" },
  { value: "retail", label: "General Retail Store" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [storeType, setStoreType] = useState("kirana");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cashierPin, setCashierPin] = useState("1234");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If already logged in, redirect to Dashboard
  if (user) {
    router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!businessName.trim()) {
      setErrorMsg("Please enter your Store or Business Name.");
      return;
    }
    if (!ownerName.trim()) {
      setErrorMsg("Please enter the Owner or Manager Name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth.php?action=register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: businessName.trim(),
          ownerName: ownerName.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          storeType,
          cashierPin: cashierPin.trim() || "1234",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to create store account.");
      }

      // Store session and redirect
      login(data.token, data.user);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please check your connection.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-slate-50 to-slate-100/80 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        {/* Onboarding Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-2xs">
            <Zap className="h-3.5 w-3.5 text-teal-600" />
            <span>Instant Store Onboarding &bull; Setup in 60s</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Your Free Store Account
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Launch high-speed POS billing, manage stock catalogs, and track customer Khata.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {errorMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store / Business Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Store or Business Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Sharma Kirana & General Store"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                />
              </div>
            </div>

            {/* Owner Name & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Owner / Manager <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rajesh Sharma"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Store Category
                </label>
                <div className="relative mt-1.5">
                  <Tag className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={storeType}
                    onChange={(e) => setStoreType(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-8 py-2.5 text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  >
                    {STORE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="store@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Cashier PIN Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mobile Number (Optional)
                </label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>Cashier Quick PIN</span>
                  <span className="text-[11px] font-normal text-slate-500 normal-case">4 Digits</span>
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="1234"
                    value={cashierPin}
                    onChange={(e) => setCashierPin(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 transition active:scale-[0.98] hover:bg-teal-800 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Store Account...</span>
                  </>
                ) : (
                  <>
                    <span>Start POS Billing Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Benefits Bullet Points */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>100% Free Retail POS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <WifiOff className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Full Offline Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>GST & Thermal Ready</span>
            </div>
          </div>
        </div>

        {/* Existing User Redirect */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Already have a store account?{" "}
          <Link
            href="/login"
            className="font-bold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Sign In to Store &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
