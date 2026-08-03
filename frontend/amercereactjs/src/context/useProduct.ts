import { useContext } from "react";
import { ProductContext } from "./productContextCore";

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

/** Safe when `StickyProduct` renders outside `ProductProvider` (falls back to local qty/size). */
export function useProductOptional() {
  return useContext(ProductContext);
}
