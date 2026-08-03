import{j as e,L as d,r as o}from"./index-DNhiH3Rj.js";import{P as p}from"./PageMeta-DjHK_elp.js";function h(){return e.jsx("section",{className:"section-page-title text-center flat-spacing-2 pb-0",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs d-flex align-items-center justify-content-center gap-1",children:[e.jsx(d,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01 m-0",children:"Return & Refund Policy"})]}),e.jsx("h3",{className:"mt-3",children:"Return & Refund Policy"}),e.jsx("p",{className:"text-body-1 cl-text-2 max-w-600 mx-auto mt-2",children:"Details about customization terms, sarees exchanges, defect reports, and cancellations."})]})})})}const c=[{id:"app-features",title:"1. App Features",icon:"📱"},{id:"privacy-policy",title:"2. Privacy Policy Overview",icon:"🔒"},{id:"information-collection",title:"3. Information Collection",icon:"📊"},{id:"data-usage-disclosure",title:"4. Data Usage & Disclosure",icon:"🤝"},{id:"payment-security",title:"5. Payment & Security",icon:"💳"},{id:"user-rights",title:"6. User Rights (PDPA)",icon:"⚖️"},{id:"return-refund",title:"7. Return & Refund Policy",icon:"💰"},{id:"additional-policies",title:"8. Additional Policies",icon:"🍪"},{id:"contact-us",title:"9. Contact Us",icon:"📞"}];function x(){const[n,t]=o.useState("app-features");o.useEffect(()=>{const i=a=>{a.forEach(r=>{r.isIntersecting&&r.intersectionRatio>=.3&&t(r.target.id)})},s=new IntersectionObserver(i,{rootMargin:"-10% 0px -70% 0px",threshold:[.1,.3,.5]});return c.forEach(a=>{const r=document.getElementById(a.id);r&&s.observe(r)}),()=>{s.disconnect()}},[]);const l=i=>{const s=document.getElementById(i);if(s){const r=s.getBoundingClientRect().top+window.pageYOffset+-90;window.scrollTo({top:r,behavior:"smooth"}),t(i)}};return e.jsxs("section",{className:"flat-spacing-1 bg-light-primary-subtle",children:[e.jsx("style",{children:`
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
      `}),e.jsx("div",{className:"policy-container",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-lg-3",children:e.jsxs("div",{className:"policy-sidebar",children:[e.jsx("h4",{className:"policy-sidebar-title",children:"Table of Contents"}),e.jsx("ul",{className:"policy-nav-list",children:c.map(i=>e.jsx("li",{children:e.jsxs("button",{className:`policy-nav-link border-0 text-start w-100 ${n===i.id?"active":""}`,onClick:()=>l(i.id),children:[e.jsx("span",{className:"policy-nav-icon",children:i.icon}),e.jsx("span",{children:i.title})]})},i.id))})]})}),e.jsxs("div",{className:"col-lg-9 policy-content-col",children:[e.jsxs("div",{id:"app-features",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"📱"}),e.jsx("h4",{className:"policy-card-title",children:"1. App Features"})]}),e.jsx("div",{className:"policy-card-text",children:e.jsxs("ul",{className:"policy-list",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"🔧 User Interface (UI):"})," Shows featured products, offers, and categories. Users can search for products and filter by price, category, brand, etc."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"🛒 Shopping Cart:"})," Users can add products to a virtual shopping cart. They can review their cart, update quantities, or remove items before checkout."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"💳 Checkout Process:"})," Users enter their shipping address and payment details. The app may offer various payment methods: credit/debit card, PayPal, UPI, etc."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"🔐 Authentication & User Accounts:"})," Users can sign up or log in to track orders and save preferences. Some apps also offer a guest checkout."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"🚚 Order Processing:"})," Once payment is confirmed, the order goes to the backend system. The seller is notified to pack and ship the order."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"📦 Delivery & Notifications:"})," Users get notified via email, SMS, or in-app alerts. The app can integrate with logistics APIs to track shipping."]})]})})]}),e.jsxs("div",{id:"privacy-policy",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"🔒"}),e.jsx("h4",{className:"policy-card-title",children:"2. Privacy Policy Overview"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:e.jsx("strong",{children:"2Deal Privacy Policy for 2Deal E-Commerce Mobile App"})}),e.jsx("p",{children:"Welcome to 2Deal, an e-commerce mobile application operated by Golden2Deal (M) Sdn Bhd. We are committed to protecting your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application."})]})]}),e.jsxs("div",{id:"information-collection",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"📊"}),e.jsx("h4",{className:"policy-card-title",children:"3. Information We Collect"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:"We may collect and process the following categories of personal data:"}),e.jsxs("ul",{className:"policy-list",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Personal Identification Information:"})," Full name, email address, phone number."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Address Information:"})," Shipping and billing addresses."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Payment Information:"})," Credit/debit card details and other payment-related information."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Device Information:"})," Device type, operating system, IP address."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usage Data:"})," Purchase history, browsing behavior within the app."]})]})]})]}),e.jsxs("div",{id:"data-usage-disclosure",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"🤝"}),e.jsx("h4",{className:"policy-card-title",children:"4. Data Usage & Disclosure"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:e.jsx("strong",{children:"How We Use Your Information:"})}),e.jsxs("ul",{className:"policy-list",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Order Processing:"})," To process and deliver your orders."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Customer Support:"})," To respond to your inquiries and provide support."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Marketing Communications:"})," To send promotional materials, with your consent."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"App Improvement:"})," To analyze usage and improve our services."]})]}),e.jsx("p",{children:e.jsx("strong",{children:"Disclosure of Your Information:"})}),e.jsx("p",{children:"We may share your information with:"}),e.jsxs("ul",{className:"policy-list",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Service Providers:"})," Third-party vendors who perform services on our behalf, such as payment processing and delivery."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Legal Obligations:"})," All third parties are required to comply with the PDPA and ensure the protection of your personal data."]})]})]})]}),e.jsxs("div",{id:"payment-security",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"💳"}),e.jsx("h4",{className:"policy-card-title",children:"5. Payment & Security"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:e.jsx("strong",{children:"Integrated Payment Gateway:"})}),e.jsxs("p",{children:["We have integrated Fiuu as our payment gateway to facilitate secure and efficient transactions. Fiuu collects and processes personal data necessary for payment processing, including but not limited to your name, contact information, and payment details. For more information on how Fiuu handles your personal data, please refer to their Privacy Policy: ",e.jsx("a",{href:"https://fiuu.com/privacy-policy/",target:"_blank",rel:"noreferrer",className:"contact-link",children:"https://fiuu.com/privacy-policy/"}),"."]}),e.jsx("p",{children:e.jsx("strong",{children:"Data Security:"})}),e.jsx("p",{children:"We implement appropriate technical and organizational measures to safeguard your personal data against unauthorized access, alteration, disclosure, or destruction."})]})]}),e.jsxs("div",{id:"user-rights",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"⚖️"}),e.jsx("h4",{className:"policy-card-title",children:"6. User Rights & Retention"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:e.jsx("strong",{children:"Data Retention:"})}),e.jsx("p",{children:"Your personal data will be retained only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law."}),e.jsx("p",{children:e.jsx("strong",{children:"Your Rights Under the PDPA:"})}),e.jsx("p",{children:"As a data subject under the PDPA, you have the following rights:"}),e.jsxs("ul",{className:"policy-list",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Access:"})," To request access to your personal data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Correction:"})," To request correction of inaccurate or incomplete data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Withdrawal of Consent:"})," To withdraw your consent to the processing of your personal data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Prevent Processing:"})," To prevent processing likely to cause damage or distress."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Prevent Direct Marketing:"})," To object to processing for direct marketing purposes."]})]}),e.jsxs("div",{className:"info-highlight-box info-highlight-box-accent",children:[e.jsx("strong",{children:"Right to Withdraw Consent and Request Deletion:"}),e.jsx("br",{}),"You have the right to withdraw your consent to the processing of your personal data at any time by submitting a written notice to us. Upon receipt of your withdrawal notice, we will cease processing your personal data and, where appropriate, delete it, unless retention is required by law or for legitimate business purposes. We will respond to your request within 21 days, as stipulated by the PDPA."]})]})]}),e.jsxs("div",{id:"return-refund",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"💰"}),e.jsx("h4",{className:"policy-card-title",children:"7. Return and Refund Policy"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:"At 2Deal, customer satisfaction is our priority. We offer refunds under the following conditions:"}),e.jsxs("ul",{className:"policy-list",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Damaged Products:"})," If the product you received is damaged."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Undelivered Products:"})," If the product you ordered was not delivered."]})]}),e.jsx("div",{className:"badge-grid",children:e.jsx("span",{className:"badge-policy badge-policy-danger",children:"🚨 Request within 7 Days"})}),e.jsx("p",{children:"To request a refund, please contact us within 7 days of receiving the product or the expected delivery date. Once your request is approved, refunds will be processed within 7 business days. Please note that refunds will be issued to the original payment method used during the purchase."})]})]}),e.jsxs("div",{id:"additional-policies",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"🍪"}),e.jsx("h4",{className:"policy-card-title",children:"8. Additional Policies"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:e.jsx("strong",{children:"Cookies and Tracking Technologies:"})}),e.jsx("p",{children:"Our app may use cookies and similar technologies to enhance user experience. You can manage your preferences through your device settings."}),e.jsx("p",{children:e.jsx("strong",{children:"Third-Party Links:"})}),e.jsx("p",{children:"Our app may contain links to third-party websites. We are not responsible for the privacy practices of these external sites."}),e.jsx("p",{children:e.jsx("strong",{children:"Changes to This Privacy Policy:"})}),e.jsx("p",{children:"We may update this Privacy Policy from time to time. Any changes will be posted within the app and, where appropriate, notified to you via email."})]})]}),e.jsxs("div",{id:"contact-us",className:"policy-card",children:[e.jsxs("div",{className:"policy-card-header",children:[e.jsx("div",{className:"policy-card-icon-wrapper",children:"📞"}),e.jsx("h4",{className:"policy-card-title",children:"9. Contact Us"})]}),e.jsxs("div",{className:"policy-card-text",children:[e.jsx("p",{children:"If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:"}),e.jsxs("div",{className:"contact-details-grid",children:[e.jsxs("div",{className:"contact-detail-card",children:[e.jsx("div",{className:"contact-detail-card-icon",children:"🏢"}),e.jsx("div",{className:"contact-detail-card-title",children:"Company Info"}),e.jsxs("div",{className:"contact-detail-card-text",children:[e.jsx("strong",{children:"Golden2Deal (M) Sdn Bhd"}),e.jsx("br",{}),"(1429727-A)",e.jsx("br",{}),"Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong, Kuala Lumpur."]})]}),e.jsxs("div",{className:"contact-detail-card",children:[e.jsx("div",{className:"contact-detail-card-icon",children:"✉️"}),e.jsx("div",{className:"contact-detail-card-title",children:"Email Us"}),e.jsxs("div",{className:"contact-detail-card-text",children:["For privacy requests or general inquiries:",e.jsx("br",{}),e.jsx("a",{href:"mailto:golden2deal@gmail.com",className:"contact-link",children:"golden2deal@gmail.com"})]})]})]})]})]})]})]})})]})}const u=()=>e.jsxs(e.Fragment,{children:[e.jsx(p,{title:"Return & Refund Policy | Indian Ladies Fashion",description:"Read our Return and Refund Policy carefully before making a purchase. Find details about customized wear terms, sarees exchanges, defect reports, and cancellations."}),e.jsx(h,{}),e.jsx(x,{})]});export{u as default};
