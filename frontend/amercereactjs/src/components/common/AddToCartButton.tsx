import { useContextElement, type Product } from "@/context/Context";
import { useModalStore } from "@/store/modalStore";
import { addLineToCart } from "@/utils/cartSync";
import type { UnitVariantOption } from "@/context/productContextTypes";

interface AddToCartButtonProps {
  product?: Product;
  quantity?: number;
  href?: string;
  dataToggle?: "modal" | "offcanvas";
  className?: string;
  label?: string;
  variant?: "default" | "icon" | "tooltip";
  style?: React.CSSProperties;
}

/** True when product (and every pack, if any) has no sellable stock. */
function isProductFullyOutOfStock(product?: Product | null): boolean {
  if (!product) return true;
  const variants = (product as { unitVariants?: UnitVariantOption[] }).unitVariants;
  if (Array.isArray(variants) && variants.length > 0) {
    return variants.every((v) => Number(v.stock ?? 0) <= 0);
  }
  if (typeof (product as { isStockOut?: boolean }).isStockOut === "boolean") {
    return !!(product as { isStockOut?: boolean }).isStockOut;
  }
  if (typeof (product as { inStock?: boolean }).inStock === "boolean") {
    return !(product as { inStock?: boolean }).inStock;
  }
  return Number((product as { stock?: number }).stock ?? 0) <= 0;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  href = "#shoppingCart",
  dataToggle = "offcanvas",
  className,
  label = "Add to Cart",
  variant = "default",
  style,
}: AddToCartButtonProps) {
  const { isAddedToCartProducts, setQuickAddItem, setQuickAddProduct } = useContextElement();
  const { openModal } = useModalStore();
  const isAdded = product ? isAddedToCartProducts(product.id) : false;
  const isQuickAddTrigger = href === "#quickAdd";
  const isCartTrigger = href === "#shoppingCart";
  const isStockOut = isProductFullyOutOfStock(product);

  const handleClick = async (e: React.MouseEvent) => {
    if (!product || isStockOut) return;

    e.preventDefault();
    e.stopPropagation();

    if (isQuickAddTrigger) {
      setQuickAddItem(product.id);
      setQuickAddProduct(product);
      openModal("quickAdd");
      return;
    }

    // Already in cart → open cart drawer (do not add again)
    if (isAdded) {
      openModal("cart");
      return;
    }

    const variants = (product as { unitVariants?: UnitVariantOption[] }).unitVariants;
    // Pack products must go through Quick Add so the customer picks a sellable variant
    if (Array.isArray(variants) && variants.length > 0) {
      setQuickAddItem(product.id);
      setQuickAddProduct(product);
      openModal("quickAdd");
      return;
    }

    await addLineToCart(product, quantity);
    openModal("cart");
  };

  const activeClass = !isQuickAddTrigger && isAdded ? "added" : "";

  // Since we use Zustand to open modals now, we strip bootstrap data-bs-toggle
  const finalDataToggle = isQuickAddTrigger || isCartTrigger ? undefined : dataToggle;
  const bsTarget = !isQuickAddTrigger && !isCartTrigger && href.startsWith("#") && href.length > 1 ? href : undefined;

  const buttonStyle = isStockOut
    ? { ...style, backgroundColor: "#e2e2e2", color: "#333", cursor: "not-allowed", border: "none", fontWeight: "600" }
    : style;

  if (variant === "tooltip") {
    return (
      <button
        type="button"
        onClick={isStockOut ? undefined : handleClick}
        data-bs-toggle={isStockOut ? undefined : finalDataToggle}
        data-bs-target={isStockOut ? undefined : bsTarget}
        suppressHydrationWarning
        className={`tf-btn-reset ${className || "hover-tooltip tooltip-left btn-action"} ${activeClass}`.trim()}
        style={buttonStyle}
        disabled={isStockOut}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="tooltip" suppressHydrationWarning>
          {isStockOut ? "Out of Stock" : (!isQuickAddTrigger && isAdded ? "View Cart" : label)}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={isStockOut ? undefined : handleClick}
        data-bs-toggle={isStockOut ? undefined : finalDataToggle}
        data-bs-target={isStockOut ? undefined : bsTarget}
        suppressHydrationWarning
        className={`tf-btn-reset ${className || "btn-action"} ${activeClass}`.trim()}
        style={buttonStyle}
        disabled={isStockOut}
      >
        <i className="icon icon-Handbag" aria-hidden />
        <span className="text fw-semibold ml-1" suppressHydrationWarning>
          {isStockOut ? "Out of Stock" : (!isQuickAddTrigger && isAdded ? "View Cart" : label)}
        </span>
      </button>
    );
  }

  // default
  return (
    <button
      type="button"
      onClick={isStockOut ? undefined : handleClick}
      data-bs-toggle={isStockOut ? undefined : finalDataToggle}
      data-bs-target={isStockOut ? undefined : bsTarget}
      suppressHydrationWarning
      className={`tf-btn-reset ${className || "tf-btn btn-white small w-100"} ${activeClass}`.trim()}
      style={buttonStyle}
      disabled={isStockOut}
    >
      {isStockOut ? "Out of Stock" : (!isQuickAddTrigger && isAdded ? "View Cart" : label)}
    </button>
  );
}
