export interface HsnEntry {
  code: string;
  type: "HSN" | "SAC";
  description: string;
  /** Typical GST rate (%) under GST 2.0 (effective 22 September 2025). */
  typicalGst: number;
  /** Threshold, exception or condition that changes the rate for this code. */
  note?: string;
}

/**
 * Rates reflect GST 2.0 (slabs 0 / 5 / 18 / 40, plus 3% for gold and jewellery).
 * This directory is a convenience reference, not a legal notification. Always
 * confirm the exact rate for your product against the CBIC rate notification.
 */
export const HSN_DIRECTORY: HsnEntry[] = [
  // ---- Food, beverages and agriculture ----
  { code: "0401", type: "HSN", description: "Milk (fresh, pasteurised, UHT)", typicalGst: 0, note: "Flavoured or sweetened milk drinks are taxed at a higher rate." },
  { code: "0405", type: "HSN", description: "Butter, ghee and dairy spreads", typicalGst: 5, note: "Was 12% before 22 Sept 2025." },
  { code: "0406", type: "HSN", description: "Cheese, paneer and chhena", typicalGst: 5, note: "Paneer / chhena is nil-rated (0%); processed cheese is 5%." },
  { code: "0902", type: "HSN", description: "Tea, whether or not flavoured", typicalGst: 5 },
  { code: "0901", type: "HSN", description: "Coffee, roasted or not", typicalGst: 5 },
  { code: "1006", type: "HSN", description: "Rice", typicalGst: 5, note: "Loose, unbranded rice is 0%; branded, pre-packed rice is 5%." },
  { code: "1101", type: "HSN", description: "Wheat flour (atta, maida)", typicalGst: 5, note: "Loose, unbranded flour is 0%; branded, pre-packed flour is 5%." },
  { code: "1512", type: "HSN", description: "Sunflower, safflower or cottonseed oil", typicalGst: 5 },
  { code: "1514", type: "HSN", description: "Mustard and rapeseed oil", typicalGst: 5 },
  { code: "1701", type: "HSN", description: "Cane or beet sugar", typicalGst: 5 },
  { code: "1704", type: "HSN", description: "Sugar confectionery (toffees, candies)", typicalGst: 18 },
  { code: "1806", type: "HSN", description: "Chocolate and cocoa preparations", typicalGst: 18 },
  { code: "1905", type: "HSN", description: "Biscuits, pastries and cakes", typicalGst: 5, note: "Indian breads (roti, paratha) are 0%. Was 18% for biscuits and pastries before 22 Sept 2025." },
  { code: "2106", type: "HSN", description: "Namkeen, bhujia and food mixes", typicalGst: 5, note: "Was 12% to 18% before 22 Sept 2025." },
  { code: "2201", type: "HSN", description: "Mineral and packaged drinking water (unsweetened)", typicalGst: 5 },
  { code: "2202", type: "HSN", description: "Aerated, sweetened or flavoured beverages", typicalGst: 40, note: "Was 28% plus cess before 22 Sept 2025." },
  { code: "2501", type: "HSN", description: "Salt", typicalGst: 0 },

  // ---- Health, personal care and household ----
  { code: "3004", type: "HSN", description: "Medicaments (formulated)", typicalGst: 5, note: "Specified life-saving drugs are 0%. Was 12% before 22 Sept 2025." },
  { code: "3304", type: "HSN", description: "Beauty or make-up preparations", typicalGst: 18 },
  { code: "3305", type: "HSN", description: "Hair oil and shampoo", typicalGst: 5, note: "Was 18% before 22 Sept 2025." },
  { code: "3306", type: "HSN", description: "Toothpaste and oral hygiene products", typicalGst: 5, note: "Was 18% before 22 Sept 2025." },
  { code: "3401", type: "HSN", description: "Soap, organic surface-active products", typicalGst: 5, note: "Was 18% before 22 Sept 2025." },
  { code: "3402", type: "HSN", description: "Detergents and washing preparations", typicalGst: 18 },
  { code: "9619", type: "HSN", description: "Sanitary towels, napkins and tampons", typicalGst: 0, note: "Was 12% before 22 Sept 2025." },

  // ---- Plastics, paper and printed matter ----
  { code: "3923", type: "HSN", description: "Plastic packing articles (boxes, bags)", typicalGst: 18 },
  { code: "4819", type: "HSN", description: "Cartons, boxes, cases of paper", typicalGst: 18 },
  { code: "4901", type: "HSN", description: "Printed books, brochures", typicalGst: 0, note: "Printed books and newspapers are 0%." },
  { code: "4911", type: "HSN", description: "Other printed matter (catalogues, leaflets, posters)", typicalGst: 5, note: "Brochures and leaflets are 5%. Was 12% before 22 Sept 2025." },
  { code: "491110", type: "HSN", description: "Trade advertising material, commercial catalogues", typicalGst: 5, note: "Was 12% before 22 Sept 2025." },

  // ---- Textiles, apparel and footwear ----
  { code: "5208", type: "HSN", description: "Woven cotton fabrics", typicalGst: 5 },
  { code: "6109", type: "HSN", description: "T-shirts, singlets, knitted garments", typicalGst: 5, note: "5% for garments priced up to ₹2,500 per piece; 18% above ₹2,500." },
  { code: "6204", type: "HSN", description: "Women's suits, dresses, skirts (not knitted)", typicalGst: 5, note: "5% for garments priced up to ₹2,500 per piece; 18% above ₹2,500. Was 12% before 22 Sept 2025." },
  { code: "6214", type: "HSN", description: "Shawls, scarves, dupattas", typicalGst: 5, note: "5% up to ₹2,500 per piece; 18% above ₹2,500." },
  { code: "6403", type: "HSN", description: "Footwear with leather uppers", typicalGst: 5, note: "5% up to ₹2,500 per pair; 18% above ₹2,500." },
  { code: "4202", type: "HSN", description: "Trunks, handbags, wallets", typicalGst: 18 },
  { code: "420222", type: "HSN", description: "Handbags / tote bags with outer surface of textile", typicalGst: 5 },
  { code: "7113", type: "HSN", description: "Articles of jewellery (gold, silver)", typicalGst: 3 },

  // ---- Electronics, appliances and furniture ----
  { code: "8415", type: "HSN", description: "Air conditioning machines", typicalGst: 18, note: "Was 28% before 22 Sept 2025." },
  { code: "8418", type: "HSN", description: "Refrigerators and freezers", typicalGst: 18, note: "Was 28% before 22 Sept 2025." },
  { code: "8450", type: "HSN", description: "Household washing machines", typicalGst: 18, note: "Was 28% before 22 Sept 2025." },
  { code: "8471", type: "HSN", description: "Computers and automatic data processing machines", typicalGst: 18 },
  { code: "8517", type: "HSN", description: "Telephones, including smartphones", typicalGst: 18 },
  { code: "8528", type: "HSN", description: "Televisions and monitors", typicalGst: 18, note: "Was 28% for larger screens before 22 Sept 2025." },
  { code: "9403", type: "HSN", description: "Other furniture and parts", typicalGst: 18, note: "Bamboo, cane and rattan furniture is 5%." },

  // ---- Building material and vehicles ----
  { code: "2523", type: "HSN", description: "Cement", typicalGst: 18, note: "Was 28% before 22 Sept 2025." },
  { code: "8703", type: "HSN", description: "Motor cars and passenger vehicles", typicalGst: 18, note: "Small petrol/CNG/LPG cars (up to 1200 cc, 4000 mm) are 18%. Larger cars and SUVs are 40%." },
  { code: "8708", type: "HSN", description: "Motor vehicle parts and accessories", typicalGst: 18, note: "Was 28% before 22 Sept 2025." },
  { code: "8711", type: "HSN", description: "Motorcycles and scooters", typicalGst: 18, note: "Up to 350 cc: 18%. Above 350 cc: 40%." },

  // ---- Services ----
  { code: "9954", type: "SAC", description: "Construction services", typicalGst: 18 },
  { code: "9961", type: "SAC", description: "Services in wholesale trade", typicalGst: 18 },
  { code: "9963", type: "SAC", description: "Accommodation, food and beverage services", typicalGst: 5, note: "Hotel rooms priced ₹1,000 to ₹7,500 per day: 5%; above ₹7,500: 18%. Restaurants: 5% without input tax credit." },
  { code: "9964", type: "SAC", description: "Passenger transport services", typicalGst: 5, note: "Rate depends on the mode and class of transport." },
  { code: "9965", type: "SAC", description: "Goods transport services (GTA)", typicalGst: 18, note: "GTA can opt for 5% without input tax credit or 18% with credit." },
  { code: "9971", type: "SAC", description: "Financial and related services", typicalGst: 18 },
  { code: "9972", type: "SAC", description: "Real estate services", typicalGst: 18 },
  { code: "9973", type: "SAC", description: "Leasing or rental services", typicalGst: 18 },
  { code: "9982", type: "SAC", description: "Legal and accounting services", typicalGst: 18 },
  { code: "9983", type: "SAC", description: "Other professional, technical and business services", typicalGst: 18 },
  { code: "998313", type: "SAC", description: "Information technology consulting and support", typicalGst: 18 },
  { code: "998314", type: "SAC", description: "IT design and development services (software, web, app)", typicalGst: 18 },
  { code: "998391", type: "SAC", description: "Specialty design services (graphic, interior, fashion, industrial)", typicalGst: 18 },
  { code: "998361", type: "SAC", description: "Advertising services", typicalGst: 18 },
  { code: "998822", type: "SAC", description: "Tailoring, stitching and apparel job work", typicalGst: 5, note: "Concessional rate for job work on textiles and apparel." },
  { code: "9984", type: "SAC", description: "Telecommunications, broadcasting and information supply", typicalGst: 18 },
  { code: "9992", type: "SAC", description: "Education services", typicalGst: 0, note: "Exempt only for specified education services by recognised institutions." },
  { code: "9993", type: "SAC", description: "Human health and social care services", typicalGst: 0, note: "Exempt only for specified clinical and healthcare services." },
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
      (row.note?.toLowerCase().includes(q) ?? false) ||
      row.type.toLowerCase() === q,
  );
}
