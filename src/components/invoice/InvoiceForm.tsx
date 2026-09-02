"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { INDIAN_STATES } from "@/lib/indianStates";
import { gstinHint } from "@/lib/gstin";
import { useInvoiceStore } from "@/lib/store";
import type { CurrencyCode, InvoiceTemplate } from "@/types/invoice";
import { BankDetailsForm } from "./BankDetailsForm";
import { LineItemsTable } from "./LineItemsTable";
import { SignatureDrawPad } from "./SignatureDrawPad";

const ACCENTS = ["#0f766e", "#1d4ed8", "#b45309", "#be123c", "#5b21b6", "#0f172a"];

export function InvoiceForm({ grandTotal }: { grandTotal: number }) {
  const seller = useInvoiceStore((s) => s.seller);
  const client = useInvoiceStore((s) => s.client);
  const meta = useInvoiceStore((s) => s.meta);
  const config = useInvoiceStore((s) => s.config);
  const setSeller = useInvoiceStore((s) => s.setSeller);
  const setBank = useInvoiceStore((s) => s.setBank);
  const setClient = useInvoiceStore((s) => s.setClient);
  const setMeta = useInvoiceStore((s) => s.setMeta);
  const setConfig = useInvoiceStore((s) => s.setConfig);

  return (
    <div className="space-y-3 pb-8">
      <Section title="Invoice settings" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <span>GST invoice</span>
            <input
              type="checkbox"
              checked={config.gstMode === "gst"}
              onChange={(e) =>
                setConfig({ gstMode: e.target.checked ? "gst" : "non-gst" })
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <span>Reverse charge (RCM)</span>
            <input
              type="checkbox"
              checked={config.reverseCharge}
              onChange={(e) => setConfig({ reverseCharge: e.target.checked })}
            />
          </label>
          <Field
            label="Invoice no."
            value={meta.invoiceNo}
            onChange={(v) => setMeta({ invoiceNo: v })}
          />
          <Select
            label="Currency"
            value={meta.currency}
            onChange={(v) => setMeta({ currency: v as CurrencyCode })}
            options={[
              { value: "INR", label: "INR ₹" },
              { value: "USD", label: "USD $" },
              { value: "EUR", label: "EUR €" },
            ]}
          />
          <Field
            label="Invoice date"
            type="date"
            value={meta.invoiceDate}
            onChange={(v) => setMeta({ invoiceDate: v })}
          />
          <Field
            label="Due date"
            type="date"
            value={meta.dueDate}
            onChange={(v) => setMeta({ dueDate: v })}
          />
          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2">
            <span>Auto round-off to nearest rupee</span>
            <input
              type="checkbox"
              checked={config.autoRoundOff}
              onChange={(e) => setConfig({ autoRoundOff: e.target.checked })}
            />
          </label>
          {!config.autoRoundOff ? (
            <Field
              label="Manual round-off"
              type="number"
              value={String(config.manualRoundOff)}
              onChange={(v) => setConfig({ manualRoundOff: Number(v) })}
            />
          ) : null}
        </div>
        <div className="mt-3">
          <p className="mb-2 text-xs font-medium text-slate-500">Template</p>
          <div className="flex flex-wrap gap-2">
            {(["modern", "classic", "creative"] as InvoiceTemplate[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setConfig({ template: t })}
                className={`rounded-full px-3 py-1 text-xs capitalize ${
                  config.template === t
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mb-2 mt-3 text-xs font-medium text-slate-500">Accent colour</p>
          <div className="flex gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onClick={() => setConfig({ accentColor: c })}
                className={`h-7 w-7 rounded-full border-2 ${
                  config.accentColor === c ? "border-slate-900" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Billed from (seller)">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Business name"
            className="sm:col-span-2"
            value={seller.businessName}
            onChange={(v) => setSeller({ businessName: v })}
          />
          <FileField
            label="Logo"
            onData={(data) => setSeller({ logo: data })}
            hasValue={Boolean(seller.logo)}
            onClear={() => setSeller({ logo: "" })}
          />
          <SignatureDrawPad
            value={seller.signatureImage}
            onChange={(data) => setSeller({ signatureImage: data })}
          />
          <Field
            label="GSTIN"
            value={seller.gstin}
            onChange={(v) => setSeller({ gstin: v.toUpperCase() })}
            error={gstinHint(seller.gstin)}
          />
          <Field label="PAN" value={seller.pan} onChange={(v) => setSeller({ pan: v.toUpperCase() })} />
          <Field
            label="Address"
            className="sm:col-span-2"
            value={seller.address}
            onChange={(v) => setSeller({ address: v })}
          />
          <Field label="City" value={seller.city} onChange={(v) => setSeller({ city: v })} />
          <Field label="PIN" value={seller.pincode} onChange={(v) => setSeller({ pincode: v })} />
          <StateSelect
            label="State"
            value={seller.state}
            onChange={(name, code) => setSeller({ state: name, stateCode: code })}
          />
          <Field label="Phone" value={seller.phone} onChange={(v) => setSeller({ phone: v })} />
          <Field label="Email" value={seller.email} onChange={(v) => setSeller({ email: v })} />
          <Field
            label="Signatory name"
            value={seller.signatoryName}
            onChange={(v) => setSeller({ signatoryName: v })}
          />
        </div>
      </Section>

      <Section title="Billed to (buyer)">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Client name"
            className="sm:col-span-2"
            value={client.name}
            onChange={(v) => setClient({ name: v })}
          />
          <Field
            label="GSTIN (optional B2B)"
            value={client.gstin}
            onChange={(v) => setClient({ gstin: v.toUpperCase() })}
            error={gstinHint(client.gstin)}
          />
          <Field label="Phone" value={client.phone} onChange={(v) => setClient({ phone: v })} />
          <Field
            label="Billing address"
            className="sm:col-span-2"
            value={client.billingAddress}
            onChange={(v) => setClient({ billingAddress: v })}
          />
          <Field
            label="City"
            value={client.billingCity}
            onChange={(v) => setClient({ billingCity: v })}
          />
          <Field
            label="PIN"
            value={client.billingPincode}
            onChange={(v) => setClient({ billingPincode: v })}
          />
          <StateSelect
            label="Billing state"
            value={client.billingState}
            onChange={(name, code) =>
              setClient({
                billingState: name,
                billingStateCode: code,
                placeOfSupply: name,
                placeOfSupplyCode: code,
              })
            }
          />
          <StateSelect
            label="Place of supply"
            value={client.placeOfSupply}
            onChange={(name, code) =>
              setClient({ placeOfSupply: name, placeOfSupplyCode: code })
            }
          />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={client.shippingSameAsBilling}
              onChange={(e) => setClient({ shippingSameAsBilling: e.target.checked })}
            />
            Shipping address same as billing
          </label>
          {!client.shippingSameAsBilling ? (
            <>
              <Field
                label="Shipping address"
                className="sm:col-span-2"
                value={client.shippingAddress}
                onChange={(v) => setClient({ shippingAddress: v })}
              />
              <Field
                label="Shipping city"
                value={client.shippingCity}
                onChange={(v) => setClient({ shippingCity: v })}
              />
              <Field
                label="Shipping PIN"
                value={client.shippingPincode}
                onChange={(v) => setClient({ shippingPincode: v })}
              />
            </>
          ) : null}
        </div>
      </Section>

      <Section title="Items" defaultOpen>
        <LineItemsTable gstOn={config.gstMode === "gst"} />
      </Section>

      <Section title="Bank & UPI">
        <BankDetailsForm
          bank={seller.bank}
          onChange={setBank}
          amount={grandTotal}
          payeeName={seller.bank.accountHolder || seller.businessName}
          invoiceNo={meta.invoiceNo}
        />
      </Section>

      <Section title="Notes & terms">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Notes</span>
          <textarea
            rows={2}
            value={meta.notes}
            onChange={(e) => setMeta({ notes: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-medium text-slate-500">Terms & conditions</span>
          <textarea
            rows={4}
            value={meta.terms}
            onChange={(e) => setMeta({ terms: e.target.value })}
            className={inputClass}
          />
        </label>
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="border-t border-slate-100 px-4 py-4">{children}</div> : null}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
  error?: string | null;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {error ? <span className="mt-1 block text-[11px] text-red-600">{error}</span> : null}
    </label>
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
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StateSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (name: string, code: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => {
          const st = INDIAN_STATES.find((s) => s.name === e.target.value);
          if (st) onChange(st.name, st.code);
        }}
        className={inputClass}
      >
        {INDIAN_STATES.map((s) => (
          <option key={s.code + s.name} value={s.name}>
            {s.code} — {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function FileField({
  label,
  onData,
  hasValue,
  onClear,
}: {
  label: string;
  onData: (data: string) => void;
  hasValue: boolean;
  onClear: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onData(String(reader.result || ""));
            reader.readAsDataURL(file);
            e.target.value = "";
          }}
          className="block w-full text-xs"
        />
        {hasValue ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        ) : null}
      </div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";
