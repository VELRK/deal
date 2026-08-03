import { create } from "zustand";

interface ProductViewState {
  productKey: string | null; // slug or numeric id as string
  openView: (key: string) => void;
  closeView: () => void;
}

export const useProductViewStore = create<ProductViewState>((set) => ({
  productKey: null,
  openView: (key) => set({ productKey: key }),
  closeView: () => set({ productKey: null }),
}));
