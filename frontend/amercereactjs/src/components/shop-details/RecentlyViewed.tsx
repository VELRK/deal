import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

export default function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const { products, loading } = useRecentlyViewed(excludeSlug);

  if (loading || products.length === 0) return null;

  return (
    <div className="flat-spacing pt-4 pb-5 flat-animate-tab">
      <div className="container">
        <div className="d-flex flex-column align-items-center text-center mb-4">
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#3ec1bc",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: "4px",
            }}
          >
            Past Picks
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              color: "#54101d",
              fontFamily: "serif",
              fontWeight: "normal",
              margin: 0,
            }}
          >
            Recently Viewed
          </h2>
        </div>
        <TfSwiper
          className="wrap-sw-over"
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={24}
          spaceMd={16}
          space={12}
          pagination={2}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          grid={1}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="classic"
              imgWidth={330}
              imgHeight={330}
              actionBotLabel="ADD TO CART"
              actionBotHref="#shoppingCart"
              actionBotDataToggle="offcanvas"
            />
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}
