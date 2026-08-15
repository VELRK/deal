import type { ProductCardItem } from "@/types/productCard";
import { useProduct } from "@/context/useProduct";
import { formatPrice } from "@/utils/formatPrice";

export function ProductPrice({ product }: { product: ProductCardItem }) {
  const { unitVariants, currentVariantId } = useProduct();
  const selectedVariant = unitVariants.find((v) => v.id === currentVariantId) ?? unitVariants[0];

  const price = selectedVariant?.price ?? product.price;
  const priceOld = selectedVariant?.priceOld ?? product.priceOld;

  const saveAmount = priceOld && priceOld > price ? priceOld - price : 0;
  const discountPercent = priceOld && priceOld > price
    ? Math.round(((priceOld - price) / priceOld) * 100)
    : 0;

  return (
    <div className="classic-price-container my-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
        <span className="mrp-label fw-semibold" style={{ fontSize: "11px", letterSpacing: "1px", color: "#8c6239", textTransform: "uppercase" }}>
          Special Offer Price
        </span>
        {saveAmount > 0 && (
          <span className="badge" style={{ backgroundColor: "#eef7ee", color: "#1b5e20", fontSize: "11px", fontWeight: 600 }}>
            You Save {formatPrice(saveAmount)} ({discountPercent}% OFF)
          </span>
        )}
      </div>

      <div className="price-row align-items-baseline gap-3 my-1">
        <span className="price-current" style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a" }}>
          {formatPrice(price)}
        </span>

        {priceOld && priceOld > price && (
          <>
            <span className="price-original text-muted text-decoration-line-through" style={{ fontSize: "16px" }}>
              MRP {formatPrice(priceOld)}
            </span>
            <span className="discount-badge px-2 py-1" style={{ fontSize: "12px", backgroundColor: "#5a2d26", color: "#fff", borderRadius: "3px", fontWeight: 600 }}>
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      <span className="text-muted" style={{ fontSize: "12px", fontStyle: "italic" }}>
        (Inclusive of all taxes &amp; duties)
      </span>
    </div>
  );
}
