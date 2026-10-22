"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FileText,
  Calculator,
  Search,
  ShieldCheck,
  Briefcase,
  Truck,
  Scale,
  ChevronDown,
  Menu,
  X,
  FileCheck2,
  MapPin,
  Download,
  Scissors,
  Store,
  LayoutGrid,
  Package,
  Users,
  BarChart3,
  Lock,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export const ALL_TOOLS = [
  {
    href: "/",
    label: "Invoice Generator",
    shortLabel: "Invoice",
    desc: "Create GST compliant Tax Invoices, Bills of Supply, and export to PDF.",
    icon: FileText,
  },
  {
    href: "/pdf-tools/",
    label: "PDF Tools Suite",
    shortLabel: "PDF Tools",
    desc: "Free, private PDF suite: Merge, Rotate, Delete pages, Convert images & Protect.",
    icon: Sparkles,
  },
  {
    href: "/pos",
    label: "POS Billing Counter",
    shortLabel: "POS Counter",
    desc: "Fast retail checkout, barcode scan, thermal roll receipts, and UPI QR.",
    icon: Store,
  },
  {
    href: "/inventory",
    label: "Inventory & Stock Master",
    shortLabel: "Inventory",
    desc: "Manage product stock, barcodes, low-stock alerts, and CSV catalogs.",
    icon: Package,
  },
  {
    href: "/customers",
    label: "Customer Khata & Loyalty CRM",
    shortLabel: "Khata CRM",
    desc: "Customer credit ledger, Udhaar tracking, loyalty points, and WhatsApp reminders.",
    icon: Users,
  },
  {
    href: "/analytics",
    label: "Business Analytics & GSTR-1",
    shortLabel: "Analytics",
    desc: "Sales pulse, profit margin tracking, top sellers, and CA tax reports.",
    icon: BarChart3,
  },
  {
    href: "/quotation-maker",
    label: "Estimate & Quotation Maker",
    shortLabel: "Quotation",
    desc: "Create formal price quotes with validity dates; convert to invoice in 1 click.",
    icon: FileCheck2,
  },
  {
    href: "/gst-calculator",
    label: "GST Calculator",
    shortLabel: "GST Calc",
    desc: "Inclusive and exclusive GST breakdown for the 5%, 18% and 40% GST 2.0 slabs.",
    icon: Calculator,
  },
  {
    href: "/gst-state-codes",
    label: "GST State Codes Directory",
    shortLabel: "State Codes",
    desc: "Directory of all 37 Indian States & UTs with 2-digit GST codes and 1-click copy.",
    icon: MapPin,
  },
  {
    href: "/hsn-finder",
    label: "HSN / SAC Finder",
    shortLabel: "HSN / SAC",
    desc: "Search 4 to 8 digit HSN/SAC codes and official GST tax rates.",
    icon: Search,
  },
  {
    href: "/gstin-validator",
    label: "GSTIN Validator",
    shortLabel: "GSTIN Check",
    desc: "Verify 15-digit GSTIN format, state code, PAN entity, and MOD 36 checksum.",
    icon: ShieldCheck,
  },
  {
    href: "/freelance-rate-calculator",
    label: "Freelance Rate Calc",
    shortLabel: "Freelance Rate",
    desc: "Calculate hourly rate, daily retainer, and project costs based on income target.",
    icon: Briefcase,
  },
  {
    href: "/eway-bill-checker",
    label: "E-Way Bill Checker",
    shortLabel: "E-Way Bill",
    desc: "Check intra-state and inter-state E-Way Bill value thresholds under Rule 138.",
    icon: Truck,
  },
  {
    href: "/composition-calculator",
    label: "Composition Scheme Calc",
    shortLabel: "Composition Calc",
    desc: "Compare flat 1%/5%/6% composition scheme against regular GST with ITC.",
    icon: Scale,
  },
  {
    href: "/gst-invoice-templates",
    label: "Invoice Templates Hub",
    shortLabel: "Templates",
    desc: "Download free Excel, Word, and PDF GST bill formats ready to edit.",
    icon: Download,
  },
  {
    href: "/freelancer-invoice-generator",
    label: "Freelancer Invoice Maker",
    shortLabel: "Freelancer",
    desc: "Pre-loaded with SAC 998314, hourly rates, and LUT export support.",
    icon: Briefcase,
  },
  {
    href: "/boutique-invoice-generator",
    label: "Boutique & Tailoring Bill",
    shortLabel: "Boutique",
    desc: "Stitching SAC 998822 and 5%/18% apparel GST slabs.",
    icon: Scissors,
  },
  {
    href: "/kirana-store-bill-maker",
    label: "Kirana Store Bill Maker",
    shortLabel: "Kirana Bill",
    desc: "Retail grocery cash memos with 0% and 5% daily FMCG staples.",
    icon: Store,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, lockScreen, logout } = useAuth();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function closeAllMenus() {
    setToolsOpen(false);
    setMobileMenuOpen(false);
  }

  const primaryLinks = [
    { href: "/", label: "Invoice Generator", shortLabel: "Invoice" },
    { href: "/quotation-maker", label: "Estimate & Quotation Maker", shortLabel: "Quotation" },
    { href: "/gst-calculator", label: "GST Calculator", shortLabel: "GST Calc" },
  ];

  const secondaryLinks = ALL_TOOLS.filter(
    (t) =>
      t.href !== "/" &&
      t.href !== "/quotation-maker" &&
      t.href !== "/gst-calculator" &&
      t.href !== "/pos" &&
      t.href !== "/inventory" &&
      t.href !== "/customers" &&
      t.href !== "/analytics"
  );

  return (
    <header className="no-print sticky top-0 z-30 min-h-[57px] border-b border-slate-200 bg-white/95 backdrop-blur-md will-change-transform transform-gpu">
      <div className="mx-auto flex max-w-[1850px] 2xl:max-w-[2100px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Logo & Trust Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900 select-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none active:ring-0 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="SwiftGST Logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 object-contain select-none"
            />
            <span className="text-base tracking-tight font-extrabold select-none">Swift<span className="text-indigo-600">GST</span></span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Free &amp; Private
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex text-xs font-medium">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 transition ${
                pathname === item.href
                  ? "bg-slate-900 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.shortLabel}
            </Link>
          ))}

          {/* Dedicated PDF Tools Button */}
          <Link
            href="/pdf-tools/"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 transition font-bold border border-indigo-200 shadow-2xs"
            title="Open Free PDF Suite (Merge, Rotate, Convert & Protect)"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>PDF Tools</span>
            <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
              8 Tools
            </span>
          </Link>

          {/* More Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((prev) => !prev)}
              aria-label="More Tools"
              aria-expanded={toolsOpen}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 transition ${
                toolsOpen || secondaryLinks.some((l) => l.href === pathname)
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>More Tools</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  toolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {toolsOpen ? (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  GST & Freelance Utilities
                </div>
                <div className="space-y-1">
                  {secondaryLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAllMenus}
                        className={`flex items-start gap-2.5 rounded-xl p-2.5 transition ${
                          isActive
                            ? "bg-teal-50 text-teal-900 font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                              ? "bg-teal-700 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-none text-slate-900">
                            {item.label}
                          </p>
                          <p className="mt-1 text-[11px] font-normal leading-snug text-slate-500 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <Link
            href="/about-us"
            className={`rounded-xl px-3 py-2 transition ${
              pathname === "/about-us" || pathname === "/about"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className={`rounded-xl px-3 py-2 transition ${
              pathname === "/contact-us" || pathname === "/contact"
                ? "bg-teal-700 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Contact
          </Link>

          {/* User / Store Auth Status & Quick-Lock */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-teal-50 border border-teal-200/80 px-2.5 py-1.5 text-xs text-teal-900 font-semibold max-w-[160px] hover:bg-teal-100 transition"
                title={`${user.businessName} - Open Back-Office`}
              >
                <Store className="h-3.5 w-3.5 text-teal-700 shrink-0" />
                <span className="truncate">{user.businessName}</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 transition"
              >
                <span>Back-Office</span>
              </Link>

              <button
                type="button"
                onClick={lockScreen}
                title="Lock POS Counter (PIN Required to Unlock)"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
              >
                <Lock className="h-3 w-3 text-amber-600" />
                <span>Lock</span>
              </button>

              <button
                type="button"
                onClick={logout}
                title="Log out from store"
                className="inline-flex items-center gap-1 rounded-xl border border-rose-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition shadow-2xs"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                title="Includes Stock Inventory & POS"
                className="inline-flex flex-col items-center justify-center rounded-xl bg-emerald-600 px-3.5 py-1.5 text-center text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition whitespace-nowrap"
              >
                <span className="text-xs font-bold leading-tight">Start Free Billing &amp; Khata</span>
                <span className="hidden xl:inline text-[9px] font-medium text-emerald-100/90 leading-none mt-0.5">
                  Includes Stock Inventory &amp; POS
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Header Right Actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          {user && (
            <button
              type="button"
              onClick={lockScreen}
              title="Lock POS Counter"
              aria-label="Lock POS Counter"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-100 shadow-2xs active:scale-95 transition"
            >
              <Lock className="h-4 w-4 text-amber-600" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 active:scale-95 transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          {/* User Account / Auth Bar Mobile */}
          {user ? (
            <div className="mb-3 rounded-2xl border border-teal-200 bg-teal-50/80 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-[180px]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white font-bold text-xs">
                    <Store className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.businessName}</p>
                    <p className="text-[11px] text-teal-800 font-medium truncate">{user.ownerName || "Cashier"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      lockScreen();
                    }}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                  >
                    <Lock className="h-3 w-3 text-amber-600" />
                    <span>Lock</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      logout();
                    }}
                    className="flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-2xs hover:bg-rose-50"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3 flex items-center gap-2">
              <Link
                href="/login"
                onClick={closeAllMenus}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeAllMenus}
                title="Includes Stock Inventory & POS"
                className="flex-1 rounded-xl bg-emerald-600 py-2 px-2 text-center text-white shadow-2xs hover:bg-emerald-700 flex flex-col items-center justify-center"
              >
                <span className="text-xs font-bold leading-tight">Start Free Billing &amp; Khata</span>
                <span className="text-[9px] font-medium text-emerald-100/90 leading-none mt-0.5">
                  Includes Stock &amp; POS
                </span>
              </Link>
            </div>
          )}

          {/* Featured Tools Hub Link */}
          <Link
            href="/#tools-hub"
            onClick={(e) => {
              closeAllMenus();
              if (pathname === "/") {
                e.preventDefault();
                const el = document.getElementById("tools-hub");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            className="flex items-center justify-between rounded-xl bg-teal-50 border border-teal-200/80 p-3 text-xs font-bold text-teal-900 mb-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 text-white">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <span>Explore All Tools &amp; Utilities Hub</span>
            </div>
            <span className="text-[10px] rounded-full bg-teal-100 text-teal-800 px-2 py-0.5 font-semibold">13+ Tools</span>
          </Link>

          {/* Primary Public Tools on Mobile */}
          <div className="space-y-1 mb-2">
            <Link
              href="/"
              onClick={closeAllMenus}
              className={`flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold ${
                pathname === "/"
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileText className="h-4 w-4 text-teal-700" />
              <span>Invoice Generator</span>
            </Link>
            <Link
              href="/quotation-maker"
              onClick={closeAllMenus}
              className={`flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold ${
                pathname === "/quotation-maker"
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileCheck2 className="h-4 w-4 text-teal-700" />
              <span>Estimate &amp; Quotation Maker</span>
            </Link>
            <Link
              href="/gst-calculator"
              onClick={closeAllMenus}
              className={`flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold ${
                pathname === "/gst-calculator"
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Calculator className="h-4 w-4 text-teal-700" />
              <span>GST Calculator</span>
            </Link>
            <Link
              href="/pdf-tools/"
              onClick={closeAllMenus}
              className="flex items-center justify-between rounded-xl p-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>PDF Tools Suite</span>
              </div>
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] text-white">8 Tools</span>
            </Link>
          </div>

          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            More GST &amp; Business Utilities
          </div>
          <div className="space-y-1">
            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAllMenus}
                  className={`flex items-center gap-3 rounded-xl p-2.5 text-xs ${
                    isActive
                      ? "bg-teal-700 font-semibold text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-teal-700"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3 grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/about-us"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium active:scale-98 transition"
            >
              About SwiftGST
            </Link>
            <Link
              href="/contact-us"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium active:scale-98 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy-policy"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium active:scale-98 transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium active:scale-98 transition"
            >
              Terms of Service
            </Link>
            <Link
              href="/disclaimer"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium active:scale-98 transition"
            >
              Legal Disclaimer
            </Link>
            <a
              href="https://www.instagram.com/swiftgst.in/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-pink-600 hover:bg-pink-50 font-semibold gap-1.5 active:scale-98 transition"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/people/Swiftgstin/61594169346217/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAllMenus}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-blue-600 hover:bg-blue-50 font-semibold gap-1.5 active:scale-98 transition col-span-2 sm:col-span-1"
            >
              <FacebookIcon className="h-4 w-4" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-slate-200 bg-white py-8 text-slate-600">
      <div className="mx-auto max-w-[1850px] 2xl:max-w-[2100px] w-full px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-slate-900 select-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none active:ring-0 shrink-0"
            >
              <Image
                src="/logo.png"
                alt="SwiftGST Logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain select-none"
              />
              <span className="select-none">SwiftGST</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% free, browser-based GST invoice generator and Indian tax utility tools. Zero sign-up required.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-700 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Safe, Private &amp; Secure</span>
            </div>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <a
                href="https://www.instagram.com/swiftgst.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50/70 px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100 hover:border-pink-300 hover:text-pink-800 transition shadow-2xs group"
                title="Follow SwiftGST on Instagram @swiftgst.in"
              >
                <InstagramIcon className="h-3.5 w-3.5 text-pink-600 transition-transform group-hover:scale-110" />
                <span>Follow @swiftgst.in</span>
              </a>
              <a
                href="https://www.facebook.com/people/Swiftgstin/61594169346217/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 transition shadow-2xs group"
                title="Follow SwiftGST on Facebook"
              >
                <FacebookIcon className="h-3.5 w-3.5 text-blue-600 transition-transform group-hover:scale-110" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Tools Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Invoicing & Taxes
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-teal-700">
                  GST Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/gst-invoice-templates" className="hover:text-teal-700 font-semibold text-teal-800">
                  GST Invoice Templates (Excel/Word/PDF)
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-teal-700 font-semibold text-teal-800">
                  Inventory &amp; Stock Master
                </Link>
              </li>
              <li>
                <Link href="/pos" className="hover:text-teal-700 font-semibold text-teal-800">
                  POS Billing Counter (58mm/80mm)
                </Link>
              </li>
              <li>
                <Link href="/customers" className="hover:text-teal-700 font-semibold text-teal-800">
                  Customer Khata &amp; Loyalty CRM
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-teal-700 font-semibold text-teal-800">
                  Business Analytics &amp; GSTR-1 Report
                </Link>
              </li>
              <li>
                <Link href="/quotation-maker" className="hover:text-teal-700 font-medium text-slate-700">
                  Estimate & Quotation Maker
                </Link>
              </li>
              <li>
                <Link href="/gst-state-codes" className="hover:text-teal-700 font-medium text-slate-700">
                  GST State Codes Directory
                </Link>
              </li>
              <li>
                <Link href="/gst-calculator" className="hover:text-teal-700">
                  GST Calculator (5%, 18%, 40%)
                </Link>
              </li>
              <li>
                <Link href="/hsn-finder" className="hover:text-teal-700">
                  HSN / SAC Code Directory
                </Link>
              </li>
              <li>
                <Link href="/gstin-validator" className="hover:text-teal-700">
                  GSTIN Validator & MOD 36 Check
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Industry Bill Generators
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/freelancer-invoice-generator" className="hover:text-teal-700 font-medium text-slate-700">
                  Freelancer & Consultant Bill Maker
                </Link>
              </li>
              <li>
                <Link href="/boutique-invoice-generator" className="hover:text-teal-700 font-medium text-slate-700">
                  Boutique & Tailoring GST Invoice
                </Link>
              </li>
              <li>
                <Link href="/kirana-store-bill-maker" className="hover:text-teal-700 font-medium text-slate-700">
                  Kirana Store & FMCG Cash Memo
                </Link>
              </li>
              <li className="pt-1 border-t border-slate-100">
                <Link href="/freelance-rate-calculator" className="hover:text-teal-700">
                  Freelance Hourly & Retainer Rate Calc
                </Link>
              </li>
              <li>
                <Link href="/eway-bill-checker" className="hover:text-teal-700">
                  E-Way Bill Threshold Checker
                </Link>
              </li>
              <li>
                <Link href="/composition-calculator" className="hover:text-teal-700">
                  Composition Scheme vs Regular Calc
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company &amp; Legal
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/about-us" className="hover:text-teal-700">
                  About SwiftGST
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-teal-700">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-teal-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-teal-700">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-teal-700">
                  Legal Disclaimer
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-100">
                <Link href="/vyapar-free-alternative" className="hover:text-teal-700 font-semibold text-teal-800">
                  Vyapar Free Alternative (PC &amp; Mobile)
                </Link>
              </li>
              <li>
                <Link href="/cleartax-free-alternative" className="hover:text-teal-700 font-medium text-slate-700">
                  ClearTax Free Alternative
                </Link>
              </li>
              <li>
                <Link href="/mybillbook-free-alternative" className="hover:text-teal-700 font-medium text-slate-700">
                  myBillBook Free Alternative
                </Link>
              </li>
              <li>
                <Link href="/retail-pos-software" className="hover:text-teal-700 font-medium text-slate-700">
                  Retail POS Billing Software
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
              Designed in compliance with CBIC GST rules, Rule 138 E-Way thresholds &amp; Section 10 norms.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} SwiftGST · Free open invoicing tool for Indian businesses, creators &amp; freelancers.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <a
              href="https://www.instagram.com/swiftgst.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-semibold transition"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/people/Swiftgstin/61594169346217/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
              <span>Facebook</span>
            </a>
            <Link href="/about-us" className="hover:text-teal-700">
              About
            </Link>
            <Link href="/contact-us" className="hover:text-teal-700">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-teal-700">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-teal-700">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-teal-700">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
