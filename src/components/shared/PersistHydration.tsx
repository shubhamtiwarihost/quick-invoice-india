"use client";

import { useEffect } from "react";
import { useInvoiceStore } from "@/lib/store";
import { useQuotationStore } from "@/lib/quotationStore";

export function PersistHydration() {
  useEffect(() => {
    const fallback = window.setTimeout(() => {
      useInvoiceStore.getState().setHydrated(true);
    }, 600);

    void Promise.resolve(useInvoiceStore.persist.rehydrate()).finally(() => {
      window.clearTimeout(fallback);
      const invoiceBank = useInvoiceStore.getState().seller?.bank;
      if (
        invoiceBank &&
        (invoiceBank.accountNumber === "50100123456789" ||
          invoiceBank.ifsc === "HDFC0001234")
      ) {
        useInvoiceStore.getState().setBank({
          accountNumber:
            invoiceBank.accountNumber === "50100123456789"
              ? "123456789012"
              : invoiceBank.accountNumber,
          ifsc:
            invoiceBank.ifsc === "HDFC0001234"
              ? "HDFC0000000"
              : invoiceBank.ifsc,
        });
      }
      useInvoiceStore.getState().setHydrated(true);
    });

    void Promise.resolve(useQuotationStore.persist.rehydrate()).finally(() => {
      const quoteBank = useQuotationStore.getState().seller?.bank;
      if (
        quoteBank &&
        (quoteBank.accountNumber === "50100123456789" ||
          quoteBank.ifsc === "HDFC0001234")
      ) {
        useQuotationStore.getState().setBank({
          accountNumber:
            quoteBank.accountNumber === "50100123456789"
              ? "123456789012"
              : quoteBank.accountNumber,
          ifsc:
            quoteBank.ifsc === "HDFC0001234"
              ? "HDFC0000000"
              : quoteBank.ifsc,
        });
      }
      useQuotationStore.getState().setHydrated(true);
    });

    return () => window.clearTimeout(fallback);
  }, []);
  return null;
}
