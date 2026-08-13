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

  const discountPercent = product.priceOld
    ? Math.round(((product.priceOld - product.price) / product.priceOld) * 100)
    : 0;

  return (
    <div
      className={`card-product classic-view wow fadeInUp rounded d-flex flex-column ${cardClass}`.trim()}
      data-wow-delay={wowDelay}
      data-availability={shopMeta?.availability}
      data-brand={shopMeta?.brand}
      style={{
        backgroundColor: "#fdf8f4",
        padding: "15px",
        height: "100%",
        gap: "12px",
        border: "1px solid #f0e6df",
      }}
      onMouseEnter={() => setActiveImage(activeHoverImage)}
      onMouseLeave={() => setActiveImage(product.img ?? "")}
    >
      {/* Image Container */}
      <div
        className={`card-product_wrapper position-relative ${wrapperClass}`.trim()}
        style={{ width: "100%", aspectRatio: `${imgWidth}/${imgHeight}`, overflow: "hidden", display: "block" }}
      >
        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "34px", height: "34px", border: "1px solid rgba(0,0,0,0.06)" }}
          />
        </div>

        {discountPercent > 0 && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#3ec1bc",
              color: "#fff",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "500",
              zIndex: 2,
              borderRadius: "2px",
            }}
          >
            {discountPercent}% OFF
          </div>
        )}

        <Link
          to={`/product-detail/${product.id}`}
          className="product-img"
          style={{ display: "block", width: "100%", height: "100%", overflow: "hidden", position: "relative" }}
        >
          <img
            className="img-product"
            src={activeImage}
            alt={product.name}
            width={imgWidth}
            height={imgHeight}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
          {activeHoverImage && activeHoverImage !== activeImage && (
            <img
              className="img-hover"
              src={activeHoverImage}
              alt={product.name}
              width={imgWidth}
              height={imgHeight}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", top: 0, left: 0 }}
            />
          )}
        </Link>
      </div>

      {/* Info Container */}
      <div className={`card-product_info d-flex flex-column gap-2 ${infoClassName}`.trim()}>
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#f5a623" }}>
          <span>★★★★★</span>
          <span style={{ color: "#777" }}>({(product as any).avg_rating || "5.0"})</span>
        </div>

        {/* Title */}
        <Link
          to={`/product-detail/${product.id}`}
          className="name-product text-dark text-decoration-none"
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.4",
          }}
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
            {formatPrice(product.price)}
          </span>
          {product.priceOld != null && product.priceOld > product.price && (
            <span style={{ fontSize: "13px", color: "#999", textDecoration: "line-through" }}>
              {formatPrice(product.priceOld)}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div style={{ marginTop: "auto", paddingTop: "6px" }}>
        <AddToCartButton
          product={product}
          href="#shoppingCart"
          dataToggle="offcanvas"
          label="Add to Cart +"
          className="btn w-100 rounded-1"
          style={{
            width: "100%",
            backgroundColor: "#3ec1bc",
            borderColor: "#3ec1bc",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
    </div>
  );
}