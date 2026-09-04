import { Suspense } from "react";
import type { Metadata } from "next";
import GstinValidatorClient from "./GstinValidatorClient";

export const metadata: Metadata = {
  title: "GSTIN Validator & Checksum Checker — QuickInvoice India",
  description:
    "Verify 15-digit Indian GSTIN format and official MOD 36 check digit. Get instant breakdown of State Code, PAN number, Entity Type, and validity status.",
  keywords: [
    "GSTIN validator",
    "GST number check",
    "GSTIN checksum calculator",
    "verify GSTIN India",
    "GST state code",
    "GST PAN format",
  ],
};

export default function GstinValidatorPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center p-12 text-sm text-slate-500">
          Loading GSTIN validator…
        </div>
      }
    >
      <GstinValidatorClient />
    </Suspense>
  );
}
