import PageTitle from "@/components/pages/our-store/PageTitle";
import OurStore from "@/components/pages/our-store/OurStore";
import PageMeta from "@/components/common/PageMeta";

const OurStorePage = () => {
  return (
    <>
      <PageMeta
        title={"Our Store | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <PageTitle />
      <OurStore />
    </>
  );
};

export default OurStorePage;
