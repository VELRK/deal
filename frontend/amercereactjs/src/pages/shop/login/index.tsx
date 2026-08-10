import Log from "@/components/shop/login/Log";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata("Login", "Continue with your mobile number.");

const LoginPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <Log />
    </>
  );
};

export default LoginPage;
