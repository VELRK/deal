import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";
import { useProducts, toProductCard } from "@/hooks/useApi";
import type { ProductFilters } from "@/services/api";

interface LiveProductsProps {
  title?: string;
  subtitle?: string;
  filters?: ProductFilters;
  viewAllUrl?: string;
  layout?: "swiper" | "grid";
  cols?: number;
}

export default function LiveProducts({
  title = "Our Collection",
  subtitle,
  filters = {},
  viewAllUrl = "/shop-left-sidebar",
  layout = "swiper",
  cols = 4,
}: LiveProductsProps) {
  const { products, loading } = useProducts({ ...filters, limit: 8 });

  const cards = products.map(toProductCard);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        {(title || viewAllUrl) && (
          <div className="sect-heading mb-0 wow fadeInUp d-flex justify-content-between align-items-end">
            <div>
              {title && <h3 className="s-title">{title}</h3>}
              {subtitle && <p className="s-desc text-body-1 cl-text-2">{subtitle}</p>}
            </div>
            {viewAllUrl && (
              <Link to={viewAllUrl} className="tf-btn btn-line">
                View All <i className="icon icon-ArrowLongRight" />
              </Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="d-flex gap-3 mt-4">
            {[...Array(cols)].map((_, i) => (
              <div
                key={i}
                className="placeholder-glow flex-fill"
                style={{ height: 380, background: "#f5f5f5", borderRadius: 8 }}
              />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <p className="text-center text-muted py-5">No products found.</p>
        ) : layout === "swiper" ? (
          <TfSwiper
            preview={cols}
            tablet={Math.min(cols, 3)}
            mobileSm={2}
            mobile={2}
            spaceLg={30}
            spaceMd={20}
            space={10}
            pagination={2}
            paginationSm={2}
            paginationMd={3}
            paginationLg={cols}
            className="wrap-sw-over"
            paginationClassName="sw-dot-default tf-sw-pagination"
          >
            {cards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </TfSwiper>
        ) : (
          <div className={`grid grid-${cols}-col gap-30`}>
            {cards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
