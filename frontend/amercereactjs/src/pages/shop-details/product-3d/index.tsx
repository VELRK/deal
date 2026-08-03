import Breadcrumb from "@/components/shop-details/Breadcrumb";
import type { ProductSingleImage } from "@/types/productCard";
import ProductDescription from "@/components/shop-details/ProductDescription";
import RelatedProducts from "@/components/shop-details/RelatedProducts";
import ProductSection from "@/components/shop-details/ProductSection";
import { products } from "@/data/products/products";
import { buildShopProductMetadata } from "@/lib/metadata/shop-product";
import { useParams } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

const threeDImages: ProductSingleImage[] = [
  {
    src: "/frontend/assets/images/product/single/detail-1.jpg",
    dataColor: "green",
    dataSize: "S",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_2.jpg",
    dataColor: "green",
    dataSize: "M",
    model3d: "/frontend/assets/images/video/clothing-3d.glb",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_3.jpg",
    dataColor: "green",
    dataSize: "L",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_4.jpg",
    dataColor: "green",
    dataSize: "XL",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_5.jpg",
    dataColor: "gray",
    dataSize: "M",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_6.jpg",
    dataColor: "gray",
    dataSize: "L",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_7.jpg",
    dataColor: "black",
    dataSize: "L",
  },
  {
    src: "/frontend/assets/images/product/single/detail-1_8.jpg",
    dataColor: "black",
    dataSize: "XL",
  },
];
export default function Page() {
  const { id = "" } = useParams<{ id: string }>();
  const pageMeta = buildShopProductMetadata(id, "3D model");
  const product = products.find((p) => p.id === Number(id)) || products[0];

  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <Breadcrumb product={product} />
      <ProductSection product={product} extraImages={threeDImages} />
      <ProductDescription />
      <RelatedProducts />
    </>
  );
}
