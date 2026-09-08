import type { Metadata } from "next";
import { ContactClient } from "@/app/contact/ContactClient";
import { MessageSquare, Clock, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — SwiftGST Support, Help & Inquiries",
  description:
    "Get in touch with SwiftGST (swiftgst.in). Technical support, feedback, bug reports, and compliance inquiries. Support email: support@swiftgst.in with response within 24–48 business hours.",
  keywords: [
    "contact SwiftGST",
    "SwiftGST customer support",
    "GST invoice support email",
    "swiftgst.in contact",
    "GST billing helpdesk India",
  ],
  alternates: {
    canonical: "https://swiftgst.in/contact-us/",
  },
  openGraph: {
    title: "Contact Us — SwiftGST Support, Help & Inquiries",
    description:
      "Need help or have suggestions? Contact the SwiftGST team at support@swiftgst.in. Official response within 24–48 business hours.",
    url: "https://swiftgst.in/contact-us/",
    type: "website",
  },
};

export default function ContactUsPage() {
  const jsonLdContact = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "SwiftGST Contact & Support",
    url: "https://swiftgst.in/contact-us/",
    description:
      "Official contact and technical support page for SwiftGST Indian billing utilities.",
    mainEntity: {
      "@type": "Organization",
      name: "SwiftGST",
      email: "support@swiftgst.in",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@swiftgst.in",
        availableLanguage: ["English", "Hindi"],
        hoursAvailable: "Mo-Fr 09:00-18:00 IST",
      },
    },
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />

      {/* Header Banner */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-12 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20 mb-4">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Helpdesk &amp; Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Contact Us
        </h1>
        <p className="mt-4 text-base sm:text-lg text-teal-100/90 leading-relaxed font-normal max-w-2xl">
          Have questions regarding our tax invoice formulas, need technical assistance, or wish to propose a feature?
          Our dedicated team is here to assist.
        </p>

        {/* Operating Hours Callout */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-teal-200">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-xs">
            <Clock className="h-3.5 w-3.5 text-teal-300" />
            Business Hours: Mon–Fri, 9:00 AM – 6:00 PM IST
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-xs">
            <Mail className="h-3.5 w-3.5 text-teal-300" />
            support@swiftgst.in
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
            Response Window: 24–48 Business Hours
          </span>
        </div>
      </div>

      <ContactClient />
    </main>
  );
}
