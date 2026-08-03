import type { DocumentMeta } from "@/lib/metadata/document-meta";
import {
  ILF_DEFAULT_DESCRIPTION,
  ILF_SITE_TITLE,
} from "@/lib/metadata/shop-product";

/** Default copy for Tops & Shirts–style shop listing routes */
export const SHOP_LISTING_DESCRIPTION =
  "Browse the Tops & Shirts collection with filters, sorting, and grid or list view.";

/** Title + description for shop listing / account-style routes (full document title). */
export function shopRouteMetadata(
  titleSegment: string,
  description: string = ILF_DEFAULT_DESCRIPTION,
): DocumentMeta {
  const desc = description.trim().slice(0, 160);
  return {
    title: `${titleSegment} | ${ILF_SITE_TITLE}`,
    description: desc,
  };
}
