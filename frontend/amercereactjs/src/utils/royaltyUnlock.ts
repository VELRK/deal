import type { RoyaltyCartInfo } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";

/** Production unlock threshold for royalty Apply (default RM 100). */
export function royaltyUnlockMinRm(info: RoyaltyCartInfo | null | undefined): number {
  // Always use production unlock threshold (ignore test min_redeem_rm=0.01).
  const n = Number(info?.unlock_min_rm ?? 100);
  if (Number.isFinite(n) && n > 0) return n;
  const fallback = Number(info?.min_redeem_rm ?? 100);
  return fallback >= 1 ? fallback : 100;
}

/**
 * Apply is enabled only at RM 100 or above.
 * Below 100 → locked. Exactly 100 and anything higher → enabled.
 */
export function royaltyIsUnlocked(info: RoyaltyCartInfo | null | undefined): boolean {
  if (!info || info.enabled === false) return false;
  const balance = Math.round(Number(info.balance_rm || 0) * 100) / 100;
  const minRm = Math.round(royaltyUnlockMinRm(info) * 100) / 100;
  return balance >= minRm;
}

/** RM still needed in royalty balance before Apply unlocks. */
export function royaltyRemainingToUnlock(info: RoyaltyCartInfo | null | undefined): number {
  if (!info) return royaltyUnlockMinRm(info);
  if (royaltyIsUnlocked(info)) return 0;
  const remaining = royaltyUnlockMinRm(info) - Number(info.balance_rm || 0);
  return Math.max(0, Math.round(remaining * 100) / 100);
}

/** Short checkout/cart copy when royalty Apply is locked. */
export function royaltyUnlockMessage(info: RoyaltyCartInfo | null | undefined): string {
  const remaining = royaltyRemainingToUnlock(info);
  const minRm = royaltyUnlockMinRm(info);
  if (remaining <= 0) return "";
  if (Number(info?.points || 0) > 0) {
    return `You have ${formatPrice(remaining)} left to unlock royalty points. Available from ${formatPrice(minRm)} and above.`;
  }
  return `Royalty points unlock at ${formatPrice(minRm)} and above.`;
}
