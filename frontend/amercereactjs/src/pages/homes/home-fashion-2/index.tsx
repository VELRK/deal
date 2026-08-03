import TopBar3 from "@/components/topBars/TopBar3";
import Header1 from "@/components/headers/Header1";
import Footer9 from "@/components/footers/Footer9";
import Hero from "@/components/homes/home-fashion-2/Hero";
import Category from "@/components/homes/home-fashion-2/Category";
import Offers from "@/components/homes/home-fashion-2/Offers";
import Products from "@/components/homes/home-fashion-2/Products";
import BestSellers from "@/components/homes/home-fashion-2/BestSellers";
import InfiniteSlide from "@/components/homes/home-fashion-2/InfiniteSlide";
import Testimonials from "@/components/homes/home-fashion-2/Testimonials";
import OfferPopup from "@/components/homes/home-fashion-2/OfferPopup";
import PageMeta from "@/components/common/PageMeta";
import RecentlyViewed from "@/components/shop-details/RecentlyViewed";
import OurStory from "@/components/homes/home-fashion-2/OurStory";
import Features from "@/components/homes/home-fashion-2/Features";
import ServicesBanner from "@/components/homes/home-fashion-2/ServicesBanner";
import AppDownload from "@/components/homes/home-fashion-2/AppDownload";
import { useSeoPage, useSiteSettings } from "@/hooks/useApi";

export default function HomeFashion2Page() {
  const { settings } = useSiteSettings();
  const seoPage = useSeoPage("home");
  const siteName = settings?.site_name ?? "ShopKart";
  const title = seoPage?.meta_title || settings?.meta_title || `${siteName} - Incense Sticks, Soaps & Food Products`;
  const description = seoPage?.meta_description || settings?.meta_description || settings?.meta_desc || `Shop Incense Sticks, Dhoop Sticks, Sambrani Cones, Soaps and Food Products at ${siteName}.`;

  return (
    <div style={{ overflowX: "hidden", width: "100%", maxWidth: "100vw" }}>
      <PageMeta
        title={title}
        description={description}
        keywords={seoPage?.meta_keywords || settings?.meta_keywords}
        image={seoPage?.og_image || settings?.seo_og_image}
        robots={seoPage?.robots}
      />
      <TopBar3 />
      <Header1 />
      <main>
        <Hero />
        <Category />
        <Products />
        <BestSellers />

        <OurStory />
        <InfiniteSlide />
        <Offers />

        <Testimonials />
        {/* <Gallery /> */}
        <RecentlyViewed />
        <ServicesBanner />

        <Features />

        <AppDownload />

      </main>
      <Footer9 />
      <OfferPopup />
    </div>
  );
}
