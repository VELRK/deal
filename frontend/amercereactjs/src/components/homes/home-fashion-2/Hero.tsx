import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { heroFashion2Slides } from "@/data/heros";
import { useBanners, apiImageUrl } from "@/hooks/useApi";
import type { ApiBanner } from "@/services/api";

function bannerSrc(b: ApiBanner): string {
  const url = b.image_url || b.image;
  if (!url) return "/frontend/assets/images/slider/fashion-2/slider-1.jpg";
  return apiImageUrl(url);
}

/* ── Skeleton shown while API is in flight ── */
function BannerSkeleton() {
  return (
    <div className="hero-banner-img custom-hero-banner" style={{ width: "100%", background: "#f0f0f0", position: "relative", overflow: "hidden" }}>
      {/* shimmer sweep */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
        animation: "sk-sweep 1.4s ease-in-out infinite",
      }} />
      {/* ghost text bottom-left */}
      <div style={{ position: "absolute", bottom: 48, left: 60, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ width: 120, height: 14, borderRadius: 4, background: "rgba(0,0,0,0.10)" }} />
        <div style={{ width: 280, height: 28, borderRadius: 4, background: "rgba(0,0,0,0.10)" }} />
        <div style={{ width: 160, height: 28, borderRadius: 4, background: "rgba(0,0,0,0.10)" }} />
        <div style={{ width: 110, height: 38, borderRadius: 40, background: "rgba(0,0,0,0.12)", marginTop: 4 }} />
      </div>
      <style>{`@keyframes sk-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

function Hero() {
  const { banners, loading } = useBanners();

  /* Show skeleton while loading */
  if (loading) {
    return (
      <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
        <style>{`
          .custom-hero-banner { height: 500px; }
          @media (max-width: 767px) { 
            .custom-hero-banner,
            .tf-slideshow,
            .tf-slideshow .swiper,
            .tf-slideshow .swiper-wrapper,
            .tf-slideshow .swiper-slide,
            .tf-slideshow .slideshow-wrap,
            .tf-slideshow .sw-slide-show {
              height: 220px !important;
            }
          }
        `}</style>
        <BannerSkeleton />
      </div>
    );
  }

  const slides = banners.length > 0
    ? banners.map((b) => ({
      img: bannerSrc(b),
      alt: b.title,
      subtitle: b.subtitle,
      title: b.title,
      ctaText: b.cta_text,
      ctaLink: b.cta_link,
    }))
    : heroFashion2Slides.map((s) => ({
      img: s.img,
      alt: s.alt ?? "Image",
      subtitle: s.subtitle,
      title: s.title,
      ctaText: s.ctaText,
      ctaLink: "/shop-default",
    }));

  return (
    <div className="tf-slideshow tf-btn-swiper-main hover-sw-nav">
      <style>{`
        .custom-hero-banner { height: 500px; }
        @media (max-width: 767px) { 
          .custom-hero-banner,
          .tf-slideshow,
          .tf-slideshow .swiper,
          .tf-slideshow .swiper-wrapper,
          .tf-slideshow .swiper-slide,
          .tf-slideshow .slideshow-wrap,
          .tf-slideshow .sw-slide-show {
            height: 220px !important;
          }
        }
      `}</style>
      <TfSwiper
        loop
        auto
        effect="fade"
        delay={3000}
        className="sw-slide-show slider_effect_fade"
        externalNavSelectors={{
          nextEl: ".tf-btn-swiper-main .nav-next-swiper",
          prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
        }}
        paginationClassName="sw-line-default tf-sw-pagination"
      >
        {slides.map((slide, idx) => {
          const titleParts = slide.title.split("\n");
          return (
            <div key={idx} className="slideshow-wrap">
              <Link to={slide.ctaLink} style={{ display: "block", width: "100%", height: "100%" }}>
                <div className="sld_image hero-banner-img custom-hero-banner" style={{ overflow: "hidden", width: "100%" }}>
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    width={817}
                    height={311}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/frontend/assets/images/slider/fashion-2/slider-1.jpg";
                    }}
                  />
                </div>
                <div className="sld_content pst-5" style={{ pointerEvents: "none" }}>
                  <div className="container">
                    <div className="content-sld_wrap">
                      <div className="heading d-none">
                        <p className="sub-text_sld text-body-1 fade-item fade-item-1 mb-15">
                          {slide.subtitle}
                        </p>
                        <p className="title_sld text-display fw-medium fade-item fade-item-2">
                          {titleParts[0]}
                          {titleParts[1] != null && (
                            <>
                              <br />
                              {titleParts[1]}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="fade-item fade-item-3 d-none">
                        <span className="tf-btn animate-btn">
                          {slide.ctaText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </TfSwiper>
      <div className="group-nav-action">
        <div className="container-full">
          <div className="d-flex align-items-center justify-content-between">
            <div className="tf-sw-nav-2 d-lg-flex d-none nav-prev-swiper" style={{ opacity: 0 }}>
              <i className="icon icon-ArrowLeft" aria-hidden />
            </div>
            <div className="tf-sw-nav-2 d-lg-flex d-none nav-next-swiper" style={{ opacity: 0 }}>
              <i className="icon icon-ArrowRight" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
