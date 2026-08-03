import { cartAPI, type CartItem } from "@/services/api";
import {
  useStore,
  type CartProduct,
  type Product,
  type ProductId,
} from "@/context/store";
import { useAuthStore } from "@/store/authStore";

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

/** Lines the user removed on web — filter these out of server pulls until login merge. */
const removedLineKeys = new Set<string>();

function lineKey(productId: ProductId, variantId?: number | null): string {
  const vid =
    variantId != null && !Number.isNaN(Number(variantId))
      ? String(Number(variantId))
      : "";
  return `${String(productId)}:${vid}`;
}

function bumpLocalCartEpoch(): number {
  localCartEpoch += 1;
  return localCartEpoch;
}

export function getLocalCartEpoch(): number {
  return localCartEpoch;
}

function filterRemovedServerItems(items: CartItem[]): CartItem[] {
  if (removedLineKeys.size === 0) return items;
  return items.filter((item) => {
    const pid = item.product_id;
    const vid = item.variant_id != null ? Number(item.variant_id) : null;
    if (removedLineKeys.has(lineKey(pid, vid))) return false;
    // Also drop if we tombstoned the product with no variant (removed all variants)
    if (removedLineKeys.has(lineKey(pid, null))) return false;
    return true;
  });
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
  // Re-adding clears the tombstone so sync can keep it.
  removedLineKeys.delete(lineKey(item.id, variantId));
  if (variantId == null) removedLineKeys.delete(lineKey(item.id, null));

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
      bumpLocalCartEpoch();
    }
    return true;
  } catch {
    /* keep optimistic local line if API fails */
    return false;
  }
}

/**
 * Remove a line from local cart by index (preferred) or loose id match.
 * Always updates Zustand first so the badge/drawer drop immediately.
 * Then best-effort API delete; when logged in, apply server items only if
 * they are not larger than the local cart (avoids resurrecting removed lines).
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
    // Trust the visible row index — id check was too brittle with mixed types.
    removed = prev[index];
    next = prev.filter((_, i) => i !== index);
  } else {
    removed = prev.find((p) => isSameCartLine(p, id, variantId));
    next = prev.filter((p) => !isSameCartLine(p, id, variantId));
  }

  const epochAtRemove = bumpLocalCartEpoch();
  useStore.getState().setCartProducts(next);

  const pid = Number(removed?.id ?? id);
  const vid =
    removed?.selectedVariantId != null
      ? Number(removed.selectedVariantId)
      : variantId != null
        ? Number(variantId)
        : undefined;

  removedLineKeys.add(lineKey(pid, vid ?? null));

  void (async () => {
    try {
      const res = await cartAPI.remove({
        product_id: pid,
        ...(vid != null && !Number.isNaN(vid) ? { variant_id: vid } : {}),
      });
      // A newer local edit won — do not clobber.
      if (getLocalCartEpoch() !== epochAtRemove) return;

      // Guest session after logout is often empty while local still has the
      // former user cart. Never replace local from the remove response —
      // local already dropped the one line; applying [] would wipe the rest.
      if (!useAuthStore.getState().isLoggedIn) return;

      const items = res.data?.data?.items;
      if (!Array.isArray(items)) return;

      const filtered = filterRemovedServerItems(items);
      const localNow = useStore.getState().cartProducts;
      // Only sync prices/stock when server matches local size (successful delete).
      if (filtered.length !== localNow.length) return;

      applyServerCartItems(filtered);
    } catch {
      /* local already updated */
    }
  })();
}

/**
 * After login/register: merge guest session cart (sk_sid) into the user cart,
 * then replace local Zustand with the server cart.
 *
 * Logout flow (do not clear sk_sid or local cart):
 * 1) Logged-in cart stays on user_id in DB; local badge still shows it.
 * 2) Guest adds after logout go to X-Session-ID (sk_sid).
 * 3) On login, merge(sk_sid) moves guest lines into user_id, then we pull.
 */
export async function syncCartFromServer(): Promise<void> {
  const epochAtStart = getLocalCartEpoch();
  try {
    const sid = localStorage.getItem("sk_sid") || undefined;
    await cartAPI.merge(sid ? { session_id: sid } : {}).catch(() => null);

    // Abort if user logged out while this sync was in flight.
    if (!useAuthStore.getState().isLoggedIn) return;

    let res = await cartAPI.products();
    let items: CartItem[] = res.data?.data?.items ?? [];

    // Re-read AFTER awaits — a remove/add may have happened during the request.
    let local = useStore.getState().cartProducts;
    const mutatedDuringSync = getLocalCartEpoch() !== epochAtStart;

    // Web-only cart (never reached API) would otherwise be wiped on refresh.
    // Skip re-push if the user edited the cart while this sync was in flight.
    if (items.length === 0 && local.length > 0 && !mutatedDuringSync) {
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
      if (!useAuthStore.getState().isLoggedIn) return;
      if (getLocalCartEpoch() !== epochAtStart) return;
      res = await cartAPI.products();
      items = res.data?.data?.items ?? [];
    }

    if (!useAuthStore.getState().isLoggedIn) return;

    local = useStore.getState().cartProducts;
    // Local remove/add won the race against this in-flight pull — keep local.
    if (getLocalCartEpoch() !== epochAtStart && local.length < items.length) {
      return;
    }

    const filtered = filterRemovedServerItems(items);
    // If tombstones left us shorter than local, keep local (guest leftovers).
    if (filtered.length < local.length && getLocalCartEpoch() !== epochAtStart) {
      return;
    }

    applyServerCartItems(filtered);
  } catch {
    /* keep local cart on network failure */
  }
}

/** Call immediately after login()/register sets the JWT. */
export async function afterLoginCartSync(): Promise<void> {
  removedLineKeys.clear();
  await syncCartFromServer();
}
