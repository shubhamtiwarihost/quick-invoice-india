"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ArrowLeft,
  Check,
  ChevronRight,
  Sparkles,
  Settings,
  User,
  Layers,
  Building2,
  QrCode,
  FileText,
  Plus,
  Maximize2,
} from "lucide-react";
import { INDIAN_STATES, getStateByCode } from "@/lib/indianStates";
import { gstinHint } from "@/lib/gstin";
import { useInvoiceStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import type { CurrencyCode, InvoiceTemplate } from "@/types/invoice";
import { BankDetailsForm } from "./BankDetailsForm";
import { LineItemsTable } from "./LineItemsTable";
import { SignatureDrawPad } from "./SignatureDrawPad";

const ACCENTS = ["#0f766e", "#1d4ed8", "#b45309", "#be123c", "#5b21b6", "#0f172a"];

type MobileModalType = "items" | "settings" | "client" | "seller" | "bank" | "notes" | null;

export function InvoiceForm({ grandTotal }: { grandTotal: number }) {
  const seller = useInvoiceStore((s) => s.seller);
  const client = useInvoiceStore((s) => s.client);
  const meta = useInvoiceStore((s) => s.meta);
  const config = useInvoiceStore((s) => s.config);
  const items = useInvoiceStore((s) => s.items);
  const addItem = useInvoiceStore((s) => s.addItem);
  const setSeller = useInvoiceStore((s) => s.setSeller);
  const setBank = useInvoiceStore((s) => s.setBank);
  const setClient = useInvoiceStore((s) => s.setClient);
  const setMeta = useInvoiceStore((s) => s.setMeta);
  const setConfig = useInvoiceStore((s) => s.setConfig);

  const [activeMobileModal, setActiveMobileModal] = useState<MobileModalType>(null);
  const [mobileViewMode, setMobileViewMode] = useState<"app" | "classic">("app");

  function handleClientGstinChange(rawGstin: string) {
    const val = rawGstin.toUpperCase().trim();
    const patch: Partial<typeof client> = { gstin: val };

    if (val.length >= 2) {
      const code = val.slice(0, 2);
      if (/^\d{2}$/.test(code)) {
        const detectedState = getStateByCode(code);
        if (detectedState) {
          patch.placeOfSupply = detectedState.name;
          patch.placeOfSupplyCode = detectedState.code;
          if (!client.billingState || client.billingStateCode === client.placeOfSupplyCode) {
            patch.billingState = detectedState.name;
            patch.billingStateCode = detectedState.code;
          }
        }
      }
    }
    setClient(patch);
  }

  const detectedBuyerState =
    client.gstin && client.gstin.length >= 2 && /^\d{2}/.test(client.gstin)
      ? getStateByCode(client.gstin.slice(0, 2))
      : undefined;

  const isIntraSupply =
    detectedBuyerState && seller.stateCode
      ? seller.stateCode === detectedBuyerState.code
      : undefined;

  // 1. Settings Form Content
  const settingsContent = (
    <div className="space-y-3.5">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium">
          <div>
            <span className="block font-semibold text-slate-900">GST Invoice</span>
            <span className="block text-[11px] text-slate-500">Enable CGST/SGST/IGST tax rates</span>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 rounded-md text-teal-700 accent-teal-700"
            checked={config.gstMode === "gst"}
            onChange={(e) =>
              setConfig({ gstMode: e.target.checked ? "gst" : "non-gst" })
            }
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium">
          <div>
            <span className="block font-semibold text-slate-900">Reverse Charge (RCM)</span>
            <span className="block text-[11px] text-slate-500">Tax payable by recipient</span>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 rounded-md text-teal-700 accent-teal-700"
            checked={config.reverseCharge}
            onChange={(e) => setConfig({ reverseCharge: e.target.checked })}
          />
        </label>
        <Field
          label="Invoice No."
          value={meta.invoiceNo}
          onChange={(v) => setMeta({ invoiceNo: v })}
          placeholder="e.g. INV-2026-001"
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
          label="Invoice Date"
          type="date"
          value={meta.invoiceDate}
          onChange={(v) => setMeta({ invoiceDate: v })}
        />
        <Field
          label="Due Date"
          type="date"
          value={meta.dueDate}
          onChange={(v) => setMeta({ dueDate: v })}
        />
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium sm:col-span-2">
          <div>
            <span className="block font-semibold text-slate-900">Auto Round-off</span>
            <span className="block text-[11px] text-slate-500">Round grand total to nearest rupee</span>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 rounded-md text-teal-700 accent-teal-700"
            checked={config.autoRoundOff}
            onChange={(e) => setConfig({ autoRoundOff: e.target.checked })}
          />
        </label>
        {!config.autoRoundOff ? (
          <Field
            label="Manual Round-off (₹)"
            type="number"
            inputMode="decimal"
            step="any"
            className="sm:col-span-2"
            value={String(config.manualRoundOff)}
            onChange={(v) => setConfig({ manualRoundOff: Number(v) })}
            placeholder="0.00"
          />
        ) : null}
      </div>
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-slate-700">A4 PDF Template Style</p>
          <div className="flex flex-wrap gap-1.5">
            {(["modern", "classic", "creative"] as InvoiceTemplate[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setConfig({ template: t })}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition active:scale-95 ${
                  config.template === t
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-slate-700">Theme Accent Colour</p>
          <div className="flex items-center gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select accent color ${c}`}
                onClick={() => setConfig({ accentColor: c })}
                className={`h-7 w-7 rounded-full border-2 transition active:scale-90 ${
                  config.accentColor === c ? "border-slate-900 ring-2 ring-slate-400" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // 2. Seller Form Content
  const sellerContent = (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      <Field
        label="Business Name / Legal Entity"
        className="sm:col-span-2"
        value={seller.businessName}
        onChange={(v) => setSeller({ businessName: v })}
        placeholder="e.g. Acme Tech Solutions Pvt Ltd"
      />
      <FileField
        label="Company Logo"
        onData={(data) => setSeller({ logo: data })}
        hasValue={Boolean(seller.logo)}
        onClear={() => setSeller({ logo: "" })}
      />
      <SignatureDrawPad
        value={seller.signatureImage}
        onChange={(data) => setSeller({ signatureImage: data })}
      />
      <Field
        label="GSTIN (15-digit)"
        value={seller.gstin}
        onChange={(v) => setSeller({ gstin: v.toUpperCase() })}
        error={gstinHint(seller.gstin)}
        placeholder="e.g. 27AAAAA0000A1Z5"
      />
      <Field
        label="PAN"
        value={seller.pan}
        onChange={(v) => setSeller({ pan: v.toUpperCase() })}
        placeholder="e.g. AAAAA0000A"
      />
      <Field
        label="Street Address"
        className="sm:col-span-2"
        value={seller.address}
        onChange={(v) => setSeller({ address: v })}
        placeholder="Building, street, landmark"
      />
      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field
          label="City"
          value={seller.city}
          onChange={(v) => setSeller({ city: v })}
          placeholder="e.g. Mumbai"
        />
        <Field
          label="PIN Code"
          value={seller.pincode}
          inputMode="numeric"
          onChange={(v) => setSeller({ pincode: v })}
          placeholder="e.g. 400001"
        />
        <StateSelect
          label="State & GST Code"
          value={seller.state}
          onChange={(name, code) => setSeller({ state: name, stateCode: code })}
        />
      </div>
      <Field
        label="Phone Number"
        type="tel"
        inputMode="tel"
        value={seller.phone}
        onChange={(v) => setSeller({ phone: v })}
        placeholder="e.g. +91 9876543210"
      />
      <Field
        label="Email Address"
        type="email"
        inputMode="email"
        value={seller.email}
        onChange={(v) => setSeller({ email: v })}
        placeholder="e.g. contact@business.in"
      />
      <Field
        label="Authorized Signatory Name"
        className="sm:col-span-2"
        value={seller.signatoryName}
        onChange={(v) => setSeller({ signatoryName: v })}
        placeholder="e.g. Rahul Sharma"
      />
    </div>
  );

  // 3. Client Form Content
  const clientContent = (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      <Field
        label="Client Name / Business Name"
        className="sm:col-span-2"
        value={client.name}
        onChange={(v) => setClient({ name: v })}
        placeholder="e.g. Nexus Enterprises"
      />
      <div className="space-y-1 sm:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Client GSTIN (optional for B2B)"
            value={client.gstin}
            onChange={handleClientGstinChange}
            error={gstinHint(client.gstin)}
            placeholder="e.g. 29BBBBB0000B1Z2"
          />
          <Field
            label="Client Phone"
            type="tel"
            inputMode="tel"
            value={client.phone}
            onChange={(v) => setClient({ phone: v })}
            placeholder="e.g. +91 9123456780"
          />
        </div>
        {detectedBuyerState && (
          <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-50/80 border border-teal-200/60 mt-1">
            <span className="h-2 w-2 rounded-full bg-teal-600 shrink-0"></span>
            <span>
              Detected State: <strong>{detectedBuyerState.code} - {detectedBuyerState.name}</strong> ·{" "}
              <span className={isIntraSupply ? "text-teal-700 font-bold" : "text-blue-700 font-bold"}>
                {isIntraSupply ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)"}
              </span>
            </span>
          </p>
        )}
      </div>
      <Field
        label="Billing Address"
        className="sm:col-span-2"
        value={client.billingAddress}
        onChange={(v) => setClient({ billingAddress: v })}
        placeholder="Building, street, area"
      />
      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field
          label="Billing City"
          value={client.billingCity}
          onChange={(v) => setClient({ billingCity: v })}
          placeholder="e.g. Bengaluru"
        />
        <Field
          label="Billing PIN Code"
          value={client.billingPincode}
          inputMode="numeric"
          onChange={(v) => setClient({ billingPincode: v })}
          placeholder="e.g. 560001"
        />
        <StateSelect
          label="Billing State"
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
      </div>
      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StateSelect
          label="Place of Supply"
          value={client.placeOfSupply}
          onChange={(name, code) =>
            setClient({ placeOfSupply: name, placeOfSupplyCode: code })
          }
        />
        <Field
          label="Client Email (optional)"
          type="email"
          inputMode="email"
          value={client.email || ""}
          onChange={(v) => setClient({ email: v })}
          placeholder="e.g. billing@nexus.in"
        />
      </div>
      <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm font-medium sm:col-span-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded-md text-teal-700 accent-teal-700"
          checked={client.shippingSameAsBilling}
          onChange={(e) => setClient({ shippingSameAsBilling: e.target.checked })}
        />
        <span>Shipping address same as billing address</span>
      </label>
      {!client.shippingSameAsBilling ? (
        <>
          <Field
            label="Shipping Address"
            className="sm:col-span-2"
            value={client.shippingAddress}
            onChange={(v) => setClient({ shippingAddress: v })}
            placeholder="Delivery destination address"
          />
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Shipping City"
              value={client.shippingCity}
              onChange={(v) => setClient({ shippingCity: v })}
              placeholder="e.g. Bengaluru"
            />
            <Field
              label="Shipping PIN"
              value={client.shippingPincode}
              inputMode="numeric"
              onChange={(v) => setClient({ shippingPincode: v })}
              placeholder="e.g. 560001"
            />
          </div>
        </>
      ) : null}
    </div>
  );

  // 4. Items Form Content
  const itemsContent = (
    <div>
      <LineItemsTable gstOn={config.gstMode === "gst"} />
    </div>
  );

  // 5. Bank Form Content
  const bankContent = (
    <div>
      <BankDetailsForm
        bank={seller.bank}
        onChange={setBank}
        amount={grandTotal}
        payeeName={seller.bank.accountHolder || seller.businessName}
        invoiceNo={meta.invoiceNo}
      />
    </div>
  );

  // 6. Notes Form Content
  const notesContent = (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-700">Client Notes / Remarks</span>
        <textarea
          rows={3}
          value={meta.notes}
          onChange={(e) => setMeta({ notes: e.target.value })}
          placeholder="e.g. Thank you for your business! Please pay within 15 days."
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-700">Terms &amp; Conditions</span>
        <textarea
          rows={3}
          value={meta.terms}
          onChange={(e) => setMeta({ terms: e.target.value })}
          placeholder="e.g. 1. Goods once sold will not be taken back. 2. Subject to Mumbai jurisdiction."
          className={inputClass}
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-3 pb-8">
      {/* MOBILE NATIVE APP VIEW (lg:hidden) */}
      <div className="block lg:hidden space-y-3">
        {/* Mobile View Mode Switcher */}
        <div className="flex items-center justify-between px-1 pb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>INVOICE BUILDER</span>
          </div>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMobileViewMode("app")}
              className={`rounded-md px-2.5 py-1 transition ${
                mobileViewMode === "app"
                  ? "bg-white text-teal-800 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              App Cards
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode("classic")}
              className={`rounded-md px-2.5 py-1 transition ${
                mobileViewMode === "classic"
                  ? "bg-white text-teal-800 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Expanded
            </button>
          </div>
        </div>

        {mobileViewMode === "app" ? (
          <div className="space-y-2.5">
            {/* 1. Quick Summary Banner Card */}
            <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  {config.gstMode === "gst" ? "GST Tax Invoice" : "Bill of Supply"}
                </span>
                <span className="rounded-md bg-white border border-teal-200 px-2 py-0.5 text-[11px] font-bold text-teal-900">
                  #{meta.invoiceNo || "DRAFT"}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Grand Total</span>
                  <p className="font-bold text-2xl tracking-tight tabular-nums text-slate-900 font-sans">
                    {formatCurrency(grandTotal, meta.currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-medium">Total Items</span>
                  <p className="text-base font-bold text-slate-800 font-sans">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Clean Line Items Card (Direct + Add & Summary Chips) */}
            <div
              onClick={() => setActiveMobileModal("items")}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.98] active:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-700">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">
                      Line Items ({items.length})
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {items.length === 0
                        ? "Tap + Add to start"
                        : `${items.length} ${items.length === 1 ? "item" : "items"} · Tap to edit`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem();
                      setActiveMobileModal("items");
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 active:scale-95 transition"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Add</span>
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>

              {/* Clean Item Summary Chips */}
              {items.length > 0 ? (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100">
                  {items.slice(0, 4).map((it, idx) => (
                    <span
                      key={it.id}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-700 max-w-[150px]"
                    >
                      <span className="font-bold text-slate-900">#{idx + 1}</span>
                      <span className="truncate">{it.description || "Item"}</span>
                    </span>
                  ))}
                  {items.length > 4 ? (
                    <span className="inline-flex items-center rounded-lg bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                      +{items.length - 4} more
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* 3. Client Details Card (Full-Screen Sheet Trigger) */}
            <div
              onClick={() => setActiveMobileModal("client")}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.98] active:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Client / Buyer
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {client.name ? client.name : "Add client name & GST details"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <span>{client.name ? "Edit" : "Add"}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
              {client.name ? (
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800">{client.name}</span>
                  <span>·</span>
                  <span>{client.placeOfSupply || "Place of supply not set"}</span>
                </div>
              ) : null}
            </div>

            {/* 4. Invoice Settings Card (Full-Screen Sheet Trigger) */}
            <div
              onClick={() => setActiveMobileModal("settings")}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.98] active:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-700">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Invoice Settings
                    </h3>
                    <p className="text-xs text-slate-500">
                      {config.gstMode === "gst" ? "GST Mode" : "Non-GST"} · {meta.currency} · {config.template}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                  <span>Configure</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* 5. Seller Profile Card (Full-Screen Sheet Trigger) */}
            <div
              onClick={() => setActiveMobileModal("seller")}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.98] active:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Seller / Business Details
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {seller.businessName || "Your Business Name & GSTIN"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <span>Edit</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* 6. Bank & UPI Card (Full-Screen Sheet Trigger) */}
            <div
              onClick={() => setActiveMobileModal("bank")}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.98] active:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Bank &amp; Dynamic UPI QR
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {seller.bank.upiId ? `UPI: ${seller.bank.upiId}` : "Add bank details & scan-to-pay QR"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span>{seller.bank.upiId ? "Configured" : "Add"}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>

            {/* 7. Notes & Terms Card (Full-Screen Sheet Trigger) */}
            <div
              onClick={() => setActiveMobileModal("notes")}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.98] active:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Notes &amp; Terms
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      Payment instructions &amp; warranty terms
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span>Edit</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Classic Accordion View */
          <div className="space-y-3">
            <Section title="Invoice settings" defaultOpen onOpenFullscreen={() => setActiveMobileModal("settings")}>
              {settingsContent}
            </Section>
            <Section title="Billed from (seller)" onOpenFullscreen={() => setActiveMobileModal("seller")}>
              {sellerContent}
            </Section>
            <Section title="Billed to (buyer)" defaultOpen onOpenFullscreen={() => setActiveMobileModal("client")}>
              {clientContent}
            </Section>
            <Section title="Items" defaultOpen onOpenFullscreen={() => setActiveMobileModal("items")}>
              {itemsContent}
            </Section>
            <Section title="Bank & UPI" onOpenFullscreen={() => setActiveMobileModal("bank")}>
              {bankContent}
            </Section>
            <Section title="Notes & terms" onOpenFullscreen={() => setActiveMobileModal("notes")}>
              {notesContent}
            </Section>
          </div>
        )}
      </div>

      {/* DESKTOP ACCORDION VIEW (hidden lg:block) */}
      <div className="hidden lg:block space-y-3">
        <Section title="Invoice settings" defaultOpen onOpenFullscreen={() => setActiveMobileModal("settings")}>
          {settingsContent}
        </Section>
        <Section title="Billed from (seller)" onOpenFullscreen={() => setActiveMobileModal("seller")}>
          {sellerContent}
        </Section>
        <Section title="Billed to (buyer)" defaultOpen onOpenFullscreen={() => setActiveMobileModal("client")}>
          {clientContent}
        </Section>
        <Section title="Items" defaultOpen onOpenFullscreen={() => setActiveMobileModal("items")}>
          {itemsContent}
        </Section>
        <Section title="Bank & UPI" onOpenFullscreen={() => setActiveMobileModal("bank")}>
          {bankContent}
        </Section>
        <Section title="Notes & terms" onOpenFullscreen={() => setActiveMobileModal("notes")}>
          {notesContent}
        </Section>
      </div>

      {/* FULL-SCREEN SLIDE-OVER SHEET MODALS FOR MOBILE */}
      {/* 1. Line Items Sheet Modal */}
      <MobileSheetModal
        isOpen={activeMobileModal === "items"}
        onClose={() => setActiveMobileModal(null)}
        title={`Line Items (${items.length})`}
        subtitle="Add, edit description, SAC/HSN, quantity, rate & GST"
        badge={`Total ${formatCurrency(grandTotal, meta.currency)}`}
      >
        {itemsContent}
      </MobileSheetModal>

      {/* 2. Settings Sheet Modal */}
      <MobileSheetModal
        isOpen={activeMobileModal === "settings"}
        onClose={() => setActiveMobileModal(null)}
        title="Invoice Settings"
        subtitle="GST mode, invoice number, dates, currency & template styling"
      >
        {settingsContent}
      </MobileSheetModal>

      {/* 3. Client Sheet Modal */}
      <MobileSheetModal
        isOpen={activeMobileModal === "client"}
        onClose={() => setActiveMobileModal(null)}
        title="Client / Buyer Details"
        subtitle="Client name, GSTIN validation, Place of Supply & Address"
      >
        {clientContent}
      </MobileSheetModal>

      {/* 4. Seller Sheet Modal */}
      <MobileSheetModal
        isOpen={activeMobileModal === "seller"}
        onClose={() => setActiveMobileModal(null)}
        title="Billed From (Seller Profile)"
        subtitle="Business name, logo, digital signature & contact details"
      >
        {sellerContent}
      </MobileSheetModal>

      {/* 5. Bank & UPI Sheet Modal */}
      <MobileSheetModal
        isOpen={activeMobileModal === "bank"}
        onClose={() => setActiveMobileModal(null)}
        title="Bank & Dynamic UPI QR"
        subtitle="Bank account details and instant scan-to-pay QR code"
      >
        {bankContent}
      </MobileSheetModal>

      {/* 6. Notes Sheet Modal */}
      <MobileSheetModal
        isOpen={activeMobileModal === "notes"}
        onClose={() => setActiveMobileModal(null)}
        title="Notes & Terms"
        subtitle="Payment terms, delivery conditions, and customer remarks"
      >
        {notesContent}
      </MobileSheetModal>
    </div>
  );
}

// Full-screen Mobile Sheet Modal Component
function MobileSheetModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  badge,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: string;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-slate-50 overscroll-contain animate-in slide-in-from-bottom duration-200"
    >
      {/* Sticky Sheet Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 active:scale-95 transition"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              {badge && (
                <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
        >
          <Check className="h-4 w-4" />
          <span>Done</span>
        </button>
      </div>

      {/* Scrollable Modal Body */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {children}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white shadow-xs active:scale-95 transition"
        >
          <Check className="h-4.5 w-4.5" />
          <span>Save &amp; Close</span>
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
  onOpenFullscreen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenFullscreen?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <div className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center justify-between pr-2 text-left"
        >
          <span>{title}</span>
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {onOpenFullscreen ? (
          <button
            type="button"
            onClick={onOpenFullscreen}
            title={`Open ${title} in fullscreen`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
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
  inputMode,
  step,
  min,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
  error?: string | null;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  step?: string;
  min?: number | string;
  placeholder?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        step={step}
        min={min}
        placeholder={placeholder}
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
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
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
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
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
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
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
            className="shrink-0 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 active:scale-95"
          >
            Remove
          </button>
        ) : null}
      </div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";
