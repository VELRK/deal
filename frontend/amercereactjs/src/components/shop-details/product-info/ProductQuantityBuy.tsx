import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProduct } from "@/context/useProduct";
import { useContextElement } from "@/context/Context";
import type { ProductCardItem } from "@/types/productCard";
import { addLineToCart, setCartLineQuantity } from "@/utils/cartSync";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useStore } from "@/context/store";

const LOW_STOCK_THRESHOLD = 5;

export function ProductQuantityBuy({ product }: { product: ProductCardItem }) {
  const {
    quantity,
    setQuantity,
    currentColor,
    currentSize,
    currentVariantId,
    unitVariants,
  } = useProduct();
  const { isAddedToCartProducts } = useContextElement();
  const { isLoggedIn } = useAuthStore();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const selectedVariant = unitVariants.find((v) => v.id === currentVariantId) ?? unitVariants[0];
  const variantId = selectedVariant?.id;
  const isInCart = isAddedToCartProducts(product.id, variantId);
  const cartQty = useStore((s) => s.quantityInCart(product.id, variantId));
  const [adding, setAdding] = useState(false);

  const stock = Number(selectedVariant?.stock ?? product.stock ?? 0);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD;

  // Keep detail qty in sync with cart when this line already exists.
  useEffect(() => {
    if (cartQty > 0) {
      setQuantity(Math.min(stock > 0 ? stock : cartQty, Math.max(1, cartQty)));
    }
  }, [cartQty, stock, product.id, variantId, setQuantity]);

  const selectedProduct = () => ({
    ...product,
    price: selectedVariant?.price ?? product.price,
    priceOld: selectedVariant?.priceOld ?? product.priceOld,
    stock,
    img: selectedVariant?.img || product.img,
    unit_label: selectedVariant?.label ?? product.unit_label,
    selectedVariantId: variantId,
    selectedColor: currentColor || undefined,
    selectedSize: currentSize || undefined,
  });

  const changeQuantity = async (next: number) => {
    const max = stock > 0 ? stock : next;
    const q = Math.min(max, Math.max(1, next));
    setQuantity(q);
    if (isInCart) {
      await setCartLineQuantity(product.id, q, variantId);
    }
  };

  const handleAddToCart = async () => {
    if (adding || isOutOfStock) return;
    setAdding(true);
    try {
      if (isInCart) {
        await setCartLineQuantity(product.id, quantity, variantId);
      } else {
        await addLineToCart(selectedProduct(), quantity);
      }
      openModal("cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (adding || isOutOfStock) return;
    setAdding(true);
    try {
      // Keep item in cart, then ask for phone OTP if guest (minimal box — not login page)
      if (isInCart) {
        await setCartLineQuantity(product.id, quantity, variantId);
      } else {
        await addLineToCart(selectedProduct(), quantity);
      }
      if (!isLoggedIn) {
        useModalStore.getState().openModal("signIn", { redirect: "/checkout" });
        return;
      }
      navigate("/checkout");
    } finally {
      setAdding(false);
    }
  };

  const [showDesc, setShowDesc] = useState(false);
  const [showSpecs, setShowSpecs] = useState(true);

  if (isOutOfStock) {
    return (
      <div className="tf-product-total-quantity">
        <div className="mb-3">
          <span className="badge px-3 py-2" style={{ backgroundColor: "#fee2e2", color: "#991b1b", fontWeight: 600, fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "2px" }}>
            Out of Stock
          </span>
        </div>
        <p className="text-muted small font-classic">This product is currently unavailable. Please check back later.</p>
      </div>
    );
  }

  const specs = [
    { label: "Pack Size", value: selectedVariant?.label ?? product.unit_label },
    { label: "Brand", value: product.brand_name },
    { label: "Model Name", value: product.model_name },
    { label: "Style Code", value: product.style_code },
    { label: "Pattern", value: product.pattern },
    { label: "Color", value: product.color },
    { label: "Brand Color", value: product.brand_color },
    { label: "EAN / Barcode", value: product.ean },
    { label: "HSN Code", value: product.hsn_code },
    { label: "Tax Code", value: product.tax_code },
    { label: "Pack Of", value: product.pack_of },
    { label: "Weight", value: product.weight ? `${product.weight} kg` : undefined },
    { label: "Dimensions (L×B×H)", value: (product.package_length && product.package_breadth && product.package_height) ? `${product.package_length} × ${product.package_breadth} × ${product.package_height} cm` : undefined },
    { label: "Min Order Qty", value: product.min_order_qty },
    { label: "Procurement SLA", value: product.procurement_sla ? `${product.procurement_sla} Business Days` : undefined },
    { label: "Procurement Type", value: product.procurement_type },
    { label: "Return Policy", value: product.return_policy },
    { label: "Manufacturer", value: product.manufacturer_name },
    { label: "Manufacturer Address", value: product.manufacturer_address },
  ].filter(item => item.value !== undefined && item.value !== null && String(item.value).trim() !== "");

  return (
    <div className="tf-product-total-quantity mt-4">
      <div className="mb-3 d-flex align-items-center">
        {isLowStock ? (
          <span className="badge px-3 py-2" style={{ backgroundColor: "#fef3c7", color: "#92400e", fontWeight: 600, fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "2px" }}>
            Only {stock} Left in Stock
          </span>
        ) : (
          <span className="badge px-3 py-2" style={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 600, fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "2px" }}>
            In Stock ({stock} Available)
          </span>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 fw-medium text-dark" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Quantity</label>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <div className="classic-wg-quantity">
              <button
                type="button"
                className="btn-quantity btn-decrease"
                disabled={quantity <= 1 || isOutOfStock || adding}
                onClick={(e) => {
                  e.preventDefault();
                  void changeQuantity(quantity - 1);
                }}
              >
                <i className="icon icon-minus" />
              </button>
              <input
                className="quantity-product"
                type="text"
                name="number"
                value={quantity}
                readOnly
              />
              <button
                type="button"
                className="btn-quantity btn-increase"
                disabled={isOutOfStock || quantity >= stock || adding}
                onClick={(e) => {
                  e.preventDefault();
                  void changeQuantity(quantity + 1);
                }}
              >
                <i className="icon icon-plus" />
              </button>
            </div>
          </div>

          <div className="col">
            <button
              type="button"
              disabled={adding || isOutOfStock}
              className="btn w-100 classic-btn-add-to-cart text-uppercase d-flex align-items-center justify-content-center gap-2"
              onClick={(e) => { e.preventDefault(); void handleAddToCart(); }}
            >
              <i className="icon icon-Handbag" style={{ fontSize: "16px" }} />
              {adding ? "Updating…" : isInCart ? "Update Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn w-100 classic-btn-buy-now text-uppercase mt-2"
          disabled={adding || isOutOfStock}
          onClick={() => void handleBuyNow()}
        >
          Buy It Now
        </button>
      </div>

      {specs.length > 0 && (
        <div className="classic-specs-card">
          <div
            className="specs-header"
            onClick={() => setShowSpecs(!showSpecs)}
          >
            <h4>Specifications &amp; Details</h4>
            <i className={`icon ${showSpecs ? "icon-minus" : "icon-plus"}`} style={{ fontSize: "12px", color: "#a87754" }} />
          </div>
          {showSpecs && (
            <div className="specs-body">
              <div className="specs-grid">
                {specs.map((item, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-label">{item.label}</span>
                    <span className="spec-value">{String(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {product.description && (
        <div className="classic-specs-card" style={{ marginTop: "16px" }}>
          <div
            className="specs-header"
            onClick={() => setShowDesc(!showDesc)}
          >
            <h4>Product Story &amp; Details</h4>
            <i className={`icon ${showDesc ? "icon-minus" : "icon-plus"}`} style={{ fontSize: "12px", color: "#a87754" }} />
          </div>
          {showDesc && (
            <div className="specs-body">
              <div
                className="text-muted font-classic"
                style={{ fontSize: "14px", lineHeight: "1.7", color: "#444" }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
