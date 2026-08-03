import InvoiceContent from "@/components/pages/invoice/InvoiceContent";
import PageMeta from "@/components/common/PageMeta";

const InvoicePage = () => {
  return (
    <>
      <PageMeta
        title={"Invoice | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <InvoiceContent />
    </>
  );
};

export default InvoicePage;
