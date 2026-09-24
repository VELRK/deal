import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
import AffiliateHowItWorks from "@/components/pages/affiliate/AffiliateHowItWorks";
import AffiliateRegistrationForm from "@/components/pages/affiliate/AffiliateRegistrationForm";
import AffiliateFaqSection from "@/components/pages/affiliate/AffiliateFaqSection";
import AffiliateCtaBanner from "@/components/pages/affiliate/AffiliateCtaBanner";

export default function AffiliatePage() {
  const scrollToApply = () => {
    const el = document.getElementById("apply");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="affiliate-page-wrapper">
      <PageMeta
        title="Become an Affiliate | 2Deal Affiliate Program"
        description="Join our affiliate program and earn commission on every sale. Partner with 2Deal to earn up to 10% commission on handcrafted incense, sambrani, and lifestyle essentials."
        keywords="2deal affiliate, become an affiliate, earn commission on every sale, affiliate program malaysia, incense affiliate"
      />

      {/* Classic Page Header */}
      <section className="section-page-title text-center flat-spacing-2 pb-0" style={{ backgroundColor: "#ffffff", padding: "40px 0 20px" }}>
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs mb-3 d-flex justify-content-center align-items-center gap-2">
              <Link to="/" className="text-caption-01 cl-text-3 link" style={{ textDecoration: "none" }}>
                Home
              </Link>
              <span className="text-muted" style={{ fontSize: "12px" }}>&gt;</span>
              <p className="text-caption-01 m-0 text-dark fw-medium">Become an Affiliate</p>
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 600, color: "#111827", marginBottom: "10px" }}>
              Become an Affiliate
            </h2>
            <p className="text-body-1 cl-text-2" style={{ maxWidth: "600px", margin: "0 auto", color: "#64748b", fontSize: "16px" }}>
              Join our affiliate program and earn commission on every sale.
            </p>
          </div>
        </div>
      </section>
      <AffiliateRegistrationForm />
      {/* How it works 3-step section */}
      <AffiliateHowItWorks />

      {/* Brand & Agency Partnership Enquiry Form (UI Improved) */}


      {/* FAQs */}
      {/* <AffiliateFaqSection /> */}

      {/* CTA Banner */}
      <AffiliateCtaBanner onApplyClick={scrollToApply} />
    </div>
  );
}
