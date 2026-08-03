import Breadcrumb from "@/components/shop-details/Breadcrumb";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import type { ProductSingleImage } from "@/types/productCard";
import { useParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

/** Gallery rows for the two-column grid (`.grid-img_2`); matches theme markup / scroll `data-*` hooks. */
const productGrid2Images: ProductSingleImage[] = [
  {
    src: "/frontend/assets/images/product/single/detail-1.jpg",
    dataColor: "green",
    dataSize: "L",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_2.jpg",
    dataColor: "green",
    dataSize: "S",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_3.jpg",
    dataColor: "green",
    dataSize: "L",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_4.jpg",
    dataColor: "green",
    dataSize: "S",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_5.jpg",
    dataColor: "gray",
    dataSize: "M",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_6.jpg",
    dataColor: "gray",
    dataSize: "XL",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_7.jpg",
    dataColor: "black",
    dataSize: "M",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_8.jpg",
    dataColor: "black",
    dataSize: "L",
  },
];
export default function Page() {
  const { id = "" } = useParams<{ id: string }>();
  const pageMeta = buildShopProductMetadata(id, "Product grid 2");
  const base = products.find((p) => p.id === Number(id)) || products[0];
  const product = {
    ...base,
    img: productGrid2Images[0].src,
  };

  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <Breadcrumb product={product} />
      <ProductSection
        product={product}
        mediaLayout="grid-2"
        extraImages={productGrid2Images}
        initialColor="green"
        initialSize="L"
      />
      <ProductDescription />
      <RelatedProducts />
    </>
  );
}
