import type { ProductCardItem } from "@/types/productCard";

export function ProductTitle({ product }: { product: ProductCardItem }) {
  const rating = Math.round(Number(product.avg_rating ?? product.rating ?? 5));
  const ratingVal = Number(product.avg_rating ?? product.rating ?? 5.0);
  const reviewCount = Number(product.review_count ?? 0);
  const totalSold = Number(product.total_sold ?? 0);

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewsEl = document.getElementById("customer-reviews") || document.getElementById("review");
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: "smooth" });
      const tabBtn = document.querySelector('a[href="#customer-reviews"]') as HTMLElement | null;
      if (tabBtn) tabBtn.click();
    }
  };

  return (
    <div className="product-title-section mb-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
        {product.brand_name ? (
          <span
            className="text-uppercase fw-semibold"
            style={{
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: "#a87754",
            }}
          >
            {product.brand_name}
          </span>
        ) : product.category ? (
          <span
            className="text-uppercase fw-semibold text-muted"
            style={{ fontSize: "11px", letterSpacing: "1.5px" }}
          >
            {product.category}
          </span>
        ) : null}

        {product.sku && (
          <span className="text-muted" style={{ fontSize: "12px" }}>
            SKU: <strong className="text-dark">{product.sku}</strong>
          </span>
        )}
      </div>

      <h1
        className="product-infor-name mb-2 text-capitalize"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "26px",
          fontWeight: 600,
          lineHeight: "1.3",
          color: "#1a1a1a",
          letterSpacing: "-0.3px",
        }}
      >
        {product.name}
      </h1>

      {product.subtitle && (
        <p
          className="product-subtitle text-muted mb-3"
          style={{ fontStyle: "italic", fontSize: "14px", lineHeight: "1.5" }}
        >
          {product.subtitle}
        </p>
      )}

      <div
        className="product-infor-meta d-flex align-items-center flex-wrap gap-3 py-2 border-bottom border-top my-3"
        style={{ borderColor: "#f0ede8 !important" }}
      >
        <div className="meta_rate d-flex align-items-center gap-2">
          <div className="star-wrap d-flex align-items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <i
                key={s}
                className="icon icon-Star"
                style={{
                  color: s <= rating ? "#a87754" : "#e0e0e0",
                  fontSize: "14px",
                }}
              />
            ))}
          </div>
          <span className="fw-medium text-dark" style={{ fontSize: "13px" }}>
            {ratingVal.toFixed(1)}{" "}
            <a
              href="#customer-reviews"
              onClick={scrollToReviews}
              className="text-muted text-decoration-underline ms-1"
              style={{ cursor: "pointer" }}
            >
              ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
            </a>
          </span>
        </div>

        {totalSold > 0 && (
          <>
            <div className="br-line type-vertical" style={{ height: "14px", width: "1px", backgroundColor: "#e0dcd5" }} />
            <div className="meta_sold d-flex align-items-center gap-1">
              <i className="icon icon-Lightning" style={{ color: "#a87754", fontSize: "14px" }} />
              <span className="text-muted" style={{ fontSize: "13px" }}>
                <strong className="text-dark">{totalSold}</strong> sold in 24h
              </span>
            </div>
          </>
        )}

        {product.model_name && (
          <>
            <div className="br-line type-vertical" style={{ height: "14px", width: "1px", backgroundColor: "#e0dcd5" }} />
            <div className="text-muted" style={{ fontSize: "13px" }}>
              Model: <span className="text-dark fw-medium">{product.model_name}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

