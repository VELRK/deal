import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageMeta
        title="Terms & Conditions | 2Deal E-Commerce"
        description="Read the terms and conditions for using the 2Deal E-Commerce mobile application and services."
      />

      <style>{`
        .policy-hero {
          background: linear-gradient(135deg, #eaf9f8 0%, #d4f2f1 100%);
          padding: 60px 0 50px;
          text-align: center;
          border-bottom: 1px solid rgba(62,193,188,0.08);
        }
        .policy-breadcrumb {
          font-size: 13px;
          color: #888;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .policy-breadcrumb a {
          color: #3ec1bc;
          text-decoration: none;
        }
        .policy-breadcrumb a:hover { text-decoration: underline; }
        .policy-breadcrumb span { color: #bbb; }
        .policy-hero-title {
          font-size: 36px;
          font-weight: 700;
          color: #111;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
        }
        .policy-hero-sub {
          font-size: 15px;
          color: #666;
          margin: 0;
        }
        .policy-wrap {
          padding: 60px 0 80px;
          background: #fff;
        }
        .policy-sidebar {
          position: sticky;
          top: 90px;
        }
        .policy-toc {
          background: #eaf9f8;
          border-left: 3px solid #3ec1bc;
          border-radius: 8px;
          padding: 24px 20px;
        }
        .policy-toc-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #3ec1bc;
          margin: 0 0 14px;
        }
        .policy-toc ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .policy-toc ul li a {
          font-size: 13px;
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
          line-height: 1.4;
          display: block;
        }
        .policy-toc ul li a:hover { color: #3ec1bc; }
        .policy-content h2 {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin: 48px 0 14px;
          padding-top: 8px;
          border-top: 1px solid #c8eeed;
          scroll-margin-top: 100px;
        }
        .policy-content h2:first-child { margin-top: 0; border-top: none; }
        .policy-content h3 {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin: 22px 0 8px;
        }
        .policy-content p {
          font-size: 14.5px;
          color: #555;
          line-height: 1.8;
          margin: 0 0 14px;
        }
        .policy-content ul {
          padding-left: 20px;
          margin: 0 0 14px;
        }
        .policy-content ul li {
          font-size: 14.5px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 4px;
        }
        .policy-info-card {
          background: #f4fcfc;
          border: 1px solid rgba(62,193,188,0.12);
          border-radius: 10px;
          padding: 20px 22px;
          margin-bottom: 36px;
        }
        .policy-info-card p { margin: 0; color: #444; }
        .policy-info-card strong { color: #3ec1bc; }
        .policy-highlight-box {
          background: #f0fbfb;
          border: 1px solid rgba(62,193,188,0.1);
          border-left: 4px solid #3ec1bc;
          border-radius: 6px;
          padding: 16px 20px;
          margin: 16px 0 20px;
        }
        .policy-highlight-box p { margin: 0; font-size: 14px; color: #444; }
        .policy-contact-box {
          background: linear-gradient(135deg, #3ec1bc 0%, #2da19d 100%);
          border-radius: 12px;
          padding: 30px;
          color: #fff;
          text-align: center;
          margin-top: 48px;
        }
        .policy-contact-box h3 { color: #fff; font-size: 18px; margin: 0 0 10px; }
        .policy-contact-box p { color: rgba(255,255,255,0.88); font-size: 14px; margin: 0 0 16px; }
        .policy-contact-box a {
          display: inline-block;
          background: #fff;
          color: #3ec1bc;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .policy-contact-box a:hover { transform: translateY(-2px); }
        @media (max-width: 767px) {
          .policy-hero { padding: 40px 0 36px; }
          .policy-hero-title { font-size: 26px; }
          .policy-wrap { padding: 40px 0 60px; }
          .policy-sidebar { display: none; }
        }
      `}</style>

      {/* Hero */}
      <div className="policy-hero">
        <div className="container">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Terms &amp; Conditions</span>
          </div>
          <h1 className="policy-hero-title">Terms &amp; Conditions</h1>
          <p className="policy-hero-sub">Last updated: August 2026 &nbsp;·&nbsp; 2Deal</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="policy-wrap">
        <div className="container">
          <div className="row">

            {/* Sidebar TOC */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="policy-sidebar">
                <div className="policy-toc">
                  <p className="policy-toc-title">Contents</p>
                  <ul>
                    <li><a href="#services">1. App Services &amp; Usage</a></li>
                    <li><a href="#orders">2. Orders &amp; Payments</a></li>
                    <li><a href="#returns">3. Returns &amp; Refunds</a></li>
                    <li><a href="#delivery">4. Delivery &amp; Notifications</a></li>
                    <li><a href="#ip">5. Intellectual Property</a></li>
                    <li><a href="#liability">6. Limitation of Liability</a></li>
                    <li><a href="#privacy">7. Privacy &amp; Data Protection</a></li>
                    <li><a href="#changes">8. Changes to Terms</a></li>
                    <li><a href="#contact">9. Contact Information</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">
              <div className="policy-content">

                <div className="policy-info-card">
                  <p>Welcome to <strong>2Deal</strong>, an e-commerce mobile application operated by Golden2Deal (M) Sdn Bhd. By downloading our app, accessing our website, or placing an order with us, you agree to the following Terms &amp; Conditions. Please read them carefully.</p>
                </div>

                <p><strong>Golden2Deal (M) Sdn Bhd (1429727-A)</strong><br />
                  Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A,<br />
                  Kawasan Industri Taman Bukit Maluri, 52100 Kepong, Kuala Lumpur.<br />
                  <strong>Contact:</strong> golden2deal@gmail.com</p>

                <h2 id="services">1. App Services &amp; Usage</h2>
                <p>2Deal provides a digital platform where users can:</p>
                <ul>
                  <li>Browse featured products, offers, and categories.</li>
                  <li>Search and filter items by price, brand, and category.</li>
                  <li>Add products to a virtual shopping cart.</li>
                  <li>Sign up for an account to track orders and save preferences.</li>
                </ul>
                <p>All products and services displayed on our platform are subject to availability. Users must ensure that they do not misuse the app or attempt unauthorized access to our systems.</p>

                <h2 id="orders">2. Orders &amp; Payments</h2>
                <ul>
                  <li>Orders are confirmed only after successful payment processing.</li>
                  <li>We reserve the right to refuse or cancel any order due to incorrect pricing, unavailable items, or suspected fraudulent activity.</li>
                  <li>The app supports various payment methods, including credit/debit cards, online banking, and e-wallets.</li>
                </ul>
                <div className="policy-highlight-box">
                  <p><strong>Integrated Payment Gateway:</strong> We use Fiuu as our payment gateway to facilitate secure transactions. All payment data is processed securely through Fiuu.</p>
                </div>

                <h2 id="returns">3. Returns &amp; Refunds</h2>
                <p>At 2Deal, customer satisfaction is our priority. We offer refunds under the following conditions:</p>
                <ul>
                  <li><strong>Damaged Products:</strong> If the product you received is damaged upon delivery.</li>
                  <li><strong>Undelivered Products:</strong> If the product you ordered was not delivered within the estimated time.</li>
                </ul>
                <p>To request a refund, please contact us within 7 days of receiving the product or the expected delivery date. Approved refunds will be processed within 7 business days to your original payment method.</p>

                <h2 id="delivery">4. Delivery &amp; Notifications</h2>
                <ul>
                  <li>Once payment is confirmed, the order goes to our backend system, and the seller is notified to pack and ship.</li>
                  <li>Users will receive updates via email, SMS, or in-app alerts regarding their order status.</li>
                  <li>Our app integrates with logistics APIs to provide real-time shipping tracking.</li>
                  <li>Delivery delays caused by third-party logistics or unforeseen circumstances are beyond our direct control, but our support team will assist you in tracking your items.</li>
                </ul>

                <h2 id="ip">5. Intellectual Property</h2>
                <p>All app content including images, logos, UI designs, and text content are the property of Golden2Deal (M) Sdn Bhd and may not be copied, reproduced, or used without written permission.</p>

                <h2 id="liability">6. Limitation of Liability</h2>
                <p>Golden2Deal (M) Sdn Bhd shall not be liable for:</p>
                <ul>
                  <li>Minor color variations in product photos due to screen settings.</li>
                  <li>Delays beyond our reasonable control caused by third-party logistics.</li>
                  <li>Indirect or incidental damages arising from the use of our app or products.</li>
                </ul>

                <h2 id="privacy">7. Privacy &amp; Data Protection</h2>
                <p>We are committed to protecting your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA). The information you share with us (such as your address and contact details) is used for order processing, support, and necessary communications.</p>
                <p>
                  <Link to="/return-refund" style={{ color: "#3ec1bc", fontWeight: 600 }}>
                    View our full Privacy Policy →
                  </Link>
                </p>

                <h2 id="changes">8. Changes to Terms</h2>
                <p>We reserve the right to update or modify these Terms &amp; Conditions at any time. Any changes will be posted within the app or website, and where appropriate, notified to you via email.</p>

                <h2 id="contact">9. Contact Information</h2>
                <div className="policy-contact-box">
                  <h3>Questions or Support?</h3>
                  <p>
                    Golden2Deal (M) Sdn Bhd<br />
                    Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A,<br />
                    Kawasan Industri Taman Bukit Maluri, 52100 Kepong, KL.<br />
                  </p>
                  <a href="mailto:golden2deal@gmail.com">Email Us: golden2deal@gmail.com</a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
