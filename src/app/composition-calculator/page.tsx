import type { Metadata } from "next";
import CompositionClient from "./CompositionClient";

export const metadata: Metadata = {
  title: "Composition Scheme vs Regular GST Calculator — SwiftGST",
  description:
    "Compare Composition Scheme (1%, 5%, 6% flat tax) vs Regular GST scheme (Output tax minus ITC). Find out your net tax liability and compliance savings.",
  keywords: [
    "composition scheme calculator",
    "composition vs regular gst",
    "gst composition eligibility",
    "cmp-08 calculator",
    "gst itc comparison",
    "composition scheme turnover limit",
  ],
};

export default function CompositionCalculatorPage() {
  return <CompositionClient />;
}
