import PageTitle from "@/components/shop/track-order/PageTitle";
import OrderTracking from "@/components/shop/track-order/OrderTracking";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Track order",
  "Enter your details to check the status of your order.",
);

const TrackOrderPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <OrderTracking />
    </>
  );
};

export default TrackOrderPage;
