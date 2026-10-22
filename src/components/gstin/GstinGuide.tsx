import Link from "next/link";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const GSTIN_FAQS: FaqItem[] = [
  {
    question: "What is the format of a GSTIN?",
    answer:
      "A GSTIN has 15 characters. The first two digits are the state code, the next ten characters are the taxpayer's PAN, the 13th character counts the registrations the same PAN holds in that state (1 to 9, then A to Z), the 14th character is the letter Z by default, and the 15th is a checksum character calculated from the first 14.",
  },
  {
    question: "Does a valid checksum mean the GSTIN is registered and active?",
    answer:
      "No. The checksum only proves the number is correctly formed, so it catches typing mistakes. It does not prove that the GSTIN was issued, is active, or belongs to the business you are dealing with. Before you rely on a supplier or customer GSTIN, confirm its status on the official GST portal using the Search Taxpayer option.",
  },
  {
    question: "How do I verify a GSTIN before claiming input tax credit?",
    answer:
      "First check the format and checksum with this validator to rule out typos. Then search the GSTIN on the GST portal to confirm the legal name, registration status and registration type. Finally make sure the supplier has filed their returns, because input tax credit depends on the invoice appearing in your GSTR-2B.",
  },
  {
    question: "What is the 13th character of a GSTIN?",
    answer:
      "It is the entity number: how many GST registrations the same PAN holds within that state. The first registration is 1, the second is 2, and so on up to 9, after which letters A to Z are used. A business with a single registration in a state will normally have 1.",
  },
  {
    question: "Why is the 14th character of a GSTIN always Z?",
    answer:
      "The 14th character is reserved and is set to the letter Z by default for all GSTINs. A GSTIN with any other letter in that position is not in the standard format, which is why the validator flags it.",
  },
  {
    question: "Can two GSTINs share the same PAN?",
    answer:
      "Yes. A PAN holder needs a separate GSTIN for each state in which they are registered, so one PAN can have many GSTINs that differ in the first two digits (the state code) and in the 13th character. All of them contain the same ten-character PAN.",
  },
  {
    question: "How do I find a GSTIN from a PAN?",
    answer:
      "On the GST portal, use Search Taxpayer and choose the option to search by PAN. It lists the GSTINs registered against that PAN across states. You can also read the state code from any GSTIN using our GST state code list.",
  },
];

const PAN_TYPES: { code: string; entity: string }[] = [
  { code: "P", entity: "Individual (Proprietor)" },
  { code: "C", entity: "Company" },
  { code: "F", entity: "Firm / LLP" },
  { code: "H", entity: "Hindu Undivided Family (HUF)" },
  { code: "A", entity: "Association of Persons (AOP)" },
  { code: "B", entity: "Body of Individuals (BOI)" },
  { code: "T", entity: "Trust" },
  { code: "G", entity: "Government" },
  { code: "L", entity: "Local Authority" },
  { code: "J", entity: "Artificial Juridical Person" },
];

export function GstinGuide() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-8 px-4 pb-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">What this GSTIN validator checks, and what it cannot</h2>
        <div className="mt-3 grid gap-4 text-xs leading-relaxed text-slate-600 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <h3 className="font-bold text-emerald-900">It checks</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>That the number is exactly 15 characters in the correct pattern</li>
              <li>That the first two digits are a valid GST state or UT code</li>
              <li>The PAN structure and the entity type it implies</li>
              <li>That the 14th character is Z</li>
              <li>The MOD 36 checksum in the 15th character</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <h3 className="font-bold text-amber-900">It cannot check</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Whether the GSTIN was actually issued by the GST system</li>
              <li>Whether the registration is active, suspended or cancelled</li>
              <li>The legal or trade name of the business</li>
              <li>Whether the taxpayer has filed returns</li>
            </ul>
            <p className="mt-2">
              For those, use Search Taxpayer on the official GST portal. Everything here runs in your
              browser and no GSTIN is sent to any server.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">GSTIN structure explained, character by character</h2>
        <div className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-teal-300">
          <p>27 ABCDE1234F 1 Z 5</p>
          <p className="mt-1 text-slate-400">state · PAN (10) · entity no. · Z · checksum</p>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Placeholder for illustration only. It is not a real registration.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">What it means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr><td className="px-4 py-2 font-mono font-bold">1 to 2</td><td className="px-4 py-2">State or UT code. For example 27 is Maharashtra, 07 is Delhi, 29 is Karnataka. See the full{" "}
                <Link href="/gst-state-codes/" className="font-semibold text-teal-700 hover:underline">GST state code list</Link>.</td></tr>
              <tr><td className="px-4 py-2 font-mono font-bold">3 to 12</td><td className="px-4 py-2">The taxpayer&apos;s 10-character PAN.</td></tr>
              <tr><td className="px-4 py-2 font-mono font-bold">13</td><td className="px-4 py-2">Number of registrations held by that PAN in the state (1 to 9, then A to Z).</td></tr>
              <tr><td className="px-4 py-2 font-mono font-bold">14</td><td className="px-4 py-2">Reserved, set to Z by default.</td></tr>
              <tr><td className="px-4 py-2 font-mono font-bold">15</td><td className="px-4 py-2">Checksum character from the MOD 36 algorithm over the first 14 characters.</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-sm font-bold text-slate-900">What the 6th character tells you</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          The 6th character of a GSTIN is the 4th character of the PAN, which shows the type of taxpayer.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {PAN_TYPES.map((t) => (
            <div key={t.code} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs">
              <span className="font-mono text-sm font-bold text-teal-800">{t.code}</span>
              <p className="mt-0.5 leading-snug text-slate-600">{t.entity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">How to verify a supplier or customer GSTIN in three steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <li><strong>Check the number here.</strong> A format or checksum error almost always means a typing mistake. Fix it before going further.</li>
          <li><strong>Confirm it on the GST portal.</strong> Use Search Taxpayer to see the legal name, status and registration type, and make sure it matches the invoice.</li>
          <li><strong>Put the right GSTIN on your invoice.</strong> A wrong or missing buyer GSTIN can block their input tax credit. Create a compliant bill with the{" "}
            <Link href="/invoice/" className="font-semibold text-teal-700 hover:underline">free GST invoice generator</Link>, and work out the tax with the{" "}
            <Link href="/gst-calculator/" className="font-semibold text-teal-700 hover:underline">GST calculator</Link>.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold text-slate-900">GSTIN validation FAQs</h2>
        </div>
        <FaqAccordion items={GSTIN_FAQS} />
      </div>
    </section>
  );
}
