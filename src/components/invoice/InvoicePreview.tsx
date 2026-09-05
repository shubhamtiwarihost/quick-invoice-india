"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvoiceDraft, InvoiceSummary } from "@/types/invoice";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { upiQrDataUrl } from "./BankDetailsForm";

export function InvoicePreview({
  draft,
  summary,
}: {
  draft: InvoiceDraft;
  summary: InvoiceSummary;
}) {
  const [qr, setQr] = useState("");

  const payee = draft.seller.bank.accountHolder || draft.seller.businessName;
  const upi = draft.seller.bank.upiId;
  const total = summary.grandTotal;
  const invoiceNo = draft.meta.invoiceNo;

  useEffect(() => {
    let cancelled = false;
    upiQrDataUrl(upi, payee, total, invoiceNo).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [upi, payee, total, invoiceNo]);

  const Template = useMemo(() => {
    if (draft.config.template === "classic") return ClassicTemplate;
    if (draft.config.template === "creative") return CreativeTemplate;
    return ModernTemplate;
  }, [draft.config.template]);

  return (
    <div className="invoice-print-root flex justify-center w-full">
      <div
        id="invoice-a4"
        className="invoice-a4 origin-top bg-white shadow-2xl rounded-sm w-[794px] lg:w-full lg:max-w-[820px] aspect-[1/1.414]"
        style={{ padding: "32px 36px" }}
      >
        <Template draft={draft} summary={summary} qrDataUrl={qr} />
      </div>
    </div>
  );
}
