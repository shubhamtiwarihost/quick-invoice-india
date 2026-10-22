import Link from "next/link";

interface ToolLink {
  href: string;
  label: string;
  desc: string;
}

const TOOLS: ToolLink[] = [
  { href: "/gst-calculator/", label: "GST Calculator", desc: "Add or remove GST at the 5%, 18% and 40% slabs." },
  { href: "/hsn-finder/", label: "HSN & SAC Code Finder", desc: "Find the code and typical GST rate for what you sell." },
  { href: "/gst-state-codes/", label: "GST State Code List", desc: "Every 2-digit state and UT code, with copy in one click." },
  { href: "/gstin-validator/", label: "GSTIN Validator", desc: "Check a GSTIN's format, state and checksum." },
  { href: "/eway-bill-checker/", label: "E-Way Bill Checker", desc: "Find out if a consignment needs an e-way bill." },
  { href: "/composition-calculator/", label: "Composition Scheme Calculator", desc: "Compare composition tax with regular GST." },
  { href: "/invoice/", label: "Free GST Invoice Generator", desc: "Make a compliant tax invoice with a UPI QR code." },
  { href: "/quotation-maker/", label: "Quotation Maker", desc: "Create GST quotes and convert them to invoices." },
  { href: "/freelance-rate-calculator/", label: "Freelance Rate Calculator", desc: "Work out your hourly rate and GST liability." },
];

/** Contextual internal links: shows up to four other tools, never the page you are on. */
export function RelatedTools({ current, prefer = [] }: { current: string; prefer?: string[] }) {
  const byHref = new Map(TOOLS.map((t) => [t.href, t]));
  const ordered = [
    ...prefer.map((h) => byHref.get(h)).filter((t): t is ToolLink => Boolean(t)),
    ...TOOLS,
  ].filter((t, i, arr) => t.href !== current && arr.findIndex((x) => x.href === t.href) === i);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-14" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-lg font-bold text-slate-900">
        Related free GST tools
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {ordered.slice(0, 4).map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-teal-600"
            >
              <span className="text-sm font-bold text-slate-900">{t.label}</span>
              <span className="mt-1 block text-xs text-slate-500">{t.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
