import type { ProductCardItem } from "@/types/productCard";

export function ProductTitle({ product }: { product: ProductCardItem }) {
  const rating = Math.round(Number(product.avg_rating ?? product.rating ?? 5));
  const ratingVal = Number(product.avg_rating ?? product.rating ?? 5.0);
  const reviewCount = Number(product.review_count ?? 0);
  const totalSold = Number(product.total_sold ?? 0);

  return (
    <div className="product-title-section mb-4">
      {product.category && (
        <div className="product-infor-cate mb-2 text-uppercase text-muted">
          {product.category}
        </div>
      )}

      <h1 className="product-infor-name mb-2 text-capitalize">
        {product.name}
      </h1>

      {product.subtitle && (
        <p className="product-subtitle text-muted mb-4 font-italic" style={{ fontStyle: "italic", fontSize: "14px" }}>
          {product.subtitle}
        </p>
      )}

      <div className="product-infor-meta d-flex align-items-center flex-wrap gap-3 py-2 border-bottom border-top my-3">
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
          <span className="text-caption-01 fw-medium text-dark" style={{ fontSize: "13px" }}>
            {ratingVal.toFixed(1)} <span className="text-muted">({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})</span>
          </span>
        </div>

        {totalSold > 0 && (
          <>
            <div className="br-line type-vertical" />
            <div className="meta_sold d-flex align-items-center gap-1">
              <i className="icon icon-Lightning" style={{ color: "#a87754", fontSize: "14px" }} />
              <span className="text-caption-01 text-muted" style={{ fontSize: "13px" }}>
                <strong className="text-dark">{totalSold}</strong> sold
              </span>
            </div>
          </>
        )}

        {product.sku && (
          <>
            <div className="br-line type-vertical" />
            <div className="meta_sku text-caption-01" style={{ fontSize: "13px" }}>
              <span className="text-muted">SKU: </span>
              <span className="text-dark fw-medium">{product.sku}</span>
            </div>
          </>
        )}

        {product.brand_name && (
          <>
            <div className="br-line type-vertical" />
            <div className="meta_brand text-caption-01" style={{ fontSize: "13px" }}>
              <span className="text-muted">Brand: </span>
              <span className="text-dark fw-semibold">{product.brand_name}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

