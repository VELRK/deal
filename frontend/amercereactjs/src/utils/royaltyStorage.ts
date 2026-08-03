const KEY = "sk_use_royalty";

export function loadUseRoyalty(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function saveUseRoyalty(on: boolean): void {
  try {
    if (on) sessionStorage.setItem(KEY, "1");
    else sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
