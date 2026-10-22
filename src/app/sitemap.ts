import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://swiftgst.in";

/**
 * Pages that are meant to rank. Legal and trust pages (privacy, terms, disclaimer,
 * about, contact) stay crawlable through the footer but are deliberately left out of
 * the sitemap so Google's attention goes to the pages that answer search queries.
 *
 * `updated` is the date of the last real content change. Google uses lastmod only when
 * it has proven accurate, so do NOT bump it for cosmetic edits and do NOT use the build
 * time. Leave it undefined for pages whose content has not changed recently.
 */
const PAGES: { path: string; updated?: string }[] = [
  { path: "/", updated: "2026-10-22" },
  { path: "/invoice/", updated: "2026-10-22" },
  { path: "/gst-calculator/", updated: "2026-10-22" },
  { path: "/hsn-finder/", updated: "2026-10-22" },
  { path: "/gst-state-codes/", updated: "2026-10-22" },
  { path: "/gstin-validator/", updated: "2026-10-22" },
  { path: "/composition-calculator/", updated: "2026-10-22" },
  { path: "/eway-bill-checker/" },
  { path: "/freelance-rate-calculator/" },
  { path: "/quotation-maker/", updated: "2026-10-22" },
  { path: "/gst-invoice-templates/", updated: "2026-10-22" },
  { path: "/kirana-store-bill-maker/", updated: "2026-10-22" },
  { path: "/boutique-invoice-generator/", updated: "2026-10-22" },
  { path: "/freelancer-invoice-generator/" },
  { path: "/retail-pos-software/" },
  { path: "/vyapar-free-alternative/" },
  { path: "/cleartax-free-alternative/" },
  { path: "/mybillbook-free-alternative/" },
  { path: "/pdf-tools/" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, updated }) => ({
    url: `${BASE_URL}${path}`,
    ...(updated ? { lastModified: new Date(updated) } : {}),
  }));
}
