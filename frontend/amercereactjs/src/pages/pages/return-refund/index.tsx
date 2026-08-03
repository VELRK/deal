import PageTitle from "@/components/pages/return-refund/PageTitle";
import ReturnRefundContent from "@/components/pages/return-refund/ReturnRefundContent";
import PageMeta from "@/components/common/PageMeta";

const ReturnRefundPage = () => {
  return (
    <>
      <PageMeta
        title="Return & Refund Policy | Indian Ladies Fashion"
        description="Read our Return and Refund Policy carefully before making a purchase. Find details about customized wear terms, sarees exchanges, defect reports, and cancellations."
      />
      <PageTitle />
      <ReturnRefundContent />
    </>
  );
};

export default ReturnRefundPage;
