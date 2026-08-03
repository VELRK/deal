import type { MouseEvent } from "react";
import AddToCartButton from "@/components/common/AddToCartButton";
import { useContextElement } from "@/context/Context";
import { ProductCardSizeList } from "./ProductCardParts";
import { useProductCard } from "./useProductCard";
import { useModalStore } from "@/store/modalStore";

function VariantSizeBox({ sizes }: { sizes: string[] }) {
  return (
    <div className="variant-box">
      <ProductCardSizeList sizes={sizes} />
    </div>
  );
}

/** Sizes strip + bottom CTAs (Quick Add / Quick View) for grid cards. */
export function ProductCardBottomSection() {
  const {
    gridVariant,
    product,
    hasSize,
    isShopGridHoverBar,
    actionBotLabel,
    actionBotHref,
    actionBotDataToggle,
  } = useProductCard();
  const { setQuickViewItem } = useContextElement();
  const { openModal } = useModalStore();

  const openQuickView = (e: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setQuickViewItem(product);
    openModal("quickView");
  };

  if (gridVariant === "shopGridHover06") {
    return (
      <>
        <div className="product-action_bot vertical">
          <AddToCartButton
            product={product}
            href="#quickAdd"
            dataToggle="modal"
            label="Quick Add"
            className="tf-btn btn-white small w-100 sm-d-none"
          />
          <button
            type="button"
            className="btn-icon-quick_view sm-d-none"
            onClick={openQuickView}
            aria-label="Quick view"
            style={{ border: "none", cursor: "pointer", background: "none" }}
          >
            <i className="icon icon-Eye" aria-hidden />
          </button>
        </div>
        {hasSize && <VariantSizeBox sizes={product.sizes!} />}
      </>
    );
  }

  return (
    <>
      {hasSize && <VariantSizeBox sizes={product.sizes!} />}
      {gridVariant === "shopGridHover05" ? (
        <div className="product-action_bot vertical">
          <button
            type="button"
            className="tf-btn btn-white small w-100 sm-d-none"
            onClick={openQuickView}
            style={{ border: "none", cursor: "pointer", background: "none" }}
          >
            Quick View
          </button>
          <AddToCartButton
            product={product}
            href="#quickAdd"
            dataToggle="modal"
            label="Quick Add"
          />
        </div>
      ) : (
        !isShopGridHoverBar && (
          <div className="product-action_bot">
            <AddToCartButton
              product={product}
              href={actionBotHref}
              dataToggle={actionBotDataToggle}
              label={actionBotLabel}
            />
          </div>
        )
      )}
    </>
  );
}
