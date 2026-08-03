import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy | 2Deal E-Commerce"
        description="Learn how 2Deal collects, uses, and protects your personal information."
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
            <span>Privacy Policy</span>
          </div>
          <h1 className="policy-hero-title">Privacy Policy</h1>
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
                    <li><a href="#business-info">1. Business Information</a></li>
                    <li><a href="#info-collect">2. Information We Collect</a></li>
                    <li><a href="#how-we-use">3. How We Use Your Information</a></li>
                    <li><a href="#payment">4. Fiuu Payment Security</a></li>
                    <li><a href="#cookies">5. Cookies & Analytics</a></li>
                    <li><a href="#sharing">6. Sharing of Information</a></li>
                    <li><a href="#data-protection">7. Data Protection (PDPA)</a></li>
                    <li><a href="#promo">8. Promotional Communication</a></li>
                    <li><a href="#third-party">9. Third-Party Links</a></li>
                    <li><a href="#children">10. Children's Privacy</a></li>
                    <li><a href="#updates">11. Policy Updates</a></li>
                    <li><a href="#contact">12. Contact Us</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">
              <div className="policy-content">

                <div className="policy-info-card">
                  <p>Welcome to <strong>2Deal</strong>, an e-commerce mobile application. Your privacy is critically important to us. We are committed to protecting your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA) and ensuring a safe shopping experience.</p>
                </div>

                <h2 id="business-info">1. Business Information</h2>
                <p><strong>Golden2Deal (M) Sdn Bhd (1429727-A)</strong><br />
                  Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A,<br />
                  Kawasan Industri Taman Bukit Maluri, 52100 Kepong, Kuala Lumpur.</p>
                <p><strong>Email:</strong> golden2deal@gmail.com</p>

                <h2 id="info-collect">2. Information We Collect</h2>
                <p>We may collect the following information from users:</p>
                <h3>Personal Information</h3>
                <ul>
                  <li>Name</li>
                  <li>Mobile number</li>
                  <li>Email address</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment details (processed securely through the Fiuu payment gateway)</li>
                </ul>
                <h3>App &amp; Order Information</h3>
                <ul>
                  <li>Product selections and shopping cart data</li>
                  <li>Purchase and return history</li>
                  <li>In-app preferences</li>
                </ul>
                <h3>Technical Information</h3>
                <ul>
                  <li>IP address</li>
                  <li>Device information (OS, model)</li>
                  <li>App usage data, crash logs, and analytics</li>
                </ul>

                <h2 id="how-we-use">3. How We Use Your Information</h2>
                <p>Your information may be used to:</p>
                <ul>
                  <li>Process and deliver your orders</li>
                  <li>Manage your user account</li>
                  <li>Contact you regarding order processing, shipping, and returns</li>
                  <li>Improve the mobile app and customer experience</li>
                  <li>Send promotional offers (only if you've opted in)</li>
                  <li>Prevent fraud, enforce our Terms &amp; Conditions, and maintain security</li>
                </ul>

                <h2 id="payment">4. Fiuu Payment Security</h2>
                <p>We use <strong>Fiuu</strong> as our integrated payment gateway to process all transactions securely. We do not store complete debit/credit card information or bank credentials on our own servers.</p>
                <p>Fiuu collects and processes personal data necessary for payment processing. For more information on how Fiuu handles your personal data, please refer to their Privacy Policy at <a href="https://fiuu.com/privacy-policy/" target="_blank" rel="noreferrer" style={{color: '#3ec1bc'}}>https://fiuu.com/privacy-policy/</a>.</p>

                <h2 id="cookies">5. Cookies &amp; Analytics</h2>
                <p>Our app and website may use cookies and analytics tools to:</p>
                <ul>
                  <li>Improve functionality and track user sessions</li>
                  <li>Remember your login and shopping cart preferences</li>
                  <li>Analyze traffic to improve the user experience</li>
                </ul>

                <h2 id="sharing">6. Sharing of Information</h2>
                <p>We do not sell, rent, or trade your personal information.</p>
                <p>Information may only be shared with:</p>
                <ul>
                  <li>Delivery and logistics API partners (to track and deliver your shipping)</li>
                  <li>Fiuu Payment gateway and financial institutions</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                </ul>

                <h2 id="data-protection">7. Data Protection (PDPA Compliance)</h2>
                <p>We take appropriate technical and organizational security measures to protect customer data in accordance with the <strong>Personal Data Protection Act 2010 (PDPA)</strong>. We protect your data against:</p>
                <ul>
                  <li>Unauthorized access</li>
                  <li>Misuse or data loss</li>
                  <li>Alteration or unauthorized disclosure</li>
                </ul>
                <p>You have the right to access, correct, or request deletion of your personal data at any time by contacting us.</p>

                <h2 id="promo">8. Promotional Communication</h2>
                <p>Users may receive:</p>
                <ul>
                  <li>Order and shipping notifications (via email, SMS, or in-app alerts)</li>
                  <li>Offer announcements and app updates</li>
                </ul>
                <p>Users can opt out of marketing messages at any time via the app settings or by clicking unsubscribe.</p>

                <h2 id="third-party">9. Third-Party Links</h2>
                <p>Our app may contain links to social media pages or third-party websites. We are not responsible for the privacy practices of external entities.</p>

                <h2 id="children">10. Children's Privacy</h2>
                <p>Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from minors without parental consent.</p>

                <h2 id="updates">11. Policy Updates</h2>
                <p>Golden2Deal reserves the right to update or modify this Privacy Policy at any time. Changes will be updated within the app and on this page.</p>

                <h2 id="contact">12. Contact Us</h2>
                <div className="policy-contact-box">
                  <h3>Questions about your privacy or PDPA rights?</h3>
                  <p>
                    Golden2Deal (M) Sdn Bhd<br />
                    Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A,<br />
                    Kawasan Industri Taman Bukit Maluri, 52100 Kepong, KL<br />
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
