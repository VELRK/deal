/** Paths where we should NOT return after login/register. */
const AUTH_PATH_PREFIXES = [
  "/login",
  "/register",
  "/forget-password",
  "/forgot-password",
  "/reset-password",
];

const STORAGE_KEY = "sk_auth_return";

export function isAuthPath(path: string): boolean {
  const p = (path.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  return AUTH_PATH_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + "/"));
}

/**
 * Only allow same-app relative paths (block open redirects).
 */
export function sanitizeAuthRedirect(raw: string | null | undefined, fallback = "/account-page"): string {
  if (!raw) return fallback;
  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep raw */
  }
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return fallback;
  }
  if (isAuthPath(path)) return fallback;
  return path;
}

/** Remember last non-auth page for modal login / register. */
export function rememberAuthReturn(pathWithSearch: string): void {
  if (!pathWithSearch || isAuthPath(pathWithSearch)) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, pathWithSearch);
  } catch {
    /* ignore */
  }
}

export function peekAuthReturn(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearAuthReturn(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Resolve where to send the user after successful auth.
 * Priority: explicit override → remembered page → fallback.
 */
export function resolveAuthRedirect(explicit?: string | null, fallback = "/account-page"): string {
  if (explicit) return sanitizeAuthRedirect(explicit, fallback);
  return sanitizeAuthRedirect(peekAuthReturn(), fallback);
}
