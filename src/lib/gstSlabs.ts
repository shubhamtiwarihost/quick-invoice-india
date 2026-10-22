import type { GstSlab } from "@/types/invoice";

/**
 * GST 2.0 (effective 22 September 2025) replaced the old 5-slab structure
 * (0 / 5 / 12 / 18 / 28) with 0 / 5 / 18 / 40. 3% continues for gold and
 * jewellery. These are the rates offered when creating NEW documents.
 */
export const CURRENT_GST_SLABS: GstSlab[] = [0, 3, 5, 18, 40];

/** Slabs that were removed by GST 2.0 but may exist on older saved invoices. */
export const LEGACY_GST_SLABS: GstSlab[] = [12, 28];

export const GST_2_EFFECTIVE_DATE = "22 September 2025";

/**
 * Options for a slab <select>. Always returns the current slabs, and also keeps
 * a legacy slab (12% / 28%) selectable if the saved document already uses it,
 * so opening an older invoice never silently changes or blanks its rate.
 */
export function slabOptions(current?: number): GstSlab[] {
  if (
    current !== undefined &&
    (LEGACY_GST_SLABS as number[]).includes(current)
  ) {
    return [...CURRENT_GST_SLABS, current as GstSlab].sort((a, b) => a - b);
  }
  return CURRENT_GST_SLABS;
}

/** Coerce an arbitrary typical-rate value (e.g. from the HSN directory) to a valid slab. */
export function toGstSlab(rate: number): GstSlab {
  const all: number[] = [...CURRENT_GST_SLABS, ...LEGACY_GST_SLABS];
  return (all.includes(rate) ? rate : 18) as GstSlab;
}

export function legacySlabLabel(rate: number): string {
  return (LEGACY_GST_SLABS as number[]).includes(rate)
    ? `${rate}% (old rate, before ${GST_2_EFFECTIVE_DATE})`
    : `${rate}%`;
}
