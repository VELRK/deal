import PageTitle from "@/components/shop/view-cart/PageTitle";
import ShoppingCart from "@/components/shop/view-cart/ShoppingCart";
import MayBe from "@/components/shop/view-cart/MayBe";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "View cart",
  "Review items in your bag, apply discounts, and proceed to checkout.",
);

const ViewCartPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <ShoppingCart />
      <MayBe />
    </>
  );
};

export default ViewCartPage;
