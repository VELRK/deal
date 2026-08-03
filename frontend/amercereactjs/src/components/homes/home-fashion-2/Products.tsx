import TfSwiper from "@/components/ui/TfSwiper";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts, toProductCard } from "@/hooks/useApi";

function Products() {
  const { products, loading } = useProducts({ sort: "newest", limit: 16 });

  const cards = products.map(toProductCard);

  return (
    <div className="flat-spacing pt-5 flat-animate-tab">
      <div className="container">
        <div className="sect-heading type-2 overflow-auto text-nowrap">
          <ul className="tab-btn-wrap-v3 style-4 justify-content-sm-center mb-0" role="tablist">
            <li className="nav-tab-item" role="presentation">
              <a href="#newest" role="tab" aria-selected className="tf-btn-tab py-4 active">
                <h2 style={{ fontSize: "36px", color: "#54101d", fontFamily: "serif", fontWeight: "normal", margin: 0 }}>New Arrival</h2>              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div className="tab-pane fade active show" role="tabpanel">
            {loading ? (
              <div className="text-center py-40">Loading…</div>
            ) : (
              <TfSwiper
                className="wrap-sw-over"
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
                grid={2}
                paginationClassName="sw-dot-default tf-sw-pagination"
              >
                {cards.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="classic"
                    imgWidth={330}
                    imgHeight={440}
                    actionBotLabel="Quick Add"
                    actionBotHref="#quickAdd"
                    actionBotDataToggle="modal"
                  />
                ))}
              </TfSwiper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
