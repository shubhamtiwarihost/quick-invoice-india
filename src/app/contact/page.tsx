import type { Metadata } from "next";
import ContactUsPage from "@/app/contact-us/page";

export const metadata: Metadata = {
  title: "Contact Us — Support & Help",
  description:
    "Get in touch with SwiftGST (swiftgst.in). Technical support, feedback, bug reports, and compliance inquiries. Support email: support@swiftgst.in with response within 24–48 business hours.",
  alternates: {
    canonical: "https://swiftgst.in/contact-us/",
  },
};

export default function ContactPage() {
  return <ContactUsPage />;
}
