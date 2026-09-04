import type { Metadata } from "next";
import EwayBillClient from "./EwayBillClient";

export const metadata: Metadata = {
  title: "GST E-Way Bill Rule & Exemption Checker — SwiftGST",
  description:
    "Check if your consignment requires a GST E-Way bill based on state thresholds (₹50k vs ₹1 Lakh), inter-state rules, and service exemptions under GST Rule 138.",
  keywords: [
    "eway bill checker",
    "gst e-way bill threshold",
    "intra state eway bill limit",
    "eway bill exemptions India",
    "Rule 138 GST",
    "eway bill limit Maharashtra Delhi",
  ],
};

export default function EwayBillCheckerPage() {
  return <EwayBillClient />;
}
