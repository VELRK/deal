import { setCurrentPage } from "./filterActions";
import { useShop } from "./ShopContext";
import { ShopLoadMoreButton, ShopPagination } from "./ShopListingUi";
import type { ShopProgressiveLoadMoreState } from "./useShopProgressiveLoad";

function rowClass(list: boolean) {
  return `wd-full justify-content-center${list ? " mt-24" : ""}`;
}

function rowStyle(list: boolean) {
  return list ? undefined : { gridColumn: "1 / -1" as const };
}

export function ShopListingFooters({
  layout,
  loadMore,
}: {
  layout: "grid" | "list";
  loadMore?: ShopProgressiveLoadMoreState | null;
}) {
  const {
    viewMode,
    state,
    dispatch,
    hasNoFilteredItems,
    showPaginationFooter,
    totalPages,
    pageItems,
  } = useShop();

  if (viewMode !== layout || hasNoFilteredItems) return null;

  const list = layout === "list";

  return (
    <>
      {showPaginationFooter && (
        <div className={rowClass(list)} style={rowStyle(list)}>
          <ShopPagination
            currentPage={state.currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={(p) => setCurrentPage(p, dispatch)}
          />
        </div>
      )}
      {loadMore && (
        <div
          ref={loadMore.infiniteScroll ? loadMore.sentinelRef : undefined}
          className={rowClass(list)}
          style={rowStyle(list)}
        >
          <ShopLoadMoreButton
            loading={loadMore.loading}
            onClick={loadMore.onLoadMore}
            autoTrigger={loadMore.infiniteScroll}
          />
        </div>
      )}
    </>
  );
}
