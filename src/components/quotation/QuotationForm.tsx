"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Calendar, Check } from "lucide-react";
import { INDIAN_STATES } from "@/lib/indianStates";
import { gstinHint } from "@/lib/gstin";
import { formatCurrency } from "@/lib/format";
import { useQuotationStore } from "@/lib/quotationStore";
import type { CurrencyCode, GstSlab, ItemUnit } from "@/types/invoice";
import { BankDetailsForm } from "@/components/invoice/BankDetailsForm";
import { SignatureDrawPad } from "@/components/invoice/SignatureDrawPad";

const ACCENTS = ["#DEBA5F", "#059669", "#1d4ed8", "#f59e0b", "#5b21b6", "#0f172a"];
const UNITS: ItemUnit[] = ["Nos", "Hrs", "Pcs", "Mtrs", "Bags", "Kgs"];
const SLABS: GstSlab[] = [0, 5, 12, 18, 28];

const TERMS_PRESETS = [
  {
    label: "Freelance Design & Tech",
    terms:
      "1. Quotation Validity: Valid for 15 days from date of issue.\n2. Payment: 50% advance to initiate work, 50% on final milestone completion.\n3. Revisions: Up to 2 iterative revision cycles included. Out-of-scope requests billed extra.\n4. Taxes: GST applicable @ 18% on professional services.",
  },
  {
    label: "Agency / Retainer",
    terms:
      "1. Quotation Validity: Valid for 30 days.\n2. Milestones: 40% contract advance, 30% prototype demo, 30% final deployment.\n3. Intellectual Property: Rights transferred upon receipt of full settlement.\n4. Warranty: 30 days post-launch technical support included.",
  },
  {
    label: "Goods / Supplies",
    terms:
      "1. Price Validity: Valid for 10 days due to market raw material rates.\n2. Terms: 100% advance against Proforma / PO.\n3. Delivery: Dispatched within 5-7 business days of confirmation.\n4. Transit: Risk and freight borne by buyer unless specified.",
  },
];

export function QuotationForm({ grandTotal }: { grandTotal: number }) {
  const seller = useQuotationStore((s) => s.seller);
  const client = useQuotationStore((s) => s.client);
  const meta = useQuotationStore((s) => s.meta);
  const config = useQuotationStore((s) => s.config);
  const items = useQuotationStore((s) => s.items);

  const setSeller = useQuotationStore((s) => s.setSeller);
  const setBank = useQuotationStore((s) => s.setBank);
  const setClient = useQuotationStore((s) => s.setClient);
  const setMeta = useQuotationStore((s) => s.setMeta);
  const setConfig = useQuotationStore((s) => s.setConfig);
  const setValidityDays = useQuotationStore((s) => s.setValidityDays);
  const addItem = useQuotationStore((s) => s.addItem);
  const updateItem = useQuotationStore((s) => s.updateItem);
  const removeItem = useQuotationStore((s) => s.removeItem);

  function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    useQuotationStore.setState({ items: newItems });
  }

  return (
    <div className="space-y-3 pb-8 text-slate-800">
      {/* 1. Quotation & Validity Settings */}
      <Section title="Quotation & Validity Settings" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium">
            <span>GST applicable quote</span>
            <input
              type="checkbox"
              checked={config.gstMode === "gst"}
              onChange={(e) =>
                setConfig({ gstMode: e.target.checked ? "gst" : "non-gst" })
              }
              className="rounded text-teal-700 focus:ring-teal-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium">
            <span>Reverse Charge (RCM)</span>
            <input
              type="checkbox"
              checked={config.reverseCharge}
              onChange={(e) => setConfig({ reverseCharge: e.target.checked })}
              className="rounded text-teal-700 focus:ring-teal-500"
            />
          </label>

          <Field
            label="Quotation no."
            value={meta.quotationNo}
            onChange={(v) => setMeta({ quotationNo: v })}
            placeholder="QT-2026-001"
          />

          <Select
            label="Currency"
            value={meta.currency}
            onChange={(v) => setMeta({ currency: v as CurrencyCode })}
            options={[
              { value: "INR", label: "INR ₹ (Indian Rupee)" },
              { value: "USD", label: "USD $ (US Dollar)" },
              { value: "EUR", label: "EUR € (Euro)" },
            ]}
          />

          <Field
            label="Quotation Date"
            type="date"
            value={meta.quotationDate}
            onChange={(v) => setMeta({ quotationDate: v })}
          />

          <Field
            label="Valid Until"
            type="date"
            value={meta.validUntil}
            onChange={(v) => setMeta({ validUntil: v })}
          />

          {/* Quick Validity Presets */}
          <div className="sm:col-span-2 rounded-xl bg-amber-50/70 p-3 border border-amber-200/80">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-700" />
                Quick Validity Window:
              </span>
              <span className="text-[11px] font-normal text-amber-800">
                Current: {meta.validityDays} days
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[7, 15, 30, 45, 60].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setValidityDays(days)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    meta.validityDays === days
                      ? "bg-amber-700 text-white shadow-xs"
                      : "bg-white text-amber-900 border border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  +{days} Days
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Subject / Project Title"
              value={meta.subject}
              onChange={(v) => setMeta({ subject: v })}
              placeholder="e.g. Quotation for Website Redesign & Brand Identity"
            />
          </div>
        </div>

        {/* Accent Colors */}
        <div className="mt-3">
          <p className="mb-2 text-xs font-medium text-slate-500">Theme Color</p>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setConfig({ accentColor: c })}
                className="flex h-7 w-7 items-center justify-center rounded-full transition hover:scale-110 active:scale-95 shadow-xs"
                style={{ backgroundColor: c }}
              >
                {config.accentColor === c ? (
                  <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* 2. Seller Details */}
      <Section title="Your Business (Quotation Provider)">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Business / Freelancer Name"
              value={seller.businessName}
              onChange={(v) => setSeller({ businessName: v })}
              placeholder="Your Brand or Legal Trade Name"
            />
          </div>
          {config.gstMode === "gst" ? (
            <Field
              label="GSTIN"
              value={seller.gstin}
              onChange={(v) => {
                const upper = v.toUpperCase();
                setSeller({ gstin: upper });
                if (upper.length >= 2) {
                  const stateCode = upper.slice(0, 2);
                  const st = INDIAN_STATES.find((s) => s.code === stateCode);
                  if (st) setSeller({ state: st.name, stateCode: st.code });
                }
              }}
              hint={gstinHint(seller.gstin) || undefined}
              placeholder="27AAPCA1234A1Z5"
            />
          ) : null}
          <Field
            label="PAN"
            value={seller.pan}
            onChange={(v) => setSeller({ pan: v.toUpperCase() })}
            placeholder="AAPCA1234A"
          />
          <div className="sm:col-span-2">
            <Field
              label="Address"
              value={seller.address}
              onChange={(v) => setSeller({ address: v })}
            />
          </div>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field
              label="City"
              value={seller.city}
              onChange={(v) => setSeller({ city: v })}
            />
            <Field
              label="Pincode"
              value={seller.pincode}
              onChange={(v) => setSeller({ pincode: v })}
            />
            <Select
              label="State"
              value={seller.state}
              onChange={(v) => {
                const s = INDIAN_STATES.find((x) => x.name === v);
                setSeller({ state: v, stateCode: s?.code || "" });
              }}
              options={INDIAN_STATES.map((s) => ({
                value: s.name,
                label: `${s.name} (${s.code})`,
              }))}
            />
          </div>
          <Field
            label="Phone"
            value={seller.phone}
            onChange={(v) => setSeller({ phone: v })}
          />
          <Field
            label="Email"
            value={seller.email}
            onChange={(v) => setSeller({ email: v })}
          />
        </div>

        {/* Bank Details */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="mb-2 text-xs font-semibold text-slate-700">Bank & UPI for Advance</p>
          <BankDetailsForm
            bank={seller.bank}
            onChange={setBank}
            amount={grandTotal}
            payeeName={seller.bank.accountHolder || seller.businessName}
            invoiceNo={meta.quotationNo}
          />
        </div>

        {/* Signatory */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <Field
            label="Authorized Signatory Name"
            value={seller.signatoryName}
            onChange={(v) => setSeller({ signatoryName: v })}
          />
          <div className="mt-2">
            <SignatureDrawPad
              value={seller.signatureImage}
              onChange={(sig) => setSeller({ signatureImage: sig })}
            />
          </div>
        </div>
      </Section>

      {/* 3. Client / Prospect Details */}
      <Section title="Client / Prospective Customer">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Client or Company Name"
              value={client.name}
              onChange={(v) => setClient({ name: v })}
              placeholder="e.g. Horizon Tech Solutions Ltd"
            />
          </div>
          {config.gstMode === "gst" ? (
            <Field
              label="Client GSTIN (Optional for quotes)"
              value={client.gstin}
              onChange={(v) => {
                const upper = v.toUpperCase();
                setClient({ gstin: upper });
                if (upper.length >= 2) {
                  const stateCode = upper.slice(0, 2);
                  const st = INDIAN_STATES.find((s) => s.code === stateCode);
                  if (st) {
                    setClient({
                      billingState: st.name,
                      billingStateCode: st.code,
                      placeOfSupply: st.name,
                      placeOfSupplyCode: st.code,
                    });
                  }
                }
              }}
              hint={gstinHint(client.gstin) || undefined}
              placeholder="27AAACH1234P1Z2"
            />
          ) : null}
          <div className="sm:col-span-2">
            <Field
              label="Client Billing Address"
              value={client.billingAddress}
              onChange={(v) => setClient({ billingAddress: v })}
            />
          </div>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field
              label="City"
              value={client.billingCity}
              onChange={(v) => setClient({ billingCity: v })}
            />
            <Field
              label="Pincode"
              value={client.billingPincode}
              onChange={(v) => setClient({ billingPincode: v })}
            />
            <Select
              label="Client State"
              value={client.billingState}
              onChange={(v) => {
                const s = INDIAN_STATES.find((x) => x.name === v);
                setClient({
                  billingState: v,
                  billingStateCode: s?.code || "",
                  placeOfSupply: v,
                  placeOfSupplyCode: s?.code || "",
                });
              }}
              options={INDIAN_STATES.map((s) => ({
                value: s.name,
                label: `${s.name} (${s.code})`,
              }))}
            />
          </div>
          <Select
            label="Place of Supply (POS)"
            value={client.placeOfSupply}
            onChange={(v) => {
              const s = INDIAN_STATES.find((x) => x.name === v);
              setClient({
                placeOfSupply: v,
                placeOfSupplyCode: s?.code || "",
              });
            }}
            options={INDIAN_STATES.map((s) => ({
              value: s.name,
              label: `${s.name} (${s.code})`,
            }))}
          />
          <Field
            label="Phone"
            value={client.phone}
            onChange={(v) => setClient({ phone: v })}
          />
          <Field
            label="Email"
            value={client.email}
            onChange={(v) => setClient({ email: v })}
          />
        </div>
      </Section>

      {/* 4. Scope of Work / Line Items */}
      <Section title="Scope of Work & Deliverables" defaultOpen>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Add deliverables, estimated quantities, and rates.
          </p>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Deliverable
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const lineGross = item.quantity * item.rate;
            const lineDisc =
              item.discountType === "percent"
                ? (lineGross * item.discountValue) / 100
                : item.discountValue;
            const lineTaxableVal = Math.max(0, lineGross - lineDisc);
            const lineGstVal =
              config.gstMode === "gst" ? (lineTaxableVal * (item.gstSlab || 0)) / 100 : 0;
            const lineGrand = lineTaxableVal + lineGstVal;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-300"
              >
                <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <span className="inline-flex items-center justify-center rounded-lg bg-teal-50 border border-teal-200/80 px-2.5 py-1 text-xs font-bold text-teal-900 select-none whitespace-nowrap">
                    Deliverable #{index + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    {items.length > 1 ? (
                      <>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveItem(index, "up")}
                          title="Move item up"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 active:scale-95 transition"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === items.length - 1}
                          onClick={() => moveItem(index, "down")}
                          title="Move item down"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 active:scale-95 transition"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}

                    {items.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        title="Delete deliverable"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Deliverable / Task Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="e.g. UX wireframes and interactive prototypes"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">HSN/SAC</label>
                      <input
                        type="text"
                        value={item.hsnSac}
                        onChange={(e) => updateItem(item.id, { hsnSac: e.target.value })}
                        placeholder="998314"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-mono text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Qty</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0.01}
                        step="any"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Unit</label>
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, { unit: e.target.value as ItemUnit })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white"
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Rate (₹)</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white"
                      />
                    </div>
                    {config.gstMode === "gst" ? (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600">GST %</label>
                        <select
                          value={item.gstSlab}
                          onChange={(e) =>
                            updateItem(item.id, { gstSlab: Number(e.target.value) as GstSlab })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white"
                        >
                          {SLABS.map((s) => (
                            <option key={s} value={s}>{s}%</option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Bottom Row Total Bar */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 border border-slate-100 text-xs">
                  <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap select-none">
                    Row #{index + 1}
                  </span>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap select-none">
                    Row Total:{" "}
                    <strong className="font-mono text-slate-900 font-bold">
                      {formatCurrency(lineGrand, meta.currency)}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 5. Client Terms & Conditions */}
      <Section title="Terms, Validity & Client Conditions" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Quotation Terms & Conditions
              </label>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Load:</span>
              {TERMS_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setMeta({ terms: p.terms })}
                  className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-200 active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={meta.terms}
              onChange={(e) => setMeta({ terms: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-800 outline-none focus:border-teal-600 focus:bg-white"
              placeholder="1. Quotation Validity...\n2. Payment Milestones..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Project Notes / Scope Summary
            </label>
            <textarea
              rows={5}
              value={meta.notes}
              onChange={(e) => setMeta({ notes: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-teal-600 focus:bg-white"
              placeholder="Additional notes, client instructions, or deliverables summary..."
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? <div className="border-t border-slate-100 p-4">{children}</div> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600/20"
      />
      {hint ? <p className="mt-0.5 text-[10px] text-amber-600">{hint}</p> : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
