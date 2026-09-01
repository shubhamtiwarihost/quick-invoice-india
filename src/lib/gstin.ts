export const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

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
