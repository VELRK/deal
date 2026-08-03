import Breadcrumb from "@/components/shop-details/Breadcrumb";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import { useParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
export default function Page() {
  const { id = "" } = useParams<{ id: string }>();
  const pageMeta = buildShopProductMetadata(id, "Grouped product");
  const product = products.find((p) => p.id === Number(id)) || products[0];

  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <Breadcrumb product={product} />
      <ProductSection
        parentClass="section-product-single flat-spacing pt-0 tf-main-product section-image-zoom"
        product={product}
        layout="grouped"
      />
      <RelatedProducts />
    </>
  );
}
