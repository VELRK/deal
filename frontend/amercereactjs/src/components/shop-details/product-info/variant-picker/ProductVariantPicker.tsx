import { useProduct } from "@/context/useProduct";
import { COLOR_PICKERS } from "./colorPickersMap";
import { SIZE_PICKERS } from "./sizePickersMap";
import { UnitVariantPicker } from "./UnitVariantPicker";
import type { ProductVariantColorType, ProductVariantSizeType } from "./types";

export type { ProductVariantColorType, ProductVariantSizeType } from "./types";

export function ProductVariantPicker({
  colorType = "image",
  sizeType = "button",
}: {
  colorType?: ProductVariantColorType;
  sizeType?: ProductVariantSizeType;
} = {}) {
  const {
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    colors,
    sizes,
    unitVariants,
  } = useProduct();

  const ColorPicker = COLOR_PICKERS[colorType];
  const SizePicker = SIZE_PICKERS[sizeType];

  return (
    <>
      {unitVariants.length > 0 && <UnitVariantPicker />}
      {colors.length > 0 && (
        <ColorPicker
          colors={colors}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
      )}
      {sizes.length > 0 && (
        <SizePicker
          sizes={sizes}
          currentSize={currentSize}
          setCurrentSize={setCurrentSize}
        />
      )}
    </>
  );
}
