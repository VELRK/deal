import { cartAPI, type CartItem } from "@/services/api";
import { useStore, type CartProduct } from "@/context/store";

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

/** Merge guest cart into user cart, then hydrate local Zustand from server. */
export async function syncCartFromServer(): Promise<void> {
  try {
    const sid = localStorage.getItem("sk_sid") || undefined;
    await cartAPI.merge(sid ? { session_id: sid } : {}).catch(() => null);
    const res = await cartAPI.products();
    const items = res.data?.data?.items ?? [];
    useStore.getState().setCartProducts(items.map(mapApiItemToCartProduct));
  } catch {
    /* keep local cart on network failure */
  }
}
