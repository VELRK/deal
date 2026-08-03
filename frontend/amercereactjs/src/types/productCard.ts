export interface ProductColorSwatch {
  label: string;
  /** CSS class for swatch (e.g. "bg-olive-brown") */
  swatchClass: string;
  img: string;
  hex?: string;
}

/** One image in a product single gallery (main or thumb). */
export interface ProductSingleImage {
  src: string;
  dataSize?: string;
  dataColor?: string;
  video?: string;
  model3d?: string;
}

/** Optional shop-default filter facets (Unimart-style). Present on products that appear in `shopDefaultProducts`. */
export interface ShopProductFacetFields {
  cardVariant: "" | "square";
  filterBrands: string[];
  filterCategory: string[];
  filterColor: string[];
  /** Size labels for filtering (e.g. XS, S, M). */
  filterSizes: string[];
  tags: string[];
  rating: number;
  inStock: boolean;
  isStockOut: boolean;
  services: string[];
}

/** One product for cards, single-product sections, or any product UI. Use img/imgHover for cards; use images for single-product gallery. */
export interface ProductCardItem extends Partial<ShopProductFacetFields> {
  id: number;
  /** Main image for card layout. Omit when using images[] (single-product). */
  img: string;
  imgHover?: string;
  /** Gallery images for single-product layout. When set, use instead of img. */
  images?: ProductSingleImage[];
  name: string;
  price: number;
  priceOld?: number;
  /** Badge text (e.g. "NEW", "-25%"). Rendered with class "new" or "sale" based on value. */
  badge?: string;
  /** Optional second badge (e.g. "TREND"). Rendered with class "trend". */
  badgeTrend?: string;
  /** Size options shown in variant-box (e.g. ["XS", "S", "M"]) */
  sizes?: string[];
  /** Size variants with price for single-product (e.g. [{ value: "30ml", price: "39.99" }, { value: "100ml", price: "59.99", active: true }]). */
  sizeVariants?: { value: string; price: string; active?: boolean }[];
  /** Color swatches; first is active. */
  colors?: ProductColorSwatch[];
  /** Marquee text (e.g. "HOT SALE 25% OFF"); when set, shows product-marquee_sale. */
  marquee?: string;
  /** Countdown timer value for data-timer (seconds); when set, shows product-countdown. */
  countdown?: number;
  /** Optional tag to filter products for a section. Not rendered in UI. */
  tag?: string;
  /** Demo tab ids for filtered sections (e.g. home-mental TopPick). Not rendered in UI. */
  filterTabIds?: string[];
  /** Category for single-product (e.g. "Skin care", "Headphone"). */
  category?: string;
  /** Reviews text (e.g. "(134 reviews)"). */
  reviewsText?: string;
  /** Full description for single-product. */
  description?: string;
  /** Short description shown in product info panel. */
  short_desc?: string;
  /** Sold progress for single-product (e.g. 84). */
  soldPercent?: number;
  /** Sold label (e.g. "84% Sold - Only 24 item(s) left in stock!"). */
  soldLabel?: string;
  sku?: string;
  /** Badge label (e.g. "Best seller"). */
  badgeLabel?: string;
  /** Badge subtext (e.g. "Selling fast! 22 people have this in their carts."). */
  badgeSubtext?: string;
  slug?: string;

  // ── Live DB fields ────────────────────────────────────────────────────────
  stock?: number;
  subtitle?: string;
  model_name?: string;
  brand_name?: string;
  listing_status?: string;
  avg_rating?: number;
  review_count?: number;
  total_sold?: number;
  min_order_qty?: number;
  procurement_type?: string;
  procurement_sla?: number;
  return_policy?: string;
  shipping_info?: string;
  hsn_code?: string;
  tax_code?: string;
  manufacturer_name?: string;
  manufacturer_address?: string;
  style_code?: string;
  ean?: string;
  brand_color?: string;
  pattern?: string;
  fit_type?: string;
  neck_type?: string;
  sleeve_length?: string;
  length_type?: string;
  pack_of?: number;
  pattern_type?: string;
  pattern_coverage?: string;
  ornamentation?: string;
  saree_type?: string;
  fabric?: string;
  occasion?: string;
  work_type?: string;
  color?: string;
  color_hex?: string;
  color2?: string;
  origin_state?: string;
  weave_type?: string;
  zari_type?: string;
  wash_care?: string;
  suitable_for?: string;
  features?: string[];
  category_attributes?: Record<string, string>;
  videos?: { id: number; url: string; title?: string }[];
  package_length?: number;
  package_breadth?: number;
  package_height?: number;
  weight?: number;
  // Cart-selection fields (set when adding to cart)
  selectedColor?: string;
  selectedSize?: string;
  selectedVariantId?: number;
  unit_label?: string;
  unitVariants?: import("@/context/productContextTypes").UnitVariantOption[];
}
