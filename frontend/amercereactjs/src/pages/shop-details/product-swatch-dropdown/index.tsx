import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import { useParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

export default function Page() {
  const { id = "" } = useParams<{ id: string }>();
  const pageMeta = buildShopProductMetadata(id, "Swatch dropdown");
  const product = products.find((p) => p.id === Number(id)) || products[0];

  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <Breadcrumb product={product} />
      <ProductSection product={product} layout="swatch-dropdown" />
      <ProductDescription />
      <RelatedProducts />
    </>
  );
}
