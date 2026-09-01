"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

const LINKS = [
  { href: "/", label: "Invoice" },
  { href: "/gst-calculator", label: "GST calculator" },
  { href: "/hsn-finder", label: "HSN / SAC" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
            <FileText className="h-4 w-4" />
          </span>
          QuickInvoice India
        </Link>
        <nav className="flex gap-1 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 ${
                pathname === l.href
                  ? "bg-teal-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
      Built for Indian GST invoices · Drafts save automatically in this browser
    </footer>
  );
}
