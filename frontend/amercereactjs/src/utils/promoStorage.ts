const APPLIED_KEY = "sk_applied_promo";

export type StoredPromo = { code: string; discount: number };

export function loadStoredPromo(): StoredPromo | null {
  try {
    const raw = sessionStorage.getItem(APPLIED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPromo;
    if (!parsed?.code) return null;
    return { code: parsed.code, discount: Number(parsed.discount) || 0 };
  } catch {
    return null;
  }
}

export function saveStoredPromo(promo: StoredPromo | null): void {
  if (!promo?.code) {
    sessionStorage.removeItem(APPLIED_KEY);
    return;
  }
  sessionStorage.setItem(APPLIED_KEY, JSON.stringify(promo));
}
