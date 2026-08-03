import { Link } from "react-router-dom";
import { useProductCard } from "./useProductCard";
import { formatPrice } from "@/utils/formatPrice";
import AddToCartButton from "@/components/common/AddToCartButton";
import WishlistButton from "@/components/common/WishlistButton";

export function ProductCardClassicView() {
  const {
    product,
    wrapperClass,
    cardClass,
    infoClassName,
    imgWidth,
    imgHeight,
    wowDelay,
    shopMeta,
    activeImage,
    activeHoverImage,
    setActiveImage,
  } = useProductCard();

  return (
    <div
      className={`card-product classic-view wow fadeInUp border rounded h-100 d-flex flex-column ${cardClass}`.trim()}
      data-wow-delay={wowDelay}
      data-availability={shopMeta?.availability}
      data-brand={shopMeta?.brand}
      style={{ borderColor: "#e5e5e5", overflow: "hidden" }}
      onMouseEnter={() => setActiveImage(activeHoverImage)}
      onMouseLeave={() => setActiveImage(product.img ?? "")}
    >
      <div className={`card-product_wrapper position-relative ${wrapperClass}`.trim()}>
        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px", border: "1px solid rgba(0,0,0,0.06)" }}
          />
        </div>
        <Link
          to={`/product-detail/${product.id}`}
          className="product-img"
          style={{ display: "block", aspectRatio: `${imgWidth}/${imgHeight}`, overflow: "hidden" }}
        >
          <img
            className="img-product"
            src={activeImage}
            alt={product.name}
            width={imgWidth}
            height={imgHeight}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <img
            className="img-hover"
            src={activeHoverImage}
            alt={product.name}
            width={imgWidth}
            height={imgHeight}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>
        {/* Sale badge inside the image on bottom left */}
        {product.priceOld != null && product.priceOld > product.price && (
          <div 
            className="position-absolute bottom-0 start-0 m-3 px-2 py-1 text-white text-caption-01 rounded-1" 
            style={{ background: "#a87754", zIndex: 10, fontSize: "12px", letterSpacing: "0.5px" }}
          >
            Sale
          </div>
        )}
      </div>
      
      <div className={`card-product_info p-3 d-flex flex-column flex-grow-1 ${infoClassName}`.trim()}>
        <Link 
          to={`/product-detail/${product.id}`} 
          className="name-product text-dark flex-grow-1 text-decoration-none"
          style={{ fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: "1.5", color: "#333", marginBottom: "8px" }}
        >
          {product.name}
        </Link>
        
        <div className="d-flex align-items-center mb-3 gap-2 flex-wrap">
          {product.priceOld != null && product.priceOld > product.price && (
            <span className="price-old text-decoration-line-through" style={{ fontSize: "13px", color: "#888" }}>
              {formatPrice(product.priceOld)}
            </span>
          )}
          <span className="price-new" style={{ color: "#5a2d26", fontSize: "17px", fontWeight: "500" }}>
            {formatPrice(product.price)}
          </span>
        </div>
        
        <AddToCartButton
          product={product}
          href="#shoppingCart"
          dataToggle="offcanvas"
          label="Add to cart"
          className="btn w-100 rounded-1 text-uppercase mt-auto btn-classic-add-to-cart"
        />
      </div>
    </div>
  );
}
