/** Canonical storefront paths for products, collections, and blogs. */

export type SlugRef = {
  slug?: string | null;
  id?: string | number | null;
};

export type CategoryRef = {
  slug?: string | null;
  id?: string | number | null;
};

export function productPath(ref: SlugRef | string | number): string {
  if (typeof ref === "string" || typeof ref === "number") {
    return `/products/${ref}`;
  }
  const key = ref.slug || ref.id;
  return key != null && key !== "" ? `/products/${key}` : "/shop-default";
}

export function collectionPath(cat: CategoryRef | string): string {
  const slug = typeof cat === "string" ? cat : cat.slug;
  return slug ? `/collections/${slug}` : "/shop-default";
}

export function subcategoryPath(
  cat: CategoryRef | string,
  sub: CategoryRef | string,
): string {
  const catSlug = typeof cat === "string" ? cat : cat.slug;
  const subSlug = typeof sub === "string" ? sub : sub.slug;
  if (!catSlug || !subSlug) return collectionPath(cat);
  return `/${catSlug}/${subSlug}`;
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
