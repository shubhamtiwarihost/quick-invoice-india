export interface StateCodeFaq {
  question: string;
  answer: string;
}

/** Shared by the visible FAQ section and the FAQPage structured data so they never drift apart. */
export const STATE_CODE_FAQS: StateCodeFaq[] = [
  {
    question: "What are GST state codes in India?",
    answer:
      "GST state codes are two-digit numbers that identify the State or Union Territory in which a taxpayer is registered. They form the first two digits of every 15-character GSTIN and are used to decide whether a sale is intra-state (CGST + SGST) or inter-state (IGST).",
  },
  {
    question: "What are the GST state codes of the major states?",
    answer:
      "Maharashtra is 27, Delhi is 07, Karnataka is 29, Gujarat is 24, Tamil Nadu is 33, Uttar Pradesh is 09, West Bengal is 19, Rajasthan is 08, Telangana is 36, Kerala is 32, Haryana is 06 and Madhya Pradesh is 23. The full list of all codes is in the table above.",
  },
  {
    question: "How many GST state codes are there?",
    answer:
      "This directory lists 38 codes: 28 States, 8 Union Territories, the older Andhra Pradesh code 28, and code 97 for Other Territory. Code 25 is no longer used, because Daman and Diu merged with Dadra and Nagar Haveli.",
  },
  {
    question: "What happened to GST state code 25 (Daman and Diu)?",
    answer:
      "Dadra and Nagar Haveli and Daman and Diu were merged into one Union Territory in January 2020. Registrations that started with code 25 moved to code 26, which is now the single operational code for the combined Union Territory.",
  },
  {
    question: "What is the difference between GST state codes 28 and 37 for Andhra Pradesh?",
    answer:
      "Both belong to Andhra Pradesh. Code 37 is the current code for the state, and code 28 is the older Andhra Pradesh code that you may still see on existing GSTINs. For tax purposes both are the same state, so a sale between a 28 and a 37 registration in Andhra Pradesh is intra-state (CGST + SGST), not IGST.",
  },
  {
    question: "What is the GST state code for Ladakh?",
    answer:
      "Ladakh has GST state code 38. When Ladakh became a separate Union Territory after the Jammu and Kashmir Reorganisation Act, Jammu and Kashmir kept code 01.",
  },
  {
    question: "What is GST code 97 (Other Territory)?",
    answer:
      "Code 97 is used for supplies made in places that do not fall within any State or Union Territory, such as offshore installations or areas beyond the territorial baseline. Code 99 is used on the GST system for Centre Jurisdiction and is not a state code you would normally put on an invoice.",
  },
  {
    question: "Does the state code decide whether I charge CGST + SGST or IGST?",
    answer:
      "Yes, it is the quickest check. If the supplier's state code and the Place of Supply state code are the same, charge CGST and SGST in equal halves. If they differ, charge IGST at the full rate. Note that Place of Supply follows the IGST Act rules, so for goods it is usually where delivery ends, which may differ from the state in the buyer's GSTIN.",
  },
  {
    question: "How do I find the state from a GSTIN?",
    answer:
      "Read the first two digits of the GSTIN and look them up in the table above. For example, a GSTIN starting with 09 is registered in Uttar Pradesh and one starting with 29 is registered in Karnataka. You can also paste the full number into the GSTIN validator, which reads the state, PAN and checksum for you.",
  },
  {
    question: "Can I test a GSTIN for any state code?",
    answer:
      "Yes. Click \"Validate GSTIN\" next to any state code in the table to open a sample GSTIN with a mathematically valid MOD 36 checksum for that state. These are test numbers for learning and software testing, not real registrations.",
  },
];
