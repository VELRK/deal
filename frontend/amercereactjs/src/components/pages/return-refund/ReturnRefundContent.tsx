import { useState, useEffect } from "react";

interface Section {
  id: string;
  title: string;
  icon: string;
}

const sections: Section[] = [
  { id: "app-features", title: "1. App Features", icon: "📱" },
  { id: "privacy-policy", title: "2. Privacy Policy Overview", icon: "🔒" },
  { id: "information-collection", title: "3. Information Collection", icon: "📊" },
  { id: "data-usage-disclosure", title: "4. Data Usage & Disclosure", icon: "🤝" },
  { id: "payment-security", title: "5. Payment & Security", icon: "💳" },
  { id: "user-rights", title: "6. User Rights (PDPA)", icon: "⚖️" },
  { id: "return-refund", title: "7. Return & Refund Policy", icon: "💰" },
  { id: "additional-policies", title: "8. Additional Policies", icon: "🍪" },
  { id: "contact-us", title: "9. Contact Us", icon: "📞" },
];

function ReturnRefundContent() {
  const [activeSection, setActiveSection] = useState<string>("app-features");

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-10% 0px -70% 0px",
      threshold: [0.1, 0.3, 0.5],
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // account for header sticky height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <section className="flat-spacing-1 bg-light-primary-subtle">
      {/* Premium Styling */}
      <style>{`
        .bg-light-primary-subtle {
          background-color: #f4fcfc;
          padding: 60px 0;
          font-family: 'Inter', sans-serif;
        }

        .policy-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        /* Sticky Navigation Sidebar */
        .policy-sidebar {
          position: sticky;
          top: 100px;
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 6px 20px rgba(62, 193, 188, 0.03);
          border: 1px solid rgba(62, 193, 188, 0.05);
          max-height: calc(100vh - 140px);
          overflow-y: auto;
        }

        .policy-sidebar-title {
          font-size: 16px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(62, 193, 188, 0.08);
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .policy-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .policy-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #555555;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-left: 3px solid transparent;
        }

        .policy-nav-link:hover {
          color: #3ec1bc;
          background-color: #eaf9f8;
          padding-left: 18px;
        }

        .policy-nav-link.active {
          color: #ffffff;
          background-color: #3ec1bc;
          border-left-color: #2da19d;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(62, 193, 188, 0.15);
        }

        .policy-nav-icon {
          font-size: 16px;
        }

        /* Content Area Cards */
        .policy-content-col {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .policy-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          scroll-margin-top: 100px;
        }

        .policy-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(62, 193, 188, 0.05);
          border-color: rgba(62, 193, 188, 0.1);
        }

        .policy-card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
          padding-bottom: 14px;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
        }

        .policy-card-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #eaf9f8;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #3ec1bc;
          flex-shrink: 0;
        }

        .policy-card-title {
          font-size: 20px;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .policy-card-text {
          font-size: 15px;
          line-height: 1.7;
          color: #444444;
          margin-bottom: 0;
        }

        .policy-card-text p {
          margin-bottom: 14px;
        }

        .policy-card-text p:last-child {
          margin-bottom: 0;
        }

        /* Bullet lists & checklist items */
        .policy-list {
          list-style: none;
          padding-left: 0;
          margin: 18px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .policy-list li {
          position: relative;
          padding-left: 24px;
          font-size: 15px;
          color: #444444;
          line-height: 1.5;
        }

        .policy-list li::before {
          content: "✦";
          position: absolute;
          left: 0;
          color: #3ec1bc;
          font-weight: bold;
        }

        /* Non-returnable Badge styles */
        .badge-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 18px 0;
        }

        .badge-policy {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .badge-policy-danger {
          background: #eaf9f8;
          color: #3ec1bc;
          border: 1px solid rgba(62, 193, 188, 0.2);
        }

        /* Info box for quick highlights */
        .info-highlight-box {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 16px;
          border-left: 4px solid #6c757d;
          font-size: 14px;
          color: #555555;
          margin-top: 16px;
          line-height: 1.5;
        }

        .info-highlight-box-accent {
          border-left-color: #3ec1bc;
          background: #f4fcfc;
        }

        /* Contact Details Layout */
        .contact-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .contact-details-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-detail-card {
          background: #f4fcfc;
          border: 1px solid rgba(62, 193, 188, 0.06);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.25s ease;
        }

        .contact-detail-card:hover {
          border-color: #3ec1bc;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(62, 193, 188, 0.04);
        }

        .contact-detail-card-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .contact-detail-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contact-detail-card-text {
          font-size: 14px;
          color: #555555;
          line-height: 1.4;
        }

        .contact-link {
          color: #3ec1bc;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .contact-link:hover {
          color: #2da19d;
          text-decoration: underline;
        }

        /* Mobile Scroll Navigation */
        @media (max-width: 991px) {
          .policy-sidebar {
            position: sticky;
            top: 60px;
            max-height: none;
            padding: 12px;
            margin-bottom: 24px;
            background: #ffffff;
            border-radius: 10px;
          }

          .policy-sidebar-title {
            display: none;
          }

          .policy-nav-list {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 4px;
            gap: 8px;
            -webkit-overflow-scrolling: touch;
          }

          .policy-nav-list::-webkit-scrollbar {
            height: 4px;
          }

          .policy-nav-list::-webkit-scrollbar-thumb {
            background-color: rgba(62, 193, 188, 0.15);
            border-radius: 4px;
          }

          .policy-nav-link {
            padding: 8px 14px;
            font-size: 13px;
            border-left: none;
            border-bottom: 2px solid transparent;
            border-radius: 6px;
          }

          .policy-nav-link:hover {
            padding-left: 14px;
            background-color: rgba(62, 193, 188, 0.05);
          }

          .policy-nav-link.active {
            border-left-color: transparent;
            border-bottom-color: #2da19d;
          }
        }
      `}</style>

      <div className="policy-container">
        <div className="row">
          {/* Table of Contents Column */}
          <div className="col-lg-3">
            <div className="policy-sidebar">
              <h4 className="policy-sidebar-title">Table of Contents</h4>
              <ul className="policy-nav-list">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      className={`policy-nav-link border-0 text-start w-100 ${
                        activeSection === sec.id ? "active" : ""
                      }`}
                      onClick={() => scrollToSection(sec.id)}
                    >
                      <span className="policy-nav-icon">{sec.icon}</span>
                      <span>{sec.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policy Text Content Column */}
          <div className="col-lg-9 policy-content-col">
            {/* 1. App Features */}
            <div id="app-features" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">📱</div>
                <h4 className="policy-card-title">1. App Features</h4>
              </div>
              <div className="policy-card-text">
                <ul className="policy-list">
                  <li><strong>🔧 User Interface (UI):</strong> Shows featured products, offers, and categories. Users can search for products and filter by price, category, brand, etc.</li>
                  <li><strong>🛒 Shopping Cart:</strong> Users can add products to a virtual shopping cart. They can review their cart, update quantities, or remove items before checkout.</li>
                  <li><strong>💳 Checkout Process:</strong> Users enter their shipping address and payment details. The app may offer various payment methods: credit/debit card, PayPal, UPI, etc.</li>
                  <li><strong>🔐 Authentication &amp; User Accounts:</strong> Users can sign up or log in to track orders and save preferences. Some apps also offer a guest checkout.</li>
                  <li><strong>🚚 Order Processing:</strong> Once payment is confirmed, the order goes to the backend system. The seller is notified to pack and ship the order.</li>
                  <li><strong>📦 Delivery &amp; Notifications:</strong> Users get notified via email, SMS, or in-app alerts. The app can integrate with logistics APIs to track shipping.</li>
                </ul>
              </div>
            </div>

            {/* 2. Privacy Policy Overview */}
            <div id="privacy-policy" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🔒</div>
                <h4 className="policy-card-title">2. Privacy Policy Overview</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  <strong>2Deal Privacy Policy for 2Deal E-Commerce Mobile App</strong>
                </p>
                <p>
                  Welcome to 2Deal, an e-commerce mobile application operated by Golden2Deal (M) Sdn Bhd. We are committed to protecting your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application.
                </p>
              </div>
            </div>

            {/* 3. Information Collection */}
            <div id="information-collection" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">📊</div>
                <h4 className="policy-card-title">3. Information We Collect</h4>
              </div>
              <div className="policy-card-text">
                <p>We may collect and process the following categories of personal data:</p>
                <ul className="policy-list">
                  <li><strong>Personal Identification Information:</strong> Full name, email address, phone number.</li>
                  <li><strong>Address Information:</strong> Shipping and billing addresses.</li>
                  <li><strong>Payment Information:</strong> Credit/debit card details and other payment-related information.</li>
                  <li><strong>Device Information:</strong> Device type, operating system, IP address.</li>
                  <li><strong>Usage Data:</strong> Purchase history, browsing behavior within the app.</li>
                </ul>
              </div>
            </div>

            {/* 4. Data Usage & Disclosure */}
            <div id="data-usage-disclosure" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🤝</div>
                <h4 className="policy-card-title">4. Data Usage &amp; Disclosure</h4>
              </div>
              <div className="policy-card-text">
                <p><strong>How We Use Your Information:</strong></p>
                <ul className="policy-list">
                  <li><strong>Order Processing:</strong> To process and deliver your orders.</li>
                  <li><strong>Customer Support:</strong> To respond to your inquiries and provide support.</li>
                  <li><strong>Marketing Communications:</strong> To send promotional materials, with your consent.</li>
                  <li><strong>App Improvement:</strong> To analyze usage and improve our services.</li>
                </ul>
                <p><strong>Disclosure of Your Information:</strong></p>
                <p>We may share your information with:</p>
                <ul className="policy-list">
                  <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing and delivery.</li>
                  <li><strong>Legal Obligations:</strong> All third parties are required to comply with the PDPA and ensure the protection of your personal data.</li>
                </ul>
              </div>
            </div>

            {/* 5. Payment & Security */}
            <div id="payment-security" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">💳</div>
                <h4 className="policy-card-title">5. Payment &amp; Security</h4>
              </div>
              <div className="policy-card-text">
                <p><strong>Integrated Payment Gateway:</strong></p>
                <p>
                  We have integrated Fiuu as our payment gateway to facilitate secure and efficient transactions. Fiuu collects and processes personal data necessary for payment processing, including but not limited to your name, contact information, and payment details. For more information on how Fiuu handles your personal data, please refer to their Privacy Policy: <a href="https://fiuu.com/privacy-policy/" target="_blank" rel="noreferrer" className="contact-link">https://fiuu.com/privacy-policy/</a>.
                </p>
                <p><strong>Data Security:</strong></p>
                <p>
                  We implement appropriate technical and organizational measures to safeguard your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
            </div>

            {/* 6. User Rights (PDPA) */}
            <div id="user-rights" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">⚖️</div>
                <h4 className="policy-card-title">6. User Rights &amp; Retention</h4>
              </div>
              <div className="policy-card-text">
                <p><strong>Data Retention:</strong></p>
                <p>
                  Your personal data will be retained only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
                </p>
                <p><strong>Your Rights Under the PDPA:</strong></p>
                <p>As a data subject under the PDPA, you have the following rights:</p>
                <ul className="policy-list">
                  <li><strong>Access:</strong> To request access to your personal data.</li>
                  <li><strong>Correction:</strong> To request correction of inaccurate or incomplete data.</li>
                  <li><strong>Withdrawal of Consent:</strong> To withdraw your consent to the processing of your personal data.</li>
                  <li><strong>Prevent Processing:</strong> To prevent processing likely to cause damage or distress.</li>
                  <li><strong>Prevent Direct Marketing:</strong> To object to processing for direct marketing purposes.</li>
                </ul>
                <div className="info-highlight-box info-highlight-box-accent">
                  <strong>Right to Withdraw Consent and Request Deletion:</strong>
                  <br />
                  You have the right to withdraw your consent to the processing of your personal data at any time by submitting a written notice to us. Upon receipt of your withdrawal notice, we will cease processing your personal data and, where appropriate, delete it, unless retention is required by law or for legitimate business purposes. We will respond to your request within 21 days, as stipulated by the PDPA.
                </div>
              </div>
            </div>

            {/* 7. Return & Refund Policy */}
            <div id="return-refund" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">💰</div>
                <h4 className="policy-card-title">7. Return and Refund Policy</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  At 2Deal, customer satisfaction is our priority. We offer refunds under the following conditions:
                </p>
                <ul className="policy-list">
                  <li><strong>Damaged Products:</strong> If the product you received is damaged.</li>
                  <li><strong>Undelivered Products:</strong> If the product you ordered was not delivered.</li>
                </ul>
                <div className="badge-grid">
                  <span className="badge-policy badge-policy-danger">
                    🚨 Request within 7 Days
                  </span>
                </div>
                <p>
                  To request a refund, please contact us within 7 days of receiving the product or the expected delivery date. Once your request is approved, refunds will be processed within 7 business days. Please note that refunds will be issued to the original payment method used during the purchase.
                </p>
              </div>
            </div>

            {/* 8. Additional Policies */}
            <div id="additional-policies" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🍪</div>
                <h4 className="policy-card-title">8. Additional Policies</h4>
              </div>
              <div className="policy-card-text">
                <p><strong>Cookies and Tracking Technologies:</strong></p>
                <p>Our app may use cookies and similar technologies to enhance user experience. You can manage your preferences through your device settings.</p>
                
                <p><strong>Third-Party Links:</strong></p>
                <p>Our app may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>
                
                <p><strong>Changes to This Privacy Policy:</strong></p>
                <p>We may update this Privacy Policy from time to time. Any changes will be posted within the app and, where appropriate, notified to you via email.</p>
              </div>
            </div>

            {/* 9. Contact Us */}
            <div id="contact-us" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">📞</div>
                <h4 className="policy-card-title">9. Contact Us</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="contact-details-grid">
                  <div className="contact-detail-card">
                    <div className="contact-detail-card-icon">🏢</div>
                    <div className="contact-detail-card-title">Company Info</div>
                    <div className="contact-detail-card-text">
                      <strong>Golden2Deal (M) Sdn Bhd</strong>
                      <br />
                      (1429727-A)
                      <br />
                      Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong, Kuala Lumpur.
                    </div>
                  </div>
                  <div className="contact-detail-card">
                    <div className="contact-detail-card-icon">✉️</div>
                    <div className="contact-detail-card-title">Email Us</div>
                    <div className="contact-detail-card-text">
                      For privacy requests or general inquiries:
                      <br />
                      <a href="mailto:golden2deal@gmail.com" className="contact-link">
                        golden2deal@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReturnRefundContent;
