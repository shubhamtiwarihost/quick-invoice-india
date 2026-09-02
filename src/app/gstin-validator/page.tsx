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
  return <GstinValidatorClient />;
}
