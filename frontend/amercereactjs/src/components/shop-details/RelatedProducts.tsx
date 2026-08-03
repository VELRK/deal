import { useParams } from "react-router-dom";
import { useProduct, toProductCard } from "@/hooks/useApi";
import ProductCard from "../ui/ProductCard";
import TfSwiper from "../ui/TfSwiper";

export default function RelatedProducts() {
  const { id = "" } = useParams<{ id: string }>();
  const { product: apiProduct, loading } = useProduct(id);

  const related = (apiProduct?.related ?? []).map(toProductCard);

  if (loading || related.length === 0) return null;

  return (
    <div className="flat-spacing flat-animate-tab pt-0">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp mb-20">
          <h3 className="s-title">Related Products</h3>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={2}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          className="wrap-sw-over"
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}
