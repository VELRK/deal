import Checkout from "@/components/shop/checkout/Checkout";
import PageTitle from "@/components/shop/checkout/PageTitle";
import MayBe from "@/components/shop/view-cart/MayBe";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Checkout",
  "Review your cart, shipping, and payment details to complete your order.",
);

export default function Page() {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <Checkout />
      <MayBe />
    </>
  );
}
