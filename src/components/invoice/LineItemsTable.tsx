"use client";

import type { GstSlab, ItemUnit, LineItem } from "@/types/invoice";
import { useInvoiceStore } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";

const UNITS: ItemUnit[] = ["Pcs", "Mtrs", "Hrs", "Nos", "Bags", "Kgs"];
const SLABS: GstSlab[] = [0, 5, 12, 18, 28];

export function LineItemsTable({ gstOn }: { gstOn: boolean }) {
  const items = useInvoiceStore((s) => s.items);
  const addItem = useInvoiceStore((s) => s.addItem);
  const updateItem = useInvoiceStore((s) => s.updateItem);
  const removeItem = useInvoiceStore((s) => s.removeItem);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Line items</p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            index={index}
            gstOn={gstOn}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            canRemove={items.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  index,
  gstOn,
  onChange,
  onRemove,
  canRemove,
}: {
  item: LineItem;
  index: number;
  gstOn: boolean;
  onChange: (patch: Partial<LineItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Item {index + 1}</span>
        <button
          type="button"
          disabled={!canRemove}
          onClick={onRemove}
          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <input
        placeholder="Description of goods / services"
        value={item.description}
        onChange={(e) => onChange({ description: e.target.value })}
        className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Mini label="HSN / SAC">
          <input
            value={item.hsnSac}
            onChange={(e) => onChange({ hsnSac: e.target.value })}
            className={inputClass}
          />
        </Mini>
        <Mini label="Qty">
          <input
            type="number"
            min={0}
            step="any"
            value={item.quantity}
            onChange={(e) => {
              const v = e.target.value;
              onChange({ quantity: v === "" ? 0 : Number(v) });
            }}
            className={inputClass}
          />
        </Mini>
        <Mini label="Unit">
          <select
            value={item.unit}
            onChange={(e) => onChange({ unit: e.target.value as ItemUnit })}
            className={inputClass}
          >
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </Mini>
        <Mini label="Rate">
          <input
            type="number"
            min={0}
            step="any"
            value={item.rate}
            onChange={(e) => {
              const v = e.target.value;
              onChange({ rate: v === "" ? 0 : Number(v) });
            }}
            className={inputClass}
          />
        </Mini>
        <Mini label="Discount">
          <div className="flex gap-1">
            <select
              value={item.discountType}
              onChange={(e) =>
                onChange({ discountType: e.target.value as LineItem["discountType"] })
              }
              className={`${inputClass} w-16`}
            >
              <option value="percent">%</option>
              <option value="flat">₹</option>
            </select>
            <input
              type="number"
              min={0}
              step="any"
              value={item.discountValue}
              onChange={(e) => {
                const v = e.target.value;
                onChange({ discountValue: v === "" ? 0 : Number(v) });
              }}
              className={inputClass}
            />
          </div>
        </Mini>
        {gstOn ? (
          <Mini label="GST slab">
            <select
              value={item.gstSlab}
              onChange={(e) => onChange({ gstSlab: Number(e.target.value) as GstSlab })}
              className={inputClass}
            >
              {SLABS.map((s) => (
                <option key={s} value={s}>
                  {s}%
                </option>
              ))}
            </select>
          </Mini>
        ) : null}
      </div>
    </div>
  );
}

function Mini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";
