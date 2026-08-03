import { cartAPI, type CartItem } from "@/services/api";
import {
  useStore,
  type CartProduct,
  type Product,
  type ProductId,
} from "@/context/store";
import { useAuthStore } from "@/store/authStore";

const TOMBSTONE_STORAGE_KEY = "sk_cart_removed";

function mapApiItemToCartProduct(item: CartItem): CartProduct {
  const price = Number(item.effective_price ?? item.sale_price ?? item.price ?? 0);
  const variantId =
    item.variant_id != null ? Number(item.variant_id) : undefined;
  return {
    id: Number(item.product_id),
    name: item.product_name || item.name || "Product",
    price,
    priceOld: item.sale_price ? Number(item.price) : undefined,
    img: item.thumbnail || "",
    images: item.thumbnail ? [{ src: item.thumbnail }] : [],
    stock: item.stock,
    slug: item.slug,
    sku: item.sku,
    unit_label: item.unit_label || item.variant_label,
    selectedVariantId:
      variantId != null && !Number.isNaN(variantId) ? variantId : undefined,
    quantity: Number(item.quantity) || 1,
  } as CartProduct;
}

export function applyServerCartItems(items: CartItem[]): void {
  useStore.getState().setCartProducts(items.map(mapApiItemToCartProduct));
}

/** Loose product/variant match (string vs number ids from persist/API). */
export function isSameCartLine(
  p: { id: ProductId; selectedVariantId?: number },
  id: ProductId,
  variantId?: number | null,
): boolean {
  if (String(p.id) !== String(id)) return false;
  if (variantId == null) return true;
  if (p.selectedVariantId == null) return true;
  return String(p.selectedVariantId) === String(variantId);
}

/** Monotonic clock bumped on every local cart edit (add/remove). */
let localCartEpoch = 0;

/** Lines the user removed on web — persist so login sync cannot resurrect them. */
const removedLineKeys = new Set<string>(loadTombstones());

function loadTombstones(): string[] {
  try {
    const raw = sessionStorage.getItem(TOMBSTONE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function persistTombstones(): void {
  try {
    sessionStorage.setItem(
      TOMBSTONE_STORAGE_KEY,
      JSON.stringify([...removedLineKeys]),
    );
  } catch {
    /* ignore */
  }
}

function lineKey(productId: ProductId, variantId?: number | null): string {
  const vid =
    variantId != null && String(variantId) !== "" && !Number.isNaN(Number(variantId))
      ? String(Number(variantId))
      : "";
  return `${String(productId)}:${vid}`;
}

function parseLineKey(key: string): { productId: number; variantId?: number } {
  const [pid, vid = ""] = key.split(":");
  return {
    productId: Number(pid),
    ...(vid ? { variantId: Number(vid) } : {}),
  };
}

function bumpLocalCartEpoch(): number {
  localCartEpoch += 1;
  return localCartEpoch;
}

export function getLocalCartEpoch(): number {
  return localCartEpoch;
}

function rememberRemovedLine(productId: ProductId, variantId?: number | null): void {
  removedLineKeys.add(lineKey(productId, variantId ?? null));
  persistTombstones();
}

function forgetRemovedLine(productId: ProductId, variantId?: number | null): void {
  removedLineKeys.delete(lineKey(productId, variantId));
  if (variantId == null) removedLineKeys.delete(lineKey(productId, null));
  persistTombstones();
}

function clearTombstones(): void {
  removedLineKeys.clear();
  persistTombstones();
}

function filterRemovedServerItems(items: CartItem[]): CartItem[] {
  if (removedLineKeys.size === 0) return items;
  return items.filter((item) => {
    const pid = item.product_id;
    const vid = item.variant_id != null ? Number(item.variant_id) : null;
    if (removedLineKeys.has(lineKey(pid, vid))) return false;
    if (removedLineKeys.has(lineKey(pid, null))) return false;
    return true;
  });
}

/** Push pending web-removes to the authenticated user cart. */
async function flushTombstonesToServer(): Promise<void> {
  const keys = [...removedLineKeys];
  for (const key of keys) {
    const { productId, variantId } = parseLineKey(key);
    if (!productId) continue;
    await cartAPI
      .remove({
        product_id: productId,
        ...(variantId != null ? { variant_id: variantId } : {}),
      })
      .catch(() => null);
  }
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
  bumpLocalCartEpoch();
  forgetRemovedLine(item.id, variantId);

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
      applyServerCartItems(filterRemovedServerItems(items));
      bumpLocalCartEpoch();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a line from local cart by index (preferred) or loose id match.
 * Always updates Zustand first so the badge/drawer drop immediately.
 * Guest / after-logout: local-only (API session cart is empty; applying it
 * would wipe or ignore the remove). Removals are tombstoned and flushed on login.
 */
export function removeLineFromCart(
  id: ProductId,
  variantId?: number | null,
  index?: number,
): void {
  const prev = useStore.getState().cartProducts;
  let removed: CartProduct | undefined;
  let next: CartProduct[];

  if (typeof index === "number" && index >= 0 && index < prev.length) {
    removed = prev[index];
    next = prev.filter((_, i) => i !== index);
  } else {
    removed = prev.find((p) => isSameCartLine(p, id, variantId));
    next = prev.filter((p) => !isSameCartLine(p, id, variantId));
  }

  // Fallback: drop by product id if variant match failed
  if (next.length === prev.length) {
    removed = prev.find((p) => String(p.id) === String(id));
    next = prev.filter((p) => String(p.id) !== String(id));
  }
  if (next.length === prev.length) return;

  const pid = Number(removed?.id ?? id);
  const vid =
    removed?.selectedVariantId != null
      ? Number(removed.selectedVariantId)
      : variantId != null
        ? Number(variantId)
        : undefined;

  bumpLocalCartEpoch();
  rememberRemovedLine(pid, vid ?? null);
  useStore.getState().setCartProducts(next);

  // Guests: local-only. Session API is empty after logout and must not run.
  if (!useAuthStore.getState().isLoggedIn) return;

  const epochAtRemove = getLocalCartEpoch();
  void (async () => {
    try {
      const res = await cartAPI.remove({
        product_id: pid,
        ...(vid != null && !Number.isNaN(vid) ? { variant_id: vid } : {}),
      });
      if (getLocalCartEpoch() !== epochAtRemove) return;

      const items = res.data?.data?.items;
      if (!Array.isArray(items)) return;

      const filtered = filterRemovedServerItems(items);
      const localNow = useStore.getState().cartProducts;
      if (filtered.length !== localNow.length) return;

      applyServerCartItems(filtered);
    } catch {
      /* local already updated */
    }
  })();
}

/**
 * After login/register: flush web-removes to user cart, merge guest session,
 * then pull server cart.
 */
export async function syncCartFromServer(): Promise<void> {
  const epochAtStart = getLocalCartEpoch();
  try {
    const sid = localStorage.getItem("sk_sid") || undefined;
    await cartAPI.merge(sid ? { session_id: sid } : {}).catch(() => null);

    if (!useAuthStore.getState().isLoggedIn) return;

    // Apply removals done while logged out / guest against the user cart.
    if (removedLineKeys.size > 0) {
      await flushTombstonesToServer();
    }

    let res = await cartAPI.products();
    let items: CartItem[] = res.data?.data?.items ?? [];

    let local = useStore.getState().cartProducts;
    const mutatedDuringSync = getLocalCartEpoch() !== epochAtStart;

    if (items.length === 0 && local.length > 0 && !mutatedDuringSync) {
      for (const p of local) {
        const vid =
          p.selectedVariantId != null ? Number(p.selectedVariantId) : undefined;
        // Skip lines the user already removed
        if (removedLineKeys.has(lineKey(p.id, vid ?? null))) continue;
        if (removedLineKeys.has(lineKey(p.id, null))) continue;
        await cartAPI
          .add({
            product_id: Number(p.id),
            quantity: Math.max(1, Number(p.quantity) || 1),
            ...(vid != null && !Number.isNaN(vid) ? { variant_id: vid } : {}),
          })
          .catch(() => null);
      }
      if (!useAuthStore.getState().isLoggedIn) return;
      if (getLocalCartEpoch() !== epochAtStart) return;
      res = await cartAPI.products();
      items = res.data?.data?.items ?? [];
    }

    if (!useAuthStore.getState().isLoggedIn) return;

    local = useStore.getState().cartProducts;
    if (getLocalCartEpoch() !== epochAtStart && local.length < items.length) {
      return;
    }

    const filtered = filterRemovedServerItems(items);
    applyServerCartItems(filtered);

    // Server now matches removals — clear tombstones.
    if (filtered.length === useStore.getState().cartProducts.length) {
      clearTombstones();
    }
  } catch {
    /* keep local cart on network failure */
  }
}

/** Call immediately after login()/register sets the JWT. */
export async function afterLoginCartSync(): Promise<void> {
  await syncCartFromServer();
}
