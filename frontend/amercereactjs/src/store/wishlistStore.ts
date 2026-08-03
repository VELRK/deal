import { create } from "zustand";
import { wishlistAPI } from "@/services/api";
import { toProductCard } from "@/hooks/useApi";
import type { ProductCardItem } from "@/types/productCard";

interface WishlistState {
  items: ProductCardItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggle: (product: ProductCardItem) => Promise<void>;
  isWishlisted: (id: number | string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await wishlistAPI.get();
      const raw = (res.data as { data?: unknown[] }).data ?? [];
      // Wishlist rows have: product_id, name, price, sale_price, thumbnail, slug
      const products: ProductCardItem[] = raw.map((row: unknown) => {
        const r = row as {
          product_id: number; name: string; slug: string;
          price: number; sale_price?: number; thumbnail?: string;
        };
        return toProductCard({
          id: r.product_id,
          name: r.name,
          slug: r.slug,
          price: r.price,
          sale_price: r.sale_price,
          thumbnail: r.thumbnail,
          stock: 1,
          featured: 0,
          avg_rating: 0,
          review_count: 0,
          total_sold: 0,
          category_id: 0,
          status: "active",
        });
      });
      set({ items: products });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  toggle: async (product: ProductCardItem) => {
    const { items } = get();
    const isAdded = items.some((i) => i.id === product.id);

    // Optimistic update
    if (isAdded) {
      set({ items: items.filter((i) => i.id !== product.id) });
    } else {
      set({ items: [...items, product] });
    }

    try {
      await wishlistAPI.toggle({ product_id: Number(product.id) });
    } catch {
      // Revert on error
      if (isAdded) {
        set({ items: [...get().items, product] });
      } else {
        set({ items: get().items.filter((i) => i.id !== product.id) });
      }
    }
  },

  isWishlisted: (id) => get().items.some((i) => i.id === id),

  clear: () => set({ items: [] }),
}));
