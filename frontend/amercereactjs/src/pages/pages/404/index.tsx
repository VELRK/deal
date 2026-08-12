import Section404 from "@/components/pages/404/Section404";
import PageMeta from "@/components/common/PageMeta";

const NotFoundPage = () => {
  return (
    <>
      <PageMeta
        title={"404"}
        description={"Shop incense, soaps, and food products online."}
      />
      <Section404 />
    </>
  );
};

export default NotFoundPage;
