import { Link, useParams } from "react-router-dom";
import { useProducts } from "@/hooks/useApi";
import type { ProductCardItem } from "@/types/productCard";
import { collectionPath, productPath } from "@/utils/seoPaths";

function NavArrow({ direction, href, iconClass }: {
  direction: "prev" | "next"; href?: string; iconClass: string;
}) {
  const cls = `link nav-post-item nav-post-${direction}`;
  if (!href) {
    return (
      <span className={`${cls} opacity-50`} style={{ pointerEvents: "none" }} aria-disabled="true">
        <i className={`icon ${iconClass}`} />
      </span>
    );
  }
  return <Link to={href} className={cls}><i className={`icon ${iconClass}`} /></Link>;
}

export default function Breadcrumb({ product }: { product: ProductCardItem }) {
  const params   = useParams();
  const rawId    = Array.isArray(params.id) ? params.id[0] : params.id;
  const currentId = Number(rawId) || product.id;

  // Fetch all product IDs (lightweight — id + name only from cache)
  const { products: allProducts } = useProducts({ limit: 100, sort: "newest" });

  const sorted  = [...allProducts].sort((a, b) => a.id - b.id);
  const idx     = sorted.findIndex((p) => p.id === currentId);
  const prev    = idx > 0 ? sorted[idx - 1] : null;
  const next    = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const prevHref  = prev ? productPath(prev) : undefined;
  const nextHref  = next ? productPath(next) : undefined;

  return (
    <div className="section-page-title-single flat-spacing-3">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs">
            <Link to="/" className="text-caption-01 cl-text-3 link">Home</Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <Link
              to={product.category ? collectionPath(product.category.toLowerCase().replace(/\s+/g, "-")) : "/shop-default"}
              className="text-caption-01 cl-text-3 link"
            >
              {product.category ?? "Shop"}
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01">{product.name}</p>
          </div>
          <div className="nav-post-list">
            <NavArrow direction="prev" href={prevHref} iconClass="icon-CaretLeft" />
            <Link to="/shop-default" className="link nav-all-post nav-post-link">
              <i className="icon icon-SquaresFour" />
            </Link>
            <NavArrow direction="next" href={nextHref} iconClass="icon-CaretRightThin" />
          </div>
        </div>
      </div>
    </div>
  );
}
