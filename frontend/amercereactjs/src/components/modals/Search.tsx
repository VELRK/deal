import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "@/services/api";
import type { ApiProduct } from "@/services/api";
import { toProductCard } from "@/hooks/useApi";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

const FEATURED_KEYWORDS = ["Incense Sticks", "Dhoop Sticks", "Sambrani Cones", "Soaps", "Food Products"];

export default function Search({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const [query, setQuery]           = useState("");
  const [debouncedQuery, setDebounced] = useState("");
  const [results, setResults]       = useState<ApiProduct[]>([]);
  const [featured, setFeatured]     = useState<ApiProduct[]>([]);
  const [loading, setLoading]       = useState(false);

  // Debounce input
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 350);
    return () => window.clearTimeout(t);
  }, [query]);

  // Load featured products once on mount
  useEffect(() => {
    productsAPI.getAll({ limit: 8 })
      .then((r) => setFeatured(r.data.data?.products ?? []))
      .catch(() => {});
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    setLoading(true);
    productsAPI.search(debouncedQuery)
      .then((r) => setResults(r.data.data ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const displayProducts = debouncedQuery ? results : featured;
  const sectionLabel    = debouncedQuery ? "Search Results" : "Featured Products";

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-search"
      id="search"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="d-flex align-items-center justify-content-between gap-10">
            <h3>Search</h3>
            <span className="icon-close-popup flex-shrink-0" data-bs-dismiss="modal">
              <i className="icon-X2" />
            </span>
          </div>

          <form className="form-search-nav style-2" onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              window.location.href = `/frontend/search-result?q=${encodeURIComponent(query.trim())}`;
            }
          }}>
            <fieldset>
              <input
                type="text"
                placeholder="Search incense sticks, soaps, food products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                autoFocus
              />
            </fieldset>
            <button type="submit" className="btn-action">
              <i className="icon icon-MagnifyingGlass" />
            </button>
          </form>

          {/* Featured keywords */}
          <div className="search-feature">
            <p className="h5 mb-16">Popular Searches</p>
            <div className="tf-list-tag">
              {FEATURED_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  className="link-tag border-0 bg-transparent"
                  onClick={() => setQuery(kw)}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="recently-view">
            <p className="h5 mb-16">{sectionLabel}</p>

            {loading && (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status" />
              </div>
            )}

            {!loading && debouncedQuery && results.length === 0 && (
              <p className="cl-text-2 mb-24">No products found for "<strong>{debouncedQuery}</strong>".</p>
            )}

            {!loading && displayProducts.length > 0 && (
              <TfSwiper
                className="mb-24"
                preview={4} tablet={3} mobileSm={2} mobile={2}
                spaceLg={30} spaceMd={20} space={10}
                paginationLg={4} paginationMd={3} paginationSm={2} pagination={2}
                paginationClassName="sw-dot-default tf-sw-pagination"
              >
                {displayProducts.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={toProductCard(product)}
                  />
                ))}
              </TfSwiper>
            )}

            {debouncedQuery && results.length > 0 && (
              <div className="text-center mb-16">
                <Link
                  to={`/search-result?q=${encodeURIComponent(debouncedQuery)}`}
                  className="tf-btn style-2 btn-sm"
                  data-bs-dismiss="modal"
                >
                  View all results for "{debouncedQuery}"
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
