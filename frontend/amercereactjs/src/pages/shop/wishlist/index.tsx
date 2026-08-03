import PageTitle from "@/components/shop/wishlist/PageTitle";
import Wishlist from "@/components/shop/wishlist/Wishlist";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Wishlist",
  "Review and manage products you have saved for later.",
);

const WishlistPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <Wishlist />
    </>
  );
};

export default WishlistPage;
