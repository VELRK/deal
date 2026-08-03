import type { CartProduct, ProductId } from "@/context/store";

/** Total qty of a product across all cart lines (any variant). */
export function productCartQty(
  cartProducts: CartProduct[],
  productId: ProductId | null | undefined,
): number {
  if (productId == null) return 0;
  return cartProducts
    .filter((p) => String(p.id) === String(productId))
    .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
}

/** Total items in the cart (sum of line quantities). */
export function cartTotalQty(cartProducts: CartProduct[]): number {
  return cartProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
}
