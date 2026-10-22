"use client";

import Link from "next/link";
import {
  Store,
  Package,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function RetailSuiteShowcase() {
  const suites = [
    {
      title: "Fast Retail POS Counter",
      href: "/pos",
      badge: "Instant Billing",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      icon: Store,
      accentColor: "teal",
      description:
        "High-speed barcode scanner checkout, ergonomic touch product tiles, multi-tender cash/UPI/split payment modes, and 58mm/80mm thermal roll receipt printing.",
      features: [
        "USB & Bluetooth Barcode Auto-Focus",
        "Cash, UPI, Card & Split Payments",
        "Instant 58mm / 80mm Thermal Receipt",
      ],
      ctaText: "Launch POS Counter",
    },
    {
      title: "Inventory & Stock Manager",
      href: "/inventory",
      badge: "Stock Control",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      icon: Package,
      accentColor: "blue",
      description:
        "Complete product master catalog with real-time stock levels, low-inventory alert badges, cost price vs selling price margin tracking, and bulk CSV catalog imports.",
      features: [
        "Live Low-Stock Alert Thresholds",
        "Bulk CSV / Excel Catalog Import",
        "GST 2.0 Slabs (0%, 5%, 18%, 40%)",
      ],
      ctaText: "Manage Inventory",
    },
    {
      title: "Customer Khata & CRM",
      href: "/customers",
      badge: "Udhaar Ledger",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: Users,
      accentColor: "amber",
      description:
        "Maintain customer accounts, track outstanding credit (Udhaar), record payment settlements, issue loyalty rewards, and send 1-click WhatsApp payment reminders.",
      features: [
        "Digital Udhaar Ledger & Settle Balances",
        "1-Click WhatsApp Payment Reminders",
        "Customer Loyalty Points Tracking",
      ],
      ctaText: "Open Customer Khata",
    },
    {
      title: "Profit Analytics & GSTR-1",
      href: "/analytics",
      badge: "CA Tax Ready",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: BarChart3,
      accentColor: "emerald",
      description:
        "Real-time financial pulse, live gross profit margin estimation (Sale Price - Cost Price), drawer cash reconciliation, top seller leaderboard, and GSTR-1 sales CSV export.",
      features: [
        "Live Gross Profit Margin Tracking",
        "Top 5 Selling Items Leaderboard",
        "CA-Compliant GSTR-1 Sales CSV",
      ],
      ctaText: "View Business Analytics",
    },
  ];

  return (
    <section className="w-full bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1850px] 2xl:max-w-[2100px] w-full relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/30 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>SWIFTGST FREE RETAIL ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Complete Retail POS, Stock &amp; Khata Suite
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Run your store with high-speed POS billing, automated stock tracking, customer credit ledgers,
            and real-time profit analytics — 100% free, completely private, zero monthly subscription fees.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-teal-400" />
              <span>Works Offline &amp; Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Private &amp; Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
              <span>CBIC GST &amp; GSTR-1 Compliant</span>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suites.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.href}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/80 p-6 shadow-xl backdrop-blur-xs transition hover:border-slate-700 hover:bg-slate-800/90 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-700/80 border border-slate-600 px-2.5 py-0.5 text-[11px] font-semibold text-teal-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {item.description}
                  </p>

                  <ul className="space-y-2 mb-6 text-xs text-slate-300">
                    {item.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-500 active:scale-95 shadow-md shadow-teal-900/30"
                >
                  <span>{item.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
