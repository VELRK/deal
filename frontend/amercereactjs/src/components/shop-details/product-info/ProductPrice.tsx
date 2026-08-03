import type { ProductCardItem } from "@/types/productCard";
import { useProduct } from "@/context/useProduct";
import { formatPrice } from "@/utils/formatPrice";

export function ProductPrice({ product }: { product: ProductCardItem }) {
  const { unitVariants, currentVariantId } = useProduct();
  const selectedVariant = unitVariants.find((v) => v.id === currentVariantId) ?? unitVariants[0];

  const price = selectedVariant?.price ?? product.price;
  const priceOld = selectedVariant?.priceOld ?? product.priceOld;

  const discountPercent = priceOld && priceOld > price
    ? Math.round(((priceOld - price) / priceOld) * 100)
    : 0;

  return (
    <div className="classic-price-container">
      <span className="mrp-label">Maximum Retail Price (MRP)</span>
      <div className="price-row align-items-center">
        <span className="price-current">
          {formatPrice(price)}
        </span>

        {priceOld && priceOld > price && (
          <>
            <span className="price-original">
              {formatPrice(priceOld)}
            </span>
            <span className="discount-badge">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>
      <span className="text-muted" style={{ fontSize: "12px", fontStyle: "italic", marginTop: "2px" }}>
        (inclusive of all taxes)
      </span>
    </div>
  );
}
