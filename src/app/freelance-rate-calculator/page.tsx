import type { Metadata } from "next";
import FreelanceRateClient from "./FreelanceRateClient";

export const metadata: Metadata = {
  title: "Freelance Rate & Hourly Income Calculator — SwiftGST",
  description:
    "Calculate your ideal freelance hourly rate, daily retainer, and project costs based on your target income, working hours, business expenses, and taxes.",
  keywords: [
    "freelance rate calculator",
    "hourly rate calculator India",
    "freelance retainer estimator",
    "consulting fee calculator",
    "freelance project pricing",
    "freelancer hourly charge",
  ],
};

export default function FreelanceRateCalculatorPage() {
  return <FreelanceRateClient />;
}
