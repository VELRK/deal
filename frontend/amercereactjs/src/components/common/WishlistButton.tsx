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
        outline: "none",
        border: "none",
        ...style,
      }}
      suppressHydrationWarning
      aria-label={isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isAdded ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          fill="#e53935"
          className="icon"
          viewBox="0 0 16 16"
          aria-hidden
          suppressHydrationWarning
          style={{ verticalAlign: "-0.125em" }}
        >
          <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.732 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          fill="currentColor"
          className="icon"
          viewBox="0 0 16 16"
          aria-hidden
          suppressHydrationWarning
          style={{ verticalAlign: "-0.125em" }}
        >
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg>
      )}
      <span className="tooltip" suppressHydrationWarning>
        {isLoggedIn
          ? isAdded ? "Remove from Wishlist" : "Add to Wishlist"
          : "Login to save"}
      </span>
    </button>
  );
}

