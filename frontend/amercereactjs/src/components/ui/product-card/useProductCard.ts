import { useContext } from "react";
import {
  ProductCardContext,
  type ProductCardContextValue,
} from "./productCardContextCore";

export function useProductCard(): ProductCardContextValue {
  const ctx = useContext(ProductCardContext);
  if (ctx == null) {
    throw new Error("useProductCard must be used within <ProductCardProvider>");
  }
  return ctx;
}
