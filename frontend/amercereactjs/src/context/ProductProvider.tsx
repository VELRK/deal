import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { ProductSingleImage } from "@/types/productCard";
import type { ColorOption, SizeOption, UnitVariantOption } from "./productContextTypes";
import { ProductContext, type ProductContextType } from "./productContextCore";

export interface ProductProviderProps {
  children: ReactNode;
  initialColor?: string;
  initialSize?: string;
  initialQuantity?: number;
  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  colors: ColorOption[];
  unitVariants?: UnitVariantOption[];
  initialVariantId?: number | null;
  thumbnailPosition?: "bottom" | "left" | "right";
  zoomType?: "default" | "inner" | "magnifying" | "none";
}

export function ProductProvider({
  children,
  initialColor = "green",
  initialSize = "",
  initialQuantity = 1,
  extraImages,
  sizes,
  colors,
  unitVariants = [],
  initialVariantId = null,
  thumbnailPosition = "left",
  zoomType = "default",
}: ProductProviderProps) {
  const [pane, setPane] = useState<HTMLElement | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [currentSize, setCurrentSize] = useState(
    initialSize || (sizes.length > 0 ? sizes[0].value : ""),
  );
  const [currentVariantId, setCurrentVariantId] = useState<number | null>(
    initialVariantId ?? (unitVariants.find((v) => v.isDefault)?.id ?? unitVariants[0]?.id ?? null),
  );
  const [quantity, setQuantity] = useState(initialQuantity);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const defaultId =
      initialVariantId ??
      unitVariants.find((v) => v.isDefault)?.id ??
      unitVariants[0]?.id ??
      null;
    setCurrentVariantId(defaultId);
    setQuantity(1);
    setActiveImageIndex(0);
  }, [unitVariants, initialVariantId]);

  useEffect(() => {
    setQuantity(1);
    setActiveImageIndex(0);
  }, [currentVariantId]);

  const registerPane = useCallback((el: HTMLElement | null) => {
    setPane(el);
  }, []);

  const value: ProductContextType = {
    pane,
    registerPane,
    isZooming,
    setIsZooming,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    currentVariantId,
    setCurrentVariantId,
    unitVariants,
    quantity,
    setQuantity,
    extraImages,
    sizes,
    colors,
    thumbnailPosition,
    zoomType,
    activeImageIndex,
    setActiveImageIndex,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
