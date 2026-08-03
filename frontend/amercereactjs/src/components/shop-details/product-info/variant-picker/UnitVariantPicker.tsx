import { useProduct } from "@/context/useProduct";
import { formatPrice } from "@/utils/formatPrice";

export function UnitVariantPicker() {
  const { unitVariants, currentVariantId, setCurrentVariantId } = useProduct();
  if (unitVariants.length === 0) return null;

  const active = unitVariants.find((v) => v.id === currentVariantId) ?? unitVariants[0];

  return (
    <div className="variant-picker-item variant-unit mb-4">
      <div className="variant-picker-label mb-3">
        <span
          className="fw-medium text-dark"
          style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}
        >
          Select Pack Size
        </span>
        {active && (
          <span className="text-muted ms-2" style={{ fontSize: "12px" }}>
            — {active.label}
          </span>
        )}
      </div>

      <div
        className="variant-unit-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "12px",
        }}
      >
        {unitVariants.map((variant) => {
          const isActive = currentVariantId === variant.id;
          const outOfStock = variant.stock <= 0;
          const discount =
            variant.priceOld && variant.priceOld > variant.price
              ? Math.round(((variant.priceOld - variant.price) / variant.priceOld) * 100)
              : 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={outOfStock}
              onClick={() => setCurrentVariantId(variant.id)}
              aria-pressed={isActive}
              title={variant.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                padding: 0,
                border: isActive ? "2px solid #a87754" : "1px solid #e5e0db",
                borderRadius: "6px",
                background: isActive ? "#fdf8f4" : "#fff",
                cursor: outOfStock ? "not-allowed" : "pointer",
                opacity: outOfStock ? 0.5 : 1,
                overflow: "hidden",
                textAlign: "left",
                transition: "border-color 0.15s, box-shadow 0.15s",
                boxShadow: isActive ? "0 2px 8px rgba(168, 119, 84, 0.15)" : "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: "#f8f6f3",
                  overflow: "hidden",
                }}
              >
                {variant.img ? (
                  <img
                    src={variant.img}
                    alt={variant.label}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center h-100 text-muted"
                    style={{ fontSize: "11px", padding: "8px", textAlign: "center" }}
                  >
                    {variant.label}
                  </div>
                )}
              </div>

              <div style={{ padding: "8px 10px 10px" }}>
                <div
                  className="fw-medium text-dark"
                  style={{ fontSize: "12px", lineHeight: 1.3, marginBottom: "4px" }}
                >
                  {variant.label}
                </div>
                <div className="d-flex align-items-baseline flex-wrap gap-1">
                  <span className="fw-semibold" style={{ fontSize: "14px", color: "#1a1a1a" }}>
                    {formatPrice(variant.price)}
                  </span>
                  {variant.priceOld && variant.priceOld > variant.price && (
                    <>
                      <span
                        className="text-muted text-decoration-line-through"
                        style={{ fontSize: "11px" }}
                      >
                        {formatPrice(variant.priceOld)}
                      </span>
                      {discount > 0 && (
                        <span style={{ fontSize: "10px", color: "#166534", fontWeight: 600 }}>
                          {discount}% off
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div style={{ fontSize: "10px", marginTop: "4px", color: outOfStock ? "#991b1b" : "#166534" }}>
                  {outOfStock ? "Out of stock" : `${variant.stock} available`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
