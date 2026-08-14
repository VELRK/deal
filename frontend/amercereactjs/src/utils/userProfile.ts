import type { ApiUser } from "@/services/api";

/** Placeholder emails created for phone-OTP auto-register. */
export function isPlaceholderEmail(email?: string | null): boolean {
  if (!email) return true;
  const e = email.toLowerCase();
  return (
    e.startsWith("ph_")
    || e.endsWith("@shopkart.app")
    || e.endsWith("@2deal.app")
  );
}

export function isPlaceholderName(name?: string | null): boolean {
  if (!name || !name.trim()) return true;
  const n = name.trim();
  // OTP / auto-generated labels: "User 1982", "SER001", "USR1234", etc.
  return /^(User|SER|USR|CUST)\s*\d{1,8}$/i.test(n);
}

/** Incomplete until a real customer name is set (email is optional). */
export function isProfileIncomplete(user?: ApiUser | null): boolean {
  if (!user) return true;
  return isPlaceholderName(user.name);
}
