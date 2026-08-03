import { createContext, type Dispatch, type SetStateAction } from "react";
import type { ProductCardItem } from "@/types/productCard";
import type {
  ProductCardGridVariant,
  ProductCardLayoutVariant,
} from "./productCardTypes";

export type ProductCardContextValue = {
  product: ProductCardItem;
  layoutVariant: ProductCardLayoutVariant;
  gridVariant: ProductCardGridVariant;
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
  isShopGridHoverBar: boolean;
  shopHoverActionClass: string;
  shopGridStyleClass: string;
};

export const ProductCardContext = createContext<ProductCardContextValue | null>(
  null,
);
