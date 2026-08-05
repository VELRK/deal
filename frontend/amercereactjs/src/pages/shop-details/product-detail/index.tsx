import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import RecentlyViewed from "@/components/shop-details/RecentlyViewed";
import ProductSection from "@/components/shop-details/ProductSection";
import { useParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
import { useProduct, toProductCard, apiImageUrl } from "@/hooks/useApi";
import type { ColorOption, SizeOption } from "@/context/ProductContext";
import { useCurrentProductStore } from "@/store/currentProductStore";
import { useEffect } from "react";
import { trackView } from "@/hooks/useRecentlyViewed";

export default function Page() {
  const { id = "" } = useParams<{ id: string }>();
  const { product: apiProduct, loading } = useProduct(id);
  const setCurrentProduct = useCurrentProductStore((s) => s.setCurrentProduct);

  // Must be before any early returns — Rules of Hooks
  // Track this product as recently viewed
  useEffect(() => {
    if (id) trackView(id);
  }, [id]);

  useEffect(() => {
    if (!apiProduct) return;
    const card = {
      ...toProductCard(apiProduct),
      procurement_sla: apiProduct.procurement_sla,
      images: [
        { src: apiImageUrl(apiProduct.thumbnail) },
        ...(apiProduct.images ?? [])
          .filter((img) => img.image !== apiProduct.thumbnail)
          .map((img) => ({ src: apiImageUrl(img.image) })),
      ],
      description: apiProduct.description ?? apiProduct.short_desc ?? "",
    };
    setCurrentProduct(card);
    return () => setCurrentProduct(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiProduct?.id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );
  }

  if (!apiProduct) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <p className="cl-text-2">Product not found.</p>
      </div>
    );
  }

  const card = {
    ...toProductCard(apiProduct),
    procurement_sla: apiProduct.procurement_sla,
    images: [
      { src: apiImageUrl(apiProduct.thumbnail) },
      ...(apiProduct.images ?? [])
        .filter((img) => img.image !== apiProduct.thumbnail)
        .map((img) => ({ src: apiImageUrl(img.image) })),
    ],
    description: apiProduct.description ?? apiProduct.short_desc ?? "",
  };

  const unitVariants = card.unitVariants ?? [];
  const initialVariantId = unitVariants.find((v) => v.isDefault)?.id ?? unitVariants[0]?.id ?? null;

  // Build color swatches from colors_json (image per color) or fallback to color/color2
  const colors: ColorOption[] = (() => {
    const thumb = apiImageUrl(apiProduct.thumbnail);
    if (apiProduct.colors_json && apiProduct.colors_json.length > 0) {
      return apiProduct.colors_json.map((c) => ({
        label: c.name,
        swatchClass: c.hex ? "" : "bg-gray",
        img: c.image ? apiImageUrl(c.image) : thumb,
      }));
    }
    // Fallback: build from color / color2
    const fallback: ColorOption[] = [];
    if (apiProduct.color) fallback.push({ label: apiProduct.color, swatchClass: "bg-gray", img: thumb });
    if (apiProduct.color2) fallback.push({ label: apiProduct.color2, swatchClass: "bg-gray", img: thumb });
    return fallback;
  })();

  // Build real size options from DB
  const sizes: SizeOption[] = (apiProduct.sizes ?? []).map((s) => ({ value: s }));

  const initialColor = colors[0]?.label ?? "";
  const initialSize  = sizes[0]?.value ?? "";

  return (
    <>
      <PageMeta
        title={apiProduct.seo?.meta_title || apiProduct.meta_title || `${card.name} | 2DEAL`}
        description={apiProduct.seo?.meta_description || apiProduct.meta_desc || apiProduct.short_desc || card.name}
        keywords={apiProduct.seo?.meta_keywords || apiProduct.meta_keywords}
        image={apiProduct.seo?.og_image || apiProduct.og_image || apiImageUrl(apiProduct.thumbnail)}
        ogType="product"
      />
      <Breadcrumb product={card} />
      <ProductSection
        product={card}
        colors={colors.length > 0 ? colors : undefined}
        sizes={sizes.length > 0 ? sizes : undefined}
        unitVariants={unitVariants}
        initialVariantId={initialVariantId}
        initialColor={initialColor}
        initialSize={initialSize}
        extraImages={card.images}
      />
      <ProductDescription product={card} productId={apiProduct.id} />
      <RelatedProducts />
      <RecentlyViewed excludeSlug={id} />
    </>
  );
}
