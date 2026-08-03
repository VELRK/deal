import { products } from "@/data/products/products";
import type { DocumentMeta } from "@/lib/metadata/document-meta";

export const ILF_SITE_TITLE =
  "2Deal - Incense Sticks, Soaps & Food Products Store";

export const ILF_DEFAULT_DESCRIPTION =
  "2Deal - Incense Sticks, Soaps & Food Products Store";

export function buildShopProductMetadata(
  id: string,
  pageLabel: string,
): DocumentMeta {
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const title = `${product.name} | ${pageLabel} | ${ILF_SITE_TITLE}`;
  const rawDesc =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${ILF_DEFAULT_DESCRIPTION}`;
  const description = rawDesc.slice(0, 160);
  return { title, description };
}
