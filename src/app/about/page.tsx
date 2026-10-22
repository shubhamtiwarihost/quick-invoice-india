import type { Metadata } from "next";
import AboutUsPage from "@/app/about-us/page";

export const metadata: Metadata = {
  title: "About Us — Mission & Compliance Standards",
  description:
    "Learn about SwiftGST (swiftgst.in) — our founding mission, editorial standards, creator background, and commitment to 100% private, fast Indian GST invoicing and compliance.",
  alternates: {
    canonical: "https://swiftgst.in/about-us/",
  },
};

export default function AboutPage() {
  return <AboutUsPage />;
}
