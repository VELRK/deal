import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";
import { cartAPI, productsAPI } from "@/services/api";
import { toProductCard } from "@/hooks/useApi";
import { useContextElement } from "@/context/Context";
import type { ProductCardItem } from "@/types/productCard";

function MayBe() {
  const { cartProducts } = useContextElement();
  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [title, setTitle] = useState("You may be interested in…");

  const cartKey = useMemo(
    () =>
      cartProducts
        .map((p) => `${p.id}:${p.selectedVariantId ?? ""}`)
        .sort()
        .join("|"),
    [cartProducts],
  );

  useEffect(() => {
    let cancelled = false;

    const loadFeatured = () =>
      productsAPI
        .getAll({ featured: 1, limit: 12 })
        .then((res) => {
          if (cancelled) return;
          const raw = res.data?.data?.products ?? [];
          setItems(raw.map(toProductCard));
          setTitle("You may be interested in…");
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        });

    if (!cartKey) {
      loadFeatured();
      return () => {
        cancelled = true;
      };
    }

    cartAPI
      .suggestions({ limit: 12 })
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.data?.products ?? [];
        if (raw.length === 0) {
          return loadFeatured();
        }
        const basedOn = res.data?.data?.based_on ?? [];
        const pack = basedOn
          .map((b) => (typeof b.variant_label === "string" ? b.variant_label : ""))
          .find((l) => l.trim() !== "");
        setItems(raw.map(toProductCard));
        setTitle(
          pack
            ? `More ${pack} packs in this category`
            : "Similar products in this category",
        );
      })
      .catch(() => {
        if (!cancelled) loadFeatured();
      });

    return () => {
      cancelled = true;
    };
  }, [cartKey]);

  if (items.length === 0) return null;

  return (
    <section className="flat-spacing animate-fade-in delay-300">
      <div className="container">
        <div className="sect-heading">
          <h4>{title}</h4>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationLg={4}
          paginationMd={3}
          paginationSm={2}
          pagination={2}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default MayBe;
