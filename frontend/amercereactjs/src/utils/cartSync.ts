import { cartAPI, type CartItem } from "@/services/api";
import { useStore, type CartProduct, type Product } from "@/context/store";

function mapApiItemToCartProduct(item: CartItem): CartProduct {
  const price = Number(item.effective_price ?? item.sale_price ?? item.price ?? 0);
  return {
    id: item.product_id,
    name: item.product_name || item.name || "Product",
    price,
    priceOld: item.sale_price ? Number(item.price) : undefined,
    img: item.thumbnail || "",
    images: item.thumbnail ? [{ src: item.thumbnail }] : [],
    stock: item.stock,
    slug: item.slug,
    sku: item.sku,
    unit_label: item.unit_label || item.variant_label,
    selectedVariantId: item.variant_id ?? undefined,
    quantity: item.quantity,
  } as CartProduct;
}

export function applyServerCartItems(items: CartItem[]): void {
  useStore.getState().setCartProducts(items.map(mapApiItemToCartProduct));
}

/**
 * Add (or keep) a line locally and persist it to the API so refresh/sync
 * cannot wipe a cart that only lived in Zustand.
 */
export async function addLineToCart(
  item: Product & { selectedVariantId?: number },
  qty = 1,
): Promise<boolean> {
  const quantity = Math.max(1, Number(qty) || 1);
  const variantId =
    item.selectedVariantId != null ? Number(item.selectedVariantId) : undefined;

  useStore.getState().addProductToCart(item, quantity);

  try {
    const res = await cartAPI.add({
      product_id: Number(item.id),
      quantity,
      ...(variantId != null && !Number.isNaN(variantId)
        ? { variant_id: variantId }
        : {}),
    });
    const items = res.data?.data?.items;
    if (Array.isArray(items)) {
      applyServerCartItems(items);
    }
    return true;
  } catch {
    /* keep optimistic local line if API fails */
    return false;
  }
}

/** Merge guest cart into user cart, then hydrate local Zustand from server. */
export async function syncCartFromServer(): Promise<void> {
  try {
    const sid = localStorage.getItem("sk_sid") || undefined;
    await cartAPI.merge(sid ? { session_id: sid } : {}).catch(() => null);

    const local = useStore.getState().cartProducts;
    let res = await cartAPI.products();
    let items: CartItem[] = res.data?.data?.items ?? [];

    // Web-only cart (never reached API) would otherwise be wiped on refresh.
    if (items.length === 0 && local.length > 0) {
      for (const p of local) {
        const vid =
          p.selectedVariantId != null ? Number(p.selectedVariantId) : undefined;
        await cartAPI
          .add({
            product_id: Number(p.id),
            quantity: Math.max(1, Number(p.quantity) || 1),
            ...(vid != null && !Number.isNaN(vid) ? { variant_id: vid } : {}),
          })
          .catch(() => null);
      }
      res = await cartAPI.products();
      items = res.data?.data?.items ?? [];
    }

    applyServerCartItems(items);
  } catch {
    /* keep local cart on network failure */
  }
}
