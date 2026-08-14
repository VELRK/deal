import { cartAPI, type CartItem } from "@/services/api";
import {
  useStore,
  type CartProduct,
  type Product,
  type ProductId,
} from "@/context/store";
import { useAuthStore } from "@/store/authStore";

const TOMBSTONE_STORAGE_KEY = "sk_cart_removed";
const PAID_CART_CLEAR_KEY = "sk_paid_cart_clear";

export type PaidCartLine = { product_id: number; variant_id?: number | null };

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

/** Drop paid products from Zustand + localStorage and remember so sync cannot restore them. */
export function removePaidProductsFromLocalCart(lines: PaidCartLine[]): void {
  if (!Array.isArray(lines) || lines.length === 0) return;

  const ids = new Set(lines.map((l) => String(l.product_id)).filter(Boolean));
  if (ids.size === 0) return;

  const prev = useStore.getState().cartProducts;
  const next = prev.filter((p) => !ids.has(String(p.id)));
  for (const line of lines) {
    const pid = Number(line.product_id);
    if (!pid) continue;
    rememberRemovedLine(pid, line.variant_id ?? null);
    rememberRemovedLine(pid, null);
  }
  if (next.length !== prev.length) {
    bumpLocalCartEpoch();
    useStore.getState().setCartProducts(next);
  }
  persistPaidCartClear(lines);
}

export async function removePaidProductsFromCart(lines: PaidCartLine[]): Promise<void> {
  removePaidProductsFromLocalCart(lines);
  for (const line of lines) {
    const pid = Number(line.product_id);
    if (!pid) continue;
    const vid = line.variant_id != null ? Number(line.variant_id) : undefined;
    await cartAPI
      .remove({
        product_id: pid,
        ...(vid ? { variant_id: vid } : {}),
      })
      .catch(() => null);
    await cartAPI.remove({ product_id: pid }).catch(() => null);
  }
}

function persistPaidCartClear(lines: PaidCartLine[]): void {
  try {
    localStorage.setItem(PAID_CART_CLEAR_KEY, JSON.stringify(lines));
  } catch {
    /* ignore */
  }
}

/** Apply payment-success cart clear before server sync (FPX return / new tab). */
export function applyPaidCartClearFromStorage(): void {
  try {
    const raw = localStorage.getItem(PAID_CART_CLEAR_KEY);
    if (!raw) return;
    const lines = JSON.parse(raw) as PaidCartLine[];
    if (Array.isArray(lines) && lines.length > 0) {
      removePaidProductsFromLocalCart(lines);
    }
  } catch {
    /* ignore */
  }
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
    const raw =
      sessionStorage.getItem(TOMBSTONE_STORAGE_KEY) ||
      localStorage.getItem(TOMBSTONE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function persistTombstones(): void {
  try {
    const json = JSON.stringify([...removedLineKeys]);
    sessionStorage.setItem(TOMBSTONE_STORAGE_KEY, json);
    localStorage.setItem(TOMBSTONE_STORAGE_KEY, json);
  } catch {
    /* ignore */
  }
}

function clearTombstones(): void {
  removedLineKeys.clear();
  try {
    sessionStorage.removeItem(TOMBSTONE_STORAGE_KEY);
    localStorage.removeItem(TOMBSTONE_STORAGE_KEY);
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
    // Second pass without variant — covers NULL vs default-variant mismatches.
    await cartAPI.remove({ product_id: productId }).catch(() => null);
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

  const already = useStore
    .getState()
    .isAddedToCartProducts(item.id, variantId);
  if (already) {
    // Product already in cart — set absolute quantity (do not stack via cartAPI.add).
    return setCartLineQuantity(item.id, quantity, variantId);
  }

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

/** Set absolute quantity for an existing cart line (local + API). */
export async function setCartLineQuantity(
  id: ProductId,
  qty: number,
  variantId?: number | null,
): Promise<boolean> {
  const quantity = Math.max(1, Number(qty) || 1);
  const vid =
    variantId != null && !Number.isNaN(Number(variantId))
      ? Number(variantId)
      : undefined;

  useStore.getState().updateQuantity(id, quantity, vid);
  bumpLocalCartEpoch();
  forgetRemovedLine(id, vid);

  try {
    const res = await cartAPI.update({
      product_id: Number(id),
      quantity,
      ...(vid != null ? { variant_id: vid } : {}),
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
 * Guest / after-logout: still call API to clear session rows, but never apply
 * the response (empty guest session after logout would wipe remaining lines).
 * Removals are tombstoned until the server cart no longer contains them.
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

  const loggedIn = useAuthStore.getState().isLoggedIn;
  const epochAtRemove = getLocalCartEpoch();
  const removePayload = {
    product_id: pid,
    ...(vid != null && !Number.isNaN(vid) ? { variant_id: vid } : {}),
  };

  void (async () => {
    try {
      const res = await cartAPI.remove(removePayload);
      // After logout the session cart is empty — never replace local from it.
      if (!loggedIn || !useAuthStore.getState().isLoggedIn) return;
      if (getLocalCartEpoch() !== epochAtRemove) return;

      const items = res.data?.data?.items;
      if (!Array.isArray(items)) return;

      const filtered = filterRemovedServerItems(items);
      const localNow = useStore.getState().cartProducts;
      if (filtered.length !== localNow.length) return;

      applyServerCartItems(filtered);
      // Only drop tombstones once the server cart no longer has them.
      if (filtered.length === items.length) clearTombstones();
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
  applyPaidCartClearFromStorage();
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

    // Only clear tombstones when the *server* no longer has those lines.
    // Clearing after a local-only filter let the next focus sync resurrect items.
    if (filtered.length === items.length) {
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
