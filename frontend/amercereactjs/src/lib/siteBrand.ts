/** Live storefront brand from admin settings (updated when settings load). */
let liveSiteName = "";

export function setLiveSiteName(name: string | undefined | null) {
  const next = (name ?? "").trim();
  if (next) liveSiteName = next;
}

export function getLiveSiteName(fallback = "2Deal"): string {
  return liveSiteName || fallback;
}

/** Old hardcoded marketing titles that should not win over admin site_name. */
export function isLegacyMarketingTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  return (
    /^2Deal Online Store$/i.test(t) ||
    /^2DEAL$/i.test(t) ||
    /Incense Sticks,\s*Soaps\s*&\s*Food Products/i.test(t) ||
    /Incense Sticks, Soaps & Food Products Store/i.test(t)
  );
}

/**
 * Build a stable browser tab title: page segment + live site name.
 * Strips legacy incense / “2Deal Online Store” suffixes so they never flash in again.
 */
export function formatDocumentTitle(pageTitle: string, siteName?: string): string {
  const brand = (siteName?.trim() || getLiveSiteName()).trim() || "2Deal";
  let base = (pageTitle || "").trim();

  if (!base || isLegacyMarketingTitle(base)) {
    return brand;
  }

  // Remove legacy brand chunks anywhere in the title
  base = base
    .replace(/\s*\|\s*2Deal\s*-\s*Incense Sticks[^|]*/gi, "")
    .replace(/\s*-\s*Incense Sticks,\s*Soaps\s*&\s*Food Products(?:\s*Store)?/gi, "")
    .replace(/\s*\|\s*2Deal Online Store\s*/gi, "")
    .replace(/\s*\|\s*2Deal\s*-\s*Incense[^|]*/gi, "")
    .replace(/\s*\|\s*2DEAL\s*$/gi, "")
    .replace(/\s*\|\s*2Deal\s*$/gi, "")
    .trim();

  // If stripping left only the brand (or empty), use brand alone
  if (!base || base.toLowerCase() === brand.toLowerCase() || isLegacyMarketingTitle(base)) {
    return brand;
  }

  // Avoid "Home | Brand | Brand"
  const brandRe = new RegExp(
    `\\|\\s*${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`,
    "i",
  );
  if (brandRe.test(base)) return base;

  return `${base} | ${brand}`;
}
