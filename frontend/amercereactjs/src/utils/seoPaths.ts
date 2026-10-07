/** Canonical storefront paths for products and blogs. */

export type SlugRef = {
  slug?: string | null;
  id?: string | number | null;
};

export function productPath(ref: SlugRef | string | number): string {
  if (typeof ref === "string" || typeof ref === "number") {
    return `/product/${ref}`;
  }
  const key = ref.slug || ref.id;
  return key != null && key !== "" ? `/product/${key}` : "/shop-default";
}

export function blogPath(ref: SlugRef | string | number): string {
  if (typeof ref === "string" || typeof ref === "number") {
    return `/blog/${ref}`;
  }
  const key = ref.slug || ref.id;
  return key != null && key !== "" ? `/blog/${key}` : "/blog";
}

export function absoluteUrl(path: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "");
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
