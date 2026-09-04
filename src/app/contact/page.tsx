import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — SwiftGST Support & Inquiries",
  description:
    "Have questions, feedback, or need technical support? Contact the SwiftGST team at support@swiftgst.in. Response within 24–48 business hours.",
  keywords: [
    "contact SwiftGST",
    "SwiftGST support",
    "GST invoice support",
    "swiftgst.in contact",
  ],
  openGraph: {
    title: "Contact Us — SwiftGST Support & Inquiries",
    description:
      "Get in touch with SwiftGST for support, questions, feedback, or business partnerships.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-teal-100 bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-10 text-white shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
          <MessageSquare className="h-3.5 w-3.5" />
          Get In Touch
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Contact Us
        </h1>
        <p className="mt-3 text-lg text-teal-100/90 leading-relaxed font-normal max-w-2xl">
          Have questions, feedback, or need technical support? We are here to help.
        </p>
      </div>

      <ContactClient />
    </main>
  );
}
