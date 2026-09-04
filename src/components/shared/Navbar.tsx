"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
} from "lucide-react";

export const ALL_TOOLS = [
  {
    href: "/",
    label: "Invoice Generator",
    shortLabel: "Invoice",
    desc: "Create GST compliant Tax Invoices, Bills of Supply, and export to PDF.",
    icon: FileText,
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
    desc: "Inclusive and exclusive GST breakdown for 5%, 12%, 18%, 28% slabs.",
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
];

export function Navbar() {
  const pathname = usePathname();
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

  const primaryLinks = ALL_TOOLS.slice(0, 3);
  const secondaryLinks = ALL_TOOLS.slice(3);

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-slate-900 select-none outline-none focus:outline-none focus:ring-0"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs select-none">
            <FileText className="h-4 w-4" />
          </span>
          <span className="text-base tracking-tight select-none">QuickInvoice India</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex text-xs font-medium">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 transition ${
                pathname === item.href
                  ? "bg-teal-700 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.shortLabel}
            </Link>
          ))}

          {/* More Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((prev) => !prev)}
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
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="space-y-1">
            {ALL_TOOLS.map((item) => {
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
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-slate-200 bg-white py-8 text-slate-600">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-slate-900 select-none outline-none focus:outline-none focus:ring-0"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 text-white select-none">
                <FileText className="h-3.5 w-3.5" />
              </span>
              <span className="select-none">QuickInvoice India</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% free, browser-based GST invoice generator and Indian tax utility tools. Zero sign-up required.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-700 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Private & Client-Side Secure</span>
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
                  GST Calculator (5%, 12%, 18%, 28%)
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
              Business Calculators
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/freelance-rate-calculator" className="hover:text-teal-700">
                  Freelance Hourly & Retainer Rate Calc
                </Link>
              </li>
              <li>
                <Link href="/eway-bill-checker" className="hover:text-teal-700">
                  E-Way Bill Threshold & Exemption Checker
                </Link>
              </li>
              <li>
                <Link href="/composition-calculator" className="hover:text-teal-700">
                  Composition vs Regular GST Scheme Calc
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Indian GST Standards
            </h4>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Designed according to CBIC GST invoice rules, Rule 138 E-Way Bill mandates, Section 10 Composition norms, and standard Indian currency notations.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} QuickInvoice India · Free open invoicing tool for Indian businesses, creators & freelancers.
        </div>
      </div>
    </footer>
  );
}
