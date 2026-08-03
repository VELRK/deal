import { j as e, L as i } from "./index-Bx-aQa3S.js"; import { P as a } from "./PageMeta-CMERlfd_.js"; function s() { return e.jsx(e.Fragment, { children: e.jsx("section", { className: "section-page-title text-center flat-spacing-2 pb-0", children: e.jsx("div", { className: "container", children: e.jsxs("div", { className: "main-page-title", children: [e.jsxs("div", { className: "breadcrumbs", children: [e.jsx(i, { to: "/", className: "text-caption-01 cl-text-3 link", children: "Home" }), e.jsx("i", { className: "icon icon-CaretRightThin cl-text-3" }), e.jsx("p", { className: "text-caption-01", children: "About Us" })] }), e.jsx("h3", { children: "About Us" }), e.jsxs("p", { className: "text-body-1 cl-text-2", children: ["Coimbatore's destination for elegant ethnic fashion, precision tailoring,", e.jsx("br", { className: "d-none d-lg-block" }), "and timeless handcrafted Aari embroidery."] })] }) }) }) }) } function t() {
  return e.jsxs("section", {
    className: "about-us-section bg-light-pink-subtle", children: [e.jsx("style", {
      children: `
        .bg-light-pink-subtle {
          background-color: #fdfafb;
          padding: 60px 0;
          font-family: 'Inter', sans-serif;
        }

        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        /* Hero Image/Text Layout */
        .about-hero-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(193, 16, 105, 0.03);
          border: 1px solid rgba(193, 16, 105, 0.05);
          margin-bottom: 50px;
        }

        .about-hero-image-wrap {
          height: 100%;
          min-height: 380px;
          background-image: url('/deal/frontend/assets/images/about-storefront.png');
          background-size: cover;
          background-position: center;
        }

        .about-hero-content {
          padding: 48px;
        }

        @media (max-width: 768px) {
          .about-hero-content {
            padding: 30px;
          }
          .about-hero-image-wrap {
            min-height: 250px;
          }
        }

        .about-subtitle {
          font-size: 14px;
          font-weight: 700;
          color: #c11069;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          display: inline-block;
        }

        .about-hero-title {
          font-size: 32px;
          font-weight: 700;
          color: #111111;
          line-height: 1.25;
          margin-bottom: 20px;
        }

        .about-hero-text {
          font-size: 16px;
          line-height: 1.8;
          color: #555555;
          margin-bottom: 16px;
        }

        /* Specialties Cards */
        .section-heading-custom {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-heading-title {
          font-size: 28px;
          font-weight: 700;
          color: #111111;
          position: relative;
          display: inline-block;
          padding-bottom: 12px;
        }

        .section-heading-title::after {
          content: '';
          position: absolute;
          width: 50px;
          height: 3px;
          background-color: #c11069;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .specialty-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }

        @media (max-width: 991px) {
          .specialty-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 575px) {
          .specialty-grid {
            grid-template-columns: 1fr;
          }
        }

        .specialty-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-align: center;
        }

        .specialty-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 28px rgba(193, 16, 105, 0.06);
          border-color: rgba(193, 16, 105, 0.1);
        }

        .specialty-icon-box {
          width: 60px;
          height: 60px;
          background: #faf0f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 20px auto;
          color: #c11069;
          transition: all 0.3s ease;
        }

        .specialty-card:hover .specialty-icon-box {
          background: #c11069;
          color: #ffffff;
          transform: scale(1.08);
        }

        .specialty-title {
          font-size: 18px;
          font-weight: 600;
          color: #111111;
          margin-bottom: 12px;
        }

        .specialty-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #666666;
          margin-bottom: 0;
        }

        /* Philosophy Callout Block */
        .philosophy-banner {
          background: linear-gradient(135deg, #c11069 0%, #920b4e 100%);
          border-radius: 20px;
          padding: 48px;
          color: #ffffff;
          text-align: center;
          box-shadow: 0 10px 30px rgba(193, 16, 105, 0.15);
          margin-bottom: 60px;
        }

        .philosophy-banner-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
        }

        .philosophy-banner-text {
          font-size: 16px;
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0.95;
        }

        .philosophy-callout {
          font-size: 18px;
          font-weight: 500;
          border-top: 1px dashed rgba(255, 255, 255, 0.2);
          padding-top: 20px;
          margin-top: 20px;
        }

        /* Twin Lists (Philosophy vs Why Choose Us) */
        .twin-sections {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.03);
          margin-bottom: 60px;
        }

        @media (max-width: 768px) {
          .twin-sections {
            padding: 24px;
          }
        }

        .twin-column-title {
          font-size: 20px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(193, 16, 105, 0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .twin-column-title-icon {
          color: #c11069;
          font-size: 22px;
        }

        .premium-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .premium-list li {
          position: relative;
          padding-left: 28px;
          font-size: 15px;
          color: #444444;
          line-height: 1.5;
        }

        .premium-list li::before {
          content: "✦";
          position: absolute;
          left: 0;
          color: #c11069;
          font-weight: bold;
        }

        /* Store Location Card */
        .about-store-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 6px 24px rgba(193, 16, 105, 0.03);
          border: 1px solid rgba(193, 16, 105, 0.05);
          text-align: center;
        }

        .store-icon-wrapper {
          width: 50px;
          height: 50px;
          background: #faf0f2;
          color: #c11069;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin: 0 auto 20px auto;
        }

        .store-title {
          font-size: 22px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 14px;
        }

        .store-address {
          font-size: 16px;
          color: #555555;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 24px auto;
        }

        .store-phone-box {
          font-size: 16px;
          color: #111111;
          font-weight: 600;
          display: inline-block;
          background: #faf0f2;
          padding: 10px 24px;
          border-radius: 30px;
          border: 1px solid rgba(193, 16, 105, 0.1);
        }

        .store-phone-link {
          color: #c11069;
          text-decoration: none;
          margin-left: 6px;
          transition: color 0.2s;
        }

        .store-phone-link:hover {
          color: #920b4e;
          text-decoration: underline;
        }
      `}), e.jsxs("div", { className: "about-container", children: [e.jsx("div", { className: "about-hero-card", children: e.jsxs("div", { className: "row g-0 align-items-stretch", children: [e.jsx("div", { className: "col-lg-5 col-md-12 d-none d-lg-block", children: e.jsx("div", { className: "about-hero-image-wrap" }) }), e.jsx("div", { className: "col-lg-7 col-md-12", children: e.jsxs("div", { className: "about-hero-content", children: [e.jsx("span", { className: "about-subtitle", children: "Welcome to our boutique" }), e.jsx("h2", { className: "about-hero-title", children: "2Deal" }), e.jsxs("div", { className: "about-hero-text", children: [e.jsx("p", { children: "We are your premier destination for elegant ethnic fashion, customized tailoring, and timeless handcrafted designs in Coimbatore." }), e.jsx("p", { children: "Located opposite the SNS Tech Arch on Sathy Main Road, Saravanampatti, we bring together traditional craftsmanship and modern styling to create outfits that celebrate every woman’s individuality." })] })] }) })] }) }), e.jsx("div", { className: "section-heading-custom", children: e.jsx("h3", { className: "section-heading-title", children: "What We Specialize In" }) }), e.jsxs("div", { className: "specialty-grid", children: [e.jsxs("div", { className: "specialty-card", children: [e.jsx("div", { className: "specialty-icon-box", children: "🛍️" }), e.jsx("h4", { className: "specialty-title", children: "Premium Saree Collections" }), e.jsx("p", { className: "specialty-desc", children: "Explore our handpicked curation of elegant festive and casual sarees representing fine craftsmanship." })] }), e.jsxs("div", { className: "specialty-card", children: [e.jsx("div", { className: "specialty-icon-box", children: "✂️" }), e.jsx("h4", { className: "specialty-title", children: "Customized Blouse Stitching" }), e.jsx("p", { className: "specialty-desc", children: "Flawless tailors design blouses customized according to your exact fit and style choices." })] }), e.jsxs("div", { className: "specialty-card", children: [e.jsx("div", { className: "specialty-icon-box", children: "🧵" }), e.jsx("h4", { className: "specialty-title", children: "Designer Salwar Tailoring" }), e.jsx("p", { className: "specialty-desc", children: "Stitching elegant salwar suits, anarkalis, and ethnic wear tailored precisely to your measurements." })] }), e.jsxs("div", { className: "specialty-card", children: [e.jsx("div", { className: "specialty-icon-box", children: "🪡" }), e.jsx("h4", { className: "specialty-title", children: "Bespoke Aari Embroidery" }), e.jsx("p", { className: "specialty-desc", children: "Timeless, handcrafted bridal and occasion embroidery customized for blouses and ethnic wear." })] }), e.jsxs("div", { className: "specialty-card", children: [e.jsx("div", { className: "specialty-icon-box", children: "✨" }), e.jsx("h4", { className: "specialty-title", children: "Traditional & Festive Wear" }), e.jsx("p", { className: "specialty-desc", children: "Made-to-order ethnic wear, carefully crafted to elevate your presence on your special celebrations." })] }), e.jsxs("div", { className: "specialty-card", children: [e.jsx("div", { className: "specialty-icon-box", children: "📞" }), e.jsx("h4", { className: "specialty-title", children: "Personalized Consultations" }), e.jsx("p", { className: "specialty-desc", children: "Collaborate directly with our design experts to map out design details and pick the perfect matching fits." })] })] }), e.jsxs("div", { className: "philosophy-banner", children: [e.jsx("h4", { className: "philosophy-banner-title", children: "Our Style Philosophy" }), e.jsx("p", { className: "philosophy-banner-text", children: "Our boutique is built on a passion for detail, comfort, and perfect fitting. Every design is thoughtfully tailored to reflect grace, confidence, and contemporary elegance while preserving the beauty of Indian tradition." }), e.jsx("div", { className: "philosophy-callout", children: '"We believe fashion is personal. That is why our tailoring and embroidery services are carefully customized to suit each customer’s preferences, measurements, and occasion needs."' })] }), e.jsx("div", { className: "twin-sections", children: e.jsxs("div", { className: "row g-4", children: [e.jsxs("div", { className: "col-md-6", children: [e.jsxs("h4", { className: "twin-column-title", children: [e.jsx("span", { className: "twin-column-title-icon", children: "🎨" }), "Style Philosophy"] }), e.jsx("p", { className: "text-muted small mb-3", children: "Whether you are looking for a silk saree, a fitted designer blouse, or custom bridal embroidery:" }), e.jsxs("ul", { className: "premium-list", children: [e.jsx("li", { children: "Traditional silhouettes that respect classic legacy" }), e.jsx("li", { children: "Modern fits designed for today's comfort and ease" }), e.jsx("li", { children: "Handcrafted detailing made with exquisite care" }), e.jsx("li", { children: "Premium quality fabrics sourced with attention" }), e.jsx("li", { children: "Elegant finishing to complete your signature look" })] })] }), e.jsxs("div", { className: "col-md-6", children: [e.jsxs("h4", { className: "twin-column-title", children: [e.jsx("span", { className: "twin-column-title-icon", children: "✓" }), "Why Choose Us"] }), e.jsx("p", { className: "text-muted small mb-3", children: "Experience fashion designed with tradition and stitched with precision:" }), e.jsxs("ul", { className: "premium-list", children: [e.jsx("li", { children: "Skilled tailoring and design expertise" }), e.jsx("li", { children: "Customized fitting solutions for all silhouettes" }), e.jsx("li", { children: "Exclusive and precise Aari embroidery work" }), e.jsx("li", { children: "Carefully curated saree and ready-made collections" }), e.jsx("li", { children: "Premium quality fabric selections" }), e.jsx("li", { children: "Friendly and helpful customer support desk" }), e.jsx("li", { children: "Elegant, high-quality, and affordable fashion choices" })] })] })] }) }), e.jsxs("div", { className: "about-store-card", children: [e.jsx("div", { className: "store-icon-wrapper", children: "📍" }), e.jsx("h4", { className: "store-title", children: "Visit Our Store" }), e.jsxs("div", { className: "store-address", children: [e.jsx("strong", { children: "2Deal" }), e.jsx("br", {}), "Opposite the SNS Tech Arch, Sathy Main Road,", e.jsx("br", {}), "Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India"] }), e.jsxs("div", { className: "store-phone-box", children: ["📞 Call Us:", " ", e.jsx("a", { href: "tel:+919597220129", className: "store-phone-link", children: "+91 95972 20129" })] })] })] })]
  })
} const n = () => e.jsxs(e.Fragment, { children: [e.jsx(a, { title: "About Us | 2Deal - Online Shopping Store", description: "Welcome to 2Deal, Coimbatore's destination for elegant ethnic fashion, precision tailoring, and bespoke Aari embroidery." }), e.jsx(s, {}), e.jsx(t, {})] }); export { n as default };
