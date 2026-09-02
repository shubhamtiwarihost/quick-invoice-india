import { getStateByCode, type IndianState } from "@/lib/indianStates";

export const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const PAN_ENTITY_TYPES: Record<string, { title: string; desc: string }> = {
  C: {
    title: "Company",
    desc: "Private Limited, Public Limited, or One Person Company (OPC)",
  },
  P: {
    title: "Individual / Proprietorship",
    desc: "Sole proprietor or individual business owner",
  },
  F: {
    title: "Partnership Firm / LLP",
    desc: "Registered partnership firm or Limited Liability Partnership",
  },
  H: {
    title: "Hindu Undivided Family (HUF)",
    desc: "Family-owned ancestral business governed under Hindu law",
  },
  T: {
    title: "Trust",
    desc: "Charitable, private, or religious registered trust",
  },
  A: {
    title: "Association of Persons (AOP)",
    desc: "Group of individuals joining together for common purpose",
  },
  B: {
    title: "Body of Individuals (BOI)",
    desc: "Group of individuals without formal partnership agreement",
  },
  G: {
    title: "Government Agency",
    desc: "Central or State Government department or enterprise",
  },
  L: {
    title: "Local Authority",
    desc: "Municipal corporation, panchayat, or port authority",
  },
  J: {
    title: "Artificial Juridical Person",
    desc: "Legal entity not covered under other categories (e.g. deity, universities)",
  },
};

export function isValidGstin(value: string): boolean {
  if (!value.trim()) return true;
  return GSTIN_REGEX.test(value.trim().toUpperCase());
}

export function gstinHint(value: string): string | null {
  if (!value.trim()) return null;
  return isValidGstin(value)
    ? null
    : "GSTIN must be 15 characters (e.g. 27AAPCA1234A1Z5)";
}

export function computeGstinCheckDigit(gstin14: string): string | null {
  if (!gstin14 || gstin14.length < 14) return null;
  const chars = gstin14.toUpperCase().slice(0, 14);
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    const char = chars[i];
    const val = CHARS.indexOf(char);
    if (val === -1) return null;

    // Alternating weights 1 and 2
    const weight = i % 2 === 0 ? 1 : 2;
    const product = val * weight;
    const quotient = Math.floor(product / 36);
    const remainder = product % 36;
    sum += quotient + remainder;
  }

  const remainder = sum % 36;
  const checkCode = (36 - remainder) % 36;
  return CHARS[checkCode];
}

export interface GstinBreakdown {
  raw: string;
  formatted: string;
  isValidFormat: boolean;
  isValidChecksum: boolean;
  stateCode: string;
  state: IndianState | undefined;
  pan: string;
  entityCode: string;
  entityType: { title: string; desc: string } | undefined;
  entityRegistrationNumber: string;
  defaultZChar: string;
  checksumChar: string;
  calculatedChecksum: string | null;
  errors: string[];
}

export function parseAndValidateGstin(input: string): GstinBreakdown {
  const formatted = input.trim().toUpperCase();
  const errors: string[] = [];

  const isValidFormat = GSTIN_REGEX.test(formatted);
  if (formatted.length > 0 && formatted.length < 15) {
    errors.push(`GSTIN is ${formatted.length} characters long. A full GSTIN must be exactly 15 characters.`);
  } else if (formatted.length > 15) {
    errors.push("GSTIN cannot exceed 15 characters.");
  } else if (formatted.length === 15 && !isValidFormat) {
    errors.push("GSTIN format is invalid. Ensure characters follow [2 digits state][10 char PAN][1 entity digit][Z][1 checksum digit].");
  }

  const stateCode = formatted.slice(0, 2);
  const state = stateCode.length === 2 ? getStateByCode(stateCode) : undefined;
  if (stateCode.length === 2 && !state) {
    errors.push(`State code '${stateCode}' is not a recognized Indian State / UT code (01-38, 97).`);
  }

  const pan = formatted.slice(2, 12);
  const entityCode = formatted.length >= 6 ? formatted[5] : "";
  const entityType = entityCode ? PAN_ENTITY_TYPES[entityCode] : undefined;

  const entityRegistrationNumber = formatted.length >= 13 ? formatted[12] : "";
  const defaultZChar = formatted.length >= 14 ? formatted[13] : "";
  if (defaultZChar && defaultZChar !== "Z") {
    errors.push(`14th character must be 'Z' by default (received '${defaultZChar}').`);
  }

  const checksumChar = formatted.length >= 15 ? formatted[14] : "";
  const calculatedChecksum = formatted.length >= 14 ? computeGstinCheckDigit(formatted.slice(0, 14)) : null;
  const isValidChecksum =
    Boolean(checksumChar) &&
    Boolean(calculatedChecksum) &&
    checksumChar === calculatedChecksum;

  if (formatted.length === 15 && calculatedChecksum && checksumChar !== calculatedChecksum) {
    errors.push(
      `MOD 36 Check digit mismatch: received '${checksumChar}', but algorithm computed '${calculatedChecksum}'.`,
    );
  }

  return {
    raw: input,
    formatted,
    isValidFormat,
    isValidChecksum,
    stateCode,
    state,
    pan,
    entityCode,
    entityType,
    entityRegistrationNumber,
    defaultZChar,
    checksumChar,
    calculatedChecksum,
    errors,
  };
}
