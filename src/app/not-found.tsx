import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const POPULAR = [
  { href: "/gst-calculator/", label: "GST Calculator", desc: "Add or remove GST at the current 5%, 18% and 40% slabs." },
  { href: "/invoice/", label: "GST Invoice Generator", desc: "Create a free GST tax invoice with CGST, SGST or IGST." },
  { href: "/hsn-finder/", label: "HSN & SAC Code Finder", desc: "Look up the code and typical GST rate for your product." },
  { href: "/gst-state-codes/", label: "GST State Code List", desc: "Every 2-digit GST state and UT code in one table." },
  { href: "/gstin-validator/", label: "GSTIN Validator", desc: "Check the format and checksum of any GSTIN." },
  { href: "/eway-bill-checker/", label: "E-Way Bill Checker", desc: "See whether your consignment needs an e-way bill." },
];

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">This page could not be found</h1>
      <p className="mt-3 text-sm text-slate-600">
        The link may be old or mistyped. Try one of our most-used free GST tools instead, or go back to the{" "}
        <Link href="/" className="font-semibold text-teal-700 hover:underline">
          SwiftGST home page
        </Link>
        .
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {POPULAR.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-teal-600"
            >
              <span className="text-sm font-bold text-slate-900">{item.label}</span>
              <span className="mt-1 block text-xs text-slate-500">{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
