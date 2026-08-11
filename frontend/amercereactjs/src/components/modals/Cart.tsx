import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, type CartProduct } from "@/context/store";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";
import { useModalStore } from "@/store/modalStore";
import { Drawer } from "@/components/Modal";
import { useAuthStore } from "@/store/authStore";
import { cartAPI, siteSettingsAPI } from "@/services/api";
import { removeLineFromCart } from "@/utils/cartSync";
import { apiImageUrl } from "@/hooks/useApi";

export default function Cart() {
  const navigate = useNavigate();
  // Subscribe to cart slices directly so remove always re-renders drawer + totals.
  const cartProducts = useStore((s) => s.cartProducts);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const totalPrice = useStore((s) => s.totalPrice);
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "cart";

  const [freeShippingAbove, setFreeShippingAbove] = useState(100);

  useEffect(() => {
    siteSettingsAPI.get().then((res) => {
      if (res.data.success && res.data.data) {
        const s = res.data.data;
        // if (typeof s.free_shipping_above === 'number') {
        //   setFreeShippingAbove(s.free_shipping_above);
        // }
      }
    }).catch(() => {});
  }, []);

  const removeLine = (id: ProductId, variantId?: number, index?: number) => {
    removeLineFromCart(id, variantId, index);
  };

  const setQty = (id: ProductId, qty: number, variantId?: number, index?: number) => {
    if (qty < 1) removeLine(id, variantId, index);
    else {
      updateQuantity(id, qty, variantId);
      cartAPI
        .update({
          product_id: Number(id),
          quantity: qty,
          ...(variantId != null ? { variant_id: variantId } : {}),
        })
        .catch(() => { });
    }
  };

  const goTo = (path: string) => {
    closeModal();
    setTimeout(() => navigate(path), 50);
  };

  const amountToFreeship = Math.max(0, freeShippingAbove - totalPrice);
  const freeShipPercent = Math.min(100, Math.round((totalPrice / freeShippingAbove) * 100));

  return (
    <Drawer isOpen={isOpen} onClose={closeModal} width="440px">
      <div style={styles.wrapper}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIconBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <p style={styles.headerTitle}>Shopping Cart</p>
                {cartProducts.length > 0 && (
                  <span style={styles.countBadge}>{cartProducts.length}</span>
                )}
              </div>
              <p style={styles.headerSub}>
                {cartProducts.length === 0
                  ? "Your cart is currently empty"
                  : `${cartProducts.length} item${cartProducts.length > 1 ? "s" : ""} selected`}
              </p>
            </div>
          </div>
          <button type="button" onClick={closeModal} style={styles.closeBtn} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        {cartProducts.length > 0 && (
          <div style={styles.freeShippingBox}>
            <div style={styles.freeShippingText}>
              {amountToFreeship === 0 ? (
                <span style={{ color: "#166534", fontWeight: "700" }}>
                  🎉 You unlocked <strong>FREE Shipping!</strong>
                </span>
              ) : (
                <span>
                  Add <strong>{formatPrice(amountToFreeship)}</strong> more for <strong>FREE Shipping</strong>
                </span>
              )}
            </div>
            <div style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${freeShipPercent}%`,
                  backgroundColor: amountToFreeship === 0 ? "#22c55e" : "#3ec1bc",
                }}
              />
            </div>
          </div>
        )}

        <div style={styles.divider} />

        {/* ── Body (Scrollable) ── */}
        <div style={styles.body}>
          {cartProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIconCircle}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h4 style={styles.emptyTitle}>Your cart is empty</h4>
              <p style={styles.emptySub}>Looks like you haven't added anything to your cart yet. Start exploring our collections!</p>
              <button
                type="button"
                onClick={() => goTo("/shop-default")}
                style={styles.shopBtn}
              >
                Start Shopping →
              </button>
            </div>
          ) : (
            <div style={styles.itemList}>
              {cartProducts.map((item, idx) => (
                <div key={`${item.id}-${item.selectedVariantId ?? "base"}-${idx}`}>
                  <CartMiniLine
                    item={item}
                    onRemove={() => removeLine(item.id, item.selectedVariantId, idx)}
                    onQtyChange={(qty) => setQty(item.id, qty, item.selectedVariantId, idx)}
                    onProductClick={() => goTo(`/product-detail/${item.id}`)}
                  />
                  {idx < cartProducts.length - 1 && (
                    <div style={styles.itemDivider} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer (Sticky & Mobile Responsive) ── */}
        {cartProducts.length > 0 && (
          <div style={styles.footer}>
            {/* Subtotal line */}
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal</span>
              <span style={styles.summaryValue}>{formatPrice(totalPrice)}</span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summarySubText}>
                Shipping &amp; taxes calculated at checkout
              </span>
            </div>

            <div style={styles.totalDivider} />

            {/* Total line */}
            <div style={styles.totalRow}>
              <div>
                <span style={styles.totalLabel}>Estimated Total</span>
                <span style={styles.totalSubHint}>Local currency taxes included</span>
              </div>
              <span style={styles.totalValue}>{formatPrice(totalPrice)}</span>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionGroup}>
              <button
                type="button"
                id="side-cart-checkout-btn"
                onClick={() => {
                  if (!useAuthStore.getState().isLoggedIn) {
                    useModalStore.getState().openModal("signIn", { redirect: "/checkout" });
                  } else {
                    goTo("/checkout");
                  }
                }}
                style={styles.checkoutBtn}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2da8a3";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3ec1bc";
                }}
              >
                <span>Proceed to Checkout</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => goTo("/view-cart")}
                style={styles.viewCartBtn}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f8fafc";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
                }}
              >
                View Shopping Cart
              </button>
            </div>

            {/* Trust badge */}
            <div style={styles.trustBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>100% Secure Checkout • Instant Order Confirmation</span>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function CartMiniLine({
  item,
  onRemove,
  onQtyChange,
  onProductClick,
}: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
  onProductClick: () => void;
}) {
  const baseImg =
    item.img ||
    item.images?.[0]?.src ||
    "/frontend/assets/images/no-image.png";
  const imgSrc = apiImageUrl(baseImg);
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;
  const packLabel = item.unit_label ?? null;
  const lineTotal = item.price * item.quantity;

  return (
    <div style={styles.cartItem}>
      {/* Product Image */}
      <div style={styles.imgWrapper} onClick={onProductClick}>
        <img
          loading="lazy"
          src={imgSrc}
          alt={item.name}
          style={styles.productImg}
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.fallback === "1") return;
            el.dataset.fallback = "1";
            el.src = "/frontend/assets/images/no-image.png";
          }}
        />
      </div>

      {/* Product Info */}
      <div style={styles.itemBody}>
        <div style={styles.itemTop}>
          <span style={styles.productName} onClick={onProductClick}>
            {item.name}
          </span>
          <button
            type="button"
            onClick={onRemove}
            style={styles.removeBtn}
            title="Remove item"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        {/* Meta badges */}
        <div style={styles.metaGroup}>
          {item.category && (
            <span style={styles.metaTag}>{item.category}</span>
          )}
          {packLabel && (
            <span style={styles.metaTag}>Pack: {packLabel}</span>
          )}
          {colorLabel && (
            <span style={styles.metaTag}>Color: {colorLabel}</span>
          )}
          {sizeLabel && (
            <span style={styles.metaTag}>Size: {sizeLabel}</span>
          )}
        </div>

        {/* Price + Qty row */}
        <div style={styles.priceQtyRow}>
          {/* Qty stepper */}
          <div style={styles.qtyStepper}>
            <button
              type="button"
              style={styles.qtyBtn}
              onClick={() => onQtyChange(item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span style={styles.qtyValue}>{item.quantity}</span>
            <button
              type="button"
              style={{
                ...styles.qtyBtn,
                ...(item.stock !== undefined && item.quantity >= item.stock
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}),
              }}
              onClick={() => {
                if (item.stock !== undefined && item.quantity >= item.stock) return;
                onQtyChange(item.quantity + 1);
              }}
              aria-label="Increase quantity"
              disabled={item.stock !== undefined && item.quantity >= item.stock}
              title={item.stock !== undefined && item.quantity >= item.stock ? `Only ${item.stock} in stock` : ""}
            >
              +
            </button>
          </div>

          {/* Price display */}
          <div style={{ textAlign: "right" }}>
            <div style={styles.lineTotal}>{formatPrice(lineTotal)}</div>
            {item.quantity > 1 && (
              <div style={styles.unitPrice}>{formatPrice(item.price)} ea</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline Styles ── */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    backgroundColor: "#ffffff",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerIconBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    backgroundColor: "#f0fdfa",
    color: "#3ec1bc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #ccfbf1",
  },
  headerTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  countBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#3ec1bc",
    backgroundColor: "#e6fffa",
    border: "1px solid #b2f5ea",
    borderRadius: "12px",
    padding: "2px 8px",
  },
  headerSub: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  closeBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "7px",
    cursor: "pointer",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  },
  freeShippingBox: {
    padding: "10px 20px",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    flexShrink: 0,
  },
  freeShippingText: {
    fontSize: "12px",
    color: "#334155",
    marginBottom: "6px",
  },
  progressBarTrack: {
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease, background-color 0.3s ease",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: 0,
  },
  body: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "4px 0",
    WebkitOverflowScrolling: "touch",
  },
  itemList: {
    padding: "0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
    textAlign: "center",
  },
  emptyIconCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    border: "1px solid #e2e8f0",
  },
  emptyTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 6px",
  },
  emptySub: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 20px",
    lineHeight: "1.5",
    maxWidth: "280px",
  },
  shopBtn: {
    backgroundColor: "#3ec1bc",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.2px",
    boxShadow: "0 4px 12px rgba(62, 193, 188, 0.25)",
  },
  cartItem: {
    display: "flex",
    gap: "12px",
    padding: "14px 20px",
  },
  itemDivider: {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: "0 20px",
  },
  imgWrapper: {
    width: "74px",
    height: "82px",
    flexShrink: 0,
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    backgroundColor: "#f8fafc",
  },
  productImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  itemBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minWidth: 0,
  },
  itemTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
  },
  productName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0f172a",
    lineHeight: "1.4",
    cursor: "pointer",
    flex: 1,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "3px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    transition: "color 0.15s, background-color 0.15s",
  },
  metaGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "4px",
  },
  metaTag: {
    fontSize: "11px",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    padding: "2px 6px",
    fontWeight: "500",
  },
  priceQtyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  qtyStepper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  qtyBtn: {
    background: "none",
    border: "none",
    padding: "4px 9px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1,
    fontWeight: "600",
  },
  qtyValue: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0f172a",
    minWidth: "22px",
    textAlign: "center",
    padding: "0 2px",
    borderLeft: "1px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    lineHeight: "24px",
  },
  lineTotal: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
  },
  unitPrice: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  footer: {
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    flexShrink: 0,
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    padding: "16px 20px max(16px, env(safe-area-inset-bottom, 16px))",
    boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.05)",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  summaryLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  },
  summarySubText: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  totalDivider: {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: "10px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  totalLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    display: "block",
  },
  totalSubHint: {
    fontSize: "11px",
    color: "#94a3b8",
    display: "block",
  },
  totalValue: {
    fontSize: "19px",
    fontWeight: "800",
    color: "#3ec1bc",
    letterSpacing: "-0.3px",
  },
  actionGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  checkoutBtn: {
    backgroundColor: "#3ec1bc",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "13px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    letterSpacing: "0.4px",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 14px rgba(62, 193, 188, 0.35)",
  },
  viewCartBtn: {
    backgroundColor: "transparent",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "11px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s ease",
    textAlign: "center",
  },
  trustBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "12px",
  },
};
