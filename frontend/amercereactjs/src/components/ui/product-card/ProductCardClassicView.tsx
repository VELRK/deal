import { useState } from "react";
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
    wowDelay,
    shopMeta,
    activeImage,
    activeHoverImage,
    setActiveImage,
  } = useProductCard();

  const [isHovered, setIsHovered] = useState(false);

  const discountPercent =
    product.priceOld && product.priceOld > product.price
      ? Math.round(((product.priceOld - product.price) / product.priceOld) * 100)
      : 0;

  const ratingVal = (product as any).avg_rating || "4.8";
  const hasHoverImg = Boolean(activeHoverImage && activeHoverImage !== activeImage);

  return (
    <div
      className={`card-product classic-view fresh-arrival-card wow fadeInUp d-flex flex-column ${cardClass}`.trim()}
      data-wow-delay={wowDelay}
      data-availability={shopMeta?.availability}
      data-brand={shopMeta?.brand}
      style={{
        backgroundColor: "#ffffff",
        padding: "12px",
        height: "100%",
        borderRadius: "14px",
        border: "1px solid #eef2f6",
        boxShadow: isHovered
          ? "0 14px 28px rgba(0, 0, 0, 0.08)"
          : "0 2px 8px rgba(0, 0, 0, 0.04)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (hasHoverImg) setActiveImage(activeHoverImage);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImage(product.img ?? "");
      }}
    >
      {/* 1:1 Aspect Ratio Image Container */}
      <div
        className={`card-product_wrapper position-relative ${wrapperClass}`.trim()}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
          display: "block",
        }}
      >
        {/* Floating Wishlist Button */}
        <div
          className="position-absolute"
          style={{ top: "8px", right: "8px", zIndex: 10 }}
        >
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          />
        </div>

        {/* Dynamic Badge: Discount or New Tag */}
        {discountPercent > 0 ? (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              padding: "3px 8px",
              fontSize: "11px",
              fontWeight: 700,
              zIndex: 2,
              borderRadius: "6px",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              boxShadow: "0 2px 6px rgba(220, 38, 38, 0.35)",
            }}
          >
            {discountPercent}% OFF
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              color: "#ffffff",
              padding: "3px 8px",
              fontSize: "10.5px",
              fontWeight: 700,
              zIndex: 2,
              borderRadius: "6px",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)",
            }}
          >
            NEW
          </div>
        )}

        {/* Product Image Link */}
        <Link
          to={`/product-detail/${product.slug ?? product.id}`}
          className="product-img d-block w-100 h-100"
          style={{
            overflow: "hidden",
            position: "relative",
            aspectRatio: "1 / 1",
          }}
        >
          <img
            className="img-product"
            src={activeImage || product.img}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transform: isHovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          {hasHoverImg && (
            <img
              className="img-hover"
              src={activeHoverImage}
              alt={product.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: 0,
                left: 0,
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1.06)" : "scale(1)",
                transition: "opacity 0.3s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          )}
        </Link>
      </div>

      {/* Info Container */}
      <div
        className={`card-product_info d-flex flex-column ${infoClassName}`.trim()}
        style={{
          paddingTop: "10px",
          gap: "5px",
          flexGrow: 1,
          textAlign: "left",
        }}
      >
        {/* Zomato / Swiggy style Rating & Highlights */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
          }}
        >
          <span
            style={{
              backgroundColor: "#15803d",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "1.5px 6px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              lineHeight: "1.2",
            }}
          >
            ★ {ratingVal}
          </span>
          <span
            style={{
              color: "#64748b",
              fontWeight: 500,
              fontSize: "11.5px",
            }}
          >
            In Stock
          </span>
        </div>

        {/* Product Title - Fixed 2-line clamp for exact alignment */}
        <Link
          to={`/product-detail/${product.slug ?? product.id}`}
          className="name-product"
          style={{
            fontSize: "13.5px",
            fontWeight: 600,
            color: isHovered ? "#3ec1bc" : "#1e293b",
            lineHeight: "1.35",
            height: "37px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textDecoration: "none",
            transition: "color 0.2s ease",
            margin: "1px 0",
          }}
        >
          {product.name}
        </Link>

        {/* Amazon / Swiggy Price Row */}
        <div
          className="d-flex align-items-baseline flex-wrap"
          style={{ gap: "6px", minHeight: "22px", marginTop: "2px" }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.2px",
            }}
          >
            {formatPrice(product.price)}
          </span>
          {product.priceOld != null && product.priceOld > product.price && (
            <>
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  textDecoration: "line-through",
                  fontWeight: 400,
                }}
              >
                {formatPrice(product.priceOld)}
              </span>
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#16a34a",
                }}
              >
                ({discountPercent}% off)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Full Width Swiggy/Zomato/Amazon Style Add to Cart Button */}
      <div style={{ marginTop: "auto", paddingTop: "10px" }}>
        <AddToCartButton
          product={product}
          href="#shoppingCart"
          dataToggle="offcanvas"
          label="ADD TO CART"
          className="btn w-100"
          style={{
            width: "100%",
            backgroundColor: "#3ec1bc",
            borderColor: "#3ec1bc",
            color: "#ffffff",
            fontSize: "12.5px",
            fontWeight: 700,
            letterSpacing: "0.4px",
            padding: "9px 12px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(62, 193, 188, 0.25)",
            transition: "all 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}