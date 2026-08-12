import InvoiceContent from "@/components/pages/invoice/InvoiceContent";
import PageMeta from "@/components/common/PageMeta";

const InvoicePage = () => {
  return (
    <>
      <PageMeta
        title={"Invoice"}
        description={"Shop incense, soaps, and food products online."}
      />
      <InvoiceContent />
    </>
  );
};

export default InvoicePage;
