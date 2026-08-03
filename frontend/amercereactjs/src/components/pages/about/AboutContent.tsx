function AboutContent() {
  return (
    <section className="about-us-section bg-light-pink-subtle">
      {/* Self-contained Premium Styles */}
      <style>{`
        .bg-light-pink-subtle {
          background-color: #ffffff;
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
          box-shadow: 0 6px 24px rgba(62, 193, 188, 0.03);
          border: 1px solid rgba(62, 193, 188, 0.05);
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
            display: none; /* Hide on mobile to focus on text */
          }
        }

        .about-subtitle {
          font-size: 14px;
          font-weight: 700;
          color: #3ec1bc;
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
          background-color: #3ec1bc;
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
        }

        .specialty-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 28px rgba(62, 193, 188, 0.06);
          border-color: rgba(62, 193, 188, 0.1);
        }

        .specialty-icon-box {
          width: 50px;
          height: 50px;
          background: rgba(62, 193, 188, 0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
          color: #3ec1bc;
          transition: all 0.3s ease;
        }

        .specialty-card:hover .specialty-icon-box {
          background: #3ec1bc;
          color: #ffffff;
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

        /* Twin Lists */
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
          border-bottom: 2px solid rgba(62, 193, 188, 0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .twin-column-title-icon {
          color: #3ec1bc;
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
          color: #3ec1bc;
          font-weight: bold;
        }

        /* Products Overview Grid */
        .products-overview {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }

        .product-badge {
          background: rgba(62, 193, 188, 0.08);
          color: #3ec1bc;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(62, 193, 188, 0.1);
        }

        /* Policy Alert */
        .policy-alert {
          background: #ffffff;
          border-left: 4px solid #3ec1bc;
          padding: 20px;
          border-radius: 0 12px 12px 0;
          font-size: 14px;
          color: #555555;
          margin-top: 40px;
          line-height: 1.6;
        }

        /* Store Location Card */
        .about-store-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 6px 24px rgba(62, 193, 188, 0.03);
          border: 1px solid rgba(62, 193, 188, 0.05);
          text-align: center;
        }

        .store-icon-wrapper {
          width: 50px;
          height: 50px;
          background: rgba(62, 193, 188, 0.08);
          color: #3ec1bc;
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

        .store-contact-row {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .store-contact-box {
          font-size: 15px;
          color: #111111;
          font-weight: 600;
          background: rgba(62, 193, 188, 0.08);
          padding: 10px 24px;
          border-radius: 30px;
          border: 1px solid rgba(62, 193, 188, 0.1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .store-contact-link {
          color: #3ec1bc;
          text-decoration: none;
          transition: color 0.2s;
        }

        .store-contact-link:hover {
          color: #3ec1bc;
          text-decoration: underline;
        }
      `}</style>

      <div className="about-container">
        {/* Intro Hero Section */}
        <div className="about-hero-card">
          <div className="row g-0 align-items-center">
            <div className="col-lg-12">
              <div className="about-hero-content">
                <span className="about-subtitle">Who We Are</span>
                <h2 className="about-hero-title">Welcome to Golden2Deal (M) Sdn Bhd</h2>
                <div className="about-hero-text">
                  <p>
                    We are driven by a simple mission: to deliver quality products with unmatched service. Since our inception, we have grown into a trusted name in the market by putting our customers first and maintaining the highest standards in everything we do.
                  </p>
                  <p>
                    Our team is built on integrity, commitment, and innovation. We believe in long-term relationships and work closely with our clients and partners to ensure satisfaction at every step. At Pathi, it’s not just about selling—it’s about delivering value.
                  </p>
                </div>
                
                <h4 className="mt-4 mb-3 fs-5 fw-bold text-dark">Our Products</h4>
                <div className="products-overview">
                  <span className="product-badge">Incense Sticks</span>
                  <span className="product-badge">Dhoop Sticks</span>
                  <span className="product-badge">Sambrani Cones</span>
                  <span className="product-badge">Soaps</span>
                  <span className="product-badge">Food Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* E-Commerce App Features Section */}
        <div className="section-heading-custom">
          <h3 className="section-heading-title">E-Commerce Experience</h3>
        </div>

        <div className="specialty-grid">
          {/* UI */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🔧</div>
            <h4 className="specialty-title">User Interface (UI)</h4>
            <p className="specialty-desc">
              Shows featured products, offers, and categories. Users can search for products and filter by price, category, brand, etc.
            </p>
          </div>

          {/* Cart */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🛒</div>
            <h4 className="specialty-title">Shopping Cart</h4>
            <p className="specialty-desc">
              Users can add products to a virtual shopping cart. They can review their cart, update quantities, or remove items before checkout.
            </p>
          </div>

          {/* Checkout */}
          <div className="specialty-card">
            <div className="specialty-icon-box">💳</div>
            <h4 className="specialty-title">Checkout Process</h4>
            <p className="specialty-desc">
              Users enter their shipping address and payment details. The app may offer various payment methods: credit/debit card, PayPal, UPI, etc.
            </p>
          </div>

          {/* Auth */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🔐</div>
            <h4 className="specialty-title">Authentication &amp; Accounts</h4>
            <p className="specialty-desc">
              Users can sign up or log in to track orders and save preferences. Some apps also offer a guest checkout.
            </p>
          </div>

          {/* Orders */}
          <div className="specialty-card">
            <div className="specialty-icon-box">🚚</div>
            <h4 className="specialty-title">Order Processing</h4>
            <p className="specialty-desc">
              Once payment is confirmed, the order goes to the backend system. The seller is notified to pack and ship the order.
            </p>
          </div>

          {/* Delivery */}
          <div className="specialty-card">
            <div className="specialty-icon-box">📦</div>
            <h4 className="specialty-title">Delivery &amp; Notifications</h4>
            <p className="specialty-desc">
              Users get notified via email, SMS, or in-app alerts. The app can integrate with logistics APIs to track shipping.
            </p>
          </div>
        </div>

        {/* Twin Columns: Why Choose Us & Privacy */}
        <div className="twin-sections">
          <div className="row g-4">
            {/* Why Choose Us */}
            <div className="col-md-6">
              <h4 className="twin-column-title">
                <span className="twin-column-title-icon">✓</span>
                Why Choose Us?
              </h4>
              <ul className="premium-list">
                <li>Trusted quality and genuine products</li>
                <li>Competitive pricing</li>
                <li>Customer-focused service</li>
                <li>Timely delivery and professional support</li>
                <li>Quality Assurance</li>
                <li>Customer-Centric Approach</li>
                <li>On-Time Delivery</li>
                <li>Experience &amp; Expertise</li>
              </ul>
            </div>

            {/* Privacy Policy Note */}
            <div className="col-md-6">
              <h4 className="twin-column-title">
                <span className="twin-column-title-icon">🛡️</span>
                Privacy &amp; Security
              </h4>
              <p className="text-muted mb-0 lh-lg">
                As an e-commerce mobile application operated by Golden2Deal (M) Sdn Bhd, we are committed to protecting your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application.
              </p>
              
              <div className="policy-alert">
                <strong>Your Trust Matters:</strong> We employ industry-standard encryption and security measures to ensure your data is always safe with us.
              </div>
            </div>
          </div>
        </div>

        {/* Visit Our Store / Contact Details */}
        <div className="about-store-card">
          <div className="store-icon-wrapper">🏢</div>
          <h4 className="store-title">Contact 2Deal</h4>
          <div className="store-address">
            <strong>GOLDEN 2 DEAL (M) SDN. BHD. (1429727-A)</strong>
            <br />
            Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong Kuala Lumpur.
            <br />
            Malaysia
          </div>
          <div className="store-contact-row">
            <div className="store-contact-box">
              📞 Phone:
              <a href="tel:[Your Phone Number]" className="store-contact-link">
                [Your Phone Number]
              </a>
            </div>
            <div className="store-contact-box">
              ✉️ Email:
              <a href="mailto:golden2deal@gmail.com" className="store-contact-link">
                golden2deal@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutContent;

