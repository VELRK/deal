import {
  useEffect,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import type { FilterAction, FilterState } from "@/types/shopFilter";
import type { SortingOption } from "@/types/shopFilter";
import { SORT_OPTIONS } from "./ShopFilterBody";
import { setSorting } from "./filterActions";
import { useShop } from "./ShopContext";
import { clampGridColsForWidth, type GridCols } from "./shopGridCols";
import { SHOP_SIDEBAR_DESKTOP_MIN_PX } from "./shopLayoutUtils";

export type { GridCols };

export function ShopLayoutSwitch({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
}) {
  const { gridCols, setGridCols, setWideEnoughForSidebar } = useShop();

  useEffect(() => {
    const onResize = () => {
      setGridCols((prev) => {
        const next = clampGridColsForWidth(window.innerWidth, prev);
        return next === prev ? prev : next;
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setGridCols]);

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${SHOP_SIDEBAR_DESKTOP_MIN_PX}px)`,
    );
    const sync = () => setWideEnoughForSidebar(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [setWideEnoughForSidebar]);

  const keyActivate = (e: KeyboardEvent, fn: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <ul className="tf-control-layout">
      <li
        className={`tf-view-layout-switch sw-layout-list list-layout ${viewMode === "list" ? "active" : ""}`}
        data-value-layout="list"
        role="button"
        tabIndex={0}
        onClick={() => setViewMode("list")}
        onKeyDown={(e) => keyActivate(e, () => setViewMode("list"))}
      >
        <i className="icon-List" />
      </li>
      {(
        [
          ["tf-col-2", "sw-layout-2", "icon-grid-2"],
          ["tf-col-3", "sw-layout-3 d-none d-md-flex", "icon-grid-3"],
          ["tf-col-4", "sw-layout-4 d-none d-lg-flex", "icon-grid-4"],
        ] as const
      ).map(([col, cls, icon]) => (
        <li
          key={col}
          className={`tf-view-layout-switch ${cls} ${gridCols === col && viewMode === "grid" ? "active" : ""}`}
          data-value-layout={col}
          role="button"
          tabIndex={0}
          onClick={() => {
            setViewMode("grid");
            setGridCols(col);
          }}
          onKeyDown={(e) =>
            keyActivate(e, () => {
              setViewMode("grid");
              setGridCols(col);
            })
          }
        >
          <i className={icon} />
        </li>
      ))}
    </ul>
  );
}

export function ShopSortDropdown({
  sortOpen,
  setSortOpen,
  sortLabel,
  state,
  dispatch,
}: {
  sortOpen: boolean;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  sortLabel: string;
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
}) {
  return (
    <div className="tf-control-sorting position-relative">
      <div className={`tf-dropdown-sort ${sortOpen ? "show" : ""}`}>
        <div
          className="btn-select"
          role="button"
          tabIndex={0}
          aria-expanded={sortOpen}
          onClick={() => setSortOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSortOpen((o) => !o);
            }
          }}
        >
          <span className="text-sort-value">{sortLabel}</span>
          <span className="icon icon-CaretDown" />
        </div>
        {sortOpen && (
          <div className="dropdown-menu show position-absolute end-0">
            {SORT_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                role="button"
                tabIndex={0}
                className={`select-item ${state.sortingOption === opt.value ? "active" : ""} ${opt.value === SORT_OPTIONS[0]?.value ? "remove-all-filters" : ""}`.trim()}
                data-sort-value={opt.value}
                onClick={() => {
                  setSorting(opt.value as SortingOption, dispatch);
                  setSortOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSorting(opt.value as SortingOption, dispatch);
                    setSortOpen(false);
                  }
                }}
              >
                <span className="text-value-item">{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ShopPagination({
  currentPage,
  totalPages,
  pageItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  pageItems: number[];
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="tf-page-pagination">
      <button
        type="button"
        className="pag-item"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <i className="icon icon-CaretLeft" />
      </button>
      {pageItems.map((p) => (
        <button
          key={p}
          type="button"
          className={`pag-item ${currentPage === p ? "active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className="pag-item"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <i className="icon icon-CaretRightThin" />
      </button>
    </div>
  );
}

export function ShopLoadMoreButton({
  loading,
  onClick,
  autoTrigger = false,
}: {
  loading: boolean;
  onClick: () => void;
  autoTrigger?: boolean;
}) {
  return (
    <div className="wd-full justify-content-center" style={{ display: "flex" }}>
      <button
        type="button"
        className={`btn-loadmore tf-btn animate-btn tf-loading loadmore${loading ? " loading" : ""}`}
        id={autoTrigger ? "loadMoreBtnInfinity" : "loadMoreBtn"}
        onClick={onClick}
        disabled={loading}
        aria-busy={loading}
        aria-label={
          autoTrigger
            ? loading
              ? "Loading more products"
              : "More products load when this is in view"
            : undefined
        }
        title={
          autoTrigger
            ? "More products load automatically when visible"
            : undefined
        }
      >
        <span className="text">Load More</span>
        <div className="spinner-circle" aria-hidden>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span key={n} className={`spinner-circle${n} spinner-child`} />
          ))}
        </div>
      </button>
    </div>
  );
}

export function ShopEmptyFilters({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-40" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto 24px", display: "block" }}>
        <style>{`
          @keyframes floatMag {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-10px, -15px) rotate(-10deg); }
            66% { transform: translate(15px, -5px) rotate(15deg); }
          }
          @keyframes floatBox {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shadowPulse {
            0%, 100% { transform: scale(1); opacity: 0.15; }
            50% { transform: scale(0.85); opacity: 0.05; }
          }
          .anim-mag { animation: floatMag 4s ease-in-out infinite; transform-origin: 120px 80px; }
          .anim-box { animation: floatBox 3.5s ease-in-out infinite; transform-origin: center; }
          .anim-shadow { animation: shadowPulse 3.5s ease-in-out infinite; transform-origin: center; }
        `}</style>
        
        {/* Shadow */}
        <ellipse cx="100" cy="165" rx="45" ry="8" fill="#3ec1bc" className="anim-shadow" />
        
        {/* Empty Box */}
        <g className="anim-box" stroke="#3ec1bc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Back flaps */}
          <path d="M40 65L60 40M160 65L140 40" strokeOpacity="0.5" />
          
          {/* Main Box Body */}
          <path d="M100 140L40 105V65L100 100L160 65V105L100 140Z" fill="rgba(62, 193, 188, 0.05)" />
          <path d="M100 140V100" />
          <path d="M40 65L100 100L160 65" />
          
          {/* Front Flaps */}
          <path d="M40 65L20 85M160 65L180 85" strokeOpacity="0.8" />
          
          {/* Box top opening */}
          <path d="M40 65L100 30L160 65" fill="rgba(62, 193, 188, 0.1)" strokeOpacity="0.8" />
        </g>

        {/* Magnifying Glass */}
        <g className="anim-mag">
          {/* Handle */}
          <path d="M138 98L165 125" stroke="#2b9d99" strokeWidth="10" strokeLinecap="round" />
          {/* Rim */}
          <circle cx="120" cy="80" r="25" fill="#ffffff" stroke="#3ec1bc" strokeWidth="6" />
          {/* Glass reflection */}
          <path d="M105 70C110 65 120 62 130 68" stroke="#3ec1bc" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </g>
      </svg>
      <h4 className="mb-12" style={{ fontWeight: 600, color: "#111" }}>No products found</h4>
      <p className="text-body-1 mb-24" style={{ color: "#666", maxWidth: "350px", margin: "0 auto 24px" }}>
        We couldn't find any items matching your current filters. Try adjusting your search criteria.
      </p>
      <button type="button" className="tf-btn" onClick={onClear} style={{ background: "#3ec1bc", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "50px", fontWeight: 600 }}>
        Clear filters
      </button>
    </div>
  );
}
