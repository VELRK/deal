import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{n}from"./chunk-QFMPRPBF-BNQPla1W.js";import{t as r}from"./jsx-runtime-DdEXjPBp.js";import{t as i}from"./PageMeta-6gZ1jYam.js";var a=r();function o(){return(0,a.jsx)(`section`,{className:`section-page-title text-center flat-spacing-2 pb-0`,children:(0,a.jsx)(`div`,{className:`container`,children:(0,a.jsxs)(`div`,{className:`main-page-title`,children:[(0,a.jsxs)(`div`,{className:`breadcrumbs d-flex align-items-center justify-content-center gap-1`,children:[(0,a.jsx)(n,{to:`/`,className:`text-caption-01 cl-text-3 link`,children:`Home`}),(0,a.jsx)(`i`,{className:`icon icon-CaretRightThin cl-text-3`}),(0,a.jsx)(`p`,{className:`text-caption-01 m-0`,children:`Return & Refund Policy`})]}),(0,a.jsx)(`h3`,{className:`mt-3`,children:`Return & Refund Policy`}),(0,a.jsx)(`p`,{className:`text-body-1 cl-text-2 max-w-600 mx-auto mt-2`,children:`Details about customization terms, sarees exchanges, defect reports, and cancellations.`})]})})})}var s=e(t(),1),c=[{id:`business-info`,title:`1. Business Information`,icon:`🏢`},{id:`customized-products`,title:`2. Customized Products`,icon:`✂️`},{id:`sarees-ready-made`,title:`3. Sarees & Ready-Made`,icon:`🛍️`},{id:`non-returnable`,title:`4. Non-Returnable Items`,icon:`🚫`},{id:`damaged-incorrect`,title:`5. Damaged or Defective`,icon:`⚠️`},{id:`refund-policy`,title:`6. Refund Policy`,icon:`💰`},{id:`cancellation-policy`,title:`7. Cancellation Policy`,icon:`🛑`},{id:`color-variation`,title:`8. Color & Design`,icon:`🎨`},{id:`shipping-charges`,title:`9. Shipping Charges`,icon:`🚚`},{id:`contact-us`,title:`10. Contact Us`,icon:`📞`}];function l(){let[e,t]=(0,s.useState)(`business-info`);(0,s.useEffect)(()=>{let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.intersectionRatio>=.3&&t(e.target.id)})},{rootMargin:`-10% 0px -70% 0px`,threshold:[.1,.3,.5]});return c.forEach(t=>{let n=document.getElementById(t.id);n&&e.observe(n)}),()=>{e.disconnect()}},[]);let n=e=>{let n=document.getElementById(e);if(n){let r=n.getBoundingClientRect().top+window.pageYOffset+-90;window.scrollTo({top:r,behavior:`smooth`}),t(e)}};return(0,a.jsxs)(`section`,{className:`flat-spacing-1 bg-light-pink-subtle`,children:[(0,a.jsx)(`style`,{children:`
        .bg-light-pink-subtle {
          background-color: #fdfafb;
          padding: 60px 0;
          font-family: 'Outfit', sans-serif;
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
          box-shadow: 0 6px 20px rgba(193, 16, 105, 0.03);
          border: 1px solid rgba(193, 16, 105, 0.05);
          max-height: calc(100vh - 140px);
          overflow-y: auto;
        }

        .policy-sidebar-title {
          font-size: 16px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(193, 16, 105, 0.08);
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
          color: #c11069;
          background-color: #faf0f2;
          padding-left: 18px;
        }

        .policy-nav-link.active {
          color: #ffffff;
          background-color: #c11069;
          border-left-color: #920b4e;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(193, 16, 105, 0.15);
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
          box-shadow: 0 8px 26px rgba(193, 16, 105, 0.05);
          border-color: rgba(193, 16, 105, 0.1);
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
          background: #faf0f2;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #c11069;
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

        /* Customized Highlight Block (Warning Accent) */
        .policy-card-alert {
          background-color: #fff9fa;
          border: 1px solid rgba(193, 16, 105, 0.15);
          border-left: 4px solid #c11069;
        }

        .policy-card-alert .policy-card-icon-wrapper {
          background: #ffeef2;
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
          color: #c11069;
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
          background: #ffeef2;
          color: #c11069;
          border: 1px solid rgba(193, 16, 105, 0.2);
        }

        .badge-policy-success {
          background: #e6f6ee;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
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
          border-left-color: #c11069;
          background: #fdf8fa;
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
          background: #fdfafb;
          border: 1px solid rgba(193, 16, 105, 0.06);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.25s ease;
        }

        .contact-detail-card:hover {
          border-color: #c11069;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(193, 16, 105, 0.04);
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
          color: #c11069;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .contact-link:hover {
          color: #920b4e;
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
            background-color: rgba(193, 16, 105, 0.15);
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
            background-color: rgba(193, 16, 105, 0.05);
          }

          .policy-nav-link.active {
            border-left-color: transparent;
            border-bottom-color: #920b4e;
          }
        }
      `}),(0,a.jsx)(`div`,{className:`policy-container`,children:(0,a.jsxs)(`div`,{className:`row`,children:[(0,a.jsx)(`div`,{className:`col-lg-3`,children:(0,a.jsxs)(`div`,{className:`policy-sidebar`,children:[(0,a.jsx)(`h4`,{className:`policy-sidebar-title`,children:`Table of Contents`}),(0,a.jsx)(`ul`,{className:`policy-nav-list`,children:c.map(t=>(0,a.jsx)(`li`,{children:(0,a.jsxs)(`button`,{className:`policy-nav-link border-0 text-start w-100 ${e===t.id?`active`:``}`,onClick:()=>n(t.id),children:[(0,a.jsx)(`span`,{className:`policy-nav-icon`,children:t.icon}),(0,a.jsx)(`span`,{children:t.title})]})},t.id))})]})}),(0,a.jsxs)(`div`,{className:`col-lg-9 policy-content-col`,children:[(0,a.jsxs)(`div`,{id:`business-info`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`🏢`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`1. Business Information`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsxs)(`p`,{children:[`Welcome to `,(0,a.jsx)(`strong`,{children:`Indian Ladies Fashion`}),`. We strive to provide premium-quality ethnic wear, customized tailoring, and handcrafted Aari embroidery services with complete customer satisfaction.`]}),(0,a.jsxs)(`div`,{className:`info-highlight-box`,children:[(0,a.jsx)(`strong`,{children:`Indian Ladies Fashion`}),(0,a.jsx)(`br`,{}),`Opposite the SNS Tech Arch, Sathy Main Road,`,(0,a.jsx)(`br`,{}),`Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India`,(0,a.jsx)(`br`,{}),(0,a.jsx)(`strong`,{children:`Contact Phone:`}),` `,(0,a.jsx)(`a`,{href:`tel:+919597220129`,className:`contact-link`,children:`+91 95972 20129`})]})]})]}),(0,a.jsxs)(`div`,{id:`customized-products`,className:`policy-card policy-card-alert`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`✂️`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`2. Customized & Tailored Products`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`Since customized stitching, blouse tailoring, alterations, and Aari embroidery work are specially made according to your specific size and style requirements, these products are:`}),(0,a.jsxs)(`div`,{className:`badge-grid`,children:[(0,a.jsx)(`span`,{className:`badge-policy badge-policy-danger`,children:`🚫 Non-Returnable`}),(0,a.jsx)(`span`,{className:`badge-policy badge-policy-danger`,children:`🚫 Non-Exchangeable`}),(0,a.jsx)(`span`,{className:`badge-policy badge-policy-danger`,children:`🚫 Non-Refundable`})]}),(0,a.jsx)(`p`,{children:`This includes:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`Customized blouses`}),(0,a.jsx)(`li`,{children:`Tailor-stitched salwars`}),(0,a.jsx)(`li`,{children:`Altered garments`}),(0,a.jsx)(`li`,{children:`Personalized embroidery work`}),(0,a.jsx)(`li`,{children:`Made-to-order ethnic wear`})]}),(0,a.jsxs)(`div`,{className:`info-highlight-box info-highlight-box-accent`,children:[`💡 `,(0,a.jsx)(`strong`,{children:`Note:`}),` Customers are requested to provide accurate measurements and double-confirm design details before order processing begins.`]})]})]}),(0,a.jsxs)(`div`,{id:`sarees-ready-made`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`🛍️`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`3. Sarees & Ready-Made Products`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`Eligible ready-made products and sarees may be exchanged, provided that you fulfill the following requirements:`}),(0,a.jsxs)(`div`,{className:`badge-grid`,children:[(0,a.jsx)(`span`,{className:`badge-policy badge-policy-success`,children:`⏳ Request within 3 Days`}),(0,a.jsx)(`span`,{className:`badge-policy badge-policy-success`,children:`✓ Tags & Original Packaging`})]}),(0,a.jsx)(`p`,{children:`The product must be:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`Unused and unworn`}),(0,a.jsx)(`li`,{children:`Unwashed`}),(0,a.jsx)(`li`,{children:`Undamaged`}),(0,a.jsx)(`li`,{children:`In its original packaging with all tags intact`})]}),(0,a.jsxs)(`div`,{className:`info-highlight-box`,children:[`ℹ️ `,(0,a.jsx)(`strong`,{children:`Please note:`}),` Exchange approval is subject to product inspection upon return.`]})]})]}),(0,a.jsxs)(`div`,{id:`non-returnable`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`🚫`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`4. Non-Returnable Items`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`The following items are strictly non-eligible for return, exchange, or refund:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`Customized or stitched garments`}),(0,a.jsx)(`li`,{children:`Aari embroidery products`}),(0,a.jsx)(`li`,{children:`Discounted or clearance sale items`}),(0,a.jsx)(`li`,{children:`Gift cards or promotional products`}),(0,a.jsx)(`li`,{children:`Products damaged due to customer misuse`}),(0,a.jsx)(`li`,{children:`Products altered after delivery`})]})]})]}),(0,a.jsxs)(`div`,{id:`damaged-incorrect`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`⚠️`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`5. Damaged or Incorrect Products`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsxs)(`p`,{children:[`If you receive a `,(0,a.jsx)(`strong`,{children:`damaged item`}),`, `,(0,a.jsx)(`strong`,{children:`wrong product`}),`, or `,(0,a.jsx)(`strong`,{children:`defective product`}),`, please contact us immediately:`]}),(0,a.jsx)(`div`,{className:`badge-grid`,children:(0,a.jsx)(`span`,{className:`badge-policy badge-policy-danger`,children:`🚨 Report within 24 Hours`})}),(0,a.jsx)(`p`,{children:`Please provide the following details in your contact request:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`Order details (order number)`}),(0,a.jsx)(`li`,{children:`Clear photos of the product highlighting the damage/defect`}),(0,a.jsx)(`li`,{children:`Invoice or proof of purchase`})]}),(0,a.jsx)(`p`,{children:`After verification from our team, we will happily offer one of the following solutions:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`Product Replacement`}),(0,a.jsx)(`li`,{children:`Store Credit`}),(0,a.jsx)(`li`,{children:`Product Exchange (if applicable)`})]})]})]}),(0,a.jsxs)(`div`,{id:`refund-policy`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`💰`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`6. Refund Policy`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`Refunds are applicable only in approved cases where:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`The ordered product is unavailable`}),(0,a.jsx)(`li`,{children:`Payment was deducted but the order failed on the system`}),(0,a.jsx)(`li`,{children:`Approved cancellation request before customization work begins`})]}),(0,a.jsxs)(`div`,{className:`info-highlight-box info-highlight-box-accent`,children:[`⌛ Refunds, once approved, will be processed back to the original payment method within `,(0,a.jsx)(`strong`,{children:`7–10 business days`}),`.`]})]})]}),(0,a.jsxs)(`div`,{id:`cancellation-policy`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`🛑`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`7. Cancellation Policy`})]}),(0,a.jsx)(`div`,{className:`policy-card-text`,children:(0,a.jsxs)(`div`,{className:`row g-3`,children:[(0,a.jsx)(`div`,{className:`col-md-6`,children:(0,a.jsxs)(`div`,{className:`contact-detail-card h-100`,children:[(0,a.jsx)(`div`,{className:`contact-detail-card-icon`,children:`✂️`}),(0,a.jsx)(`div`,{className:`contact-detail-card-title`,children:`Customized Orders`}),(0,a.jsxs)(`div`,{className:`contact-detail-card-text`,children:[`Customized tailoring and embroidery orders `,(0,a.jsx)(`strong`,{children:`cannot be cancelled`}),` once work has started.`]})]})}),(0,a.jsx)(`div`,{className:`col-md-6`,children:(0,a.jsxs)(`div`,{className:`contact-detail-card h-100`,children:[(0,a.jsx)(`div`,{className:`contact-detail-card-icon`,children:`🛍️`}),(0,a.jsx)(`div`,{className:`contact-detail-card-title`,children:`Ready-Made Products`}),(0,a.jsxs)(`div`,{className:`contact-detail-card-text`,children:[`Orders for standard items and sarees may be cancelled `,(0,a.jsx)(`strong`,{children:`before dispatch`}),` confirmation.`]})]})})]})})]}),(0,a.jsxs)(`div`,{id:`color-variation`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`🎨`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`8. Color & Design Variation`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`Slight color and design variations may occur. These are standard in handcrafted and ethnic products due to:`}),(0,a.jsxs)(`ul`,{className:`policy-list`,children:[(0,a.jsx)(`li`,{children:`Screen display settings on different devices`}),(0,a.jsx)(`li`,{children:`Studio lighting during photography`}),(0,a.jsx)(`li`,{children:`Handcrafted nature of embroidery and dye processes`})]}),(0,a.jsx)(`p`,{children:`Please note that such minor variations are not considered manufacturing defects.`})]})]}),(0,a.jsxs)(`div`,{id:`shipping-charges`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`🚚`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`9. Shipping Charges`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`Shipping and handling charges are non-refundable.`}),(0,a.jsx)(`p`,{children:`Customers may need to bear the return shipping costs for approved exchanges, unless the return is due to a mistake on our side (e.g. damaged or wrong product).`})]})]}),(0,a.jsxs)(`div`,{id:`contact-us`,className:`policy-card`,children:[(0,a.jsxs)(`div`,{className:`policy-card-header`,children:[(0,a.jsx)(`div`,{className:`policy-card-icon-wrapper`,children:`📞`}),(0,a.jsx)(`h4`,{className:`policy-card-title`,children:`10. Contact Us`})]}),(0,a.jsxs)(`div`,{className:`policy-card-text`,children:[(0,a.jsx)(`p`,{children:`For any support, questions, or clarification regarding our Return, Exchange, or Refund policies, please reach out to us:`}),(0,a.jsxs)(`div`,{className:`contact-details-grid`,children:[(0,a.jsxs)(`div`,{className:`contact-detail-card`,children:[(0,a.jsx)(`div`,{className:`contact-detail-card-icon`,children:`📍`}),(0,a.jsx)(`div`,{className:`contact-detail-card-title`,children:`Visit Our Store`}),(0,a.jsxs)(`div`,{className:`contact-detail-card-text`,children:[(0,a.jsx)(`strong`,{children:`Indian Ladies Fashion`}),(0,a.jsx)(`br`,{}),`Opposite the SNS Tech Arch, Sathy Main Road, Saravanampatti Post, Coimbatore – 641035`]})]}),(0,a.jsxs)(`div`,{className:`contact-detail-card`,children:[(0,a.jsx)(`div`,{className:`contact-detail-card-icon`,children:`📞`}),(0,a.jsx)(`div`,{className:`contact-detail-card-title`,children:`Call Us`}),(0,a.jsxs)(`div`,{className:`contact-detail-card-text`,children:[`Feel free to speak to our support desk:`,(0,a.jsx)(`br`,{}),(0,a.jsx)(`a`,{href:`tel:+919597220129`,className:`contact-link`,children:`+91 95972 20129`})]})]})]})]})]})]})]})})]})}var u=()=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i,{title:`Return & Refund Policy | Indian Ladies Fashion`,description:`Read our Return and Refund Policy carefully before making a purchase. Find details about customized wear terms, sarees exchanges, defect reports, and cancellations.`}),(0,a.jsx)(o,{}),(0,a.jsx)(l,{})]});export{u as default};