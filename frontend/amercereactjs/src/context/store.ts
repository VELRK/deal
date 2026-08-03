import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist, type StorageValue } from "zustand/middleware";

import type { ProductCardItem } from "@/types/productCard";
import { products } from "@/data/products/products";

export type Product = ProductCardItem;
export type CartProduct = Product & {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariantId?: number;
};
export type ProductId = number | string;

interface StoreState {
  cartProducts: CartProduct[];
  wishList: Product[];
  compareItem: Product[];
  quickViewItem: Product;
  quickAddItem: ProductId;
  quickAddProduct: Product | null;
  totalPrice: number;
  activeCartProduct: CartProduct | null;
  setCartProducts: (
    value: CartProduct[] | ((prev: CartProduct[]) => CartProduct[]),
  ) => void;
  setWishList: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setQuickViewItem: (item: Product) => void;
  setQuickAddItem: (id: ProductId) => void;
  setQuickAddProduct: (product: Product | null) => void;
  setCompareItem: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setActiveCartProduct: (item: CartProduct | null) => void;
  isAddedToCartProducts: (id: ProductId, variantId?: number) => boolean;
  addProductToCart: (item: Product, qty?: number) => void;
  updateQuantity: (id: ProductId, qty: number, variantId?: number) => void;
  quantityInCart: (id: ProductId, variantId?: number) => number;
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: ProductId) => void;
  addToCompareItem: (item: Product) => void;
  removeFromCompareItem: (id: ProductId) => void;
  isAddedtoWishlist: (id: ProductId) => boolean;
  isAddedToCompareItem: (id: ProductId) => boolean;
}

const getTotalPrice = (cart: CartProduct[]) =>
  cart.reduce((acc, product) => acc + product.quantity * product.price, 0);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      wishList: [],
      compareItem: [],
      quickViewItem: products[0],
      quickAddItem: 1,
      quickAddProduct: null,
      totalPrice: 0,
      activeCartProduct: null,

      setCartProducts: (value) =>
        set((state) => {
          const next =
            typeof value === "function" ? value(state.cartProducts) : value;
          return { cartProducts: next, totalPrice: getTotalPrice(next) };
        }),

      setWishList: (value) =>
        set((state) => ({
          wishList: typeof value === "function" ? value(state.wishList) : value,
        })),

      setQuickViewItem: (item) => set({ quickViewItem: item }),
      setQuickAddItem: (id) => set({ quickAddItem: id }),
      setQuickAddProduct: (product) => set({ quickAddProduct: product }),
      setCompareItem: (value) =>
        set((state) => ({
          compareItem:
            typeof value === "function" ? value(state.compareItem) : value,
        })),
      setActiveCartProduct: (item) => set({ activeCartProduct: item }),

      isAddedToCartProducts: (id, variantId) => {
        const cart = get().cartProducts;
        const pid = String(id);
        return cart.some((elm) => {
          if (String(elm.id) !== pid) return false;
          // Listing / buttons with no variant: any line for this product counts
          if (variantId == null) return true;
          if (elm.selectedVariantId == null) return true;
          return String(elm.selectedVariantId) === String(variantId);
        });
      },

      addProductToCart: (item, qty = 1) => {
        const { cartProducts, isAddedToCartProducts } = get();
        if (isAddedToCartProducts(item.id, item.selectedVariantId)) return;
        const cartItem: CartProduct = {
          ...item,
          id: item.id,
          selectedVariantId:
            item.selectedVariantId != null
              ? Number(item.selectedVariantId)
              : undefined,
          quantity: qty,
        };
        const next = [...cartProducts, cartItem];
        set({ cartProducts: next, totalPrice: getTotalPrice(next) });
      },

      updateQuantity: (id, qty, variantId) => {
        const { cartProducts, isAddedToCartProducts } = get();
        if (!isAddedToCartProducts(id, variantId) || qty < 1) return;
        const pid = String(id);
        const items = cartProducts.map((item) => {
          if (String(item.id) !== pid) return item;
          if (variantId == null) return { ...item, quantity: qty };
          if (
            item.selectedVariantId != null &&
            String(item.selectedVariantId) !== String(variantId)
          ) {
            return item;
          }
          return { ...item, quantity: qty };
        });
        set({ cartProducts: items, totalPrice: getTotalPrice(items) });
      },

      quantityInCart: (id, variantId) => {
        const pid = String(id);
        return get().cartProducts.reduce((sum, elm) => {
          if (String(elm.id) !== pid) return sum;
          if (variantId == null) return sum + (Number(elm.quantity) || 0);
          if (
            elm.selectedVariantId != null &&
            String(elm.selectedVariantId) !== String(variantId)
          ) {
            return sum;
          }
          return sum + (Number(elm.quantity) || 0);
        }, 0);
      },

      addToWishlist: (item) => {
        const { wishList } = get();
        const isAlreadyAdded = wishList.some((elm) => elm.id === item.id);
        if (isAlreadyAdded) {
          set({ wishList: wishList.filter((elm) => elm.id !== item.id) });
          return;
        }
        set({ wishList: [...wishList, item] });
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          wishList: state.wishList.filter((elm) => elm.id !== id),
        }));
      },

      addToCompareItem: (item) => {
        const { compareItem } = get();
        if (compareItem.some((elm) => elm.id === item.id)) return;
        set({ compareItem: [...compareItem, item] });
      },

      removeFromCompareItem: (id) => {
        set((state) => ({
          compareItem: state.compareItem.filter((elm) => elm.id !== id),
        }));
      },

      isAddedtoWishlist: (id) => get().wishList.some((elm) => elm.id === id),
      isAddedToCompareItem: (id) =>
        get().compareItem.some((elm) => elm.id === id),
    }),
    {
      name: "2Deal-store",
      partialize: (state) => ({
        cartProducts: state.cartProducts,
        wishList: state.wishList,
        totalPrice: state.totalPrice,
      }),
      storage: {
        getItem: (
          name,
        ): StorageValue<{
          cartProducts: CartProduct[];
          wishList: Product[];
          totalPrice: number;
        }> | null => {
          if (typeof window === "undefined") return null;
          const str = window.localStorage.getItem(name);
          if (str) {
            try {
              const parsed = JSON.parse(str) as StorageValue<{
                cartProducts: CartProduct[];
                wishList: Product[];
                totalPrice: number;
              }>;
              parsed.state.wishList = normalizeStoredProductList(
                parsed?.state?.wishList,
              );
              if (
                parsed?.state?.cartProducts &&
                parsed.state.totalPrice == null
              ) {
                parsed.state.totalPrice = getTotalPrice(
                  parsed.state.cartProducts,
                );
              }
              return parsed;
            } catch {
              return null;
            }
          }
          return null;
        },
        setItem: (
          name,
          value: StorageValue<{
            cartProducts: CartProduct[];
            wishList: Product[];
            totalPrice: number;
          }>,
        ) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
          }
        },
      },
    },
  ),
);

function normalizeStoredProductList(value: unknown): Product[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) =>
      typeof item === "object" && item !== null && "id" in item
        ? (item as Product)
        : undefined,
    )
    .filter((item): item is Product => Boolean(item));
}

function getContextSnapshot(state: StoreState) {
  return {
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
    totalPrice: state.totalPrice,
    addProductToCart: state.addProductToCart,
    isAddedToCartProducts: state.isAddedToCartProducts,
    removeFromWishlist: state.removeFromWishlist,
    addToWishlist: state.addToWishlist,
    isAddedtoWishlist: state.isAddedtoWishlist,
    quickViewItem: state.quickViewItem,
    wishList: state.wishList,
    setQuickViewItem: state.setQuickViewItem,
    quickAddItem: state.quickAddItem,
    setQuickAddItem: state.setQuickAddItem,
    quickAddProduct: state.quickAddProduct,
    setQuickAddProduct: state.setQuickAddProduct,
    addToCompareItem: state.addToCompareItem,
    isAddedToCompareItem: state.isAddedToCompareItem,
    removeFromCompareItem: state.removeFromCompareItem,
    compareItem: state.compareItem,
    setCompareItem: state.setCompareItem,
    updateQuantity: state.updateQuantity,
    quantityInCart: state.quantityInCart,
    activeCartProduct: state.activeCartProduct,
    setActiveCartProduct: state.setActiveCartProduct,
  };
}

/** Same API as the old useContextElement() for drop-in replacement in existing components. */
export function useContextElement() {
  // useShallow so cartProducts/wishList identity changes trigger re-renders reliably
  // (module-level snapshot cache could skip updates across subscribers).
  return useStore(useShallow(getContextSnapshot));
}
