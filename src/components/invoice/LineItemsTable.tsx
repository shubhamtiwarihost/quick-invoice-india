"use client";

import type { GstSlab, ItemUnit, LineItem } from "@/types/invoice";
import { useInvoiceStore } from "@/lib/store";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { lineTaxable } from "@/lib/gstEngine";
import { formatCurrency } from "@/lib/format";
import { slabOptions, legacySlabLabel } from "@/lib/gstSlabs";

const UNITS: ItemUnit[] = ["Pcs", "Mtrs", "Hrs", "Nos", "Bags", "Kgs"];

export function LineItemsTable({ gstOn }: { gstOn: boolean }) {
  const items = useInvoiceStore((s) => s.items);
  const addItem = useInvoiceStore((s) => s.addItem);
  const updateItem = useInvoiceStore((s) => s.updateItem);
  const removeItem = useInvoiceStore((s) => s.removeItem);

  function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    useInvoiceStore.setState({ items: newItems });
  }

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Line items</p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 shadow-xs active:scale-95 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>
      <div className="space-y-3.5">
        {items.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            index={index}
            totalItems={items.length}
            gstOn={gstOn}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            onMoveUp={() => moveItem(index, "up")}
            onMoveDown={() => moveItem(index, "down")}
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
  totalItems,
  gstOn,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canRemove,
}: {
  item: LineItem;
  index: number;
  totalItems: number;
  gstOn: boolean;
  onChange: (patch: Partial<LineItem>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canRemove: boolean;
}) {
  const { taxable } = lineTaxable(item);
  const gstAmount = gstOn ? (taxable * (item.gstSlab || 0)) / 100 : 0;
  const rowTotal = taxable + gstAmount;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-300">
      {/* Top action header with badge and reorder/delete buttons */}
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-lg bg-teal-50 border border-teal-200/80 px-2.5 py-1 text-xs font-bold text-teal-900 select-none whitespace-nowrap">
            Item #{index + 1}
          </span>
        </div>

        {/* Action button controls */}
        <div className="flex items-center gap-1">
          {totalItems > 1 ? (
            <>
              <button
                type="button"
                disabled={index === 0}
                onClick={onMoveUp}
                title="Move item up"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 active:scale-95 transition"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={index === totalItems - 1}
                onClick={onMoveDown}
                title="Move item down"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 active:scale-95 transition"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </>
          ) : null}

          <button
            type="button"
            disabled={!canRemove}
            onClick={onRemove}
            title="Delete this item"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 active:scale-95 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] font-semibold text-slate-600">
            Description of Goods / Services
          </label>
          <input
            placeholder="e.g. Brand identity design, Consultation, Hardware equipment"
            value={item.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Mini label="HSN / SAC">
            <input
              value={item.hsnSac}
              onChange={(e) => onChange({ hsnSac: e.target.value })}
              placeholder="e.g. 998314"
              className={inputClass}
            />
          </Mini>
          <Mini label="Quantity">
            <input
              type="number"
              inputMode="decimal"
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
          <Mini label="Rate (₹)">
            <input
              type="number"
              inputMode="decimal"
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
                className={`${inputClass} w-16 shrink-0`}
              >
                <option value="percent">%</option>
                <option value="flat">₹</option>
              </select>
              <input
                type="number"
                inputMode="decimal"
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
            <Mini label="GST Slab">
              <select
                value={item.gstSlab}
                onChange={(e) => onChange({ gstSlab: Number(e.target.value) as GstSlab })}
                className={inputClass}
              >
                {slabOptions(item.gstSlab).map((s) => (
                  <option key={s} value={s}>
                    {legacySlabLabel(s)}
                  </option>
                ))}
              </select>
            </Mini>
          ) : null}
        </div>
      </div>

      {/* Item Row Summary Badge at Bottom */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 border border-slate-100 text-xs">
        <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap select-none">
          Row #{index + 1}
        </span>
        <span className="text-[11px] text-slate-500 whitespace-nowrap select-none">
          Row Total:{" "}
          <strong className="font-mono text-slate-900 font-bold">
            {formatCurrency(rowTotal, "INR")}
          </strong>
        </span>
      </div>
    </div>
  );
}

function Mini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-slate-500 whitespace-nowrap">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600/20";
