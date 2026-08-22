import{j as e,L as g,D as E,o as ee,r as c,s as te,q as Y,v as oe,w as L,f as s,h as O,A as ae,a as re}from"./index-CpPinRpr.js";import{a as se,s as U,e as v,r as H,b as ne,c as ce,d as ie,M as le}from"./MayBe-B9xh5P6a.js";import{s as de}from"./shop-odQY3QR1.js";import{P as pe}from"./PageMeta-DtzGqss2.js";import"./ProductCard-DmSF-RHm.js";import"./WishlistButton-Dm1JEQ9t.js";import"./productViewStore-Boy1Sha1.js";import"./TfSwiper-C589o6k7.js";import"./shop-product-RZ8zQmue.js";function xe(){return e.jsx("section",{className:"section-page-title text-center flat-spacing-2 pb-0",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(g,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01",children:"Shopping Cart"})]}),e.jsx("h3",{children:"Shopping Cart"})]})})})}function fe(){const i=E(t=>t.cartProducts),o=E(t=>t.updateQuantity),n=E(t=>t.totalPrice),{isLoggedIn:p}=ee(),[w,N]=c.useState(""),[y,m]=c.useState(""),[k,j]=c.useState(0),[D,f]=c.useState(""),[q,z]=c.useState(!1),[l,M]=c.useState(null),[x,I]=c.useState(!1),[G,J]=c.useState(50),[C]=c.useState(100);c.useMemo(()=>{te.get().then(t=>{if(t.data.success&&t.data.data){const r=t.data.data;typeof r.shipping_charge=="number"&&J(r.shipping_charge)}}).catch(t=>console.error("Failed to load settings",t))},[]),c.useEffect(()=>{if(!p||n<=0)return;const t=se();if(t){m(t.code),j(t.discount);return}const r=sessionStorage.getItem("sk_affiliate_ref");if(!r)return;let a=!1;return z(!0),Y.apply({code:r,order_amount:n}).then(u=>{if(a)return;const d=u.data;d.success&&d.data?(m(d.data.code),j(d.data.discount),U({code:d.data.code,discount:d.data.discount})):f(d.message??"Invalid affiliate promo code.")}).catch(u=>{if(a)return;const d=u?.response?.data?.message;f(d??"Could not apply affiliate promo code.")}).finally(()=>{a||z(!1)}),()=>{a=!0}},[p,n]),c.useEffect(()=>{if(!p){M(null);return}let t=!1;const r=a=>{t||(M(a),a&&!H(a)&&x&&(I(!1),v(!1)))};return oe.getRoyalty().then(a=>{const u=a.data?.data??null;if(u){r(u);return}return L.get().then(d=>{r(d.data?.data?.summary?.royalty??null)})}).catch(()=>{L.get().then(a=>r(a.data?.data?.summary?.royalty??null)).catch(()=>{t||M(null)})}),()=>{t=!0}},[p,i.length,n]);const T=t=>{I(t),v(t)};c.useEffect(()=>{i.length===0&&x&&(I(!1),v(!1))},[i.length,x]);const F=async()=>{const t=w.trim().toUpperCase();if(t){if(!p){f("Please login to apply a promo code.");return}z(!0),f("");try{const a=(await Y.apply({code:t,order_amount:n})).data;a.success&&a.data?(m(a.data.code),j(a.data.discount),N(""),U({code:a.data.code,discount:a.data.discount})):f(a.message??"Invalid promo code.")}catch(r){const a=r?.response?.data?.message;f(a??"Invalid or expired promo code.")}finally{z(!1)}}},X=()=>{m(""),j(0),f(""),U(null)},A=k,S=n<=0||n>=C?0:G,P=Math.max(0,n-A)+S,V=!!l&&l.enabled!==!1&&(!!l.show_on_cart||!!l.can_redeem||Number(l.points)>0),h=V&&H(l),B=ne(l),_=h?"":ce(l),Q=h&&P>0,b=x&&Q?Math.min(Number(l?.balance_rm||0),P):0,$=Math.max(0,P-b),R=Math.max(0,C-n),W=(t,r,a)=>{ae(t,r,a)},Z=(t,r,a,u)=>{if(r<1){W(t,a,u);return}o(t,r,a),L.update({product_id:Number(t),quantity:r,...a!=null?{variant_id:a}:{}}).catch(()=>{})};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .classic-cart-section {
          padding: 48px 0 64px;
          background-color: #fafafa;
          min-height: 60vh;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }
        .classic-cart-title {
          font-size: 28px;
          font-weight: 800;
          color: #1a202c;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }
        .classic-cart-subtitle {
          font-size: 14px;
          color: #718096;
          margin-bottom: 32px;
        }
        .classic-cart-table-wrap {
          background: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .classic-cart-table {
          width: 100%;
          border-collapse: collapse;
        }
        .classic-cart-table thead tr {
          background-color: #f7f8fa;
          border-bottom: 2px solid #e8ecf0;
        }
        .classic-cart-table thead th {
          padding: 14px 20px;
          font-size: 11px;
          font-weight: 700;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          text-align: left;
        }
        .classic-cart-table thead th.col-total {
          text-align: right;
        }
        .classic-cart-table thead th.col-qty {
          text-align: center;
        }
        .classic-cart-table tbody tr {
          border-bottom: 1px solid #f0f2f5;
          transition: background-color 0.15s ease;
        }
        .classic-cart-table tbody tr:last-child {
          border-bottom: none;
        }
        .classic-cart-table tbody tr:hover {
          background-color: #fafbfc;
        }
        .classic-cart-table td {
          padding: 20px;
          vertical-align: middle;
        }
        .cart-product-cell {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cart-product-img {
          width: 80px;
          height: 88px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e8ecf0;
          background-color: #f7f8fa;
        }
        .cart-product-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cart-product-info .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          text-decoration: none;
          line-height: 1.4;
          display: block;
          margin-bottom: 4px;
          transition: color 0.15s;
        }
        .cart-product-info .product-name:hover {
          color: #3ec1bc;
        }
        .cart-product-info .product-meta {
          font-size: 12px;
          color: #a0aec0;
          margin-bottom: 2px;
        }
        .cart-product-info .product-meta span {
          font-weight: 600;
          color: #718096;
        }
        .cart-remove-btn {
          font-size: 12px;
          color: #fc8181;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .cart-remove-btn:hover {
          color: #e53e3e;
        }
        .cart-price-cell {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
        }
        .cart-qty-cell {
          text-align: center;
        }
        .qty-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }
        .qty-stepper button {
          background: none;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 16px;
          color: #4a5568;
          font-weight: 500;
          line-height: 1;
          transition: background 0.15s;
        }
        .qty-stepper button:hover {
          background-color: #f7fafc;
        }
        .qty-stepper .qty-val {
          font-size: 14px;
          font-weight: 700;
          color: #1a202c;
          min-width: 32px;
          text-align: center;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          padding: 8px 4px;
          line-height: 1;
        }
        .cart-total-cell {
          text-align: right;
          font-size: 15px;
          font-weight: 700;
          color: #1a202c;
        }

        /* Promo + Royalty */
        .classic-promo-wrap {
          background: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 12px;
          padding: 20px;
          margin-top: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .classic-promo-wrap label {
          font-size: 12px;
          font-weight: 700;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          display: block;
          margin-bottom: 10px;
        }
        .promo-input-row {
          display: flex;
          gap: 10px;
        }
        .promo-input-row input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          outline: none;
          color: #2d3748;
          transition: border-color 0.15s;
          background: #fafafa;
        }
        .promo-input-row input:focus {
          border-color: #3ec1bc;
          background: #fff;
        }
        .promo-apply-btn {
          background-color: #3ec1bc;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.15s;
        }
        .promo-apply-btn:hover { background-color: #2da8a3; }
        .promo-apply-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .promo-applied-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .promo-applied-text { font-size: 13px; color: #166534; font-weight: 600; }
        .promo-remove-btn {
          font-size: 12px;
          color: #dc2626;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }
        .promo-error { font-size: 12px; color: #dc2626; margin-top: 8px; }
        .royalty-box {
          margin-top: 12px;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 14px;
        }
        .royalty-box.active { background: #fffbeb; }
        .royalty-box.locked { border-color: #e2e8f0; background: #f8fafc; }
        .royalty-box .royalty-title { font-size: 13px; font-weight: 700; color: #92400e; }
        .royalty-box .royalty-sub { font-size: 12px; color: #78350f; margin-top: 3px; }
        .royalty-unlock-note {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .royalty-apply-btn {
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          padding: 6px 14px;
          border: none;
          cursor: pointer;
          background: #f59e0b;
          color: white;
          transition: background 0.15s;
        }
        .royalty-apply-btn:hover { background: #d97706; }
        .royalty-apply-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .royalty-remove-btn {
          font-size: 12px;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          color: #dc2626;
        }

        /* Order Summary Sidebar */
        .classic-summary-card {
          background: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 100px;
        }
        .summary-card-header {
          background: #f7f8fa;
          padding: 16px 24px;
          border-bottom: 1px solid #e8ecf0;
        }
        .summary-card-header h5 {
          font-size: 13px;
          font-weight: 700;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 0;
        }
        .summary-card-body {
          padding: 20px 24px;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
        }
        .summary-line .label { color: #718096; font-weight: 500; }
        .summary-line .value { font-weight: 600; color: #2d3748; }
        .summary-line .value.free { color: #38a169; }
        .summary-line .value.discount { color: #38a169; }
        .summary-line .value.royalty { color: #d97706; }
        .summary-freeship-note {
          font-size: 11px;
          color: #a0aec0;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: #f7f8fa;
          border-radius: 6px;
          line-height: 1.5;
        }
        .summary-divider {
          height: 1px;
          background: #e8ecf0;
          margin: 16px 0;
        }
        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .summary-total-label {
          font-size: 16px;
          font-weight: 700;
          color: #1a202c;
        }
        .summary-total-value {
          font-size: 22px;
          font-weight: 800;
          color: #3ec1bc;
          letter-spacing: -0.5px;
        }
        .checkout-action-btn {
          display: block;
          width: 100%;
          background-color: #3ec1bc;
          color: #ffffff;
          text-align: center;
          padding: 15px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s ease;
          margin-bottom: 12px;
        }
        .checkout-action-btn:hover { background-color: #2da8a3; color: #fff; }
        .continue-shopping-link {
          display: block;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #718096;
          text-decoration: none;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .continue-shopping-link:hover {
          background: #f7f8fa;
          color: #4a5568;
        }
        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11px;
          color: #a0aec0;
          margin-top: 14px;
        }

        /* Free shipping progress banner on cart page */
        .cart-freeship-banner {
          background: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .freeship-banner-info {
          font-size: 13px;
          color: #2d3748;
          margin-bottom: 8px;
        }
        .freeship-progress-track {
          height: 8px;
          background: #edf2f7;
          border-radius: 4px;
          overflow: hidden;
        }
        .freeship-progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        /* Mobile Sticky Bottom Bar */
        .mobile-cart-sticky-bar {
          display: none;
        }
        @media (max-width: 991px) {
          .mobile-cart-sticky-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 990;
            background: #ffffff;
            padding: 12px 16px max(12px, env(safe-area-inset-bottom, 12px));
            border-top: 1px solid #e2e8f0;
            box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.12);
          }
          .mobile-bar-info {
            display: flex;
            flex-direction: column;
          }
          .mobile-bar-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          .mobile-bar-total {
            font-size: 19px;
            font-weight: 800;
            color: #3ec1bc;
            letter-spacing: -0.3px;
          }
          .mobile-bar-checkout-btn {
            background-color: #3ec1bc;
            color: #ffffff;
            border: none;
            border-radius: 10px;
            padding: 12px 18px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 14px rgba(62, 193, 188, 0.35);
          }
          .classic-cart-section {
            padding-bottom: 100px !important;
          }
        }

        /* Responsive Mobile Cart Table */
        @media (max-width: 767px) {
          .classic-cart-table thead {
            display: none;
          }
          .classic-cart-table, 
          .classic-cart-table tbody, 
          .classic-cart-table tr, 
          .classic-cart-table td {
            display: block;
            width: 100%;
          }
          .classic-cart-table tbody tr {
            padding: 16px;
            margin-bottom: 14px;
            background: #ffffff;
            border: 1px solid #e8ecf0;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          }
          .classic-cart-table td {
            padding: 8px 0;
            border: none;
          }
          .cart-product-cell {
            margin-bottom: 8px;
          }
          .cart-price-cell {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-top: 1px dashed #edf2f7;
            font-size: 14px;
          }
          .cart-price-cell::before {
            content: "Unit Price";
            font-size: 12px;
            color: #718096;
            font-weight: 500;
          }
          .cart-qty-cell {
            text-align: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-top: 1px dashed #edf2f7;
          }
          .cart-qty-cell::before {
            content: "Quantity";
            font-size: 12px;
            color: #718096;
            font-weight: 500;
          }
          .cart-total-cell {
            text-align: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-top: 1px dashed #edf2f7;
            font-size: 15px;
          }
          .cart-total-cell::before {
            content: "Subtotal";
            font-size: 12px;
            color: #1a202c;
            font-weight: 700;
          }
        }

        /* Empty state */
        .classic-cart-empty {
          text-align: center;
          padding: 80px 24px;
          background: #fff;
          border: 1px solid #e8ecf0;
          border-radius: 12px;
        }
        .classic-cart-empty .empty-icon { font-size: 56px; opacity: 0.3; display: block; margin-bottom: 20px; }
        .classic-cart-empty h4 { font-size: 22px; font-weight: 800; color: #1a202c; margin-bottom: 8px; }
        .classic-cart-empty p { font-size: 14px; color: #a0aec0; margin-bottom: 28px; }
        .classic-cart-empty a {
          display: inline-block;
          background: #3ec1bc;
          color: white;
          padding: 13px 32px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s;
        }
        .classic-cart-empty a:hover { background: #2da8a3; }
      `}),e.jsx("section",{className:"classic-cart-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h1",{className:"classic-cart-title",children:"Shopping Cart"}),e.jsx("p",{className:"classic-cart-subtitle",children:i.length===0?"Your cart is empty":`${i.length} item${i.length>1?"s":""} in your cart`}),i.length>0&&e.jsxs("div",{className:"cart-freeship-banner",children:[e.jsx("div",{className:"freeship-banner-info",children:R===0?e.jsxs("span",{style:{color:"#166534",fontWeight:"700"},children:["🎉 Congratulations! You have unlocked ",e.jsx("strong",{children:"FREE Shipping!"})]}):e.jsxs("span",{children:["🚚 Add ",e.jsx("strong",{children:s(R)})," more to get ",e.jsx("strong",{children:"FREE Shipping"})," on your order!"]})}),e.jsx("div",{className:"freeship-progress-track",children:e.jsx("div",{className:"freeship-progress-fill",style:{width:`${Math.min(100,Math.round(n/C*100))}%`,backgroundColor:R===0?"#22c55e":"#3ec1bc"}})})]}),e.jsx("div",{className:"row",children:i.length===0?e.jsx("div",{className:"col-12",children:e.jsxs("div",{className:"classic-cart-empty",children:[e.jsx("span",{className:"empty-icon",children:"🛒"}),e.jsx("h4",{children:"Your cart is empty"}),e.jsx("p",{children:"Add items from the shop to see them here."}),e.jsx(g,{to:"/shop-default",children:"Continue Shopping"})]})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"col-lg-8 mb-4 mb-lg-0 animate-fade-in-up delay-100",children:[e.jsx("div",{className:"classic-cart-table-wrap",children:e.jsxs("table",{className:"classic-cart-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50%"},children:"Product"}),e.jsx("th",{children:"Price"}),e.jsx("th",{className:"col-qty",children:"Quantity"}),e.jsx("th",{className:"col-total",children:"Total"})]})}),e.jsx("tbody",{children:i.map((t,r)=>e.jsx(ue,{item:t,onRemove:()=>W(t.id,t.selectedVariantId,r),onQtyChange:a=>Z(t.id,a,t.selectedVariantId,r)},`${t.id}-${t.selectedVariantId??"base"}-${r}`))})]})}),e.jsxs("div",{className:"classic-promo-wrap",children:[e.jsx("label",{children:"Voucher / Promo Code"}),y?e.jsxs("div",{className:"promo-applied-row",children:[e.jsxs("span",{className:"promo-applied-text",children:["✓ ",e.jsx("strong",{children:y})," applied — you save ",s(k)]}),e.jsx("button",{type:"button",className:"promo-remove-btn",onClick:X,children:"Remove"})]}):e.jsxs("div",{className:"promo-input-row",children:[e.jsx("input",{type:"text",placeholder:"Enter promo code",value:w,onChange:t=>{N(t.target.value.toUpperCase()),f("")},onKeyDown:t=>t.key==="Enter"&&F(),disabled:q}),e.jsx("button",{className:"promo-apply-btn",type:"button",onClick:F,disabled:q,children:q?"…":"Apply"})]}),D&&e.jsx("p",{className:"promo-error",children:D}),V&&e.jsx("div",{className:`royalty-box${x?" active":""}${h?"":" locked"}`,children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{className:"royalty-title",children:"💎 Pay with Royalty Points"}),e.jsxs("div",{className:"royalty-sub",children:["You have ",e.jsx("strong",{children:l.points})," pts (",s(l.balance_rm),")  · ",l.conversion_label??"500 pts = RM 100",P<=0?" · Add items to apply":h?x&&b>0?` · Pays ${s(b)}; due ${s($)} (wallet / online at checkout)`:" · Deducts from bill; pay remainder with wallet / online at checkout":` · Unlocks at ${s(ie(l))} and above`]}),!h&&_&&e.jsx("div",{className:"royalty-unlock-note",children:B>0?`You have ${s(B)} left to unlock royalty points.`:_})]}),x?e.jsx("button",{type:"button",className:"royalty-remove-btn",onClick:()=>T(!1),children:"Remove"}):e.jsx("button",{type:"button",className:"royalty-apply-btn",disabled:!Q,title:h?void 0:_,onClick:()=>T(!0),children:h?"Apply":"Locked"})]})})]})]}),e.jsx("div",{className:"col-lg-4 animate-fade-in-up delay-200",children:e.jsxs("div",{className:"classic-summary-card",children:[e.jsx("div",{className:"summary-card-header",children:e.jsx("h5",{children:"Order Summary"})}),e.jsxs("div",{className:"summary-card-body",children:[e.jsxs("div",{className:"summary-line",children:[e.jsxs("span",{className:"label",children:["Subtotal (",i.length," item",i.length>1?"s":"",")"]}),e.jsx("span",{className:"value",children:s(n)})]}),A>0&&e.jsxs("div",{className:"summary-line",children:[e.jsxs("span",{className:"label",children:["Discount (",y,")"]}),e.jsxs("span",{className:"value discount",children:["−",s(A)]})]}),e.jsxs("div",{className:"summary-line",children:[e.jsx("span",{className:"label",children:"Shipping"}),e.jsx("span",{className:`value${S===0?" free":""}`,children:S===0?"Free":s(S)})]}),n>0&&n<C&&e.jsxs("div",{className:"summary-freeship-note",children:["🚚 Spend ",s(R)," more to unlock ",e.jsx("strong",{children:"free shipping"})]}),b>0&&e.jsxs("div",{className:"summary-line",children:[e.jsx("span",{className:"label",children:"Royalty Points"}),e.jsxs("span",{className:"value royalty",children:["−",s(b)]})]}),e.jsx("div",{className:"summary-divider"}),e.jsxs("div",{className:"summary-total-row",children:[e.jsx("span",{className:"summary-total-label",children:b>0?"Amount Due":"Total"}),e.jsx("span",{className:"summary-total-value",children:s($)})]}),e.jsx(g,{to:"/checkout",id:"checkout-btn",className:"checkout-action-btn",onClick:t=>{p?v(x):(t.preventDefault(),O.getState().openModal("signIn",{redirect:"/checkout"}))},children:"Proceed to Checkout"}),e.jsx(g,{to:"/shop-default",className:"continue-shopping-link",children:"← Continue Shopping"}),e.jsxs("div",{className:"secure-badge",children:[e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]}),"Secure checkout · SSL encrypted"]})]})]})})]})})]})}),i.length>0&&e.jsxs("div",{className:"mobile-cart-sticky-bar",children:[e.jsxs("div",{className:"mobile-bar-info",children:[e.jsx("span",{className:"mobile-bar-label",children:b>0?"Amount Due":"Total"}),e.jsx("span",{className:"mobile-bar-total",children:s($)})]}),e.jsxs(g,{to:"/checkout",className:"mobile-bar-checkout-btn",onClick:t=>{p?v(x):(t.preventDefault(),O.getState().openModal("signIn",{redirect:"/checkout"}))},children:[e.jsx("span",{children:"Proceed to Checkout"}),e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]})]})}const ue=c.memo(function({item:o,onRemove:n,onQtyChange:p}){const w=o.img??o.images?.[0]?.src??"/frontend/assets/images/product/product-1.jpg",N=re(w),y=o.selectedColor??o.colors?.[0]?.label??null,m=o.selectedSize??null,k=o.unit_label??null,j=o.price*o.quantity;return e.jsxs("tr",{className:"tf-cart_item each-prd file-delete",children:[e.jsx("td",{children:e.jsxs("div",{className:"cart-product-cell",children:[e.jsx("div",{className:"cart-product-img",children:e.jsx(g,{to:`/product-detail/${o.id}`,children:e.jsx("img",{loading:"lazy",src:N,alt:o.name})})}),e.jsxs("div",{className:"cart-product-info",children:[e.jsx(g,{to:`/product-detail/${o.id}`,className:"product-name",children:o.name}),o.category&&e.jsxs("div",{className:"product-meta",children:["Category: ",e.jsx("span",{children:o.category})]}),k&&e.jsxs("div",{className:"product-meta",children:["Pack: ",e.jsx("span",{children:k})]}),y&&e.jsxs("div",{className:"product-meta",children:["Color: ",e.jsx("span",{children:y})]}),m&&e.jsxs("div",{className:"product-meta",children:["Size: ",e.jsx("span",{children:m})]}),e.jsxs("button",{type:"button",className:"cart-remove-btn",onClick:n,children:[e.jsxs("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}),"Remove"]})]})]})}),e.jsx("td",{className:"cart-price-cell","data-cart-title":"Price",children:s(o.price)}),e.jsx("td",{className:"cart-qty-cell","data-cart-title":"Quantity",children:e.jsxs("div",{className:"qty-stepper",children:[e.jsx("button",{type:"button",onClick:()=>p(o.quantity-1),"aria-label":"Decrease quantity",children:"−"}),e.jsx("span",{className:"qty-val",children:o.quantity}),e.jsx("button",{type:"button",onClick:()=>{o.stock!==void 0&&o.quantity>=o.stock||p(o.quantity+1)},"aria-label":"Increase quantity",disabled:o.stock!==void 0&&o.quantity>=o.stock,style:o.stock!==void 0&&o.quantity>=o.stock?{opacity:.5,cursor:"not-allowed"}:{},title:o.stock!==void 0&&o.quantity>=o.stock?`Only ${o.stock} in stock`:"",children:"+"})]})}),e.jsx("td",{className:"cart-total-cell",children:s(j)})]})}),K=de("View cart","Review items in your bag, apply discounts, and proceed to checkout."),ze=()=>e.jsxs(e.Fragment,{children:[e.jsx(pe,{title:K.title,description:K.description}),e.jsx(xe,{}),e.jsx(fe,{}),e.jsx(le,{})]});export{ze as default};
