/** Live storefront brand from admin settings (updated when settings load). */
let liveSiteName = "";

export function setLiveSiteName(name: string | undefined | null) {
  const next = (name ?? "").trim();
  if (next) liveSiteName = next;
}

export function getLiveSiteName(fallback = "2Deal"): string {
  return liveSiteName || fallback;
}

/** Stale marketing / default titles that must never win over admin site_name. */
export function isLegacyMarketingTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  const lower = t.toLowerCase();
  return (
    lower === "2deal" ||
    lower === "2deal online store" ||
    lower.includes("incense sticks") ||
    lower.includes("dhoop sticks") ||
    lower.includes("sambrani") ||
    /soaps\s*&\s*food products/i.test(t) ||
    /soaps\s+and\s+food products/i.test(t)
  );
}

/**
 * Tab title = "<page> | <admin site_name>".
 * Always rebuilds brand from site_name so hardcoded / SEO suffixes cannot stick.
 */
export function formatDocumentTitle(pageTitle: string, siteName?: string): string {
  const brand = (siteName?.trim() || getLiveSiteName()).trim() || "2Deal";
  const raw = (pageTitle || "").trim();

  if (!raw || isLegacyMarketingTitle(raw)) {
    return brand;
  }

  // Keep only the page label (text before first "|"); drop any baked-in brand
  const pagePart = raw.split("|")[0].trim();
  if (
    !pagePart ||
    isLegacyMarketingTitle(pagePart) ||
    pagePart.toLowerCase() === brand.toLowerCase()
  ) {
    return brand;
  }

  return `${pagePart} | ${brand}`;
}
