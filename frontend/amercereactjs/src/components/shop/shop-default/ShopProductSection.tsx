import ProductCard from "@/components/ui/ProductCard";
import { clearAllFilters } from "./filterActions";
import { useShop } from "./ShopContext";
import { ShopAppliedFilters } from "./ShopAppliedFilters";
import { ShopEmptyFilters } from "./ShopListingUi";
import { ShopListingFooters } from "./ShopListingFooters";
import { useShopProgressiveLoad } from "./useShopProgressiveLoad";
import { shopMetaFor } from "./shopProductMeta";
import { resolveGridProductCardVariant } from "./shopLayoutUtils";

function ProductSkeleton() {
  return (
    <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ background: "#f0f0f0", borderRadius: 8, aspectRatio: "3/4", marginBottom: 12 }} />
      <div style={{ background: "#f0f0f0", borderRadius: 4, height: 14, width: "70%", marginBottom: 8 }} />
      <div style={{ background: "#f0f0f0", borderRadius: 4, height: 14, width: "40%" }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  );
}

export function ShopProductSection() {
  const {
    state,
    dispatch,
    viewMode,
    gridCols,
    loading,
    hasNoFilteredItems,
    variants,
    pagedVisibleProducts,
    progressive,
    infiniteScroll,
  } = useShop();

  const { visibleProducts, loadMore } = useShopProgressiveLoad({
    enabled: progressive,
    infiniteScroll,
    sorted: state.sorted,
    itemPerPage: state.itemPerPage,
    pagedSlice: pagedVisibleProducts,
    hasNoFilteredItems,
    viewMode,
  });

  const gridCardVariant = resolveGridProductCardVariant(variants);
  const onClear = () => clearAllFilters(dispatch);

  return (
    <div className="wrapper-control-shop gridLayout-wrapper">
      <ShopAppliedFilters state={state} dispatch={dispatch} />

      <div
        className={`tf-list-layout wrapper-shop ${viewMode === "list" ? "" : "d-none"}`}
        id="listLayout"
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : hasNoFilteredItems ? (
          <ShopEmptyFilters onClear={onClear} />
        ) : (
          visibleProducts.map((product, i) => (
            <ProductCard
              key={`${product.id}-list-${i}`}
              product={product}
              variant="shopList"
              wrapperClass={product.cardVariant}
              cardClass=""
              shopMeta={shopMetaFor(product)}
            />
          ))
        )}
      </div>

      <div
        className={`wrapper-shop tf-grid-layout ${gridCols} ${viewMode === "grid" ? "" : "d-none"}`}
        id="gridLayout"
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i}><ProductSkeleton /></div>
          ))
        ) : hasNoFilteredItems ? (
          <div className="wd-full">
            <ShopEmptyFilters onClear={onClear} />
          </div>
        ) : (
          visibleProducts.map((product, i) => (
            <ProductCard
              key={`${product.id}-grid-${i}`}
              product={product}
              wrapperClass={product.cardVariant}
              variant={gridCardVariant}
              cardClass="grid"
              shopMeta={shopMetaFor(product)}
            />
          ))
        )}
        {!loading && <ShopListingFooters layout="grid" loadMore={loadMore} />}
      </div>

      <ShopListingFooters layout="list" loadMore={loadMore} />
    </div>
  );
}
