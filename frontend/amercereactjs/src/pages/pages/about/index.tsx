import PageTitle from "@/components/pages/about/PageTitle";
import AboutContent from "@/components/pages/about/AboutContent";
import PageMeta from "@/components/common/PageMeta";

const AboutPage = () => {
  return (
    <>
      <PageMeta
        title={"About Us | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"Welcome to 2Deal, your one-stop destination for Incense Sticks, Dhoop Sticks, Sambrani Cones, Soaps and Food Products."}
      />
      <PageTitle />
      <AboutContent />
    </>
  );
};

export default AboutPage;
