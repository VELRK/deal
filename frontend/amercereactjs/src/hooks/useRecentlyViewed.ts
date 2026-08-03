import { useEffect, useState, useCallback } from "react";
import { productsAPI } from "@/services/api";
import { toProductCard } from "@/hooks/useApi";

const KEY   = "sk_recently_viewed";
const MAX   = 10;
const EVENT = "sk:recently-viewed-updated";

function getSlugs(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function trackView(slug: string) {
  if (!slug) return;
  const current = getSlugs().filter((s) => s !== slug);
  localStorage.setItem(KEY, JSON.stringify([slug, ...current].slice(0, MAX)));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useRecentlyViewed(excludeSlug?: string) {
  const [products, setProducts] = useState<ReturnType<typeof toProductCard>[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetchProducts = useCallback(() => {
    const slugs = getSlugs().filter((s) => s !== excludeSlug).slice(0, 8);
    if (slugs.length === 0) { setLoading(false); setProducts([]); return; }

    setLoading(true);
    Promise.all(slugs.map((s) => productsAPI.getOne(s).catch(() => null)))
      .then((results) => {
        const cards = results
          .filter((r) => !!r?.data?.data)
          .map((r) => toProductCard(r!.data.data));
        setProducts(cards);
      })
      .finally(() => setLoading(false));
  }, [excludeSlug]);

  useEffect(() => {
    fetchProducts();
    window.addEventListener(EVENT, fetchProducts);
    return () => window.removeEventListener(EVENT, fetchProducts);
  }, [fetchProducts]);

  return { products, loading };
}
