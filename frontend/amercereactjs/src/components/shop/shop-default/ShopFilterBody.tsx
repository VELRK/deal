import { useEffect, useId } from "react";
import { shopFilterDisabledBrands } from "@/data/products/shopDefaultProducts";
import { AvailabilityFacetSidebar } from "./filter/facets/AvailabilityFacetSidebar";
import { BrandFacetSidebar } from "./filter/facets/BrandFacetSidebar";
import { CategoryFacetSidebar } from "./filter/facets/CategoryFacetSidebar";
import { ClearFiltersFooter } from "./filter/facets/ClearFiltersFooter";
import { PriceFacetSidebar } from "./filter/facets/PriceFacetSidebar";
import { useFacetOptions } from "./filter/useFacetOptions";
import type { ShopFilterBodyProps } from "./filter/types";

export type { ShopFilterBodyProps };
export { COLOR_SWATCH, SIZE_ITEMS, SORT_OPTIONS } from "./filter/constants";

export default function ShopFilterBody({
  state,
  dispatch,
  getFilterCount,
  sourceProducts,
}: ShopFilterBodyProps) {
  const idBase = useId().replace(/:/g, "");
  const cId = `shop-filter-${idBase}`;
  const { brands, categories } = useFacetOptions(sourceProducts);
  const priceMax = Math.max(1, state.defaultPriceRange[1]);

  useEffect(() => {
    const next = state.brands.filter((b) => !shopFilterDisabledBrands.has(b));
    if (next.length !== state.brands.length) {
      dispatch({ type: "SET_BRANDS", payload: next });
    }
  }, [state.brands, dispatch]);

  return (
    <>
      <style>{`
        /* Theme checkboxes & radios */
        .widget-facet .tf-check:checked {
          background-color: #3ec1bc !important;
          border-color: #3ec1bc !important;
        }
        .widget-facet .tf-check:focus {
          box-shadow: 0 0 0 3px rgba(62, 193, 188, 0.25) !important;
        }
        
        /* Theme rc-slider for Price */
        .widget-price .rc-slider-track {
          background-color: #3ec1bc !important;
        }
        .widget-price .rc-slider-handle {
          border-color: #3ec1bc !important;
        }
        .widget-price .rc-slider-handle:hover,
        .widget-price .rc-slider-handle:active,
        .widget-price .rc-slider-handle:focus {
          border-color: #3ec1bc !important;
          box-shadow: 0 0 0 3px rgba(62, 193, 188, 0.25) !important;
        }
        
        /* Interactive labels */
        .widget-facet .label {
          cursor: pointer;
        }
        .widget-facet input[type="checkbox"]:disabled + .label {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <CategoryFacetSidebar
        cId={cId}
        categories={categories}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <div className="br-line" />
      <PriceFacetSidebar
        cId={cId}
        state={state}
        dispatch={dispatch}
        priceMax={priceMax}
      />
      <div className="br-line" />
      <AvailabilityFacetSidebar
        cId={cId}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <div className="br-line" />
      <BrandFacetSidebar
        cId={cId}
        brands={brands}
        state={state}
        dispatch={dispatch}
        getFilterCount={getFilterCount}
      />
      <ClearFiltersFooter dispatch={dispatch} />
    </>
  );
}
