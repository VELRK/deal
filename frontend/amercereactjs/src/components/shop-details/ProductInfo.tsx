import { useProduct } from "@/context/useProduct";
import type { ProductCardItem } from "@/types/productCard";
import {
  ProductTitle,
  ProductPrice,
  ProductShortDescription,
  ProductVariantPicker,
  ProductQuantityBuy,
  ProductDelivery,
} from "./product-info";

export default function ProductInfo({ product }: { product: ProductCardItem }) {
  const { registerPane } = useProduct();

  return (
    <div className="col-md-6">
      <div className="tf-product-info-wrap position-relative mt-md-0 sticky-top classic-details-wrap">
        <div ref={registerPane} className="tf-zoom-main sticky-top" />
        <div className="tf-product-info-list other-image-zoom">
          <div className="tf-product-info-heading">
            <ProductTitle product={product} />
            <ProductShortDescription product={product} />
          </div>

          <div className="tf-product-variant mt-3">
            <ProductVariantPicker />
            <ProductPrice product={product} />
            <ProductQuantityBuy product={product} />
          </div>

          <ProductDelivery product={product} />
        </div>
      </div>
    </div>
  );
}

