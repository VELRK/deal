import PageTitle from "@/components/shop/login/PageTitle";
import Log from "@/components/shop/login/Log";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Login",
  "Sign in to your account to track orders, wishlists, and saved addresses.",
);

const LoginPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <Log />
    </>
  );
};

export default LoginPage;
