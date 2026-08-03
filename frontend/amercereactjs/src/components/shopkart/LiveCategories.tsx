import { Link } from "react-router-dom";
import { useCategories, apiImageUrl } from "@/hooks/useApi";

export default function LiveCategories() {
  const { categories, loading } = useCategories();

  if (loading) return null;
  if (!categories.length) return null;

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading text-center wow fadeInUp">
          <h3 className="s-title">Shop by Category</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Explore our curated saree collections
          </p>
        </div>
        <div className="tf-grid-layout tf-col-5 gap-15">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop-left-sidebar?category_id=${cat.id}`}
              className="collection-item style-2 hover-img wow fadeInUp"
            >
              <div className="collection-image img-style ratio ratio-1x1 rounded-3 overflow-hidden">
                {cat.image ? (
                  <img
                    src={apiImageUrl(cat.image)}
                    alt={cat.name}
                    className="lazyload object-cover w-100 h-100"
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light h-100"
                    style={{ fontSize: 36 }}
                  >
                    🥻
                  </div>
                )}
              </div>
              <div className="collection-content text-center pt-2">
                <h6 className="fw-medium">{cat.name}</h6>
                {cat.product_count != null && (
                  <p className="text-body-2 cl-text-2">{cat.product_count} items</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
