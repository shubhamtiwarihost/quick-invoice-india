"use client";

import { useEffect } from "react";
import { useInvoiceStore } from "@/lib/store";

export function PersistHydration() {
  useEffect(() => {
    const fallback = window.setTimeout(() => {
      useInvoiceStore.getState().setHydrated(true);
    }, 600);
    void Promise.resolve(useInvoiceStore.persist.rehydrate()).finally(() => {
      window.clearTimeout(fallback);
      useInvoiceStore.getState().setHydrated(true);
    });
    return () => window.clearTimeout(fallback);
  }, []);
  return null;
}
