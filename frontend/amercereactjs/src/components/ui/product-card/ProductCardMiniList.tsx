import { Link } from "react-router-dom";
import AddToCartButton from "@/components/common/AddToCartButton";
import WishlistButton from "@/components/common/WishlistButton";
import {
  ProductCardDualImageLink,
  ProductCardPriceWrap,
} from "./ProductCardParts";
import { useProductCard } from "./useProductCard";

export function ProductCardMiniList() {
  const {
    product,
    wrapperClass,
    cardClass,
    imgWidth,
    imgHeight,
    activeImage,
    activeHoverImage,
    setActiveImage,
    actionBotLabel,
    actionBotHref,
    actionBotDataToggle,
  } = useProductCard();

  return (
    <div 
      className={`card-product product-style_mini_list ${cardClass}`.trim()}
      onMouseEnter={() => setActiveImage(activeHoverImage)}
      onMouseLeave={() => setActiveImage(product.img ?? "")}
    >
      <div className={`card-product_wrapper ${wrapperClass}`.trim()}>
        <ProductCardDualImageLink
          productId={product.id}
          activeImage={activeImage}
          hoverImage={activeHoverImage}
          alt={product.name}
          width={imgWidth}
          height={imgHeight}
        />
      </div>
      <div className="card-product_info">
        <Link
          to={`/product-detail/${product.id}`}
          className="name-product lh-24 fw-medium link-underline-text"
        >
          {product.name}
        </Link>
        <ProductCardPriceWrap
          price={product.price}
          priceOld={product.priceOld}
        />
        <div className="d-flex align-items-center gap-2 mt-2">
          <AddToCartButton
            product={product}
            href={actionBotHref}
            dataToggle={actionBotDataToggle}
            className="btn-action"
            label={actionBotLabel}
            variant="icon"
          />
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon"
          />
        </div>
      </div>
    </div>
  );
}

