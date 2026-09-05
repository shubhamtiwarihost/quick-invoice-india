"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Package, Users, BarChart3 } from "lucide-react";

interface NavTab {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: NavTab[] = [
  {
    label: "Counter",
    href: "/pos",
    icon: Store,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    label: "Khata",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Reports",
    href: "/analytics",
    icon: BarChart3,
  },
];

export function NativeBottomNav() {
  const pathname = usePathname();

  // On the home invoice maker, InvoiceWorkspace renders its own custom MobileBottomNav
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <div className="h-16 md:hidden pointer-events-none no-print" aria-hidden="true" />
      <nav
        aria-label="Native Mobile Navigation"
        className="no-print fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-md px-2 py-1 pb-[calc(env(safe-area-inset-bottom)+6px)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none"
      >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 touch-manipulation ${
                isActive
                  ? "text-emerald-700 font-bold"
                  : "text-slate-500 hover:text-slate-900 active:text-slate-800"
              }`}
            >
              <div
                className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-emerald-100 text-emerald-800 shadow-2xs" : "text-slate-500"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              </div>
              <span
                className={`mt-0.5 text-[11px] tracking-tight ${
                  isActive ? "font-bold text-emerald-800" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  </>
  );
}
