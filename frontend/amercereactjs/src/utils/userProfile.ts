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
  return /^User\s+\d{2,6}$/i.test(name.trim());
}

/** New / incomplete OTP accounts still need name + real email at checkout. */
export function isProfileIncomplete(user?: ApiUser | null): boolean {
  if (!user) return true;
  return isPlaceholderName(user.name) || isPlaceholderEmail(user.email);
}
