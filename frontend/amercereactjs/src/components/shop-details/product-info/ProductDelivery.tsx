import type { ProductCardItem } from "@/types/productCard";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function firstLine(text: string, max = 90): string {
  const clean = stripHtml(text);
  const first = clean.split(/[.!\n]/)[0].trim();
  const result = first.length > 0 ? first : clean;
  if (result.length <= max) return result;
  return result.slice(0, max).trimEnd() + "…";
}

const GENERIC_SHIP = "we ship across";

export function ProductDelivery({ product }: { product?: ProductCardItem }) {
  if (!product) return null;

  const rawShipping = product.shipping_info ?? "";
  const shippingText = rawShipping && !rawShipping.toLowerCase().includes(GENERIC_SHIP)
    ? firstLine(rawShipping)
    : null;

  return (
    <div className="tf-product-delivery-return border-top pt-3 mt-4 d-flex flex-column gap-3">


      {/* 4 Pillars of Classic Trust */}
      <div
        className="trust-features-grid mt-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div
          className="d-flex align-items-center gap-2 p-2 rounded"
          style={{ backgroundColor: "#fbfaf8", border: "1px solid #f3eee8" }}
        >
          <i className="icon icon-ShieldCheck" style={{ color: "#a87754", fontSize: "20px" }} />
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: "12px", lineHeight: "1.2" }}>100% Authentic</div>
            <div className="text-muted" style={{ fontSize: "11px" }}>Direct from brand</div>
          </div>
        </div>

        <div
          className="d-flex align-items-center gap-2 p-2 rounded"
          style={{ backgroundColor: "#fbfaf8", border: "1px solid #f3eee8" }}
        >
          <i className="icon icon-Package" style={{ color: "#a87754", fontSize: "20px" }} />
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: "12px", lineHeight: "1.2" }}>Free Shipping</div>
            <div className="text-muted" style={{ fontSize: "11px" }}>On all prepaid orders</div>
          </div>
        </div>

        <div
          className="d-flex align-items-center gap-2 p-2 rounded"
          style={{ backgroundColor: "#fbfaf8", border: "1px solid #f3eee8" }}
        >
          <i className="icon icon-ArrowsClockwise" style={{ color: "#a87754", fontSize: "20px" }} />
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: "12px", lineHeight: "1.2" }}>Easy Returns</div>
            <div className="text-muted" style={{ fontSize: "11px" }}>7 Days return window</div>
          </div>
        </div>

        <div
          className="d-flex align-items-center gap-2 p-2 rounded"
          style={{ backgroundColor: "#fbfaf8", border: "1px solid #f3eee8" }}
        >
          <i className="icon icon-LockSimple" style={{ color: "#a87754", fontSize: "20px" }} />
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: "12px", lineHeight: "1.2" }}>Secure Payment</div>
            <div className="text-muted" style={{ fontSize: "11px" }}>256-Bit SSL protection</div>
          </div>
        </div>
      </div>

      {shippingText && (
        <div className="product-delivery d-flex align-items-center gap-2">
          <i className="icon icon-Truck" style={{ color: "#a87754", fontSize: "16px" }} />
          <span className="text-muted" style={{ fontSize: "13px" }}>
            {shippingText}
          </span>
        </div>
      )}

      {product.manufacturer_name && (
        <div className="product-delivery d-flex align-items-start gap-2">
          <i className="icon icon-Buildings" style={{ color: "#a87754", fontSize: "16px", marginTop: "2px" }} />
          <span className="text-muted" style={{ fontSize: "12px", lineHeight: "1.4" }}>
            Manufactured by: <span className="text-dark fw-medium">{product.manufacturer_name}</span>
            {product.manufacturer_address && `, ${product.manufacturer_address}`}
          </span>
        </div>
      )}
    </div>
  );
}

