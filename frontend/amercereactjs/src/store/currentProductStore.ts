import { create } from "zustand";
import type { ProductCardItem } from "@/types/productCard";

interface CurrentProductState {
  product: ProductCardItem | null;
  setCurrentProduct: (p: ProductCardItem | null) => void;
}

export const useCurrentProductStore = create<CurrentProductState>((set) => ({
  product: null,
  setCurrentProduct: (p) => set({ product: p }),
}));
