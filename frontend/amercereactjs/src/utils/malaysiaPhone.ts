export const MY_COUNTRY_CODE = "60";

/** Shown when the number is not a valid MY mobile. */
export const MY_PHONE_ERROR =
  "Enter a valid Malaysia mobile number (e.g. 0123456789 or 01110861982).";

/** Strip to digits only. */
export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * National mobile digits after removing +60 / leading 0.
 * 9 digits → local 01XXXXXXXX (10-digit)
 * 10 digits → local 01XXXXXXXXX (11-digit, e.g. 011-1086 1982)
 */
export function malaysiaNationalMobile(input: string): string {
  const d = stripPhoneDigits(input);
  if (!d) return "";
  if (d.startsWith(MY_COUNTRY_CODE)) {
    return d.slice(MY_COUNTRY_CODE.length).replace(/^0+/, "");
  }
  if (d.startsWith("0")) return d.slice(1);
  return d;
}

/** Normalize to E.164 digits without + (e.g. 60123456789 or 601110861982). */
export function toMalaysiaE164(input: string): string {
  const mobile = malaysiaNationalMobile(input);
  if (!mobile) return "";
  return MY_COUNTRY_CODE + mobile;
}

/**
 * Validate Malaysian mobile.
 * Accepts (hyphens/spaces ignored):
 * - 01XXXXXXXX (10 digits) / 01XXXXXXXXX (11 digits)
 * - 601XXXXXXXX / +601XXXXXXXX / 601XXXXXXXXX
 * - 1XXXXXXXX or 1XXXXXXXXX beside the +60 prefix (e.g. 111-086 1982)
 */
export function isValidMalaysiaMobile(input: string): boolean {
  const mobile = malaysiaNationalMobile(input);
  // After country / trunk prefix: 9–10 digits starting with 1 (01X…)
  return (
    (mobile.length === 9 || mobile.length === 10) &&
    mobile[0] === "1"
  );
}

/** Local display beside +60: 12-345 6789 or 111-086 1982 (max 10 national digits). */
export function formatMalaysiaDisplay(digits: string): string {
  const d = stripPhoneDigits(digits).replace(/^0+/, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Display stored E.164 as +60 12-345 6789 */
export function formatMalaysiaIntl(e164: string): string {
  const d = stripPhoneDigits(e164);
  const local = d.startsWith(MY_COUNTRY_CODE)
    ? d.slice(MY_COUNTRY_CODE.length)
    : d.replace(/^0/, "");
  return `+${MY_COUNTRY_CODE} ${formatMalaysiaDisplay(local)}`.trim();
}
