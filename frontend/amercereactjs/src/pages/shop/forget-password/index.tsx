import PageTitle from "@/components/shop/forget-password/PageTitle";
import Log from "@/components/shop/forget-password/Log";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Forgot password",
  "Request a link or code to reset your account password.",
);

const ForgetPasswordPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <Log />
    </>
  );
};

export default ForgetPasswordPage;
