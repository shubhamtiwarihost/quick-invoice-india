import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Printer,
  FileCode2,
} from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Free GST Invoice Templates (Excel, Word, PDF)",
  description:
    "Download 100% free GST invoice formats in Excel (.XLSX), Word (.DOCX), and printable PDF. Compliant with CBIC rules, CGST/SGST/IGST formulas, and instant online editor.",
  keywords: [
    "GST invoice templates free download",
    "GST bill format Excel download",
    "freelancer bill format Word",
    "printable blank GST bill template PDF",
    "B2B tax invoice format XLS",
    "retail cash memo template",
    "CBIC GST bill sample",
  ],
  alternates: {
    canonical: "https://swiftgst.in/gst-invoice-templates/",
  },
  openGraph: {
    title: "Free GST Invoice Templates (Excel, Word, PDF) — SwiftGST",
    description:
      "Ready-to-use Indian GST invoice templates for Excel, Word, and printable PDF. Download free or generate online in 30 seconds.",
    url: "https://swiftgst.in/gst-invoice-templates/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free GST Invoice Templates Download — SwiftGST",
    description:
      "Download compliant GST bill templates in Excel, Word & PDF with automatic tax formulas.",
  },
};

interface TemplateCardData {
  title: string;
  format: "Excel / XLS" | "Word / DOCX" | "Printable PDF";
  formatTagColor: string;
  description: string;
  features: string[];
  downloadUrl: string;
  downloadFilename: string;
  onlineGeneratorUrl: string;
  onlineGeneratorLabel: string;
  icon: typeof FileSpreadsheet;
  badge?: string;
}

const TEMPLATES: TemplateCardData[] = [
  {
    title: "Standard B2B Tax Invoice Format",
    format: "Excel / XLS",
    formatTagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description:
      "Complete B2B tax invoice spreadsheet with automated SUM and CGST/SGST/IGST tax formulas, place of supply lookup, and reverse charge indicator.",
    features: [
      "Automated CGST (9%) + SGST (9%) and IGST (18%) math formulas",
      "Official GSTR-1 Table 4 column compatibility",
      "Supplier & Recipient GSTIN, PAN, and Bank details fields",
      "Clean A4 print margins configured for instant printing",
    ],
    downloadUrl: "/templates/standard-b2b-tax-invoice-format.xlsx",
    downloadFilename: "standard-b2b-tax-invoice-format.xlsx",
    onlineGeneratorUrl: "/?preset=b2b",
    onlineGeneratorLabel: "Generate B2B Invoice Online",
    icon: FileSpreadsheet,
    badge: "Most Popular for B2B",
  },
  {
    title: "Freelancer & Consultant Simple Bill",
    format: "Word / DOCX",
    formatTagColor: "bg-blue-100 text-blue-800 border-blue-200",
    description:
      "Clean, modern invoice template for software developers, UI/UX designers, and remote consultants. Pre-configured for hourly rates and SAC 998314.",
    features: [
      "Hourly rate & milestone deliverables layout",
      "SAC 998314 & 998313 pre-populated with 18% GST",
      "Section 194J TDS deduction reference and PAN field",
      "LUT zero-rated export note for foreign dollar invoicing",
    ],
    downloadUrl: "/templates/freelancer-simple-bill-format.docx",
    downloadFilename: "freelancer-simple-bill-format.docx",
    onlineGeneratorUrl: "/freelancer-invoice-generator/",
    onlineGeneratorLabel: "Generate Freelancer Bill Online",
    icon: FileText,
    badge: "Freelancer Choice",
  },
  {
    title: "Printable Blank GST Bill Template",
    format: "Printable PDF",
    formatTagColor: "bg-red-100 text-red-800 border-red-200",
    description:
      "High-resolution vector blank A4 GST invoice sheet with crisp borders, itemized 10-line table, bank details box, and authorized signature stamp section.",
    features: [
      "100% vector-sharp A4 printable grid layout",
      "10 itemized product/service rows with HSN & GST splits",
      "Clear Bank Name, IFSC, and UPI payment placeholder",
      "Compliant with Rule 46 of CGST Rules 2017",
    ],
    downloadUrl: "/templates/printable-blank-gst-bill-template.pdf",
    downloadFilename: "printable-blank-gst-bill-template.pdf",
    onlineGeneratorUrl: "/",
    onlineGeneratorLabel: "Fill & Download Live PDF",
    icon: Printer,
    badge: "Instant Print Ready",
  },
  {
    title: "Boutique & Tailoring Studio Bill",
    format: "Excel / XLS",
    formatTagColor: "bg-pink-100 text-pink-800 border-pink-200",
    description:
      "Tailored for custom stitching, fabric supply, and designer apparel. Pre-configured with 5% apparel job work (SAC 998822) and the 5% / 18% garment slabs (₹2,500 per piece rule).",
    features: [
      "Separate line items for Stitching vs Pure Fabric material",
      "Advance deposit received and balance due tracking",
      "Trial fitting date and alteration terms included",
      "Formula calculation for 5% & 18% apparel GST rates",
    ],
    downloadUrl: "/templates/boutique-tailoring-bill-format.xlsx",
    downloadFilename: "boutique-tailoring-bill-format.xlsx",
    onlineGeneratorUrl: "/boutique-invoice-generator/",
    onlineGeneratorLabel: "Open Boutique Generator",
    icon: FileSpreadsheet,
  },
  {
    title: "Kirana & Grocery Retail Cash Memo",
    format: "Word / DOCX",
    formatTagColor: "bg-amber-100 text-amber-800 border-amber-200",
    description:
      "Simplified retail cash memo for grocery shops, supermarkets, and FMCG retailers with walk-in customer support, 0% exempt items, and 5% staples.",
    features: [
      "Walk-in B2C retail customer layout (no GSTIN required)",
      "Daily grocery items pre-seeded (Atta, Dal, Edible Oil)",
      "Auto round-off grand total to the nearest whole rupee",
      "Thermal printer and counter slip friendly dimensions",
    ],
    downloadUrl: "/templates/kirana-retail-cash-memo-format.docx",
    downloadFilename: "kirana-retail-cash-memo-format.docx",
    onlineGeneratorUrl: "/kirana-store-bill-maker/",
    onlineGeneratorLabel: "Open Kirana Bill Maker",
    icon: FileText,
  },
];

const TEMPLATES_FAQS: FaqItem[] = [
  {
    question: "Are these GST invoice templates legally compliant with CBIC rules?",
    answer:
      "Yes. All templates conform to Section 31 of the CGST Act and Rule 46 of the CGST Rules 2017. They include all 16 mandatory fields: supplier GSTIN, consecutive serial number, date of issue, recipient name and address, HSN/SAC code, taxable value, tax rates (CGST, SGST, IGST), place of supply, and signature placeholder.",
  },
  {
    question: "Why use the SwiftGST Online Generator instead of editing offline Excel/Word templates?",
    answer:
      "Editing Excel or Word files manually often leads to calculation errors in GST rounding, broken tax formulas, or missing state code mismatches. The SwiftGST online generator automatically calculates CGST/SGST vs IGST based on state codes, generates a live dynamic UPI QR code, checks your GSTIN checksum, and exports a pixel-perfect A4 PDF in 30 seconds with zero software installation.",
  },
  {
    question: "Can I open the Excel templates in Google Sheets or Apple Numbers?",
    answer:
      "Yes. The downloadable spreadsheet templates use standard XML Spreadsheet format, which opens natively in Microsoft Excel, Google Sheets, LibreOffice Calc, and Apple Numbers without formatting distortion or macros.",
  },
  {
    question: "How do I add my company logo and signature to these templates?",
    answer:
      "In the SwiftGST online generator, you can upload your company logo (PNG/JPG) and draw your digital signature directly on screen (or upload a signature image). The generated PDF automatically embeds your logo and signature in crisp vector quality.",
  },
  {
    question: "Do I need to sign every invoice under GST?",
    answer:
      "Under Rule 46, a tax invoice must be signed by the supplier or their authorized representative. However, digital invoices issued under Rule 46(s) with an authorized digital signature or printed signature disclaimer ('This is a computer-generated invoice') are legally valid across India.",
  },
];

export default function GstInvoiceTemplatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free GST Invoice Templates Download Hub — SwiftGST",
    url: "https://swiftgst.in/gst-invoice-templates/",
    description:
      "Comprehensive directory of free downloadable Indian GST invoice templates in Excel, Word, and PDF formats.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: TEMPLATES.map((t, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: t.title,
        description: t.description,
      })),
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TEMPLATES_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer : faq.question,
      },
    })),
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero Section */}
      <div className="rounded-3xl border border-teal-200 bg-linear-to-br from-teal-950 via-slate-900 to-teal-900 p-8 md:p-12 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200 border border-teal-400/20">
          <Sparkles className="h-3.5 w-3.5" />
          100% Free GST Resources
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          Free GST Invoice Templates
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-teal-100 max-w-3xl">
          Download professionally designed, CBIC-compliant GST tax invoice formats in Excel (.XLSX), Word (.DOCX), and printable PDF. Ready with automated CGST, SGST, IGST tax formulas and A4 printing margins.
        </p>

        {/* Hero Quick CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-lg hover:bg-teal-500 active:scale-95 transition"
          >
            <Zap className="h-4 w-4 text-teal-200" />
            Generate Invoice in 30 Seconds Online
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-teal-200/90 font-medium">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>Zero Sign-up · 100% Private · Auto UPI QR</span>
          </div>
        </div>
      </div>

      {/* Template Cards Grid */}
      <section className="mt-12 space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Downloadable GST Bill Formats
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Choose your preferred offline file format or bypass manual typing by generating online instantly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-500 hover:shadow-md transition group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-teal-700 group-hover:bg-teal-50 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${tmpl.formatTagColor}`}
                  >
                    {tmpl.format}
                  </span>
                </div>

                <div className="mt-4">
                  {tmpl.badge && (
                    <span className="mb-1.5 inline-block text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      {tmpl.badge}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {tmpl.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {tmpl.description}
                  </p>
                </div>

                {/* Features Checklist */}
                <ul className="mt-4 space-y-2 text-xs text-slate-600 flex-1 border-t border-slate-100 pt-4">
                  {tmpl.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-600 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Direct Conversion Hook & Download Triggers */}
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                  {/* Primary High-Conversion Hook */}
                  <Link
                    href={tmpl.onlineGeneratorUrl}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-700 py-2.5 text-xs font-semibold text-white hover:bg-teal-800 active:scale-95 transition shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-teal-200" />
                    Skip Manual Editing — Generate Online
                  </Link>

                  {/* Clean Static File Download Button */}
                  <a
                    href={tmpl.downloadUrl}
                    download={tmpl.downloadFilename}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    Download {tmpl.format} File
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Online Invoicing vs Excel Comparison */}
      <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold border border-teal-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">
              Why Indian Small Businesses Switch from Offline Excel to SwiftGST
            </h3>
            <p className="text-xs text-slate-500">
              Comparison between manual offline spreadsheet billing and instant web invoicing
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3 text-slate-500">Manual Excel / Word Files</th>
                <th className="px-4 py-3 text-teal-800 font-bold">SwiftGST Online Generator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Tax Calculations</td>
                <td className="px-4 py-3 text-slate-500">Prone to formula breaks or circular errors</td>
                <td className="px-4 py-3 text-teal-700 font-medium">Automatic intra/inter CGST, SGST, IGST split</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Dynamic UPI QR Code</td>
                <td className="px-4 py-3 text-slate-500">Requires manual external QR generator</td>
                <td className="px-4 py-3 text-teal-700 font-medium">Auto-embedded on bill with exact amount</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">GSTR-1 Sales Summary</td>
                <td className="px-4 py-3 text-slate-500">Manual copy-pasting into CA worksheets</td>
                <td className="px-4 py-3 text-teal-700 font-medium">1-Click export to GSTR-1 Table 4 CSV</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Mobile WhatsApp Sharing</td>
                <td className="px-4 py-3 text-slate-500">Save as PDF, find file, attach in WhatsApp</td>
                <td className="px-4 py-3 text-teal-700 font-medium">1-Click WhatsApp direct message with UPI link</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">Data Privacy &amp; Security</td>
                <td className="px-4 py-3 text-slate-500">Files stored on single computer with risk of loss</td>
                <td className="px-4 py-3 text-teal-700 font-medium">100% Private — Your Data Stays With You</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mt-16 space-y-4">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-teal-700" />
          <h3 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions (GST Invoice Templates)
          </h3>
        </div>
        <FaqAccordion items={TEMPLATES_FAQS} />
      </section>

      {/* Bottom Conversion Banner */}
      <section className="mt-16 rounded-2xl border border-teal-200 bg-teal-50/70 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base md:text-lg font-bold text-teal-950">
            Ready to create your professional GST tax invoice right now?
          </h3>
          <p className="text-xs md:text-sm text-teal-800 mt-1">
            No signup, no credit card, no app download. Works instantly on desktop and mobile.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-teal-800 active:scale-95 transition shrink-0"
        >
          <Zap className="h-4 w-4" />
          Open Free Invoice Maker
        </Link>
      </section>
    </main>
  );
}
