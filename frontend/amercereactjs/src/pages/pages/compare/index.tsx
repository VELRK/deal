import PageTitle from "@/components/pages/compare/PageTitle";
import Compare from "@/components/pages/compare/Compare";
import PageMeta from "@/components/common/PageMeta";

const ComparePage = () => {
  return (
    <>
      <PageMeta
        title={"Compare"}
        description={"Shop incense, soaps, and food products online."}
      />
      <PageTitle />
      <Compare />
    </>
  );
};

export default ComparePage;
