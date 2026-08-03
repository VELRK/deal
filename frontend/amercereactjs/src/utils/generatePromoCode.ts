/** Mirrors backend Sk_Affiliate_model::generate_promo_code — first 4 name letters + last 4 phone digits. */
export function generatePromoCode(name: string, phone: string): string {
  const letters = name.replace(/[^a-zA-Z]/g, "");
  let four = letters.substring(0, 4).toUpperCase();
  while (four.length < 4) four += "0";

  const digits = phone.replace(/\D/g, "");
  let last4: string;
  if (!digits) last4 = "0000";
  else if (digits.length >= 4) last4 = digits.slice(-4);
  else last4 = digits.padStart(4, "0");

  return four + last4;
}
