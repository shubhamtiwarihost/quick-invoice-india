import type { Metadata } from "next";
import { QuotationWorkspace } from "@/components/quotation/QuotationWorkspace";
import { QuotationComplianceGuide, QUOTATION_FAQS } from "@/components/quotation/QuotationComplianceGuide";
import { GuideExtras, type GuideBlock } from "@/components/shared/GuideExtras";

const EXTRAS_QUOTATION_MAKER: GuideBlock[] = [
  {
    "heading": "Which document do you need?",
    "bullets": [
      "A quotation or estimate is an offer of price. It is not a tax document and creates no GST liability.",
      "A proforma invoice is a preview of the final bill, often used for advance payment or customs. It is not a tax invoice.",
      "A tax invoice is issued when you supply the goods or services and is what the buyer uses to claim input tax credit."
    ]
  },
  {
    "heading": "Writing a quote that gets accepted",
    "bullets": [
      "State how long the price is valid.",
      "Itemise quantity, rate and GST so the buyer sees the final amount.",
      "List what is included and excluded.",
      "Add payment terms, such as an advance percentage.",
      "Once accepted, convert the quote to a tax invoice so figures carry over."
    ]
  }
];


export const metadata: Metadata = {
  title: "Free Estimate & Quotation Maker (GST Compliant)",
  description:
    "Generate professional price quotations and estimates with validity dates, client payment terms, and 1-click conversion to GST Tax Invoice. Free, 100% private, zero sign-up.",
  keywords: [
    "quotation maker",
    "estimate generator",
    "gst quotation maker",
    "price quote maker india",
    "convert quotation to invoice",
    "freelance estimate generator",
    "proforma quotation maker",
  ],
  alternates: {
    canonical: "https://swiftgst.in/quotation-maker/",
  },
  openGraph: {
    title: "Free Estimate & Quotation Maker — SwiftGST",
    description:
      "Generate formal price quotes and project estimates with custom validity and terms. Convert seamlessly into GST invoices.",
    url: "https://swiftgst.in/quotation-maker/",
    siteName: "SwiftGST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Estimate & Quotation Maker — SwiftGST",
    description:
      "Create formal price quotations with validity terms and convert directly to GST invoices in 1 click.",
  },
};

export default function QuotationMakerPage() {
  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SwiftGST Estimate & Quotation Maker",
    operatingSystem: "All (Web Browser)",
    applicationCategory: "BusinessApplication",
    url: "https://swiftgst.in/quotation-maker/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Free estimate and quotation maker with validity periods and 1-click conversion to GST Tax Invoices.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUOTATION_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <QuotationWorkspace
        childrenBelowWorkspace={
          <>
            <QuotationComplianceGuide />
            <div className="px-4 pb-12"><GuideExtras title="Quotation, proforma invoice and tax invoice: what is the difference?" blocks={EXTRAS_QUOTATION_MAKER} /></div>
          </>
        }
      />
    </>
  );
}
