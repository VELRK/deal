import type { CartProduct } from "@/context/store";

type MetaPixel = (
  action: "track",
  eventName: string,
  parameters?: Record<string, unknown>,
  options?: { eventID: string },
) => void;

function getMetaPixel(): MetaPixel | undefined {
  return (window as Window & { fbq?: MetaPixel }).fbq;
}

type TrackableProduct = {
  id: number | string;
  name?: string;
  price: number;
};

type PurchaseItem = {
  product_id?: number | string;
  id?: number | string;
  product_name?: string;
  quantity?: number;
  price?: number;
};

type PurchaseOrder = {
  id?: number | string;
  order_id?: number | string;
  order_number?: string;
  total?: number | string;
  items?: PurchaseItem[];
};

export function trackViewContent(product: TrackableProduct) {
  const fbq = getMetaPixel();
  if (typeof fbq !== "function") return;

  fbq("track", "ViewContent", {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: "product",
    currency: "MYR",
    value: Number(product.price),
  });
}

export function trackAddToCart(product: TrackableProduct, quantity = 1) {
  const fbq = getMetaPixel();
  if (typeof fbq !== "function") return;

  fbq("track", "AddToCart", {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: "product",
    contents: [{
      id: String(product.id),
      quantity,
      item_price: Number(product.price),
    }],
    currency: "MYR",
    value: Number((Number(product.price) * quantity).toFixed(2)),
  });
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

export function trackPurchase(order: PurchaseOrder) {
  const fbq = getMetaPixel();
  const orderId = order.id ?? order.order_id;
  const total = Number(order.total);
  if (
    typeof fbq !== "function"
    || orderId == null
    || !Number.isFinite(total)
  ) {
    return;
  }

  const dedupeKey = `meta_purchase_${orderId}`;
  if (window.localStorage.getItem(dedupeKey)) return;

  const items = order.items ?? [];
  const eventId = `purchase_${orderId}`;
  fbq("track", "Purchase", {
    content_ids: items
      .map((item) => item.product_id ?? item.id)
      .filter((id): id is number | string => id != null)
      .map(String),
    content_type: "product",
    contents: items.map((item) => ({
      id: String(item.product_id ?? item.id ?? ""),
      quantity: Number(item.quantity) || 1,
      item_price: Number(item.price) || 0,
    })),
    currency: "MYR",
    num_items: items.reduce(
      (count, item) => count + (Number(item.quantity) || 1),
      0,
    ),
    value: Number(total.toFixed(2)),
  }, {
    eventID: eventId,
  });

  window.localStorage.setItem(dedupeKey, eventId);
}
