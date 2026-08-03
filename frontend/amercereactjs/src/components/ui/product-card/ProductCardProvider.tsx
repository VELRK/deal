import type { ReactNode } from "react";
import {
  ProductCardContext,
  type ProductCardContextValue,
} from "./productCardContextCore";

export function ProductCardProvider({
  value,
  children,
}: {
  value: ProductCardContextValue;
  children: ReactNode;
}) {
  return (
    <ProductCardContext.Provider value={value}>
      {children}
    </ProductCardContext.Provider>
  );
}
