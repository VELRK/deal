import Log from "@/components/shop/register/Log";
import PageTitle from "@/components/shop/register/PageTitle";
import { shopRouteMetadata } from "@/lib/metadata/shop";
import PageMeta from "@/components/common/PageMeta";

const pageMeta = shopRouteMetadata(
  "Register",
  "Create your account to save favorites, checkout faster, and manage orders.",
);

const RegisterPage = () => {
  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTitle />
      <Log />
    </>
  );
};

export default RegisterPage;
