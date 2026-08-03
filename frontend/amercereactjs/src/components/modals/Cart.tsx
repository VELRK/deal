import { useNavigate } from "react-router-dom";
import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";
import { useModalStore } from "@/store/modalStore";
import { Drawer } from "@/components/Modal";
import { useAuthStore } from "@/store/authStore";
import { cartAPI } from "@/services/api";

export default function Cart() {
  const navigate = useNavigate();
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } = useContextElement();
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "cart";

  const removeLine = (id: ProductId, variantId?: number) => {
    setCartProducts((prev) =>
      prev.filter((p) => {
        if (p.id !== id) return true;
        if (variantId == null) return p.selectedVariantId != null;
        return p.selectedVariantId !== variantId;
      }),
    );
    cartAPI
      .remove({
        product_id: Number(id),
        ...(variantId != null ? { variant_id: variantId } : {}),
      })
      .catch(() => { });
  };

  const setQty = (id: ProductId, qty: number, variantId?: number) => {
    if (qty < 1) removeLine(id, variantId);
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

  return (
    <Drawer isOpen={isOpen} onClose={closeModal} width="420px">
      <div style={styles.wrapper}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerIcon}>🛍</span>
            <div>
              <p style={styles.headerTitle}>Your Cart</p>
              <p style={styles.headerSub}>
                {cartProducts.length === 0
                  ? "No items yet"
                  : `${cartProducts.length} item${cartProducts.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <button type="button" onClick={closeModal} style={styles.closeBtn} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={styles.divider} />

        {/* ── Body ── */}
        <div style={styles.body}>
          {cartProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🛒</div>
              <h4 style={styles.emptyTitle}>Your cart is empty</h4>
              <p style={styles.emptySub}>Discover our curated collections and add items you love.</p>
              <button
                type="button"
                onClick={() => goTo("/shop-default")}
                style={styles.shopBtn}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div>
              {cartProducts.map((item, idx) => (
                <div key={`${item.id}-${item.selectedVariantId ?? "base"}`}>
                  <CartMiniLine
                    item={item}
                    onRemove={() => removeLine(item.id, item.selectedVariantId)}
                    onQtyChange={(qty) => setQty(item.id, qty, item.selectedVariantId)}
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

        {/* ── Footer ── */}
        {cartProducts.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.divider} />

            {/* Summary rows */}
            <div style={styles.summarySection}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>{formatPrice(totalPrice)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={{ ...styles.summaryLabel, color: "#94a3b8", fontSize: "12px" }}>
                  Shipping &amp; taxes calculated at checkout
                </span>
              </div>
            </div>

            {/* Total */}
            <div style={styles.totalDivider} />
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Estimated Total</span>
              <span style={styles.totalValue}>{formatPrice(totalPrice)}</span>
            </div>

            {/* Actions */}
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
                Proceed to Checkout
              </button>

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
  const imgSrc = item.img ?? item.images?.[0]?.src ?? "/frontend/assets/images/product/product-1.jpg";
  const packLabel = item.unit_label;
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div style={styles.metaGroup}>
          {item.category && (
            <span style={styles.metaTag}>{item.category}</span>
          )}
          {packLabel && (
            <span style={styles.metaTag}>Pack: {packLabel}</span>
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
              aria-label="Decrease"
            >
              −
            </button>
            <span style={styles.qtyValue}>{item.quantity}</span>
            <button
              type="button"
              style={styles.qtyBtn}
              onClick={() => onQtyChange(item.quantity + 1)}
              aria-label="Increase"
            >
              +
            </button>
          </div>

          {/* Line total */}
          <span style={styles.lineTotal}>{formatPrice(lineTotal)}</span>
        </div>

        {/* Unit price hint */}
        <span style={styles.unitPrice}>{formatPrice(item.price)} each</span>
      </div>
    </div>
  );
}

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    backgroundColor: "#ffffff",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerIcon: {
    fontSize: "24px",
    lineHeight: 1,
  },
  headerTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: "-0.3px",
  },
  headerSub: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  closeBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px",
    cursor: "pointer",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  },
  divider: {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: "0",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "52px",
    marginBottom: "16px",
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px",
  },
  emptySub: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "0 0 24px",
    lineHeight: "1.6",
  },
  shopBtn: {
    backgroundColor: "#3ec1bc",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.3px",
  },
  cartItem: {
    display: "flex",
    gap: "14px",
    padding: "18px 24px",
  },
  itemDivider: {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: "0 24px",
  },
  imgWrapper: {
    width: "78px",
    height: "88px",
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
    gap: "6px",
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
    color: "#1e293b",
    lineHeight: "1.45",
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
    color: "#cbd5e1",
    padding: "2px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
  },
  metaGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  metaTag: {
    fontSize: "11px",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    padding: "2px 6px",
  },
  priceQtyRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "4px",
  },
  qtyStepper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    overflow: "hidden",
  },
  qtyBtn: {
    background: "none",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#475569",
    lineHeight: 1,
    fontWeight: "500",
  },
  qtyValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
    minWidth: "24px",
    textAlign: "center",
    padding: "0 4px",
    borderLeft: "1px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    lineHeight: "28px",
  },
  lineTotal: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1e293b",
  },
  unitPrice: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  footer: {
    backgroundColor: "#ffffff",
  },
  summarySection: {
    padding: "14px 24px 8px",
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
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },
  totalDivider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "8px 24px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px 16px",
  },
  totalLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: "-0.2px",
  },
  totalValue: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#3ec1bc",
    letterSpacing: "-0.5px",
  },
  actionGroup: {
    padding: "0 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkoutBtn: {
    backgroundColor: "#3ec1bc",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    letterSpacing: "0.3px",
    transition: "background-color 0.2s ease",
    textTransform: "uppercase",
  },
  viewCartBtn: {
    backgroundColor: "transparent",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.2s ease",
  },
};
