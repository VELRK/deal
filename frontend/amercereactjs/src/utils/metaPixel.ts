import type { CartProduct } from "@/context/store";

type MetaPixel = (
  action: "track",
  eventName: string,
  parameters?: Record<string, unknown>,
) => void;

function getMetaPixel(): MetaPixel | undefined {
  return (window as Window & { fbq?: MetaPixel }).fbq;
}

export function trackInitiateCheckout(
  cartProducts: CartProduct[],
  totalPrice: number,
) {
  const fbq = getMetaPixel();
  if (typeof fbq !== "function") return;

  fbq("track", "InitiateCheckout", {
    content_ids: cartProducts.map((item) => String(item.id)),
    content_type: "product",
    contents: cartProducts.map((item) => ({
      id: String(item.id),
      quantity: item.quantity,
      item_price: item.price,
    })),
    currency: "MYR",
    num_items: cartProducts.reduce((total, item) => total + item.quantity, 0),
    value: Number(totalPrice.toFixed(2)),
  });
}
