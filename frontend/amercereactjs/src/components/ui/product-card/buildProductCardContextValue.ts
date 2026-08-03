import type { Dispatch, SetStateAction } from "react";
import type { ProductCardItem } from "@/types/productCard";
import {
  layoutToGridVariant,
  type ProductCardLayoutVariant,
} from "./productCardTypes";
import { shopHoverBarFlags } from "./productCardUtils";
import type { ProductCardContextValue } from "./productCardContextCore";

export function buildProductCardContextValue(params: {
  product: ProductCardItem;
  layoutVariant: ProductCardLayoutVariant;
  wrapperClass: string;
  cardClass: string;
  infoClassName: string;
  nameLinkClasses: string;
  starWrapClassName: string;
  imgWidth: number;
  imgHeight: number;
  shopMeta?: { brand?: string; availability?: string };
  showRatting: boolean;
  activeImage: string;
  activeHoverImage: string;
  setActiveImage: Dispatch<SetStateAction<string>>;
  hasSize: boolean;
  actionBotLabel: string;
  actionBotHref: string;
  actionBotDataToggle: "modal" | "offcanvas";
  wowDelay?: string;
}): ProductCardContextValue {
  const gridVariant = layoutToGridVariant(params.layoutVariant);
  const { isShopGridHoverBar, shopHoverActionClass, shopGridStyleClass } =
    shopHoverBarFlags(gridVariant);

  return {
    ...params,
    gridVariant,
    isShopGridHoverBar,
    shopHoverActionClass,
    shopGridStyleClass,
  };
}
