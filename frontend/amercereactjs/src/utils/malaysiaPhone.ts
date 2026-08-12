export const MY_COUNTRY_CODE = "60";

/** Shown when the number is not a valid MY mobile. */
export const MY_PHONE_ERROR =
  "Enter a valid Malaysia mobile number (e.g. 0123456789).";

/** Strip to digits only. */
export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normalize to E.164 digits without + (e.g. 60123456789). */
export function toMalaysiaE164(input: string): string {
  const d = stripPhoneDigits(input);
  if (d === "") return "";
  if (d.startsWith(MY_COUNTRY_CODE)) {
    const mobile = d.slice(MY_COUNTRY_CODE.length).replace(/^0+/, "");
    return mobile ? MY_COUNTRY_CODE + mobile : "";
  }
  if (d.startsWith("0")) return MY_COUNTRY_CODE + d.slice(1);
  // Input next to +60 UI: national number without leading 0 (1XXXXXXXX)
  return MY_COUNTRY_CODE + d;
}

/**
 * Validate Malaysian mobile.
 * Accepts:
 * - 01XXXXXXXX (10 digits local)
 * - 601XXXXXXXX / +601XXXXXXXX
 * - 1XXXXXXXX (9 digits) when typed beside the +60 prefix
 */
export function isValidMalaysiaMobile(input: string): boolean {
  const d = stripPhoneDigits(input);
  if (!d) return false;

  let mobile = d;
  if (d.startsWith(MY_COUNTRY_CODE)) {
    mobile = d.slice(MY_COUNTRY_CODE.length).replace(/^0+/, "");
  } else if (d.startsWith("0")) {
    mobile = d.slice(1);
  }

  // After country / trunk prefix: exactly 9 digits starting with 1 (01X…)
  return mobile.length === 9 && mobile[0] === "1";
}

/** Local display: 012-345 6789 or 12-345 6789 (max 10 digits). */
export function formatMalaysiaDisplay(digits: string): string {
  const d = stripPhoneDigits(digits).slice(0, 10);
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
