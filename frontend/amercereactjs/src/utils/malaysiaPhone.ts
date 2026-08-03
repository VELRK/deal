export const MY_COUNTRY_CODE = "60";

export const MY_PHONE_ERROR =
  "Enter a valid Malaysia mobile number (e.g. 0123456789 or 60123456789).";

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

/** Validate Malaysian mobile (01X locally, mobile digit starts with 1 after country code). */
export function isValidMalaysiaMobile(input: string): boolean {
  const e164 = toMalaysiaE164(input);
  if (!e164.startsWith(MY_COUNTRY_CODE)) return false;
  const mobile = e164.slice(MY_COUNTRY_CODE.length);
  if (mobile.length < 9 || mobile.length > 10) return false;
  return mobile[0] === "1";
}

/** Local display: 012-345 6789 */
export function formatMalaysiaDisplay(digits: string): string {
  const d = stripPhoneDigits(digits).slice(0, 11);
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
