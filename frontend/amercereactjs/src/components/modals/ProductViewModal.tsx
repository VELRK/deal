import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useProductViewStore } from "@/store/productViewStore";
import { useContextElement } from "@/context/Context";
import { productsAPI, reviewsAPI } from "@/services/api";
import type { ApiProduct, ApiReview } from "@/services/api";
import { apiImageUrl } from "@/hooks/useApi";
import { formatPrice } from "@/utils/formatPrice";
import { addLineToCart } from "@/utils/cartSync";

const LOW_STOCK = 5;

function Stars({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#f4a234" : "#ddd", fontSize: small ? 12 : 16 }}>★</span>
      ))}
    </div>
  );
}

function AttrRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ color: "#64748b", fontSize: 13, paddingRight: 16, paddingBottom: 6, whiteSpace: "nowrap", verticalAlign: "top" }}>{label}</td>
      <td style={{ fontSize: 13, fontWeight: 500, paddingBottom: 6, textTransform: "capitalize" }}>{String(value)}</td>
    </tr>
  );
}

export default function ProductViewModal() {
  const { productKey, closeView } = useProductViewStore();
  const { isAddedToCartProducts } = useContextElement();
  const navigate = useNavigate();

  const [product, setProduct]   = useState<ApiProduct | null>(null);
  const [loading, setLoading]   = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);
  const [reviews, setReviews]   = useState<ApiReview[]>([]);
  const [tab, setTab]           = useState<"desc" | "specs" | "reviews">("desc");

  // Fetch product when key changes
  useEffect(() => {
    if (!productKey) { setProduct(null); return; }
    setLoading(true);
    setActiveImg(0);
    setQuantity(1);
    setTab("desc");
    productsAPI.getOne(productKey)
      .then((res) => {
        const p = res.data.data;
        setProduct(p);
        // Fetch reviews
        reviewsAPI.getByProduct(p.id)
          .then((r) => setReviews(r.data.data ?? []))
          .catch(() => {});
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productKey]);

  // Lock body scroll when open
  useEffect(() => {
    if (productKey) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [productKey]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeView(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeView]);

  const handleClose = useCallback(() => closeView(), [closeView]);

  if (!productKey) return null;

  const defaultVariant = product?.variants?.find((v) => v.is_default) ?? product?.variants?.[0];
  const variantId = defaultVariant?.id ?? product?.default_variant_id;
  const price   = product
    ? Number(defaultVariant?.sale_price ?? defaultVariant?.price ?? product.sale_price ?? product.price)
    : 0;
  const oldPrice = defaultVariant
    ? (defaultVariant.sale_price ? Number(defaultVariant.price) : undefined)
    : (product?.sale_price ? Number(product.price) : undefined);
  const stock   = Number(defaultVariant?.stock ?? product?.stock ?? 0);
  const isOutOfStock = stock === 0;
  const isLowStock   = stock > 0 && stock <= LOW_STOCK;

  const isInCart = product ? isAddedToCartProducts(product.id, variantId) : false;

  // Build gallery
  const gallery: string[] = product
    ? [
        apiImageUrl(defaultVariant?.image || product.thumbnail),
        ...(product.images ?? [])
          .filter((img) => img.image !== product.thumbnail)
          .map((img) => apiImageUrl(img.image)),
      ]
    : [];

  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : 0;

  const handleAddToCart = async () => {
    if (!product || adding || isOutOfStock) return;
    setAdding(true);
    try {
      await addLineToCart(
        {
          id: product.id,
          img: apiImageUrl(defaultVariant?.image || product.thumbnail),
          name: product.name,
          price,
          category: product.category_name,
          unit_label: defaultVariant?.label ?? product.unit_label,
          selectedVariantId: variantId,
          inStock: !isOutOfStock,
          isStockOut: isOutOfStock,
        },
        quantity,
      );
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || isOutOfStock) return;
    await handleAddToCart();
    closeView();
    navigate("/checkout");
  };

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)", display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "16px", overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, width: "100%",
          maxWidth: 960, maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          position: "relative", display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Product Details</span>
          <button
            onClick={handleClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, fontSize: 22, color: "#64748b", lineHeight: 1 }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : !product ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320, color: "#64748b" }}>
            Product not found.
          </div>
        ) : (
          <>
            {/* Two-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 0 }} className="product-view-grid">
              {/* Left: Image gallery */}
              <div style={{ padding: "24px", borderRight: "1px solid #f1f5f9" }}>
                {/* Main image */}
                <div style={{ borderRadius: 12, overflow: "hidden", background: "#f8fafc", aspectRatio: "3/4", marginBottom: 12 }}>
                  <img
                    src={gallery[activeImg] || apiImageUrl(null)}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {gallery.slice(0, 6).map((src, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImg(i)}
                        style={{
                          width: 60, height: 72, borderRadius: 8, overflow: "hidden",
                          cursor: "pointer", border: i === activeImg ? "2px solid #0f172a" : "2px solid transparent",
                          background: "#f1f5f9", flexShrink: 0,
                        }}
                      >
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product info */}
              <div style={{ padding: "24px", overflowY: "auto", maxHeight: "calc(92vh - 64px)" }}>
                {/* Category & SKU */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                  {product.category_name && (
                    <span style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {product.category_name}
                    </span>
                  )}
                  {product.sku && (
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>SKU: {product.sku}</span>
                  )}
                </div>

                {/* Name */}
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10, lineHeight: 1.3 }}>
                  {product.name}
                </h2>

                {/* Rating */}
                {(product.avg_rating ?? 0) > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Stars rating={Math.round(product.avg_rating ?? 0)} />
                    <span style={{ fontSize: 13, color: "#64748b" }}>
                      {product.avg_rating?.toFixed(1)} ({product.review_count ?? reviews.length} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{formatPrice(price)}</span>
                  {oldPrice && (
                    <span style={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through" }}>{formatPrice(oldPrice)}</span>
                  )}
                  {product.sale_price && (
                    <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                      -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                    </span>
                  )}
                </div>

                {/* Stock badge */}
                <div style={{ marginBottom: 16 }}>
                  {isOutOfStock ? (
                    <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>Out of Stock</span>
                  ) : isLowStock ? (
                    <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>Only {stock} left!</span>
                  ) : (
                    <span style={{ background: "#dcfce7", color: "#166534", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>In Stock ({stock})</span>
                  )}
                </div>

                {/* Short description */}
                {product.short_desc && (
                  <p style={{ fontSize: 14, color: "#475569", marginBottom: 16, lineHeight: 1.6 }}>{product.short_desc}</p>
                )}

                <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: 16 }} />

                {/* Tabs: Description / Specs / Reviews */}
                <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                  {(["desc", "specs", "reviews"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 500,
                        color: tab === t ? "#0f172a" : "#64748b",
                        borderBottom: tab === t ? "2px solid #0f172a" : "2px solid transparent",
                        marginBottom: -1,
                      }}
                    >
                      {t === "desc" ? "Description" : t === "specs" ? "Specifications" : `Reviews (${reviews.length})`}
                    </button>
                  ))}
                </div>

                {/* Tab: Description */}
                {tab === "desc" && product.description && (
                  <div
                    style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 16, maxHeight: 160, overflowY: "auto" }}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
                {tab === "desc" && !product.description && (
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>No description available.</p>
                )}

                {/* Tab: Specifications */}
                {tab === "specs" && (
                  <div style={{ marginBottom: 16 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <AttrRow label="Saree Type"   value={product.saree_type} />
                        <AttrRow label="Fabric"       value={product.fabric} />
                        <AttrRow label="Color"        value={product.color} />
                        <AttrRow label="Occasion"     value={product.occasion} />
                        <AttrRow label="Work Type"    value={product.work_type} />
                        <AttrRow label="Origin"       value={product.origin_state} />
                        <AttrRow label="Weave"        value={product.weave_type} />
                        <AttrRow label="Wash Care"    value={product.wash_care} />
                        <AttrRow label="Blouse"       value={product.blouse_included ? `Included (${product.blouse_length}m)` : "Not included"} />
                        <AttrRow label="Length"       value={product.saree_length ? `${product.saree_length}m` : undefined} />
                        <AttrRow label="Net Weight"   value={product.net_weight ? `${product.net_weight}g` : undefined} />
                        <AttrRow label="Brand"        value={product.brand_name} />
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab: Reviews */}
                {tab === "reviews" && (
                  <div style={{ marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
                    {reviews.length === 0 ? (
                      <p style={{ fontSize: 13, color: "#94a3b8" }}>No reviews yet.</p>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{avgRating}</span>
                          <div>
                            <Stars rating={Math.round(avgRating)} />
                            <span style={{ fontSize: 12, color: "#64748b" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        {reviews.map((r) => (
                          <div key={r.id} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 10, marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{r.user_name ?? "Customer"}</span>
                              <Stars rating={r.rating} small />
                              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>
                                {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                            {r.title && <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.title}</div>}
                            <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>{r.body}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: 16 }} />

                {/* Quantity + Cart + Buy Now */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "#475569", flexShrink: 0 }}>Qty:</span>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >−</button>
                    <span style={{ width: 36, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(stock || 999, q + 1))}
                      disabled={isOutOfStock || quantity >= stock}
                      style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >+</button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || isOutOfStock}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 8, marginBottom: 8,
                    background: isOutOfStock ? "#f1f5f9" : "#0f172a", color: isOutOfStock ? "#94a3b8" : "#fff",
                    border: "none", fontWeight: 700, fontSize: 14, cursor: isOutOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  {isOutOfStock ? "Out of Stock" : adding ? "Adding…" : isInCart ? "Update Cart" : `Add to Cart — ${formatPrice(price * quantity)}`}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={adding || isOutOfStock}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 8, marginBottom: 16,
                    background: isOutOfStock ? "#f1f5f9" : "#c11069", color: isOutOfStock ? "#94a3b8" : "#fff",
                    border: "none", fontWeight: 700, fontSize: 14, cursor: isOutOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  {isOutOfStock ? "Unavailable" : "Buy It Now"}
                </button>

                <Link
                  to={`/product-detail/${product.id}`}
                  onClick={handleClose}
                  style={{ display: "block", textAlign: "center", fontSize: 13, color: "#0f172a", fontWeight: 600, textDecoration: "underline" }}
                >
                  View Full Product Page →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-view-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}
