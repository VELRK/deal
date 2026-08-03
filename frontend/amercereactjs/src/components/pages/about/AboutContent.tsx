function AboutContent() {
  return (
    <section className="about-us-section bg-light-pink-subtle">
      {/* Self-contained Premium Styles */}
      <style>{`
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
          background-image: url('/frontend/assets/images/about-storefront.png');
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
      `}</style>

      <div className="about-container">
        {/* Intro Hero Section */}
        <div className="about-hero-card">
          <div className="row g-0 align-items-stretch">
            <div className="col-lg-5 col-md-12 d-none d-lg-block">
              <div className="about-hero-image-wrap" />
            </div>
            <div className="col-lg-7 col-md-12">
              <div className="about-hero-content">
                <span className="about-subtitle">Welcome to our boutique</span>
                <h2 className="about-hero-title">Indian Ladies Fashion</h2>
                <div className="about-hero-text">
                  <p>
                    We are your premier destination for elegant ethnic fashion, customized tailoring, and timeless handcrafted designs in Coimbatore.
                  </p>
                  <p>
                    Located opposite the SNS Tech Arch on Sathy Main Road, Saravanampatti, we bring together traditional craftsmanship and modern styling to create outfits that celebrate every woman’s individuality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties Section */}
        <div className="section-heading-custom">
          <h3 className="section-heading-title">What We Specialize In</h3>
        </div>

        <div className="specialty-grid">
          {/* Saree collections */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🛍️</div>
            <h4 className="specialty-title">Premium Saree Collections</h4>
            <p className="specialty-desc">
              Explore our handpicked curation of elegant festive and casual sarees representing fine craftsmanship.
            </p>
          </div>

          {/* Customized blouse */}
          <div className="specialty-card">
            <div className="specialty-icon-box">✂️</div>
            <h4 className="specialty-title">Customized Blouse Stitching</h4>
            <p className="specialty-desc">
              Flawless tailors design blouses customized according to your exact fit and style choices.
            </p>
          </div>

          {/* Designer salwar */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🧵</div>
            <h4 className="specialty-title">Designer Salwar Tailoring</h4>
            <p className="specialty-desc">
              Stitching elegant salwar suits, anarkalis, and ethnic wear tailored precisely to your measurements.
            </p>
          </div>

          {/* Bespoke Aari embroidery */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🪡</div>
            <h4 className="specialty-title">Bespoke Aari Embroidery</h4>
            <p className="specialty-desc">
              Timeless, handcrafted bridal and occasion embroidery customized for blouses and ethnic wear.
            </p>
          </div>

          {/* Traditional & Festive */}
          <div className="specialty-card">
            <div className="specialty-icon-box">✨</div>
            <h4 className="specialty-title">Traditional &amp; Festive Wear</h4>
            <p className="specialty-desc">
              Made-to-order ethnic wear, carefully crafted to elevate your presence on your special celebrations.
            </p>
          </div>

          {/* Consultations */}
          <div className="specialty-card">
            <div className="specialty-icon-box">📞</div>
            <h4 className="specialty-title">Personalized Consultations</h4>
            <p className="specialty-desc">
              Collaborate directly with our design experts to map out design details and pick the perfect matching fits.
            </p>
          </div>
        </div>

        {/* Philosophy Callout Banner */}
        <div className="philosophy-banner">
          <h4 className="philosophy-banner-title">Our Style Philosophy</h4>
          <p className="philosophy-banner-text">
            Our boutique is built on a passion for detail, comfort, and perfect fitting. Every design is thoughtfully tailored to reflect grace, confidence, and contemporary elegance while preserving the beauty of Indian tradition.
          </p>
          <div className="philosophy-callout">
            "We believe fashion is personal. That is why our tailoring and embroidery services are carefully customized to suit each customer’s preferences, measurements, and occasion needs."
          </div>
        </div>

        {/* Twin Columns: Philosophy details vs Why Choose Us */}
        <div className="twin-sections">
          <div className="row g-4">
            {/* Style Elements */}
            <div className="col-md-6">
              <h4 className="twin-column-title">
                <span className="twin-column-title-icon">🎨</span>
                Style Philosophy
              </h4>
              <p className="text-muted small mb-3">
                Whether you are looking for a silk saree, a fitted designer blouse, or custom bridal embroidery:
              </p>
              <ul className="premium-list">
                <li>Traditional silhouettes that respect classic legacy</li>
                <li>Modern fits designed for today's comfort and ease</li>
                <li>Handcrafted detailing made with exquisite care</li>
                <li>Premium quality fabrics sourced with attention</li>
                <li>Elegant finishing to complete your signature look</li>
              </ul>
            </div>

            {/* Why Choose Us */}
            <div className="col-md-6">
              <h4 className="twin-column-title">
                <span className="twin-column-title-icon">✓</span>
                Why Choose Us
              </h4>
              <p className="text-muted small mb-3">
                Experience fashion designed with tradition and stitched with precision:
              </p>
              <ul className="premium-list">
                <li>Skilled tailoring and design expertise</li>
                <li>Customized fitting solutions for all silhouettes</li>
                <li>Exclusive and precise Aari embroidery work</li>
                <li>Carefully curated saree and ready-made collections</li>
                <li>Premium quality fabric selections</li>
                <li>Friendly and helpful customer support desk</li>
                <li>Elegant, high-quality, and affordable fashion choices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visit Our Store */}
        <div className="about-store-card">
          <div className="store-icon-wrapper">📍</div>
          <h4 className="store-title">Visit Our Store</h4>
          <div className="store-address">
            <strong>Indian Ladies Fashion</strong>
            <br />
            Opposite the SNS Tech Arch, Sathy Main Road,
            <br />
            Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India
          </div>
          <div className="store-phone-box">
            📞 Call Us:{" "}
            <a href="tel:+919597220129" className="store-phone-link">
              +91 95972 20129
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutContent;
