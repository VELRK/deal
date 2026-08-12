export const MY_COUNTRY_CODE = "60";

/** Malaysia mobile must be exactly 10 digits locally (01XXXXXXXX). */
export const MY_PHONE_ERROR =
  "Enter a valid 10-digit Malaysia mobile number (e.g. 0123456789).";

/** Strip to digits only. */
export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normalize to E.164 digits without + (e.g. 60123456789). */
export function toMalaysiaE164(input: string): string {
  const d = stripPhoneDigits(input);
  if (d === "") return "";
  if (d.startsWith(MY_COUNTRY_CODE)) return d;
  if (d.startsWith("0")) return MY_COUNTRY_CODE + d.slice(1);
  return MY_COUNTRY_CODE + d;
}

/**
 * Validate Malaysian mobile: exactly 10 digits with leading 0 (01XXXXXXXX),
 * or E.164 601XXXXXXXX (11 digits). Rejects 9-digit numbers.
 */
export function isValidMalaysiaMobile(input: string): boolean {
  const d = stripPhoneDigits(input);
  if (d.startsWith(MY_COUNTRY_CODE)) {
    const mobile = d.slice(MY_COUNTRY_CODE.length).replace(/^0+/, "");
    return mobile.length === 9 && mobile[0] === "1";
  }
  if (d.startsWith("0")) {
    return d.length === 10 && d[1] === "1";
  }
  // Bare national number without leading 0 is not accepted — require 10-digit local form.
  return false;
}

/** Local display: 012-345 6789 (max 10 digits). */
export function formatMalaysiaDisplay(digits: string): string {
  const d = stripPhoneDigits(digits).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Display stored E.164 as +60 12-345 6789 */
export function formatMalaysiaIntl(e164: string): string {
  const d = stripPhoneDigits(e164);
  const local = d.startsWith(MY_COUNTRY_CODE) ? "0" + d.slice(MY_COUNTRY_CODE.length) : d;
  return `+${MY_COUNTRY_CODE} ${formatMalaysiaDisplay(local)}`.trim();
}
