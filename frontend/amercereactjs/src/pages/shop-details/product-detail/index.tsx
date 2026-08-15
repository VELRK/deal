import Breadcrumb from "@/components/shop-details/Breadcrumb";
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

  // Track this product as recently viewed
  useEffect(() => {
    if (id) trackView(id);
  }, [id]);

  // Robustly collect all product images without duplicates
  const extraImages = (() => {
    if (!apiProduct) return [];
    const seen = new Set<string>();
    const list: { src: string; dataColor?: string; dataSize?: string }[] = [];

    const addImg = (rawUrl?: string | null, dataColor?: string, dataSize?: string) => {
      if (!rawUrl || typeof rawUrl !== "string") return;
      const url = apiImageUrl(rawUrl);
      if (!url || seen.has(url) || url.includes("no-image.png")) return;
      seen.add(url);
      list.push({ src: url, dataColor, dataSize });
    };

    // 1. Primary Thumbnail
    addImg(apiProduct.thumbnail);

    // 2. Product Gallery Images
    (apiProduct.images ?? []).forEach((img) => {
      if (img && typeof img === "object" && img.image) {
        addImg(img.image);
      } else if (typeof img === "string") {
        addImg(img);
      }
    });

    // 3. Variant Images
    (apiProduct.variants ?? []).forEach((v) => {
      const vImg = v.image || v.image_url;
      if (vImg) {
        addImg(vImg, undefined, v.label);
      }
    });

    // 4. Color Images
    if (Array.isArray(apiProduct.colors_json)) {
      apiProduct.colors_json.forEach((c) => {
        if (c && typeof c === "object" && c.image) {
          addImg(c.image, c.name);
        }
      });
    }

    if (list.length === 0) {
      list.push({ src: apiImageUrl(apiProduct.thumbnail) || "/frontend/assets/images/product/single/detail-1.jpg" });
    }

    return list;
  })();

  const card = apiProduct
    ? {
      ...toProductCard(apiProduct),
      procurement_sla: apiProduct.procurement_sla,
      images: extraImages,
      description: apiProduct.description ?? apiProduct.short_desc ?? "",
    }
    : null;

  useEffect(() => {
    if (!card) return;
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

  if (!apiProduct || !card) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
        <p className="cl-text-2">Product not found.</p>
      </div>
    );
  }

  const unitVariants = card.unitVariants ?? [];
  const initialVariantId = unitVariants.find((v) => v.isDefault)?.id ?? unitVariants[0]?.id ?? null;

  // Build color swatches from colors_json (image per color) or fallback to color/color2
  const colors: ColorOption[] = (() => {
    const thumb = apiImageUrl(apiProduct.thumbnail);
    if (Array.isArray(apiProduct.colors_json) && apiProduct.colors_json.length > 0) {
      return apiProduct.colors_json.map((c) => ({
        label: c.name,
        hex: c.hex || undefined,
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

  // Build real size options from DB (either array or comma-separated string)
  const rawSizes: string[] = (() => {
    if (Array.isArray(apiProduct.sizes)) {
      return apiProduct.sizes.filter(Boolean);
    }
    if (typeof (apiProduct.sizes as unknown) === "string" && apiProduct.sizes) {
      return (apiProduct.sizes as unknown as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (Array.isArray(card.sizes)) {
      return card.sizes.filter(Boolean);
    }
    return [];
  })();

  const sizes: SizeOption[] = rawSizes.map((s) => ({ value: s }));

  const initialColor = colors[0]?.label ?? "";
  const initialSize = sizes[0]?.value ?? "";

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
        extraImages={extraImages}
      />
      <RelatedProducts />
      <RecentlyViewed excludeSlug={id} />
    </>
  );
}
