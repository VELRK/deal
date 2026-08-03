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
  const sla = product?.procurement_sla ?? null;
  const rawShipping = product?.shipping_info ?? "";
  const shippingText = rawShipping && !rawShipping.toLowerCase().includes(GENERIC_SHIP)
    ? firstLine(rawShipping)
    : null;

  if (!product) return null;

  return (
    <div className="tf-product-delivery-return border-top pt-3 mt-4 d-flex flex-column gap-2">
      {sla && (
        <div className="product-delivery d-flex align-items-center gap-2">
          <i className="icon icon-Timer" style={{ color: "#a87754", fontSize: "16px" }} />
          <span className="text-muted" style={{ fontSize: "13px" }}>
            Estimated Delivery:{" "}
            <strong className="text-dark">{sla}–{sla + 3} business days</strong>
            {product.procurement_type === "MADE_TO_ORDER" && (
              <span className="text-muted small"> (Made to order)</span>
            )}
            {product.origin_state && (
              <span className="text-muted"> · Ships from {product.origin_state}</span>
            )}
          </span>
        </div>
      )}

      {shippingText && (
        <div className="product-delivery d-flex align-items-center gap-2">
          <i className="icon icon-Package" style={{ color: "#a87754", fontSize: "16px" }} />
          <span className="text-muted" style={{ fontSize: "13px" }}>
            {shippingText}
          </span>
        </div>
      )}

      {product.manufacturer_name && (
        <div className="product-delivery d-flex align-items-start gap-2">
          <i className="icon icon-Buildings" style={{ color: "#a87754", fontSize: "16px", marginTop: "2px" }} />
          <span className="text-muted" style={{ fontSize: "13px", lineHeight: "1.4" }}>
            Manufactured by: <span className="text-dark fw-medium">{product.manufacturer_name}</span>
            {product.manufacturer_address && `, ${product.manufacturer_address}`}
          </span>
        </div>
      )}
    </div>
  );
}

