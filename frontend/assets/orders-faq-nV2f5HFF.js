import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{n}from"./chunk-QFMPRPBF-BesryAy5.js";import{t as r}from"./jsx-runtime-DdEXjPBp.js";import{t as i}from"./PageMeta-Crd6kKGb.js";var a=r();function o(){return(0,a.jsx)(`section`,{className:`section-page-title text-center flat-spacing-2 pb-0`,children:(0,a.jsx)(`div`,{className:`container`,children:(0,a.jsxs)(`div`,{className:`main-page-title`,children:[(0,a.jsxs)(`div`,{className:`breadcrumbs d-flex align-items-center justify-content-center gap-1`,children:[(0,a.jsx)(n,{to:`/`,className:`text-caption-01 cl-text-3 link`,children:`Home`}),(0,a.jsx)(`i`,{className:`icon icon-CaretRightThin cl-text-3`}),(0,a.jsx)(`p`,{className:`text-caption-01 m-0`,children:`Orders FAQs`})]}),(0,a.jsx)(`h3`,{className:`mt-3`,children:`Orders FAQs`}),(0,a.jsx)(`p`,{className:`text-body-1 cl-text-2 max-w-600 mx-auto mt-2`,children:`Frequently Asked Questions regarding orders, customized stitching, measurements, bridal collections, and boutique details.`})]})})})}var s=e(t(),1),c=[{q:`How can I place an order?`,a:`You can place an order through our official website or by contacting our store directly. Simply select your preferred products or tailoring service, share your requirements, and complete the payment process.`,category:`orders`},{q:`Do you offer customized stitching?`,a:`Yes. We specialize in customized blouse stitching, salwar tailoring, designer ethnic wear stitching, personalized fitting services, and bespoke Aari embroidery. Customers can provide their measurements and design preferences while placing the order.`,category:`customization`},{q:`How do I share my measurements?`,a:`Measurements can be shared during order placement on the website, through WhatsApp or phone support (+91 95972 20129), or by visiting our store directly for accurate measurement assistance. Customers are requested to provide accurate measurements to ensure the best fit.`,category:`customization`},{q:`How long does stitching or customization take?`,a:`Delivery timelines vary depending on design complexity, embroidery work, fabric availability, and order quantity. Customized orders usually require additional processing time compared to ready-made products. Our team will coordinate the timeline with you.`,category:`customization`},{q:`Can I modify my order after placing it?`,a:`Minor changes may be accepted before stitching or embroidery work begins. Once customization has started, major modifications or cancellations are not possible due to the personalized nature of the work.`,category:`orders`},{q:`Do you provide Aari embroidery services?`,a:`Yes. We offer premium handcrafted Aari embroidery services for bridal blouses, designer blouses, sarees, festive wear, and customized ethnic outfits.`,category:`customization`},{q:`Are customized products returnable?`,a:`No. Customized stitched garments, altered products, and personalized embroidery items are strictly non-returnable and non-refundable. Please refer to our Return & Refund Policy for complete details.`,category:`returns`},{q:`Do you offer exchange for sarees or ready-made products?`,a:`Eligible ready-made products and sarees may be exchanged within 3 days if the item is unused, tags are intact, and the product is in its original condition. Exchange approval is subject to verification.`,category:`returns`},{q:`What payment methods do you accept?`,a:`We accept UPI payments, Debit/Credit Cards, Bank Transfers, and Cash payments for in-store purchases.`,category:`orders`},{q:`Do you offer shipping across India?`,a:`Yes. We offer shipping across India. Shipping availability and delivery timelines may vary based on location and order type.`,category:`delivery`},{q:`Will product colors look exactly the same as shown online?`,a:`Slight color variations may occur due to screen display settings, studio lighting during photography, fabric texture, and handcrafting processes. These minor variations are not considered manufacturing defects.`,category:`delivery`},{q:`How can I track my order?`,a:`Customers can view their order status on the dashboard under 'My Orders' or contact our support team directly for order updates and delivery status.`,category:`orders`},{q:`Do you accept bulk or bridal orders?`,a:`Yes. We accept bridal blouse orders, wedding collections, bulk tailoring orders, festive group orders, and boutique customization requests. Advance booking is highly recommended for bridal and festive seasons.`,category:`orders`},{q:`Where is your store located?`,a:`Indian Ladies Fashion boutique is located opposite the SNS Tech Arch, Sathy Main Road, Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India. Visit us for custom fittings and saree curation.`,category:`delivery`},{q:`How can I contact customer support?`,a:`For order support, customization inquiries, or store assistance, you can reach us by phone or WhatsApp at +91 95972 20129. Our team will be happy to assist you.`,category:`delivery`}],l=[{id:`all`,label:`All FAQs`,icon:`✨`},{id:`customization`,label:`Stitching & Customization`,icon:`✂️`},{id:`orders`,label:`Orders & Payments`,icon:`🧾`},{id:`returns`,label:`Returns & Exchanges`,icon:`↩️`},{id:`delivery`,label:`Boutique & Delivery`,icon:`📍`}];function u(){let[e,t]=(0,s.useState)(`all`),[n,r]=(0,s.useState)(``),[i,o]=(0,s.useState)(null),u=c.filter(t=>{let r=e===`all`||t.category===e,i=n.toLowerCase().trim(),a=!i||t.q.toLowerCase().includes(i)||t.a.toLowerCase().includes(i);return r&&a});return(0,a.jsxs)(`section`,{className:`flat-spacing-1 bg-light-pink-subtle`,children:[(0,a.jsx)(`style`,{children:`
        .bg-light-pink-subtle {
          background-color: #fdfafb;
          padding: 50px 0 80px 0;
          font-family: 'Outfit', sans-serif;
        }

        .faq-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Search Section */
        .faq-search-box {
          background: #ffffff;
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 4px 20px rgba(193, 16, 105, 0.03);
          border: 1px solid rgba(193, 16, 105, 0.08);
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .faq-search-icon {
          font-size: 20px;
          color: #c11069;
          margin-left: 18px;
        }

        .faq-search-input {
          border: none;
          outline: none;
          padding: 12px 10px;
          font-size: 15px;
          color: #111111;
          flex: 1;
          background: transparent;
        }

        .faq-search-input::placeholder {
          color: #999999;
        }

        /* Category Filter Pills */
        .faq-categories-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .faq-cat-pill {
          background: #ffffff;
          border: 1px solid rgba(193, 16, 105, 0.06);
          color: #555555;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          outline: none;
        }

        .faq-cat-pill:hover {
          color: #c11069;
          border-color: rgba(193, 16, 105, 0.2);
          background: #faf0f2;
        }

        .faq-cat-pill.active {
          background: #c11069;
          color: #ffffff;
          border-color: #c11069;
          box-shadow: 0 4px 12px rgba(193, 16, 105, 0.15);
        }

        /* Accordion Stack */
        .faq-accordion-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-card-custom {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(193, 16, 105, 0.05);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-card-custom:hover {
          box-shadow: 0 6px 20px rgba(193, 16, 105, 0.04);
          border-color: rgba(193, 16, 105, 0.1);
        }

        .faq-card-header-custom {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }

        .faq-card-question {
          font-size: 16px;
          font-weight: 600;
          color: #111111;
          margin: 0;
          transition: color 0.2s ease;
        }

        .faq-card-header-custom:hover .faq-card-question {
          color: #c11069;
        }

        .faq-card-custom.expanded .faq-card-question {
          color: #c11069;
        }

        .faq-chevron {
          width: 28px;
          height: 28px;
          background: #fdfafb;
          border-radius: 50%;
          color: #c11069;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          border: 1px solid rgba(193, 16, 105, 0.1);
          flex-shrink: 0;
        }

        .faq-card-custom.expanded .faq-chevron {
          transform: rotate(180deg);
          background: #c11069;
          color: #ffffff;
          border-color: #c11069;
        }

        /* Expandable content area */
        .faq-answer-wrap {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 24px;
        }

        .faq-card-custom.expanded .faq-answer-wrap {
          max-height: 300px;
          padding: 0 24px 22px 24px;
          border-top: 1px dashed rgba(193, 16, 105, 0.08);
          margin-top: -2px;
        }

        .faq-answer-text {
          font-size: 14.5px;
          line-height: 1.7;
          color: #555555;
          margin: 0;
          padding-top: 16px;
        }

        /* Help Box */
        .faq-help-card {
          margin-top: 50px;
          background: linear-gradient(135deg, #c11069 0%, #920b4e 100%);
          border-radius: 16px;
          padding: 30px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 8px 24px rgba(193, 16, 105, 0.15);
        }

        .faq-help-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .faq-help-desc {
          font-size: 14px;
          opacity: 0.9;
          max-width: 500px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .faq-help-btn {
          background: #ffffff;
          color: #c11069;
          border: none;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 24px;
          border-radius: 30px;
          text-decoration: none !important;
          transition: all 0.2s ease;
        }

        .faq-help-btn:hover {
          background: #faf0f2;
          transform: scale(1.03);
          color: #920b4e;
        }
      `}),(0,a.jsxs)(`div`,{className:`faq-container`,children:[(0,a.jsxs)(`div`,{className:`faq-search-box`,children:[(0,a.jsx)(`span`,{className:`faq-search-icon`,children:`🔍`}),(0,a.jsx)(`input`,{type:`text`,className:`faq-search-input`,placeholder:`Search FAQs (e.g. measurements, tailoring, Aari embroidery)...`,value:n,onChange:e=>{r(e.target.value),o(null)}})]}),(0,a.jsx)(`div`,{className:`faq-categories-wrap`,children:l.map(n=>(0,a.jsxs)(`button`,{type:`button`,className:`faq-cat-pill ${e===n.id?`active`:``}`,onClick:()=>{t(n.id),o(null)},children:[(0,a.jsx)(`span`,{children:n.icon}),(0,a.jsx)(`span`,{children:n.label})]},n.id))}),(0,a.jsx)(`div`,{className:`faq-accordion-stack`,children:u.length===0?(0,a.jsxs)(`div`,{className:`text-center py-5 rounded-3`,style:{background:`#ffffff`,border:`1px dashed rgba(193, 16, 105, 0.15)`},children:[(0,a.jsx)(`span`,{style:{fontSize:32},children:`🔍`}),(0,a.jsxs)(`p`,{className:`mt-3 mb-0 text-muted`,children:[`No matching questions found for "`,n,`". Try searching for another topic.`]})]}):u.map((e,t)=>{let n=i===t;return(0,a.jsxs)(`div`,{className:`faq-card-custom ${n?`expanded`:``}`,children:[(0,a.jsxs)(`button`,{type:`button`,className:`faq-card-header-custom`,onClick:()=>o(n?null:t),children:[(0,a.jsx)(`h5`,{className:`faq-card-question`,children:e.q}),(0,a.jsx)(`div`,{className:`faq-chevron`,children:`▼`})]}),(0,a.jsx)(`div`,{className:`faq-answer-wrap`,children:(0,a.jsx)(`p`,{className:`faq-answer-text`,children:e.a})})]},t)})}),(0,a.jsxs)(`div`,{className:`faq-help-card`,children:[(0,a.jsx)(`h6`,{className:`faq-help-title`,children:`Still have questions?`}),(0,a.jsx)(`p`,{className:`faq-help-desc`,children:`If you need assistance with custom blouse sizing, bridal booking calendars, or order alterations, get in touch with our design team.`}),(0,a.jsx)(`a`,{href:`tel:+919597220129`,className:`faq-help-btn`,children:`📞 Contact Support: +91 95972 20129`})]})]})]})}var d=()=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i,{title:`Orders FAQs | Indian Ladies Fashion`,description:`Find answers to frequently asked questions about Indian Ladies Fashion orders, custom tailoring measurements, Aari embroidery timetables, bulk orders, and return policies.`}),(0,a.jsx)(o,{}),(0,a.jsx)(u,{})]});export{d as default};