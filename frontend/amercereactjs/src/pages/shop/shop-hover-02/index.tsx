import { Link } from "react-router-dom";

import Shop from "@/components/shop/shop-default/Shop";
import PageMeta from "@/components/common/PageMeta";
import {
  SHOP_LISTING_DESCRIPTION,
  shopRouteMetadata,
} from "@/lib/metadata/shop";

const pageMeta = shopRouteMetadata(
  "Shop — Product hover 02",
  SHOP_LISTING_DESCRIPTION,
);

export default function Page() {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      {/* Page Title */}
      <section className="section-page-title text-center flat-spacing-2 pb-0">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link to={`/`} className="text-caption-01 cl-text-3 link">
                Home
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <p className="text-caption-01">Tops &amp; Shirts</p>
            </div>
            <h3>Tops &amp; Shirts</h3>
            <p className="text-body-1 cl-text-2">
              Step into our Tops &amp; Shirts Collection, where elegance meets
              confidence in styles
              <br className="d-none d-lg-block" />
              that inspire every moment.
            </p>
          </div>
        </div>
      </section>
      <Shop variant={["shopHover02"]} />
      {/* /Page Title */}
    </>
  );
}
