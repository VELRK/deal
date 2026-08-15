import PageTitle from "@/components/pages/contact/PageTitle";
import Contact from "@/components/pages/contact/Contact";
import PageMeta from "@/components/common/PageMeta";

const ContactPage = () => {
  return (
    <>
      <PageMeta
        title={"Contact Us"}
        description={"Shop incense, soaps, and food products online."}
      />
      <PageTitle />
      <Contact />
    </>
  );
};

export default ContactPage;
