import { useNavigate } from "react-router-dom";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { formatPrice } from "@/utils/formatPrice";

function closeDrawer() {
  const el = document.getElementById("recentlyViewedDrawer");
  if (!el) return;
  const bs = (window as unknown as { bootstrap?: { Offcanvas?: { getInstance?: (el: HTMLElement) => { hide(): void } | null } } }).bootstrap;
  bs?.Offcanvas?.getInstance?.(el)?.hide();
}

export default function RecentlyViewedDrawer({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const { products, loading } = useRecentlyViewed();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    closeDrawer();
    setTimeout(() => navigate(path), 50);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        className="rv-float-btn"
        data-bs-toggle="offcanvas"
        data-bs-target="#recentlyViewedDrawer"
        aria-controls="recentlyViewedDrawer"
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1040,
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "8px 0 0 8px",
          padding: "12px 10px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
        }}
        title="Recently Viewed"
      >
        <i className="icon icon-Eye" style={{ fontSize: 18 }} />
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.5px", writingMode: "vertical-rl", textOrientation: "mixed", lineHeight: 1 }}>
          RECENT
        </span>
      </button>

      {/* Offcanvas drawer */}
      <div
        ref={registerOffcanvasElement}
        className="offcanvas offcanvas-end"
        id="recentlyViewedDrawer"
        tabIndex={-1}
        aria-labelledby="recentlyViewedDrawerLabel"
        style={{ width: 360, maxWidth: "90vw" }}
      >
        <div className="canvas-wrapper" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div className="popup-header" style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f0f0f0" }}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="title mb-0" id="recentlyViewedDrawerLabel">
                <i className="icon icon-Eye me-2" style={{ fontSize: 18 }} />
                Recently Viewed
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
                <div className="spinner-border spinner-border-sm text-secondary" role="status" />
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center" style={{ paddingTop: 40 }}>
                <i className="icon icon-Eye" style={{ fontSize: 40, color: "#ccc" }} />
                <p className="cl-text-2 mt-3 mb-0">No recently viewed products yet.</p>
                <p className="cl-text-2 small">Browse products and they'll appear here.</p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {products.map((p) => (
                  <li key={p.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => goTo(`/product-detail/${p.id}`)}
                      style={{ flexShrink: 0, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        width={72}
                        height={96}
                        loading="lazy"
                        style={{ width: 72, height: 96, objectFit: "cover", borderRadius: 6, background: "#f5f5f5", display: "block" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => goTo(`/product-detail/${p.id}`)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", width: "100%" }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.name}
                        </span>
                      </button>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
                          {formatPrice(p.price)}
                        </span>
                        {p.priceOld != null && (
                          <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>
                            {formatPrice(p.priceOld)}
                          </span>
                        )}
                      </div>
                      {p.isStockOut ? (
                        <span style={{ fontSize: 11, color: "#991b1b", fontWeight: 600, marginTop: 4, display: "block" }}>Out of Stock</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => goTo(`/product-detail/${p.id}`)}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, color: "#666", marginTop: 4, display: "block", textDecoration: "underline" }}
                        >
                          View Product
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {!loading && products.length > 0 && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0" }}>
              <button
                type="button"
                onClick={() => goTo("/shop-default")}
                className="tf-btn animate-btn w-100 text-center"
                style={{ display: "block", width: "100%" }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
