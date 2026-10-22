"use client";

import Link from "next/link";
import {
  FileText,
  Calculator,
  Search,
  ShieldCheck,
  Briefcase,
  Truck,
  Scale,
  FileCheck2,
  MapPin,
  Download,
  Scissors,
  Store,
  Sparkles,
  ArrowUpRight,
  ArrowUp,
  CheckCircle2,
  HelpCircle,
  Package,
  Users,
  BarChart3,
  Layers,
} from "lucide-react";

interface ToolItem {
  title: string;
  href: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
}

interface ToolCategory {
  category: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  tools: ToolItem[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    category: "SwiftGST PDF Utilities Suite",
    tagline: "Free in-browser PDF tools: Merge, Rotate, Delete pages, Convert images & Protect PDFs",
    icon: Layers,
    tools: [
      {
        title: "All PDF Utilities Suite",
        href: "/pdf-tools/",
        badge: "Free Tools",
        description:
          "Launch our suite of in-browser PDF utilities. Work with files directly in your browser without sending private documents anywhere.",
        icon: Sparkles,
      },
      {
        title: "Merge Multiple PDFs",
        href: "/pdf-tools/#merge",
        badge: "Drag & Drop",
        description:
          "Combine and reorder multiple PDF documents into a single consolidated file with interactive drag-and-drop.",
        icon: Layers,
      },
    ],
  },
  {
    category: "Tax Invoicing & Commercial Bills",
    tagline: "Instant, legally compliant billing formats for Indian registered and unregistered businesses",
    icon: FileText,
    tools: [
      {
        title: "GST Tax Invoice Generator",
        href: "/#top",
        badge: "Most Popular",
        featured: true,
        description:
          "Create complete tax invoices with automatic CGST, SGST, IGST calculations, UPI payment QR codes, and instant PDF download.",
        icon: FileText,
      },
      {
        title: "Estimate & Quotation Maker",
        href: "/quotation-maker",
        badge: "1-Click Convert",
        description:
          "Generate professional client proposals, price estimates, and proforma bills with terms of validity. Convert directly to tax invoice.",
        icon: FileCheck2,
      },
      {
        title: "Proforma Invoice Maker",
        href: "/quotation-maker",
        badge: "Advance Billing",
        description:
          "Issue pre-shipment commercial proforma invoices to collect advance payments or satisfy purchase order criteria.",
        icon: FileText,
      },
    ],
  },
  {
    category: "Retail POS, Stock & Khata Suite",
    tagline: "High-speed retail counter checkout, live stock alerts, customer credit ledgers, and profit pulse",
    icon: Store,
    tools: [
      {
        title: "POS Billing Counter",
        href: "/pos",
        badge: "Thermal 58/80mm",
        description:
          "Ergonomic retail checkout counter with barcode scanner support, instant payment modes, UPI QR, and thermal slip printing.",
        icon: Store,
      },
      {
        title: "Inventory & Stock Master",
        href: "/inventory",
        badge: "IndexedDB Local",
        description:
          "Manage products, cost/selling prices, low-stock warnings, barcode lookups, and bulk CSV catalog imports.",
        icon: Package,
      },
      {
        title: "Customer Khata & Loyalty CRM",
        href: "/customers",
        badge: "Udhaar & Points",
        description:
          "Track customer credit (Udhaar), record payment settlements, issue loyalty rewards, and send WhatsApp balance reminders.",
        icon: Users,
      },
      {
        title: "Business Analytics & GSTR-1",
        href: "/analytics",
        badge: "Real-Time Pulse",
        description:
          "Track daily sales, drawer cash, estimated gross profit margins, top selling items, and export GSTR-1 compliant CSV reports.",
        icon: BarChart3,
      },
    ],
  },
  {
    category: "Fast Financial Calculators",
    tagline: "Instant, error-free reverse and forward GST calculations with zero spreadsheet formulas",
    icon: Calculator,
    tools: [
      {
        title: "Inclusive / Exclusive GST Calculator",
        href: "/gst-calculator",
        badge: "Reverse Calc",
        description:
          "Extract base price and net tax from total gross amounts or add GST at the current 0%, 5%, 18% and 40% slabs with intra/inter-state breakdown.",
        icon: Calculator,
      },
      {
        title: "Freelance Hourly & Retainer Rate Calc",
        href: "/freelance-rate-calculator",
        badge: "Income Planner",
        description:
          "Calculate exactly what to charge per hour, day, or monthly retainer based on your target annual income, expenses, and billable days.",
        icon: Briefcase,
      },
      {
        title: "Composition Scheme vs Regular Calculator",
        href: "/composition-calculator",
        badge: "Section 10 Calc",
        description:
          "Compare flat 1% traders, 5% restaurant, or 6% service composition turnover tax against regular GST with Input Tax Credit (ITC).",
        icon: Scale,
      },
    ],
  },
  {
    category: "Compliance, Search & Official Directories",
    tagline: "CBIC-compliant reference directories, checksum validators, and transport limit checkers",
    icon: ShieldCheck,
    tools: [
      {
        title: "15-Digit GSTIN Validator & Checksum",
        href: "/gstin-validator",
        badge: "MOD 36 Check",
        description:
          "Verify any GST number against the official 15-character structure, extract State Code, PAN entity, and check digit validity.",
        icon: ShieldCheck,
      },
      {
        title: "HSN & SAC Code Directory",
        href: "/hsn-finder",
        badge: "Common Codes",
        description:
          "Search commonly used HSN and SAC codes with their GST 2.0 rates.",
        icon: Search,
      },
      {
        title: "Indian State Codes Directory",
        href: "/gst-state-codes",
        badge: "All 37 States",
        description:
          "Complete directory of all 37 Indian States and Union Territories with 2-digit GST state codes and 1-click clipboard copy.",
        icon: MapPin,
      },
      {
        title: "E-Way Bill Rule 138 Limit Checker",
        href: "/eway-bill-checker",
        badge: "Rule 138",
        description:
          "Verify mandatory E-Way Bill generation requirements for intra-state and inter-state goods consignments exceeding ₹50,000 or state limits.",
        icon: Truck,
      },
    ],
  },
  {
    category: "Pre-Configured Industry Solutions",
    tagline: "Tailored invoice templates with pre-loaded SAC/HSN codes and industry tax slabs",
    icon: Briefcase,
    tools: [
      {
        title: "Freelancer & IT Consultant Bill Maker",
        href: "/freelancer-invoice-generator",
        badge: "SAC 998314 Pre-Loaded",
        description:
          "Tailored for software developers, UI/UX designers, copywriters, and consultants with hourly rates, SAC 998314, and export LUT zero-tax support.",
        icon: Briefcase,
      },
      {
        title: "Boutique & Tailoring Invoice Maker",
        href: "/boutique-invoice-generator",
        badge: "Dual Apparel Slabs",
        description:
          "Configured for tailors, boutiques, and fashion designers with stitching SAC 998822 and current 5%/18% apparel GST slabs.",
        icon: Scissors,
      },
      {
        title: "Kirana & FMCG Grocery Bill Maker",
        href: "/kirana-store-bill-maker",
        badge: "0% / 5% FMCG Ready",
        description:
          "Fast retail cash memo generator pre-loaded with daily grocery essentials, unbranded foodgrains (0%), and packaged FMCG (5%).",
        icon: Store,
      },
    ],
  },
  {
    category: "Free Offline Templates & Downloads",
    tagline: "Ready-to-use spreadsheet and document bill templates for offline accounting",
    icon: Download,
    tools: [
      {
        title: "Excel, Word & PDF GST Invoice Templates",
        href: "/gst-invoice-templates",
        badge: "XLSX / DOCX / PDF",
        description:
          "Download customizable, auto-calculating Excel sheets, Microsoft Word documents, and print-ready PDF invoice formats for Indian SMBs.",
        icon: Download,
      },
    ],
  },
  {
    category: "Software Comparisons & POS Guides",
    tagline: "Save thousands of rupees every year with transparent, white-label alternatives to paid billing apps",
    icon: ShieldCheck,
    tools: [
      {
        title: "Vyapar Free Alternative (PC & Mobile)",
        href: "/vyapar-free-alternative",
        badge: "Zero Subscription",
        description:
          "Save ₹3,000-₹7,000/yr. Print thermal bills, manage stock, and scan barcodes with zero watermark and zero app download.",
        icon: Store,
      },
      {
        title: "Free Retail POS Software Guide",
        href: "/retail-pos-software",
        badge: "High-Speed Counter",
        description:
          "Fast retail point of sale counter with USB/Bluetooth barcode scanning, 58mm/80mm thermal receipts, and dynamic UPI QR.",
        icon: Store,
      },
      {
        title: "ClearTax Free Alternative",
        href: "/cleartax-free-alternative",
        badge: "No Phone Signup",
        description:
          "Generate GST tax bills with zero phone number required, zero spam sales calls, and instant A4 PDF export.",
        icon: ShieldCheck,
      },
      {
        title: "myBillBook Free Alternative",
        href: "/mybillbook-free-alternative",
        badge: "0 MB Install",
        description:
          "Browser-based GST billing without installing 100MB mobile apps, paying monthly plans, or getting locked out.",
        icon: FileText,
      },
    ],
  },
];

const TOTAL_TOOLS = TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.tools.length, 0);

export function ToolsHub() {
  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <section
      id="tools-hub"
      aria-label="Explore All Free Business & GST Utilities"
      className="w-full bg-slate-50 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 scroll-mt-14"
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3.5 py-1 text-xs font-semibold text-slate-700 mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>100% Free Indian Business &amp; Tax Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore All Free Business &amp; GST Utilities
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Create GST invoices, calculate reverse taxes, verify GSTIN checksums and stay compliant
            with CBIC rules — free, with no sign-up.
          </p>

          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {TOTAL_TOOLS} free tools
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              No sign-up or phone number
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              No watermarks on PDFs
            </span>
          </div>
        </div>

        {/* Category panels, packed into columns so uneven tool counts leave no gaps */}
        <div className="columns-1 md:columns-2 xl:columns-3 gap-5 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {TOOL_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div
                key={cat.category}
                className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-start gap-3 px-5 pt-5 pb-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                    <CatIcon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
                        {cat.category}
                      </h3>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 tabular-nums">
                        {cat.tools.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{cat.tagline}</p>
                  </div>
                </div>

                {/* Tool rows */}
                <ul className="border-t border-slate-100 divide-y divide-slate-100">
                  {cat.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <li key={tool.title}>
                        <Link
                          href={tool.href}
                          className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700">
                            <ToolIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <h4 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-teal-700">
                                {tool.title}
                              </h4>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${
                                  tool.featured
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {tool.badge}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-700" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Competitor Alternative Callout */}
        <div className="mt-5 rounded-2xl bg-slate-900 p-6 sm:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-teal-300" />
                <h3 className="text-base sm:text-lg font-bold">
                  Looking for a truly free alternative to paid billing software?
                </h3>
              </div>
              <p className="mt-1.5 text-sm text-slate-300">
                See how SwiftGST compares: private, no sales calls, no subscription.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/cleartax-free-alternative"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/20 transition"
              >
                <span>ClearTax Alternative</span>
                <ArrowUpRight className="h-4 w-4 text-slate-300" />
              </Link>
              <Link
                href="/mybillbook-free-alternative"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/20 transition"
              >
                <span>myBillBook Alternative</span>
                <ArrowUpRight className="h-4 w-4 text-slate-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-6">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            SwiftGST is built for Indian business owners, freelancers, and accountants. All calculations execute locally.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Back to Invoice Editor</span>
          </button>
        </div>
      </div>
    </section>
  );
}
