import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Shop from "@/components/shop/shop-default/Shop";
import PageMeta from "@/components/common/PageMeta";
import { useCategories } from "@/hooks/useApi";
import type { ApiCategory } from "@/services/api";

/** Pretty URL shop: /collections/:categorySlug or /:categorySlug/:subcategorySlug */
export default function CollectionShopPage() {
  const { categorySlug = "", subcategorySlug = "" } = useParams<{
    categorySlug?: string;
    subcategorySlug?: string;
  }>();
  const { categories } = useCategories();
  const [title, setTitle] = useState("Shop");

  const resolved = useMemo(() => {
    let category: ApiCategory | null = null;
    let subcategory: ApiCategory | null = null;
    for (const c of categories) {
      if (c.slug === categorySlug) {
        category = c;
        if (subcategorySlug) {
          subcategory =
            (c.children ?? []).find((s) => s.slug === subcategorySlug) ?? null;
        }
        break;
      }
    }
    return { category, subcategory };
  }, [categories, categorySlug, subcategorySlug]);

  useEffect(() => {
    if (resolved.subcategory) {
      setTitle(resolved.subcategory.name);
    } else if (resolved.category) {
      setTitle(resolved.category.name);
    } else if (categorySlug) {
      setTitle(categorySlug.replace(/-/g, " "));
    }
  }, [resolved, categorySlug]);

  return (
    <>
      <PageMeta title={`${title} | 2Deal`} description={`Shop ${title} at 2Deal.`} />
      <Shop
        routeCategoryId={resolved.category ? String(resolved.category.id) : undefined}
        routeSubcategoryId={
          resolved.subcategory ? String(resolved.subcategory.id) : undefined
        }
        routeCategorySlug={categorySlug || undefined}
      />
    </>
  );
}
