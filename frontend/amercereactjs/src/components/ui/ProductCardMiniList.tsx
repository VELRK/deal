import { Link } from "react-router-dom";
import type { ProductCardItem } from "@/types/productCard";
import AddToCartButton from "@/components/common/AddToCartButton";
import WishlistButton from "@/components/common/WishlistButton";
import { formatPrice } from "@/utils/formatPrice";

export interface ProductCardMiniListProps {
  product: ProductCardItem;
  imgSize?: number;
}

export default function ProductCardMiniList({
  product,
  imgSize = 160,
}: ProductCardMiniListProps) {
  return (
    <div className="card-product product-style_mini_list wow fadeInUp">
      <div className="card-product_wrapper">
        <Link to={`/product-detail/${product.id}`} className="product-img">
          <img
            className="img-product"
            src={`${product.img}`}
            alt={product.name}
            width={imgSize}
            height={imgSize}
            loading="lazy"
          />
          <img
            className="img-hover"
            src={`${product.imgHover ?? product.img}`}
            alt={product.name}
            width={imgSize}
            height={imgSize}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="card-product_info">
        <Link
          to={`/product-detail/${product.id}`}
          className="name-product lh-24 fw-medium link-underline-text"
        >
          {product.name}
        </Link>
        <div className="price-wrap">
          <span className="price-new text-primary fw-semibold">
            {formatPrice(product.price)}
          </span>
          {product.priceOld != null && (
            <span className="price-old text-caption-01 cl-text-3">
              {formatPrice(product.priceOld)}
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 mt-2">
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            className="btn-action"
            label="Add to cart"
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

