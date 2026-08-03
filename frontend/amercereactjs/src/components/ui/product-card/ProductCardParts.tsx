import { Link } from "react-router-dom";

import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";
import CountdownTimer from "@/components/common/Countdown";
import { badgeClassFromBadge, STAR_COUNT } from "./productCardUtils";
import React from "react";

export function ProductCardDualImageLink({
  productId,
  activeImage,
  hoverImage,
  alt,
  width,
  height,
}: {
  productId: number;
  activeImage: string;
  hoverImage: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <Link
      to={`/product-detail/${productId}`}
      className="product-img"
      style={{ display: "block", aspectRatio: "3/4", overflow: "hidden" }}
    >
      <img
        className="img-product"
        src={activeImage}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <img
        className="img-hover"
        src={hoverImage}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </Link>
  );
}

export function ProductCardBadgeList({
  product,
}: {
  product: Pick<ProductCardItem, "badge" | "badgeTrend" | "isStockOut">;
}) {
  const isStockOut = (product as { isStockOut?: boolean }).isStockOut;
  if (isStockOut) {
    return (
      <ul className="product-badge_list">
        <li className="product-badge_item text-caption-01" style={{ background: "#991b1b", color: "#fff" }}>
          Sold Out
        </li>
      </ul>
    );
  }

  if (product.badge == null && product.badgeTrend == null) return null;

  const badgeClass = badgeClassFromBadge(product.badge);

  return (
    <ul className="product-badge_list">
      {product.badge != null && (
        <li className={`product-badge_item text-caption-01 ${badgeClass}`}>
          {product.badge}
        </li>
      )}
      {product.badgeTrend != null && (
        <li className="product-badge_item text-caption-01 trend">
          {product.badgeTrend}
        </li>
      )}
    </ul>
  );
}

export function ProductCardMarquee({ text }: { text: string }) {
  return (
    <div className="product-marquee_sale">
      <div className="marquee-wrapper">
        <div className="initial-child-container">
          {[1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <div className="marquee-child-item">{text}</div>
              <i className="icon icon-Star2" aria-hidden />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductCardPriceWrap({
  price,
  priceOld,
}: Pick<ProductCardItem, "price" | "priceOld">) {
  return (
    <div className="price-wrap">
      <span className="price-new text-primary fw-semibold">
        {formatPrice(price)}
      </span>
      {priceOld != null && (
        <span className="price-old text-caption-01 cl-text-3">
          {formatPrice(priceOld)}
        </span>
      )}
    </div>
  );
}

export function ProductCardStars({ className = "" }: { className?: string }) {
  return (
    <div className={`star-wrap d-flex align-items-center ${className}`.trim()}>
      {[...Array(STAR_COUNT)].map((_, i) => (
        <i key={i} className="icon icon-Star" aria-hidden />
      ))}
    </div>
  );
}

export function ProductCardColorSwatches({
  colors,
  activeImage,
  onHoverColor,
}: {
  colors: NonNullable<ProductCardItem["colors"]>;
  activeImage: string;
  onHoverColor: (img: string) => void;
}) {
  return (
    <ul className="product-color_list">
      {colors.map((color, i) => (
        <li
          key={`${color.label}-${i}`}
          onMouseEnter={() => onHoverColor(color.img)}
          className={`product-color-item color-swatch hover-tooltip tooltip-bot ${activeImage === color.img ? "active" : ""}`}
        >
          <span className="tooltip color-filter">{color.label}</span>
          <span
            className={`swatch-value ${color.swatchClass}`}
            style={color.hex ? { background: color.hex, border: "1.5px solid rgba(0,0,0,0.12)" } : { border: "1.5px solid rgba(0,0,0,0.12)" }}
          />
          <img src={color.img} alt={color.label} width={660} height={880} />
        </li>
      ))}
    </ul>
  );
}

export function ProductCardSizeList({
  sizes,
  className = "",
}: {
  sizes: string[];
  className?: string;
}) {
  return (
    <ul className={`product-size_list ${className}`.trim()}>
      {sizes.map((size) => (
        <li key={size} className="size-item text-caption-01">
          {size}
        </li>
      ))}
    </ul>
  );
}

export function ProductCardCountdown() {
  return (
    <div className="product-countdown">
      <div className="js-countdown cd-has-zero">
        <CountdownTimer style={1} />
      </div>
    </div>
  );
}
