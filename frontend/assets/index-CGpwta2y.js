import{j as e,L as s}from"./index-mMauejWE.js";import{P as i}from"./PageMeta-Bi9I5LXm.js";function t(){return e.jsx(e.Fragment,{children:e.jsx("section",{className:"section-page-title text-center flat-spacing-2 pb-0",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(s,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01",children:"About Us"})]}),e.jsx("h3",{children:"About Us"}),e.jsxs("p",{className:"text-body-1 cl-text-2",children:["Malaysia's trusted destination for quality incense, lifestyle essentials,",e.jsx("br",{className:"d-none d-lg-block"}),"and authentic products."]})]})})})})}function a(){return e.jsxs("section",{className:"about-us-section bg-light-pink-subtle",children:[e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"about-container",children:[e.jsx("div",{className:"about-hero-card",children:e.jsx("div",{className:"row g-0 align-items-center",children:e.jsx("div",{className:"col-lg-12",children:e.jsxs("div",{className:"about-hero-content",children:[e.jsx("span",{className:"about-subtitle",children:"Who We Are"}),e.jsx("h2",{className:"about-hero-title",children:"Welcome to Golden2Deal (M) Sdn Bhd"}),e.jsxs("div",{className:"about-hero-text",children:[e.jsx("p",{children:"We are driven by a simple mission: to deliver quality products with unmatched service. Since our inception, we have grown into a trusted name in the market by putting our customers first and maintaining the highest standards in everything we do."}),e.jsx("p",{children:"Our team is built on integrity, commitment, and innovation. We believe in long-term relationships and work closely with our clients and partners to ensure satisfaction at every step. At Pathi, it’s not just about selling—it’s about delivering value."})]}),e.jsx("h4",{className:"mt-4 mb-3 fs-5 fw-bold text-dark",children:"Our Products"}),e.jsxs("div",{className:"products-overview",children:[e.jsx("span",{className:"product-badge",children:"Incense Sticks"}),e.jsx("span",{className:"product-badge",children:"Dhoop Sticks"}),e.jsx("span",{className:"product-badge",children:"Sambrani Cones"}),e.jsx("span",{className:"product-badge",children:"Soaps"}),e.jsx("span",{className:"product-badge",children:"Food Products"})]})]})})})}),e.jsx("div",{className:"section-heading-custom",children:e.jsx("h3",{className:"section-heading-title",children:"E-Commerce Experience"})}),e.jsxs("div",{className:"specialty-grid",children:[e.jsxs("div",{className:"specialty-card",children:[e.jsx("div",{className:"specialty-icon-box",children:"🔧"}),e.jsx("h4",{className:"specialty-title",children:"User Interface (UI)"}),e.jsx("p",{className:"specialty-desc",children:"Shows featured products, offers, and categories. Users can search for products and filter by price, category, brand, etc."})]}),e.jsxs("div",{className:"specialty-card",children:[e.jsx("div",{className:"specialty-icon-box",children:"🛒"}),e.jsx("h4",{className:"specialty-title",children:"Shopping Cart"}),e.jsx("p",{className:"specialty-desc",children:"Users can add products to a virtual shopping cart. They can review their cart, update quantities, or remove items before checkout."})]}),e.jsxs("div",{className:"specialty-card",children:[e.jsx("div",{className:"specialty-icon-box",children:"💳"}),e.jsx("h4",{className:"specialty-title",children:"Checkout Process"}),e.jsx("p",{className:"specialty-desc",children:"Users enter their shipping address and payment details. The app may offer various payment methods: credit/debit card, PayPal, UPI, etc."})]}),e.jsxs("div",{className:"specialty-card",children:[e.jsx("div",{className:"specialty-icon-box",children:"🔐"}),e.jsx("h4",{className:"specialty-title",children:"Authentication & Accounts"}),e.jsx("p",{className:"specialty-desc",children:"Users can sign up or log in to track orders and save preferences. Some apps also offer a guest checkout."})]}),e.jsxs("div",{className:"specialty-card",children:[e.jsx("div",{className:"specialty-icon-box",children:"🚚"}),e.jsx("h4",{className:"specialty-title",children:"Order Processing"}),e.jsx("p",{className:"specialty-desc",children:"Once payment is confirmed, the order goes to the backend system. The seller is notified to pack and ship the order."})]}),e.jsxs("div",{className:"specialty-card",children:[e.jsx("div",{className:"specialty-icon-box",children:"📦"}),e.jsx("h4",{className:"specialty-title",children:"Delivery & Notifications"}),e.jsx("p",{className:"specialty-desc",children:"Users get notified via email, SMS, or in-app alerts. The app can integrate with logistics APIs to track shipping."})]})]}),e.jsx("div",{className:"twin-sections",children:e.jsxs("div",{className:"row g-4",children:[e.jsxs("div",{className:"col-md-6",children:[e.jsxs("h4",{className:"twin-column-title",children:[e.jsx("span",{className:"twin-column-title-icon",children:"✓"}),"Why Choose Us?"]}),e.jsxs("ul",{className:"premium-list",children:[e.jsx("li",{children:"Trusted quality and genuine products"}),e.jsx("li",{children:"Competitive pricing"}),e.jsx("li",{children:"Customer-focused service"}),e.jsx("li",{children:"Timely delivery and professional support"}),e.jsx("li",{children:"Quality Assurance"}),e.jsx("li",{children:"Customer-Centric Approach"}),e.jsx("li",{children:"On-Time Delivery"}),e.jsx("li",{children:"Experience & Expertise"})]})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsxs("h4",{className:"twin-column-title",children:[e.jsx("span",{className:"twin-column-title-icon",children:"🛡️"}),"Privacy & Security"]}),e.jsx("p",{className:"text-muted mb-0 lh-lg",children:"As an e-commerce mobile application operated by Golden2Deal (M) Sdn Bhd, we are committed to protecting your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application."}),e.jsxs("div",{className:"policy-alert",children:[e.jsx("strong",{children:"Your Trust Matters:"})," We employ industry-standard encryption and security measures to ensure your data is always safe with us."]})]})]})}),e.jsxs("div",{className:"about-store-card",children:[e.jsx("div",{className:"store-icon-wrapper",children:"🏢"}),e.jsx("h4",{className:"store-title",children:"Contact 2Deal"}),e.jsxs("div",{className:"store-address",children:[e.jsx("strong",{children:"GOLDEN 2 DEAL (M) SDN. BHD. (1429727-A)"}),e.jsx("br",{}),"Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong Kuala Lumpur.",e.jsx("br",{}),"Malaysia"]}),e.jsxs("div",{className:"store-contact-row",children:[e.jsxs("div",{className:"store-contact-box",children:["📞 Phone:",e.jsx("a",{href:"tel:[Your Phone Number]",className:"store-contact-link",children:"[Your Phone Number]"})]}),e.jsxs("div",{className:"store-contact-box",children:["✉️ Email:",e.jsx("a",{href:"mailto:golden2deal@gmail.com",className:"store-contact-link",children:"golden2deal@gmail.com"})]})]})]})]})]})}const n=()=>e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"About Us",description:"Welcome to 2Deal, your one-stop destination for Incense Sticks, Dhoop Sticks, Sambrani Cones, Soaps and Food Products."}),e.jsx(t,{}),e.jsx(a,{})]});export{n as default};
