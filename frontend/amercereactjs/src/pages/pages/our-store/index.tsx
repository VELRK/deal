import PageTitle from "@/components/pages/our-store/PageTitle";
import OurStore from "@/components/pages/our-store/OurStore";
import PageMeta from "@/components/common/PageMeta";

const OurStorePage = () => {
  return (
    <>
      <PageMeta
        title={"Our Store"}
        description={"Shop incense, soaps, and food products online."}
      />
      <PageTitle />
      <OurStore />
    </>
  );
};

export default OurStorePage;
