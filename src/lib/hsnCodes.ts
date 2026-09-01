export interface HsnEntry {
  code: string;
  type: "HSN" | "SAC";
  description: string;
  typicalGst: number;
}

export const HSN_DIRECTORY: HsnEntry[] = [
  { code: "0401", type: "HSN", description: "Milk and cream", typicalGst: 5 },
  { code: "0902", type: "HSN", description: "Tea, whether or not flavoured", typicalGst: 5 },
  { code: "1006", type: "HSN", description: "Rice", typicalGst: 5 },
  { code: "1701", type: "HSN", description: "Cane or beet sugar", typicalGst: 5 },
  { code: "1905", type: "HSN", description: "Bread, pastry, cakes, biscuits", typicalGst: 18 },
  { code: "2106", type: "HSN", description: "Food preparations n.e.s. (namkeen, mixes)", typicalGst: 18 },
  { code: "2201", type: "HSN", description: "Waters, including mineral and aerated", typicalGst: 18 },
  { code: "3004", type: "HSN", description: "Medicaments (formulated)", typicalGst: 12 },
  { code: "3304", type: "HSN", description: "Beauty or make-up preparations", typicalGst: 18 },
  { code: "3401", type: "HSN", description: "Soap, organic surface-active products", typicalGst: 18 },
  { code: "3923", type: "HSN", description: "Plastic packing articles (boxes, bags)", typicalGst: 18 },
  { code: "4202", type: "HSN", description: "Trunks, handbags, wallets", typicalGst: 18 },
  { code: "420222", type: "HSN", description: "Handbags / tote bags with outer surface of textile", typicalGst: 5 },
  { code: "4819", type: "HSN", description: "Cartons, boxes, cases of paper", typicalGst: 18 },
  { code: "4901", type: "HSN", description: "Printed books, brochures", typicalGst: 0 },
  { code: "4911", type: "HSN", description: "Other printed matter (catalogues, posters)", typicalGst: 12 },
  { code: "491110", type: "HSN", description: "Trade advertising material, commercial catalogues", typicalGst: 12 },
  { code: "5208", type: "HSN", description: "Woven cotton fabrics", typicalGst: 5 },
  { code: "6109", type: "HSN", description: "T-shirts, singlets, knitted", typicalGst: 5 },
  { code: "6204", type: "HSN", description: "Women's suits, dresses, skirts", typicalGst: 12 },
  { code: "6403", type: "HSN", description: "Footwear with leather uppers", typicalGst: 18 },
  { code: "7113", type: "HSN", description: "Articles of jewellery", typicalGst: 3 },
  { code: "8471", type: "HSN", description: "Computers and automatic data processing machines", typicalGst: 18 },
  { code: "8517", type: "HSN", description: "Telephones, including smartphones", typicalGst: 18 },
  { code: "9403", type: "HSN", description: "Other furniture and parts", typicalGst: 18 },
  { code: "9619", type: "HSN", description: "Sanitary towels and similar articles", typicalGst: 12 },
  { code: "9954", type: "SAC", description: "Construction services", typicalGst: 18 },
  { code: "9961", type: "SAC", description: "Services in wholesale trade", typicalGst: 18 },
  { code: "9963", type: "SAC", description: "Accommodation, food and beverage services", typicalGst: 5 },
  { code: "9964", type: "SAC", description: "Passenger transport services", typicalGst: 5 },
  { code: "9965", type: "SAC", description: "Goods transport services", typicalGst: 18 },
  { code: "9971", type: "SAC", description: "Financial and related services", typicalGst: 18 },
  { code: "9972", type: "SAC", description: "Real estate services", typicalGst: 18 },
  { code: "9973", type: "SAC", description: "Leasing or rental services", typicalGst: 18 },
  { code: "9982", type: "SAC", description: "Legal and accounting services", typicalGst: 18 },
  { code: "9983", type: "SAC", description: "Other professional, technical and business services", typicalGst: 18 },
  { code: "998314", type: "SAC", description: "Design services (graphic, interior, industrial)", typicalGst: 18 },
  { code: "998313", type: "SAC", description: "Information technology consulting and support", typicalGst: 18 },
  { code: "998361", type: "SAC", description: "Advertising services", typicalGst: 18 },
  { code: "9984", type: "SAC", description: "Telecommunications, broadcasting and information supply", typicalGst: 18 },
  { code: "9992", type: "SAC", description: "Education services", typicalGst: 0 },
  { code: "9993", type: "SAC", description: "Human health and social care services", typicalGst: 0 },
  { code: "9996", type: "SAC", description: "Recreational, cultural and sporting services", typicalGst: 18 },
  { code: "9997", type: "SAC", description: "Other services (membership, etc.)", typicalGst: 18 },
];

export function searchHsn(query: string): HsnEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return HSN_DIRECTORY;
  return HSN_DIRECTORY.filter(
    (row) =>
      row.code.includes(q) ||
      row.description.toLowerCase().includes(q) ||
      row.type.toLowerCase() === q,
  );
}
