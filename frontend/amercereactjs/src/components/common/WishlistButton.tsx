import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/context/Context";
import { fireWishlistConfetti } from "@/utils/confetti";

interface WishlistButtonProps {
  product?: Product;
  variant?: "default" | "button" | "toolbar";
  className?: string;
  style?: React.CSSProperties;
}

function openSignInModal() {
  import("bootstrap").then(({ Modal }) => {
    const el = document.getElementById("sign");
    if (el) Modal.getOrCreateInstance(el).show();
  });
}

export default function WishlistButton({
  product,
  variant = "default",
  className,
  style,
}: WishlistButtonProps) {
  const { isLoggedIn } = useAuthStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const isAdded = product ? isWishlisted(product.id) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      openSignInModal();
      return;
    }
    if (product) {
      if (!isAdded) {
        fireWishlistConfetti(e.clientX, e.clientY);
      }
      toggle(product);
    }
  };

  if (variant === "toolbar") {
    return (
      <Link to="/wishlist">
        <span className="toolbar-icon">
          <i className="icon icon-HeartStraight" />
        </span>
        <span className="toolbar-label">Wishlist</span>
      </Link>
    );
  }

  const baseClass =
    variant === "button"
      ? "hover-tooltip box-icon btn-add-wishlist"
      : "hover-tooltip tooltip-left box-icon";
  const activeClass = isAdded ? "active" : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`tf-btn-reset ${className || baseClass} ${activeClass}`.trim()}
      style={{
        transition: "all 0.2s ease",
        color: isAdded ? "#e53935" : undefined,
        ...style,
      }}
      suppressHydrationWarning
      aria-label={isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <span
        className={`icon ${isAdded ? "icon-heart text-danger" : "icon-heart"}`}
        style={{ color: isAdded ? "#e53935" : undefined }}
        aria-hidden
        suppressHydrationWarning
      />
      <span className="tooltip" suppressHydrationWarning>
        {isLoggedIn
          ? isAdded ? "Remove from Wishlist" : "Add to Wishlist"
          : "Login to save"}
      </span>
    </button>
  );
}

