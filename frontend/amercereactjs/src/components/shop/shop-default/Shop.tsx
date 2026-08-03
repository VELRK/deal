import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShopState } from "./useShopState";
import { useProducts, toProductCard } from "@/hooks/useApi";
import type { ShopProduct } from "@/types/shopFilter";
import { SORT_OPTIONS } from "./ShopFilterBody";
import { ShopMainColumn } from "./ShopMainColumn";
import { ShopPageLayout } from "./ShopPageLayout";
import { ShopOffcanvas } from "./ShopOffcanvas";
import { ShopProvider, type ShopContextValue } from "./ShopContext";
import { clampGridColsForWidth, type GridCols } from "./shopGridCols";
import {
  computePageItems,
  normalizeShopVariants,
  type ShopVariantProp,
} from "./shopLayoutUtils";

export default function Shop({
  variant,
  isFullWidth = false,
  staticProducts,
}: {
  variant?: ShopVariantProp;
  isFullWidth?: boolean;
  staticProducts?: ShopProduct[];
}) {
  const variants = useMemo(() => normalizeShopVariants(variant), [variant]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [gridCols, setGridCols] = useState<GridCols>(() =>
    clampGridColsForWidth(typeof window !== "undefined" ? window.innerWidth : 1200, "tf-col-4")
  );
  const [sortOpen, setSortOpen] = useState(false);
  const [wideEnoughForSidebar, setWideEnoughForSidebar] = useState(false);

  // Read API filters from URL search params
  const [searchParams] = useSearchParams();
  const apiFilters = {
    category_id:    searchParams.get("category_id") ?? undefined,
    subcategory_id: searchParams.get("subcategory_id") ?? undefined,
    category_slug:  searchParams.get("category_slug") ?? undefined,
    featured:       searchParams.get("featured") ?? undefined,
    sort:           searchParams.get("sort") ?? undefined,
    saree_type:     searchParams.get("saree_type") ?? undefined,
    fabric:         searchParams.get("fabric") ?? undefined,
    occasion:       searchParams.get("occasion") ?? undefined,
    q:              searchParams.get("q") ?? undefined,
    limit: 20,
  };

  // Fetch live products unless static ones are provided
  const { products: apiProducts, loading } = useProducts(
    staticProducts ? undefined : apiFilters,
  );

  const liveProducts: ShopProduct[] = useMemo(() => {
    if (staticProducts) return staticProducts;
    return apiProducts.map((p) => ({
      ...toProductCard(p),
      cardVariant: "" as const,
      filterBrands: p.brand_name ? [p.brand_name] : [],
      filterCategory: p.category_name ? [p.category_name] : [],
      filterColor: p.color ? [p.color] : [],
      filterSizes: [],
      tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
      inStock: (p.stock ?? 0) > 0,
      isStockOut: (p.stock ?? 0) === 0,
      services: ["Free Delivery"],
      rating: Math.round(p.avg_rating ?? 0),
    }));
  }, [staticProducts, apiProducts]);

  const sourceProducts = staticProducts ?? liveProducts;

  const {
    state,
    dispatch,
    visibleProducts: pagedVisibleProducts,
    getFilterCount,
    hasNoFilteredItems,
    hasMultiplePages,
  } = useShopState({ products: sourceProducts });

  const infiniteScroll = variants.includes("infinityScroll");
  const progressive = infiniteScroll || variants.includes("loadMoreButton");

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === state.sortingOption)?.label ??
    "Best Selling";

  const totalPages = Math.max(
    1,
    Math.ceil(state.sorted.length / state.itemPerPage),
  );

  const showPaginationFooter = !progressive && hasMultiplePages;
  const pageItems = computePageItems(totalPages, state.currentPage);

  const sidebarPlacement = variants.find(
    (v): v is "leftSidebar" | "rightSidebar" =>
      v === "leftSidebar" || v === "rightSidebar",
  );
  const showDesktopSidebar = sidebarPlacement != null && wideEnoughForSidebar;
  const showOffcanvas =
    !showDesktopSidebar && !variants.includes("filterDrawer");

  const shop = useMemo<ShopContextValue>(
    () => ({
      variants,
      sidebarPlacement,
      showDesktopSidebar,
      setWideEnoughForSidebar,
      viewMode,
      setViewMode,
      gridCols,
      setGridCols,
      sortOpen,
      setSortOpen,
      sortLabel,
      state,
      dispatch,
      loading: staticProducts ? false : loading,
      hasNoFilteredItems,
      showPaginationFooter,
      progressive,
      infiniteScroll,
      filterBodyProps: {
        state,
        dispatch,
        getFilterCount,
        sourceProducts,
      },
      pagedVisibleProducts,
      totalPages,
      pageItems,
    }),
    [
      variants,
      sidebarPlacement,
      showDesktopSidebar,
      setWideEnoughForSidebar,
      viewMode,
      gridCols,
      sortOpen,
      sortLabel,
      state,
      dispatch,
      getFilterCount,
      loading,
      hasNoFilteredItems,
      showPaginationFooter,
      progressive,
      infiniteScroll,
      pagedVisibleProducts,
      totalPages,
      pageItems,
    ],
  );

  return (
    <ShopProvider value={shop}>
      <section className="flat-spacing">
        {showOffcanvas && <ShopOffcanvas />}

        <ShopPageLayout
          isFullWidth={isFullWidth}
          showDesktopSidebar={showDesktopSidebar}
          sidebarPlacement={sidebarPlacement}
        >
          <ShopMainColumn />
        </ShopPageLayout>
      </section>
    </ShopProvider>
  );
}
