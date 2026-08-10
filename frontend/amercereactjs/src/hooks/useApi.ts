import { useEffect, useState, useCallback } from "react";
import { productsAPI, categoriesAPI, bannersAPI, testimonialsAPI, siteSettingsAPI, blogsAPI, seoAPI } from "@/services/api";
import type { ApiProduct, ApiCategory, ApiBanner, ApiTestimonial, ApiSiteSettings, ApiBlog, ApiSeoPage, ProductFilters } from "@/services/api";

// ── Request deduplication + TTL cache ─────────────────────────────────────────
// Prevents 429s caused by multiple components calling the same endpoint
// simultaneously on page load. Same-key calls within CACHE_TTL share one request.

const CACHE_TTL = 30_000; // 30 s
const _cache = new Map<string, { data: unknown; ts: number }>();
const _inflight = new Map<string, Promise<unknown>>();

function dedupeGet<T>(fetcher: () => Promise<T>, key: string): Promise<T> {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data as T);

  const existing = _inflight.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fetcher()
    .then((data) => { _cache.set(key, { data, ts: Date.now() }); return data; })
    .finally(() => _inflight.delete(key));

  _inflight.set(key, promise);
  return promise;
}

// ── useProducts ───────────────────────────────────────────────────────────────

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const key = `products:${JSON.stringify(filters ?? {})}`;
      const res = await dedupeGet(() => productsAPI.getAll(filters), key);
      const d = res.data.data;
      setProducts(d.products ?? []);
      setTotal(d.total ?? 0);
      setTotalPages(d.total_pages ?? 1);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { products, total, totalPages, loading, error, refetch: fetch };
}

// ── useProduct ────────────────────────────────────────────────────────────────

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    dedupeGet(() => productsAPI.getOne(slug), `product:${slug}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

// ── useNavProducts — products flagged "Show in Navbar Menu" ──────────────────

export function useCollectionBanners() {
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dedupeGet(() => bannersAPI.getCollection(), "collection-banners")
      .then((res) => setBanners(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { banners, loading };
}

export function useSpecialProducts(limit = 10) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    dedupeGet(() => productsAPI.getAll({ special_product: 1, limit }), `products:special:${limit}`)
      .then((res) => setProducts(res.data.data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit]);

  return { products, loading };
}

export function useNavProducts(limit = 4) {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    dedupeGet(() => productsAPI.getAll({ nav_featured: 1, limit }), `products:nav:${limit}`)
      .then((res) => setProducts(res.data.data.products ?? []))
      .catch(() => {});
  }, [limit]);

  return products;
}

// ── useCategories ─────────────────────────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dedupeGet(() => categoriesAPI.getAll(), "categories")
      .then((res) => setCategories(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

// ── useBanners ────────────────────────────────────────────────────────────────

export function useBanners() {
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dedupeGet(() => bannersAPI.getAll(), "banners")
      .then((res) => setBanners(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { banners, loading };
}

// ── apiImageUrl ───────────────────────────────────────────────────────────────
const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE_URL ?? "").replace(/\/$/, "");
/** Dev server proxies /deal1 → XAMPP (port 8080). */
const LOCAL_ASSETS_PREFIX = import.meta.env.DEV ? "/deal" : "";

/** Convert a backend thumbnail path like "assets/uploads/..." to a full URL. */
export function apiImageUrl(path?: string | null): string {
  if (!path || !String(path).trim()) {
    return `/frontend/assets/images/no-image.png`;
  }

  let raw = String(path).trim();

  // Absolute remote URL — keep as-is (strip accidental double-processing artifacts)
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  // Drop query/hash so cache-bust tokens from a prior apiImageUrl() call do not
  // get encodeURIComponent'd into the filename (breaks cart/checkout thumbs).
  raw = raw.split(/[?#]/)[0];

  // Already a rooted public URL for this deploy
  if (
    raw.startsWith("/deal/") ||
    raw.startsWith("/deal1/") ||
    raw.startsWith("/frontend/")
  ) {
    return raw;
  }

  let clean = raw.replace(/^\/+/, "");
  clean = clean.replace(
    /^(deal\/frontend\/|deal1\/|deal\/|ilf\/frontend\/|ilf\/|ecomm\/|frontend\/)/,
    "",
  );

  if (!clean.includes("/")) {
    clean = `assets/uploads/products/${clean}`;
  }

  const encoded = clean
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  if (import.meta.env.DEV) {
    return `${LOCAL_ASSETS_PREFIX}/${encoded}`;
  }
  if (ASSETS_BASE) return `${ASSETS_BASE}/${encoded}`;
  return `/deal/${encoded}`;
}

// ── useTestimonials ───────────────────────────────────────────────────────────

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dedupeGet(() => testimonialsAPI.getAll(), "testimonials")
      .then((res) => setTestimonials(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}

// ── useSiteSettings ───────────────────────────────────────────────────────────

export function useSiteSettings() {
  const [settings, setSettings] = useState<ApiSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dedupeGet(() => siteSettingsAPI.get(), "site-settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

// ── useSeoPage ──────────────────────────────────────────────────────────────

export function useSeoPage(pageKey: string) {
  const [seo, setSeo] = useState<ApiSeoPage | null>(null);

  useEffect(() => {
    if (!pageKey) return;
    dedupeGet(() => seoAPI.getPage(pageKey), `seo-page:${pageKey}`)
      .then((res) => setSeo(res.data.data))
      .catch(() => {});
  }, [pageKey]);

  return seo;
}

// ── useBlogs ──────────────────────────────────────────────────────────────────

export function useBlogs() {
  const [blogs, setBlogs] = useState<ApiBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dedupeGet(() => blogsAPI.getAll(), "blogs")
      .then((res) => setBlogs(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { blogs, loading };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<ApiBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    dedupeGet(() => blogsAPI.getOne(slug), `blog:${slug}`)
      .then((res) => setBlog(res.data.data))
      .catch(() => setError("Blog post not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  return { blog, loading, error };
}

/** Total sellable qty: sum of pack stocks when variants exist, else product.stock. */
export function productAvailableStock(p: Pick<ApiProduct, "stock" | "variants">): number {
  const variants = p.variants ?? [];
  if (variants.length > 0) {
    return variants.reduce((sum, v) => sum + Math.max(0, Number(v.stock ?? 0)), 0);
  }
  return Math.max(0, Number(p.stock ?? 0));
}

export function productIsInStock(p: ApiProduct): boolean {
  if (typeof p.in_stock === "boolean") return p.in_stock;
  if (typeof p.is_out_of_stock === "boolean") return !p.is_out_of_stock;
  return productAvailableStock(p) > 0;
}

/** Map an ApiProduct to the ProductCardItem shape used by existing UI components. */
export function toProductCard(p: ApiProduct) {
  const stock = productAvailableStock(p);
  const inStock = productIsInStock(p);
  return {
    id: p.id,
    slug: p.slug,
    img: apiImageUrl(p.thumbnail),
    imgHover: p.images?.[1] ? apiImageUrl(p.images[1].image) : apiImageUrl(p.thumbnail),
    name: p.name,
    subtitle: p.subtitle,
    model_name: p.model_name,
    price: Number(p.sale_price ?? p.price),
    priceOld: p.sale_price ? Number(p.price) : undefined,
    badge: p.sale_price
      ? `-${Math.round(((p.price - p.sale_price) / p.price) * 100)}%`
      : (p.featured ? "NEW" : undefined),
    category: p.category_name,
    brand_name: p.brand_name,
    listing_status: p.listing_status,
    avg_rating: p.avg_rating ?? 0,
    review_count: p.review_count ?? 0,
    total_sold: p.total_sold ?? 0,
    rating: Math.round(p.avg_rating ?? 0),
    reviewsText: `(${p.review_count ?? 0} reviews)`,
    stock,
    inStock,
    isStockOut: !inStock,
    sku: p.sku,
    ean: p.ean,
    description: p.description ?? "",
    short_desc:  p.short_desc ?? "",
    features: p.features,
    category_attributes: p.category_attributes,
    videos: p.videos,
    filterBrands: p.brand_name ? [p.brand_name] : [],
    filterCategory: p.category_name ? [p.category_name] : [],
    filterColor: p.color ? [p.color] : [],
    // sizes: API may return a comma string (list) or parsed array (single) — normalise
    filterSizes: Array.isArray(p.sizes)
      ? p.sizes
      : (typeof (p.sizes as unknown) === "string" && p.sizes ? (p.sizes as unknown as string).split(",").map((s: string) => s.trim()) : []),
    sizes: (() => {
      if (Array.isArray(p.sizes)) return p.sizes.filter(Boolean);
      if (typeof (p.sizes as unknown) === "string" && p.sizes) return (p.sizes as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean);
      return undefined;
    })(),
    // Build color swatches — colors_json may be parsed array or raw JSON string
    colors: (() => {
      const thumb = apiImageUrl(p.thumbnail);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cj: any[] | null = null;
      if (Array.isArray(p.colors_json) && p.colors_json.length > 0) {
        cj = p.colors_json;
      } else if (typeof (p as { colors_json?: unknown }).colors_json === "string") {
        try { cj = JSON.parse((p as unknown as { colors_json: string }).colors_json); } catch { cj = null; }
      }
      if (cj && cj.length > 0) {
        return cj.map((c: { name: string; hex?: string; image?: string }) => ({
          label: c.name,
          hex: c.hex || undefined,
          swatchClass: c.hex ? "" : "bg-gray",
          img: c.image ? apiImageUrl(c.image) : thumb,
        }));
      }
      const swatches = [];
      if (p.color) swatches.push({ label: p.color, swatchClass: "bg-gray", img: thumb });
      if (p.color2) swatches.push({ label: p.color2, swatchClass: "bg-gray", img: thumb });
      return swatches.length > 0 ? swatches : undefined;
    })(),
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
    cardVariant: "" as const,
    services: ["Free Delivery"],
    // Procurement / fulfillment
    min_order_qty: p.min_order_qty ?? 1,
    procurement_type: p.procurement_type,
    procurement_sla: p.procurement_sla,
    return_policy: p.return_policy,
    shipping_info: p.shipping_info,
    // Packaging
    weight: p.weight,
    package_length: p.package_length,
    package_breadth: p.package_breadth,
    package_height: p.package_height,
    hsn_code: p.hsn_code,
    tax_code: p.tax_code,
    manufacturer_name: p.manufacturer_name,
    manufacturer_address: p.manufacturer_address,
    style_code: p.style_code,
    // Fashion attributes
    color: p.color,
    color_hex: p.color_hex,
    color2: p.color2,
    brand_color: p.brand_color,
    pattern: p.pattern,
    fit_type: p.fit_type,
    neck_type: p.neck_type,
    sleeve_length: p.sleeve_length,
    length_type: p.length_type,
    pack_of: p.pack_of ?? 1,
    pattern_type: p.pattern_type,
    pattern_coverage: p.pattern_coverage,
    ornamentation: p.ornamentation,
    // Saree extras
    saree_type: p.saree_type,
    fabric: p.fabric,
    occasion: p.occasion,
    work_type: p.work_type,
    wash_care: p.wash_care,
    origin_state: p.origin_state,
    weave_type: p.weave_type,
    zari_type: p.zari_type,
    suitable_for: p.suitable_for,
    unit_label: p.unit_label,
    unitVariants: (() => {
      const productThumb = apiImageUrl(p.thumbnail);
      return (p.variants ?? []).map((v) => {
        const base = Number(v.price);
        const sale = v.sale_price != null ? Number(v.sale_price) : null;
        const effective =
          v.effective_price != null
            ? Number(v.effective_price)
            : sale && sale > 0 && sale < base
              ? sale
              : base;
        const imgPath = v.image || v.image_url;
        return {
          id: v.id,
          label: v.label,
          price: effective,
          priceOld: sale && sale > 0 && sale < base ? base : undefined,
          stock: Number(v.stock ?? 0),
          img: imgPath ? apiImageUrl(imgPath) : productThumb,
          isDefault: !!v.is_default || v.id === p.default_variant_id,
        };
      });
    })(),
  };
}
