"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components/shared/Navbar";
import { NativeBottomNav } from "@/components/mobile/NativeBottomNav";
import { BackOfficeShell } from "@/components/layout/BackOfficeShell";

export function AppLayoutManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();


  // 1. Fullscreen POS Terminal Mode
  const isPos = pathname === "/pos" || pathname.startsWith("/pos/");
  if (isPos) {
    return (
      <main className="min-h-screen bg-slate-100">
        {children}
      </main>
    );
  }

  // 2. SaaS Back-Office Shell (Dashboard, Inventory, Customers/Khata, Reports/Analytics, Settings)
  const isBackOffice =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/settings");

  if (isBackOffice) {
    return (
      <BackOfficeShell>
        {children}
      </BackOfficeShell>
    );
  }

  // 3. Clean Onboarding & Auth Flow (Login, Register)
  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/");

  if (isAuth) {
    return <main className="min-h-screen bg-slate-100">{children}</main>;
  }

  // 4. Super Admin Dashboard Mode
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdmin) {
    return <main className="min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  // 5. Public Website & Standalone Tools (/, /about-us, /contact-us, /gst-calculator, etc.)
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <NativeBottomNav />
    </>
  );
}
