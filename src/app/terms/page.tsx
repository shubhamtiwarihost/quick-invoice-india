import type { Metadata } from "next";
import TermsOfServicePage from "@/app/terms-of-service/page";

export const metadata: Metadata = {
  title: "Terms of Service — SwiftGST User Agreement & Legal Terms",
  description:
    "Review the Terms of Service governing your use of SwiftGST (swiftgst.in). Permitted commercial use, software availability, intellectual property, and limitations of liability.",
  alternates: {
    canonical: "https://swiftgst.in/terms-of-service/",
  },
};

export default function TermsPage() {
  return <TermsOfServicePage />;
}
