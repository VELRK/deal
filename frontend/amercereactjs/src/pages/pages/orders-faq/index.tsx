import PageTitle from "@/components/pages/orders-faq/PageTitle";
import OrdersFaqContent from "@/components/pages/orders-faq/OrdersFaqContent";
import PageMeta from "@/components/common/PageMeta";

const PageOrdersFaq = () => {
  return (
    <>
      <PageMeta
        title="Orders FAQs | 2Deal"
        description="Find answers to frequently asked questions about 2Deal orders, custom tailoring measurements, Aari embroidery timetables, bulk orders, and return policies."
      />
      <PageTitle />
      <OrdersFaqContent />
    </>
  );
};

export default PageOrdersFaq;
