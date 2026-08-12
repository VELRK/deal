import { products } from "@/data/products/products";
import type { DocumentMeta } from "@/lib/metadata/document-meta";
import { getLiveSiteName } from "@/lib/siteBrand";

/** Short fallback brand; PageMeta replaces with live admin site_name. */
export const ILF_SITE_TITLE = "2Deal";

export const ILF_DEFAULT_DESCRIPTION =
  "Shop incense, soaps, and food products online.";

export function buildShopProductMetadata(
  id: string,
  pageLabel: string,
): DocumentMeta {
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const brand = getLiveSiteName(ILF_SITE_TITLE);
  const title = `${product.name} | ${pageLabel} | ${brand}`;
  const rawDesc =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${ILF_DEFAULT_DESCRIPTION}`;
  const description = rawDesc.slice(0, 160);
  return { title, description };
}
