import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

export default function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const { products, loading } = useRecentlyViewed(excludeSlug);

  if (loading || products.length === 0) return null;

  return (
    <div className="flat-spacing pt-5 flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp mb-20">
          <h2 style={{ fontSize: "36px", color: "#54101d", fontFamily: "serif", fontWeight: "normal", margin: 0 }}>Recently Viewed</h2>        </div>
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}
