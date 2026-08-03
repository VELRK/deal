import Footer9 from "@/components/footers/Footer9";
import CloseNavDropdownsOnRoute from "@/components/headers/CloseNavDropdownsOnRoute";
import Header1 from "@/components/headers/Header1";
import TopBar3 from "@/components/topBars/TopBar3";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CloseNavDropdownsOnRoute />
      <TopBar3 />
      <Header1 />
      {children}
      <Footer9 parentClass="tf-footer footer-s5 bg-white" />
      <FloatingWhatsApp />
    </>
  );
}
