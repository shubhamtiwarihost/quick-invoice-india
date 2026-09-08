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
  badgeColor?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
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
    tagline: "Free in-browser PDF tools: Merge, Split, Rotate, Delete pages, Convert images & Protect PDFs",
    icon: Scissors,
    tools: [
      {
        title: "All 8 PDF Utilities Suite",
        href: "/pdf-tools/",
        badge: "8 Free Tools",
        badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
        description:
          "Launch our full suite of 8 PDF utilities. Work with files directly in your browser without sending private documents anywhere.",
        icon: Sparkles,
        features: ["Merge & Split PDFs", "Images to PDF / PDF to Img", "Watermark & AES Protect"],
      },
      {
        title: "Merge Multiple PDFs",
        href: "/pdf-tools/#merge",
        badge: "Drag & Drop",
        badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
        description:
          "Combine and reorder multiple PDF documents into a single consolidated file with interactive drag-and-drop.",
        icon: Layers,
        features: ["Drag & Drop Order", "Unlimited Files", "Preserves Bookmarks"],
      },
      {
        title: "Split / Extract PDF Pages",
        href: "/pdf-tools/#split",
        badge: "Visual Picker",
        badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
        description:
          "Select individual page thumbnails or type custom page ranges (e.g. 1-5, 8) to extract cleanly into a new PDF.",
        icon: Scissors,
        features: ["Thumbnail Selector", "Custom Page Ranges", "Lossless Export"],
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
        badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
        description:
          "Create complete tax invoices with automatic CGST, SGST, IGST calculations, UPI payment QR codes, and instant PDF download.",
        icon: FileText,
        features: ["Auto State Tax Splitting", "Dynamic UPI QR", "GSTR-1 Sales CSV"],
      },
      {
        title: "Estimate & Quotation Maker",
        href: "/quotation-maker",
        badge: "1-Click Convert",
        badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
        description:
          "Generate professional client proposals, price estimates, and proforma bills with terms of validity. Convert directly to tax invoice.",
        icon: FileCheck2,
        features: ["Validity Terms", "Client Acceptance", "1-Click Convert to Bill"],
      },
      {
        title: "Proforma Invoice Maker",
        href: "/quotation-maker",
        badge: "Advance Billing",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        description:
          "Issue pre-shipment commercial proforma invoices to collect advance payments or satisfy purchase order criteria.",
        icon: FileText,
        features: ["Advance Payment QR", "Custom Terms", "Proforma Format"],
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
        badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
        description:
          "Ergonomic retail checkout counter with barcode scanner support, instant payment modes, UPI QR, and thermal slip printing.",
        icon: Store,
        features: ["Barcode Scanner Ready", "Cash Drawer / Split Pay", "Thermal Print"],
      },
      {
        title: "Inventory & Stock Master",
        href: "/inventory",
        badge: "IndexedDB Local",
        badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
        description:
          "Manage products, cost/selling prices, low-stock warnings, barcode lookups, and bulk CSV catalog imports.",
        icon: Package,
        features: ["Low-Stock Badges", "Bulk CSV Import/Export", "Inline Stock Adjust"],
      },
      {
        title: "Customer Khata & Loyalty CRM",
        href: "/customers",
        badge: "Udhaar & Points",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        description:
          "Track customer credit (Udhaar), record payment settlements, issue loyalty rewards, and send WhatsApp balance reminders.",
        icon: Users,
        features: ["Khata Balance Ledger", "1-Click WhatsApp Reminder", "Loyalty Points"],
      },
      {
        title: "Business Analytics & GSTR-1",
        href: "/analytics",
        badge: "Real-Time Pulse",
        badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        description:
          "Track daily sales, drawer cash, estimated gross profit margins, top selling items, and export GSTR-1 compliant CSV reports.",
        icon: BarChart3,
        features: ["Gross Profit Estimation", "Top 5 Movers Leaderboard", "GSTR-1 Tax CSV"],
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
        badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        description:
          "Extract base price and net tax from total gross amounts or add 5%, 12%, 18%, 28% GST with intra/inter-state breakdown.",
        icon: Calculator,
        features: ["Reverse GST Extraction", "CGST/SGST/IGST Split", "All Slabs Supported"],
      },
      {
        title: "Freelance Hourly & Retainer Rate Calc",
        href: "/freelance-rate-calculator",
        badge: "Income Planner",
        badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
        description:
          "Calculate exactly what to charge per hour, day, or monthly retainer based on your target annual income, expenses, and billable days.",
        icon: Briefcase,
        features: ["Non-Billable Buffer", "Overheads Factored", "Retainer Pricing"],
      },
      {
        title: "Composition Scheme vs Regular Calculator",
        href: "/composition-calculator",
        badge: "Section 10 Calc",
        badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
        description:
          "Compare flat 1% traders, 5% restaurant, or 6% service composition turnover tax against regular GST with Input Tax Credit (ITC).",
        icon: Scale,
        features: ["Turnover Tax Comparison", "ITC Benefit Analysis", "Threshold Checker"],
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
        badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
        description:
          "Verify any GST number against the official 15-character structure, extract State Code, PAN entity, and check digit validity.",
        icon: ShieldCheck,
        features: ["MOD 36 Checksum", "State & PAN Extraction", "Entity Type Detector"],
      },
      {
        title: "HSN & SAC Code Directory",
        href: "/hsn-finder",
        badge: "10,000+ Codes",
        badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
        description:
          "Search 4 to 8 digit Harmonized System Nomenclature (HSN) and Service Accounting Codes (SAC) with standard GST rates.",
        icon: Search,
        features: ["Fast Keyword Search", "Goods & Services Rates", "Official CBIC Slabs"],
      },
      {
        title: "Indian State Codes Directory",
        href: "/gst-state-codes",
        badge: "All 37 States",
        badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
        description:
          "Complete directory of all 37 Indian States and Union Territories with 2-digit GST state codes and 1-click clipboard copy.",
        icon: MapPin,
        features: ["2-Digit GST Prefixes", "1-Click Copy", "Union Territory Tags"],
      },
      {
        title: "E-Way Bill Rule 138 Limit Checker",
        href: "/eway-bill-checker",
        badge: "Rule 138",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        description:
          "Verify mandatory E-Way Bill generation requirements for intra-state and inter-state goods consignments exceeding ₹50,000 or state limits.",
        icon: Truck,
        features: ["State-Specific Limits", "Exempt Goods Rules", "Consignment Checker"],
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
        badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        description:
          "Tailored for software developers, UI/UX designers, copywriters, and consultants with hourly rates, SAC 998314, and export LUT zero-tax support.",
        icon: Briefcase,
        features: ["Hourly/Project Billing", "Export LUT Zero Tax", "UPI QR Ready"],
      },
      {
        title: "Boutique & Tailoring Invoice Maker",
        href: "/boutique-invoice-generator",
        badge: "Dual Apparel Slabs",
        badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
        description:
          "Configured for tailors, boutiques, and fashion designers with stitching SAC 998822 and standard 5%/12% apparel GST slabs.",
        icon: Scissors,
        features: ["Stitching Labor SAC", "Fabric Supply Lines", "Dual 5%/12% Slabs"],
      },
      {
        title: "Kirana & FMCG Grocery Bill Maker",
        href: "/kirana-store-bill-maker",
        badge: "0% / 5% FMCG Ready",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        description:
          "Fast retail cash memo generator pre-loaded with daily grocery essentials, unbranded foodgrains (0%), and packaged FMCG (5%).",
        icon: Store,
        features: ["Daily Grocery Staples", "0% Non-Taxable Lines", "Compact Thermal/A4"],
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
        badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
        description:
          "Download customizable, auto-calculating Excel sheets, Microsoft Word documents, and print-ready PDF invoice formats for Indian SMBs.",
        icon: Download,
        features: ["Pre-built Excel Formulas", "Clean Word Layouts", "Zero Watermark"],
      },
    ],
  },
];

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
      className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 scroll-mt-14"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>100% Free Indian Business &amp; Tax Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore All Free Business &amp; GST Utilities
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to create GST invoices, calculate reverse taxes, verify GSTIN checksums,
            and stay fully compliant with CBIC regulations — all client-side, zero sign-up, and zero tracking.
          </p>

          {/* Quick Stats Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              13+ Free Business Tools
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Zero Sign-up or Phone Required
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              No Watermarks on PDF
            </span>
          </div>
        </div>

        {/* Categorized Tools Sections */}
        <div className="space-y-12">
          {TOOL_CATEGORIES.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <div key={idx} className="space-y-4">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-700 text-white shadow-xs">
                      <CatIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {cat.category}
                      </h3>
                      <p className="text-xs text-slate-500 hidden sm:block">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {cat.tools.length} {cat.tools.length === 1 ? "utility" : "utilities"}
                  </span>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.tools.map((tool, tIdx) => {
                    const ToolIcon = tool.icon;
                    return (
                      <Link
                        key={tIdx}
                        href={tool.href}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                      >
                        <div>
                          {/* Card Top: Icon & Badge */}
                          <div className="flex items-start justify-between gap-2 mb-3.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition shadow-2xs">
                              <ToolIcon className="h-5 w-5" />
                            </div>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                tool.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {tool.badge}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                            {tool.title}
                          </h4>
                          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                            {tool.description}
                          </p>

                          {/* Micro Feature Tags */}
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {tool.features.map((f, fIdx) => (
                              <span
                                key={fIdx}
                                className="inline-flex items-center rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card CTA Footer */}
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                          <span>Open Tool</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Competitor Alternative Callout Grid */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Looking for a truly free alternative to paid billing software?
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Compare how SwiftGST delivers 100% private, zero-telecall invoicing compared to legacy services:
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/cleartax-free-alternative"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 transition"
              >
                <span>ClearTax Alternative</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/mybillbook-free-alternative"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 transition"
              >
                <span>myBillBook Alternative</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Top Floating Trigger */}
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
