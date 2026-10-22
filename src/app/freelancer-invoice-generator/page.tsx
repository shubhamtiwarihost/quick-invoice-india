import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  ShieldCheck,
  FileCheck2,
  Calculator,
  ArrowRight,
  Code2,
} from "lucide-react";
import { InvoiceWorkspace } from "@/components/invoice/InvoiceWorkspace";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Freelancer Invoice Generator India (GST & Non-GST)",
  description:
    "Free GST invoice generator for Indian freelancers, software developers, and consultants. Pre-loaded SAC 998314, hourly rates, LUT zero-rated export & instant PDF download.",
  keywords: [
    "freelancer invoice generator India",
    "GST invoice for freelancers",
    "software developer invoice template",
    "consultant bill format",
    "SAC code 998314 invoice",
    "LUT export invoice GST",
    "freelance hourly invoice maker",
    "IT consulting GST bill",
  ],
  alternates: {
    canonical: "https://swiftgst.in/freelancer-invoice-generator/",
  },
  openGraph: {
    title: "Freelancer Invoice Generator India (GST & Non-GST) — SwiftGST",
    description:
      "Free GST invoice generator for Indian freelancers, consultants, and IT contractors. Pre-loaded SAC 998314, hourly billing, and instant PDF download.",
    url: "https://swiftgst.in/freelancer-invoice-generator/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelancer Invoice Generator India — SwiftGST",
    description:
      "Generate compliant GST invoices for freelance projects, hourly consulting & international clients with SAC 998314.",
  },
};

const FREELANCER_FAQS: FaqItem[] = [
  {
    question: "Do Indian freelancers need GST registration if annual turnover is under ₹20 Lakhs?",
    answer:
      "Under Section 22 of the CGST Act, service providers with aggregate annual turnover below ₹20 Lakhs (₹10 Lakhs in Special Category States like Manipur, Mizoram, Nagaland, and Tripura) are exempt from mandatory GST registration. If unregistered, you can generate clean Non-GST Bills or commercial invoices without charging CGST/SGST/IGST.",
  },
  {
    question: "How do freelancers invoice international clients without charging 18% GST?",
    answer:
      "Export of services is treated as a 'Zero-Rated Supply' under Section 16 of the IGST Act. Freelancers registered under GST can file a Letter of Undertaking (LUT) online in Form GST RFD-11 on the GST portal at the start of each financial year. With an active LUT, you can issue invoices in USD/EUR/INR with 0% IGST, provided payment is received in convertible foreign exchange (or INR via authorized mechanisms) with a Foreign Inward Remittance Certificate (FIRC/FIRS).",
  },
  {
    question: "What is SAC code 998314 and why is it essential for software freelancers?",
    answer:
      "SAC 998314 covers 'Information technology (IT) design and development services', including full-stack software development, web applications, mobile app coding, and UI/UX design. The standard GST rate is 18%. Quoting the precise 6-digit SAC code prevents invoice rejection and enables corporate clients to claim Input Tax Credit (ITC).",
  },
  {
    question: "How does TDS under Section 194J affect freelance invoices?",
    answer:
      "Indian business clients deducting payment for professional or technical services typically withhold Tax Deducted at Source (TDS) under Section 194J of the Income Tax Act (usually 10% for professional services or 2% for purely technical services). Mention your PAN prominently on the invoice so the client credits TDS directly to your PAN in Form 26AS / AIS.",
  },
  {
    question: "Can freelancers claim Input Tax Credit (ITC) on laptops and software tools?",
    answer:
      "Yes! If you possess an active GST registration, you can claim 100% ITC on GST paid for business expenses, including laptops, monitors, broadband internet bills, cloud hosting (AWS/GCP), and software subscriptions (Figma, Adobe, GitHub). This directly reduces your net GST liability.",
  },
  {
    question: "Can I collect instant payments via UPI QR Code on my invoice?",
    answer:
      "Yes. SwiftGST automatically generates an embedded, secure UPI payment QR code directly onto your invoice PDF based on your UPI VPA (e.g. yourname@okhdfcbank). Clients scanning the QR code with GPay, PhonePe, or Paytm see your invoice number and exact amount pre-filled.",
  },
];

export default function FreelancerInvoiceGeneratorPage() {
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Freelancer Invoice Generator",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/freelancer-invoice-generator/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free GST invoice generator pre-configured for Indian freelancers, IT developers, and creative consultants with SAC 998314 and hourly rates.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FREELANCER_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : faq.question,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <InvoiceWorkspace
        initialPreset="freelancer"
        pageTitle="Freelancer & IT Consultant GST Invoice Generator"
        badgeText="Pre-loaded: SAC 998314 · 18% GST · Hourly Rates"
        childrenBelowWorkspace={
          <article className="mx-auto max-w-5xl px-4 py-12 space-y-16 text-slate-800">
            {/* Guide Introduction Banner */}
            <section className="rounded-3xl border border-teal-200 bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-8 md:p-12 text-white shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
                <Briefcase className="h-3.5 w-3.5" />
                Freelance Compliance Playbook
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
                How to Bill Under GST as a Freelancer in India
              </h2>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-teal-100 max-w-3xl">
                Whether you provide full-stack software development, UI/UX design, cloud architecture, or digital marketing, billing properly ensures fast client clearance, compliant TDS credits under Section 194J, and hassle-free tax filing.
              </p>
            </section>

            {/* Step-by-Step Compliance Guidelines */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold border border-teal-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step-by-Step Freelancer GST Compliance Guidelines
                  </h3>
                  <p className="text-xs text-slate-500">
                    Essential legal checklist before sending your bill to Indian or overseas clients
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-teal-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-xs">
                      1
                    </span>
                    <h4>Verify Your Turnover Threshold</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Service providers whose all-India turnover does not cross ₹20 Lakhs per annum (₹10 Lakhs in Special Category States) are not legally required to register for GST. If exempt, generate clean commercial invoices with PAN and UPI ID.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-teal-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-xs">
                      2
                    </span>
                    <h4>File LUT for Foreign Clients (0% IGST)</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    If billing clients in the US, Europe, or Singapore, file Form GST RFD-11 on the GST portal to export services under a Letter of Undertaking (LUT) with 0% tax. Ensure foreign remittances arrive via wire transfer with FIRC certification.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-teal-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-xs">
                      3
                    </span>
                    <h4>Use Standard SAC Codes (998314)</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Services Accounting Codes (SAC) identify your service category. Use 998314 for IT programming and software development, 998313 for technical consulting, and 998365 for internet marketing.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 text-teal-700 font-bold text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-xs">
                      4
                    </span>
                    <h4>Track TDS Credits Under Section 194J</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Indian clients will deduct 10% (or 2% technical) TDS on payment. Always request the client’s TAN number and verify that deducted tax is credited to your PAN in Form 26AS / Annual Information Statement (AIS).
                  </p>
                </div>
              </div>
            </section>

            {/* SAC Codes Reference Table */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="h-5 w-5 text-teal-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Common SAC Codes for Indian Freelancers & Developers
                </h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">SAC Code</th>
                      <th className="px-4 py-3">Service Category</th>
                      <th className="px-4 py-3">Applicable GST</th>
                      <th className="px-4 py-3">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-teal-700">998314</td>
                      <td className="px-4 py-3 font-medium text-slate-900">IT Design & Development</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">18%</td>
                      <td className="px-4 py-3 text-slate-500">React/Node apps, mobile apps, UI/UX Figma design</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-teal-700">998313</td>
                      <td className="px-4 py-3 font-medium text-slate-900">IT Consulting & Architecture</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">18%</td>
                      <td className="px-4 py-3 text-slate-500">Cloud audit, AWS setup, microservice system design</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-teal-700">998365</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Internet Advertising & SEO</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">18%</td>
                      <td className="px-4 py-3 text-slate-500">Google Ads management, SEO audits, social media growth</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-teal-700">998391</td>
                      <td className="px-4 py-3 font-medium text-slate-900">Specialty Content Writing</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">18%</td>
                      <td className="px-4 py-3 text-slate-500">Technical documentation, ghostwriting, copywriting</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Interactive FAQ Accordion */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-teal-700" />
                <h3 className="text-xl font-bold text-slate-900">
                  Frequently Asked Questions (Freelancer GST Invoicing)
                </h3>
              </div>
              <FaqAccordion items={FREELANCER_FAQS} />
            </section>

            {/* Related Tools Callout */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Need to calculate your ideal hourly charge or quote project milestones?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Use our free Freelance Rate Calculator and Quotation Maker.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/freelance-rate-calculator"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
                >
                  <Calculator className="h-3.5 w-3.5 text-teal-700" />
                  Rate Calculator
                </Link>
                <Link
                  href="/gst-invoice-templates"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-800 shadow-xs"
                >
                  Download Templates
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          </article>
        }
      />
    </>
  );
}
