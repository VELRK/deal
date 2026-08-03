import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import AddToCartButton from "@/components/common/AddToCartButton";
import WishlistButton from "@/components/common/WishlistButton";

export function OfferCard({ product }: { product: any }) {
  const discount =
    product.priceOld && product.priceOld > product.price
      ? Math.round(((product.priceOld - product.price) / product.priceOld) * 100)
      : 0;

  return (
    <div
      className="card-product wow fadeInUp d-flex flex-column"
      style={{
        border: "1px solid #ececec",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow .2s ease, transform .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div className="position-relative" style={{ lineHeight: 0 }}>
        <div className="position-absolute" style={{ top: "8px", right: "8px", zIndex: 10 }}>
          <WishlistButton
            product={product}
            className="hover-tooltip tooltip-left box-icon bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "34px", height: "34px", border: "1px solid rgba(0,0,0,0.06)" }}
          />
        </div>
        <Link
          to={`/product-detail/${product.id}`}
          className="d-block"
          style={{ aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#f7f7f7" }}
        >
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </Link>
        {discount > 0 && (
          <div
            className="position-absolute text-white"
            style={{
              top: "10px",
              left: "10px",
              background: "#d32f2f",
              zIndex: 2,
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              letterSpacing: "0.3px",
            }}
          >
            -{discount}%
          </div>
        )}
      </div>

      {/* Info — fixed-height column so every card lines up */}
      <div
        className="d-flex flex-column text-start"
        style={{ padding: "12px 14px 14px", flexGrow: 1 }}
      >
        <Link
          to={`/product-detail/${product.id}`}
          className="text-decoration-none text-dark"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "1.35",
            marginBottom: "8px",
            height: "38px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Link>

        <div
          className="d-flex align-items-baseline flex-wrap"
          style={{ marginBottom: "12px", gap: "6px", minHeight: "20px" }}
        >
          <span className="fw-bold" style={{ color: "#d32f2f", fontSize: "15px" }}>
            {formatPrice(product.price)}
          </span>
          {product.priceOld != null && product.priceOld > product.price && (
            <span
              className="text-decoration-line-through text-muted"
              style={{ fontSize: "12px" }}
            >
              {formatPrice(product.priceOld)}
            </span>
          )}
        </div>

        <div style={{ marginTop: "auto" }}>
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            label="ADD TO CART"
            className="btn w-100 fw-bold"
            style={{
              backgroundColor: "#3ec1bc",
              borderColor: "#3ec1bc",
              color: "#fff",
              fontSize: "12.5px",
              padding: "9px 0",
              borderRadius: "6px",
              letterSpacing: "0.3px",
            }}
          />
        </div>
      </div>
    </div>
  );
}