import { useContextElement, type Product } from "@/context/Context";
import { useModalStore } from "@/store/modalStore";

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
  const { addProductToCart, isAddedToCartProducts, setQuickAddItem, setQuickAddProduct } = useContextElement();
  const { openModal } = useModalStore();
  const isAdded = product ? isAddedToCartProducts(product.id) : false;
  const isQuickAddTrigger = href === "#quickAdd";
  const isCartTrigger = href === "#shoppingCart";

  const handleClick = (e: React.MouseEvent) => {
    if (!product) return;

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

    addProductToCart(product, quantity);
    openModal("cart");
  };

  const isStockOut = product && (product as { isStockOut?: boolean }).isStockOut;

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
