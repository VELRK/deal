import AddToCartButton from "@/components/common/AddToCartButton";
import WishlistButton from "@/components/common/WishlistButton";
import { useProductCard } from "./useProductCard";
import { useProductViewStore } from "@/store/productViewStore";

function ViewProductButton({ productKey, className }: { productKey: string; className?: string }) {
  const openView = useProductViewStore((s) => s.openView);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); openView(productKey); }}
      className={className || "hover-tooltip tooltip-left box-icon"}
      title="View product"
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      <span className="icon icon-Eye" aria-hidden />
      <span className="tooltip">View Product</span>
    </button>
  );
}

/** Hover icon row: default vs 02–04 quick add first vs 05/06 compact row. */
export function ProductCardActionList() {
  const { product, gridVariant, isShopGridHoverBar, shopHoverActionClass } =
    useProductCard();

  const productKey = product.slug ?? String(product.id);

  if (gridVariant === "shopGridHover05" || gridVariant === "shopGridHover06") {
    return (
      <>
        <li className="wishlist">
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon"
          />
        </li>
        <li className="d-sm-none">
          <ViewProductButton
            productKey={productKey}
            className="hover-tooltip tooltip-left box-icon"
          />
        </li>
      </>
    );
  }

  if (isShopGridHoverBar) {
    return (
      <>
        <li>
          <AddToCartButton
            product={product}
            href="#quickAdd"
            dataToggle="modal"
            variant="tooltip"
            className={shopHoverActionClass}
            label="Quick Add"
          />
        </li>
        <li className="wishlist">
          <WishlistButton product={product} className={shopHoverActionClass} />
        </li>
        <li>
          <ViewProductButton productKey={productKey} className={shopHoverActionClass} />
        </li>
      </>
    );
  }

  return (
    <>
      <li className="wishlist">
        <WishlistButton product={product} />
      </li>
      <li>
        <ViewProductButton productKey={productKey} />
      </li>
    </>
  );
}
