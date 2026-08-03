import Breadcrumb from "@/components/shop-details/Breadcrumb";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import { products } from "@/data/products/products";
import ProductDescription2 from "@/components/shop-details/ProductDescription2";
import { useParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
export default function Page() {
  const { id = "" } = useParams<{ id: string }>();
  const pageMeta = buildShopProductMetadata(id, "Product detail");
  const product = products.find((p) => p.id === Number(id)) || products[0];

  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <Breadcrumb product={product} />
      <ProductSection product={product} />
      <ProductDescription2 />
      <RelatedProducts />
    </>
  );
}
