import { createContext } from "react";
import type { ProductSingleImage } from "@/types/productCard";
import type { ColorOption, SizeOption, UnitVariantOption } from "./productContextTypes";

export interface ProductContextType {
  pane: HTMLElement | null;
  registerPane: (el: HTMLElement | null) => void;
  isZooming: boolean;
  setIsZooming: (zooming: boolean) => void;

  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentSize: string;
  setCurrentSize: (size: string) => void;
  currentVariantId: number | null;
  setCurrentVariantId: (id: number) => void;
  unitVariants: UnitVariantOption[];
  quantity: number;
  setQuantity: (q: number) => void;

  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  colors: ColorOption[];
  thumbnailPosition: "bottom" | "left" | "right";
  zoomType: "default" | "inner" | "magnifying" | "none";

  /** Shared active gallery image index — written by description panel, read by gallery */
  activeImageIndex: number;
  setActiveImageIndex: (idx: number) => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined,
);
