import { Link } from "react-router-dom";
import { useProducts, toProductCard, apiImageUrl } from "@/hooks/useApi";
import { formatPrice } from "@/utils/formatPrice";
import WishlistButton from "@/components/common/WishlistButton";

function Recent({ query = "" }: { query?: string }) {
  const q = query.trim();
  const { products: apiProducts, loading } = useProducts(q ? { q, limit: 16 } : { limit: 16 });

  const products = apiProducts.map(toProductCard);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center mb-32">
          <h4 className="s-title">
            {q ? `Results for "${q}"` : "Our Products"}
          </h4>
          {q && (
            <p className="cl-text-2 mt-8">
              {loading ? "Searching…" : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-40">
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-40">
            <p className="cl-text-2 mb-16">
              No products found{q ? ` for "${q}"` : ""}.
            </p>
            <Link to="/shop-default" className="tf-btn animate-btn btn-sm">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="tf-grid-layout tf-col-2 lg-col-4 gap-30">
            {products.map((p) => (
              <div key={p.id} className="card-product">
                <div className="card-product_wrapper position-relative">
                  <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                    <WishlistButton
                      product={p}
                      className="hover-tooltip tooltip-left box-icon bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "34px", height: "34px", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                  </div>
                  <Link to={`/product-detail/${p.id}`} className="product-img" style={{ display: "block", aspectRatio: "3/4", overflow: "hidden" }}>
                    <img
                      src={p.img || apiImageUrl(null)}
                      alt={p.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Link>
                </div>
                <div className="card-product_info mt-12">
                  <Link to={`/product-detail/${p.id}`} className="product-name fw-semibold link">
                    {p.name}
                  </Link>
                  <div className="product-infor-price mt-4">
                    <span className="price-on-sale fw-bold">{formatPrice(p.price)}</span>
                    {p.priceOld && (
                      <span className="cl-text-3 text-decoration-line-through ms-8" style={{ fontSize: 13 }}>
                        {formatPrice(p.priceOld)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Recent;
