import IndexPage from "./homes/home-fashion-2/index";
import MiniPopup from "@/components/modals/MiniPopup";
import { miniPopupProduct } from "@/data/products/products";
import PageMeta from "@/components/common/PageMeta";
export default function Page() {
  return (
    <>
      <PageMeta
        title="Index | 2Deal"
        description="2Deal - Online Purchase"
      />
      <IndexPage />
      <MiniPopup product={miniPopupProduct} />
    </>
  );
}
