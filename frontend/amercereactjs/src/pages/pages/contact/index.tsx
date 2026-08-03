import PageTitle from "@/components/pages/contact/PageTitle";
import Map from "@/components/pages/contact/Map";
import Contact from "@/components/pages/contact/Contact";
import PageMeta from "@/components/common/PageMeta";

const ContactPage = () => {
  return (
    <>
      <PageMeta
        title={"Contact Us | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <PageTitle />
      <Map />
      <Contact />
    </>
  );
};

export default ContactPage;
