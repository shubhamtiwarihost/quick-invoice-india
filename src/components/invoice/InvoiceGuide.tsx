import Link from "next/link";

const MANDATORY_FIELDS = [
  "Supplier name, address and GSTIN",
  "A unique invoice number (up to 16 characters, consecutive series per financial year)",
  "Invoice date",
  "Recipient name, address and GSTIN (for B2B supplies)",
  "HSN / SAC code, description, quantity and unit of each item",
  "Taxable value after discounts",
  "CGST + SGST rate and amount, or IGST rate and amount",
  "Place of supply with state name and code",
  "Whether tax is payable on reverse charge",
  "Authorised signature",
];

export function InvoiceGuide() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h2 className="text-2xl font-extrabold text-slate-900">
        How to create a GST tax invoice in India
      </h2>
      <p className="mt-3 text-sm leading-relaxed">
        A tax invoice is the document a GST-registered supplier issues for taxable
        goods or services. It lets the buyer claim input tax credit, and it is the
        source for your GSTR-1 return. Use the generator above to fill in your
        details, add line items, and download a PDF. Nothing is uploaded; your data
        stays in your browser.
      </p>

      <h3 className="mt-8 text-lg font-bold text-slate-900">
        Details a GST invoice must contain
      </h3>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
        {MANDATORY_FIELDS.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-bold text-slate-900">
        CGST + SGST or IGST?
      </h3>
      <p className="mt-2 text-sm leading-relaxed">
        If your state and the place of supply are the same, the tax splits equally
        into CGST and SGST. If they differ, the whole amount is charged as IGST.
        The generator picks this automatically from the state you choose for the
        client.
      </p>

      <h3 className="mt-8 text-lg font-bold text-slate-900">
        Tax invoice vs bill of supply
      </h3>
      <p className="mt-2 text-sm leading-relaxed">
        Switch GST off to issue a bill of supply. Composition dealers and suppliers
        of exempt goods or services issue this instead of a tax invoice, and it
        carries no tax lines.
      </p>

      <h3 className="mt-8 text-lg font-bold text-slate-900">GST rates on new invoices</h3>
      <p className="mt-2 text-sm leading-relaxed">
        Since 22 September 2025 the main slabs are 0%, 5%, 18% and 40%, with 3% for
        gold and jewellery. The old 12% and 28% slabs no longer apply to new
        supplies. Confirm the rate for your product in the{" "}
        <Link href="/hsn-finder/" className="font-semibold text-teal-700 underline">
          HSN &amp; SAC finder
        </Link>
        , and check amounts with the{" "}
        <Link href="/gst-calculator/" className="font-semibold text-teal-700 underline">
          GST calculator
        </Link>
        .
      </p>

      <h3 className="mt-8 text-lg font-bold text-slate-900">Related tools</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li>
          <Link href="/gstin-validator/" className="text-teal-700 underline">
            GSTIN validator
          </Link>{" "}
          to check a customer&apos;s number before billing
        </li>
        <li>
          <Link href="/gst-state-codes/" className="text-teal-700 underline">
            GST state codes
          </Link>{" "}
          for place of supply
        </li>
        <li>
          <Link href="/gst-invoice-templates/" className="text-teal-700 underline">
            Invoice templates
          </Link>{" "}
          for different businesses
        </li>
      </ul>
    </section>
  );
}
