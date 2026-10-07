import{j as e,L as j,E as B,p as le,r as s,s as de,v as X,q as Z,w as F,f as n,G as ee,i as te,B as pe,a as xe}from"./index-CiR48riM.js";import{a as fe,s as W,e as _,r as oe,b as ue,c as he,d as me,M as be}from"./MayBe-DjTyk7zE.js";import{q as ge}from"./pincodeShipping-XAauMaTD.js";import{s as ye}from"./shop-DJh576vD.js";import{P as je}from"./PageMeta-DCdP8Cni.js";import"./ProductCard-BCGmg6rf.js";import"./WishlistButton-CO7VM6xl.js";import"./productViewStore-BN9IhpXt.js";import"./TfSwiper-BLeuJz8B.js";import"./shop-product-idSW1x0e.js";function ve(){return e.jsx("section",{className:"section-page-title text-center flat-spacing-2 pb-0",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(j,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01",children:"Shopping Cart"})]}),e.jsx("h3",{children:"Shopping Cart"})]})})})}function ke(){const i=B(t=>t.cartProducts),o=B(t=>t.updateQuantity),x=B(t=>t.totalPrice),{isLoggedIn:l}=le(),[C,P]=s.useState(""),[v,b]=s.useState(""),[w,k]=s.useState(0),[Q,h]=s.useState(""),[A,R]=s.useState(!1),[d,M]=s.useState(null),[u,E]=s.useState(!1),[$,D]=s.useState([]),[V,I]=s.useState(null),[re,se]=s.useState({shipping_charge:50,free_shipping_above:999,non_delivery_pincodes:[],pincode_extra_charge_ranges:[]});s.useEffect(()=>{de.get().then(t=>{if(t.data.success&&t.data.data){const r=t.data.data;se({shipping_charge:typeof r.shipping_charge=="number"?r.shipping_charge:50,free_shipping_above:typeof r.free_shipping_above=="number"?r.free_shipping_above:999,non_delivery_pincodes:r.non_delivery_pincodes??[],pincode_extra_charge_ranges:r.pincode_extra_charge_ranges??[]})}}).catch(t=>console.error("Failed to load settings",t))},[]),s.useEffect(()=>{if(!l){D([]),I(null);return}X.getAddresses().then(t=>{const r=t.data.data??[];D(r);const a=Number(sessionStorage.getItem("checkout_address_id")),f=r.find(c=>c.id===a)??r.find(c=>Number(c.is_default)===1)??r[0];I(f?.id??null)}).catch(()=>{D([]),I(null)})},[l]),s.useEffect(()=>{if(!l||x<=0)return;const t=fe();if(t){b(t.code),k(t.discount);return}const r=sessionStorage.getItem("sk_affiliate_ref");if(!r)return;let a=!1;return R(!0),Z.apply({code:r,order_amount:x}).then(f=>{if(a)return;const c=f.data;c.success&&c.data?(b(c.data.code),k(c.data.discount),W({code:c.data.code,discount:c.data.discount})):h(c.message??"Invalid affiliate promo code.")}).catch(f=>{if(a)return;const c=f?.response?.data?.message;h(c??"Could not apply affiliate promo code.")}).finally(()=>{a||R(!1)}),()=>{a=!0}},[l,x]),s.useEffect(()=>{if(!l){M(null);return}let t=!1;const r=a=>{t||(M(a),a&&!oe(a)&&u&&(E(!1),_(!1)))};return X.getRoyalty().then(a=>{const f=a.data?.data??null;if(f){r(f);return}return F.get().then(c=>{r(c.data?.data?.summary?.royalty??null)})}).catch(()=>{F.get().then(a=>r(a.data?.data?.summary?.royalty??null)).catch(()=>{t||M(null)})}),()=>{t=!0}},[l,i.length,x]);const Y=t=>{E(t),_(t)};s.useEffect(()=>{i.length===0&&u&&(E(!1),_(!1))},[i.length,u]);const H=async()=>{const t=C.trim().toUpperCase();if(t){if(!l){h("Please login to apply a promo code.");return}R(!0),h("");try{const a=(await Z.apply({code:t,order_amount:x})).data;a.success&&a.data?(b(a.data.code),k(a.data.discount),P(""),W({code:a.data.code,discount:a.data.discount})):h(a.message??"Invalid promo code.")}catch(r){const a=r?.response?.data?.message;h(a??"Invalid or expired promo code.")}finally{R(!1)}}},ne=()=>{b(""),k(0),h(""),W(null)},L=w,T=Math.max(0,x-L),m=$.find(t=>t.id===V)??null,p=ge(m?.pincode,T,re),N=x<=0||!p.deliverable?0:p.shipping,q=T+N,O=!!d&&d.enabled!==!1&&(!!d.show_on_cart||!!d.can_redeem||Number(d.points)>0),g=O&&oe(d),G=ue(d),U=g?"":he(d),K=g&&q>0,y=u&&K?Math.min(Number(d?.balance_rm||0),q):0,S=Math.max(0,q-y),z=p.amount_remaining,ie=t=>{I(t),sessionStorage.setItem("checkout_address_id",String(t))},J=(t,r,a)=>{pe(t,r,a)},ce=(t,r,a,f)=>{if(r<1){J(t,a,f);return}o(t,r,a),F.update({product_id:Number(t),quantity:r,...a!=null?{variant_id:a}:{}}).catch(()=>{})};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
      `}),e.jsx("section",{className:"classic-cart-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h1",{className:"classic-cart-title",children:"Shopping Cart"}),e.jsx("p",{className:"classic-cart-subtitle",children:i.length===0?"Your cart is empty":`${i.length} item${i.length>1?"s":""} in your cart`}),i.length>0&&p.deliverable&&p.free_threshold>0&&e.jsxs("div",{className:"cart-freeship-banner",children:[e.jsx("div",{className:"freeship-banner-info",children:z===0?e.jsxs("span",{style:{color:"#166534",fontWeight:"700"},children:["🎉 Congratulations! You have unlocked ",e.jsx("strong",{children:"FREE Shipping!"})]}):e.jsxs("span",{children:["🚚 Add ",e.jsx("strong",{children:n(z)})," more to get ",e.jsx("strong",{children:"FREE Shipping"})," on your order!"]})}),e.jsx("div",{className:"freeship-progress-track",children:e.jsx("div",{className:"freeship-progress-fill",style:{width:`${Math.min(100,Math.round(T/p.free_threshold*100))}%`,backgroundColor:z===0?"#22c55e":"#3ec1bc"}})})]}),e.jsx("div",{className:"row",children:i.length===0?e.jsx("div",{className:"col-12",children:e.jsxs("div",{className:"classic-cart-empty",children:[e.jsx("span",{className:"empty-icon",children:"🛒"}),e.jsx("h4",{children:"Your cart is empty"}),e.jsx("p",{children:"Add items from the shop to see them here."}),e.jsx(j,{to:"/shop-default",children:"Continue Shopping"})]})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"col-lg-8 mb-4 mb-lg-0 animate-fade-in-up delay-100",children:[e.jsx("div",{className:"classic-cart-table-wrap",children:e.jsxs("table",{className:"classic-cart-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50%"},children:"Product"}),e.jsx("th",{children:"Price"}),e.jsx("th",{className:"col-qty",children:"Quantity"}),e.jsx("th",{className:"col-total",children:"Total"})]})}),e.jsx("tbody",{children:i.map((t,r)=>e.jsx(we,{item:t,onRemove:()=>J(t.id,t.selectedVariantId,r),onQtyChange:a=>ce(t.id,a,t.selectedVariantId,r)},`${t.id}-${t.selectedVariantId??"base"}-${r}`))})]})}),e.jsxs("div",{className:"classic-promo-wrap",children:[e.jsx("label",{children:"Voucher / Promo Code"}),v?e.jsxs("div",{className:"promo-applied-row",children:[e.jsxs("span",{className:"promo-applied-text",children:["✓ ",e.jsx("strong",{children:v})," applied — you save ",n(w)]}),e.jsx("button",{type:"button",className:"promo-remove-btn",onClick:ne,children:"Remove"})]}):e.jsxs("div",{className:"promo-input-row",children:[e.jsx("input",{type:"text",placeholder:"Enter promo code",value:C,onChange:t=>{P(t.target.value.toUpperCase()),h("")},onKeyDown:t=>t.key==="Enter"&&H(),disabled:A}),e.jsx("button",{className:"promo-apply-btn",type:"button",onClick:H,disabled:A,children:A?"…":"Apply"})]}),Q&&e.jsx("p",{className:"promo-error",children:Q}),O&&e.jsx("div",{className:`royalty-box${u?" active":""}${g?"":" locked"}`,children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{className:"royalty-title",children:"💎 Pay with Royalty Points"}),e.jsxs("div",{className:"royalty-sub",children:["You have ",e.jsx("strong",{children:d.points})," pts (",n(d.balance_rm),")  · ",d.conversion_label??"500 pts = RM 100",q<=0?" · Add items to apply":g?u&&y>0?` · Pays ${n(y)}; due ${n(S)} (wallet / online at checkout)`:" · Deducts from bill; pay remainder with wallet / online at checkout":` · Unlocks at ${n(me(d))} and above`]}),!g&&U&&e.jsx("div",{className:"royalty-unlock-note",children:G>0?`You have ${n(G)} left to unlock royalty points.`:U})]}),u?e.jsx("button",{type:"button",className:"royalty-remove-btn",onClick:()=>Y(!1),children:"Remove"}):e.jsx("button",{type:"button",className:"royalty-apply-btn",disabled:!K,title:g?void 0:U,onClick:()=>Y(!0),children:g?"Apply":"Locked"})]})})]})]}),e.jsx("div",{className:"col-lg-4 animate-fade-in-up delay-200",children:e.jsxs("div",{className:"classic-summary-card",children:[e.jsx("div",{className:"summary-card-header",children:e.jsx("h5",{children:"Order Summary"})}),e.jsxs("div",{className:"summary-card-body",children:[l&&$.length>0&&e.jsxs("div",{style:{marginBottom:18,paddingBottom:16,borderBottom:"1px solid #edf0f2"},children:[e.jsx("label",{htmlFor:"cart-delivery-address",style:{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:7},children:"Deliver to saved address"}),e.jsx("select",{id:"cart-delivery-address",value:V??"",onChange:t=>ie(Number(t.target.value)),style:{width:"100%",border:"1px solid #dfe4e8",borderRadius:8,padding:"9px 10px",background:"#fff",fontSize:13},children:$.map(t=>e.jsxs("option",{value:t.id,children:[t.label||"Address"," — ",t.city,", ",t.pincode]},t.id))}),m&&e.jsxs("div",{style:{fontSize:12,color:"#64748b",lineHeight:1.5,marginTop:7},children:[m.line1,m.line2?`, ${m.line2}`:"",", ",m.city,", ",m.state," ",m.pincode]}),!p.deliverable&&e.jsx("div",{style:{fontSize:12,color:"#dc2626",fontWeight:600,marginTop:7},children:p.message})]}),e.jsxs("div",{className:"summary-line",children:[e.jsxs("span",{className:"label",children:["Subtotal (",i.length," item",i.length>1?"s":"",")"]}),e.jsx("span",{className:"value",children:n(x)})]}),L>0&&e.jsxs("div",{className:"summary-line",children:[e.jsxs("span",{className:"label",children:["Discount (",v,")"]}),e.jsxs("span",{className:"value discount",children:["−",n(L)]})]}),e.jsxs("div",{className:"summary-line",children:[e.jsx("span",{className:"label",children:p.scenario==="extra_charge"?"Delivery charges":"Shipping"}),e.jsx("span",{className:`value${N===0?" free":""}`,children:p.deliverable?N===0?"Free":n(N):"Not available"})]}),p.deliverable&&N>0&&z>0&&e.jsxs("div",{className:"summary-freeship-note",children:["🚚 Spend ",n(z)," more to unlock ",e.jsx("strong",{children:"free shipping"})]}),y>0&&e.jsxs("div",{className:"summary-line",children:[e.jsx("span",{className:"label",children:"Royalty Points"}),e.jsxs("span",{className:"value royalty",children:["−",n(y)]})]}),e.jsx("div",{className:"summary-divider"}),e.jsxs("div",{className:"summary-total-row",children:[e.jsx("span",{className:"summary-total-label",children:y>0?"Amount Due":"Total"}),e.jsx("span",{className:"summary-total-value",children:n(S)})]}),e.jsx(j,{to:"/checkout",id:"checkout-btn",className:"checkout-action-btn",onClick:t=>{if(!p.deliverable){t.preventDefault();return}ee(i,S),l?_(u):(t.preventDefault(),te.getState().openModal("signIn",{redirect:"/checkout"}))},children:"Proceed to Checkout"}),e.jsx(j,{to:"/shop-default",className:"continue-shopping-link",children:"← Continue Shopping"}),e.jsxs("div",{className:"secure-badge",children:[e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]}),"Secure checkout · SSL encrypted"]})]})]})})]})})]})}),i.length>0&&e.jsxs("div",{className:"mobile-cart-sticky-bar",children:[e.jsxs("div",{className:"mobile-bar-info",children:[e.jsx("span",{className:"mobile-bar-label",children:y>0?"Amount Due":"Total"}),e.jsx("span",{className:"mobile-bar-total",children:n(S)})]}),e.jsxs(j,{to:"/checkout",className:"mobile-bar-checkout-btn",onClick:t=>{ee(i,S),l?_(u):(t.preventDefault(),te.getState().openModal("signIn",{redirect:"/checkout"}))},children:[e.jsx("span",{children:"Proceed to Checkout"}),e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]})]})}const we=s.memo(function({item:o,onRemove:x,onQtyChange:l}){const C=o.img??o.images?.[0]?.src??"/frontend/assets/images/product/product-1.jpg",P=xe(C),v=o.selectedColor??o.colors?.[0]?.label??null,b=o.selectedSize??null,w=o.unit_label??null,k=o.price*o.quantity;return e.jsxs("tr",{className:"tf-cart_item each-prd file-delete",children:[e.jsx("td",{children:e.jsxs("div",{className:"cart-product-cell",children:[e.jsx("div",{className:"cart-product-img",children:e.jsx(j,{to:`/product/${o.slug??o.id}`,children:e.jsx("img",{loading:"lazy",src:P,alt:o.name})})}),e.jsxs("div",{className:"cart-product-info",children:[e.jsx(j,{to:`/product/${o.slug??o.id}`,className:"product-name",children:o.name}),o.category&&e.jsxs("div",{className:"product-meta",children:["Category: ",e.jsx("span",{children:o.category})]}),w&&e.jsxs("div",{className:"product-meta",children:["Pack: ",e.jsx("span",{children:w})]}),v&&e.jsxs("div",{className:"product-meta",children:["Color: ",e.jsx("span",{children:v})]}),b&&e.jsxs("div",{className:"product-meta",children:["Size: ",e.jsx("span",{children:b})]}),e.jsxs("button",{type:"button",className:"cart-remove-btn",onClick:x,children:[e.jsxs("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}),"Remove"]})]})]})}),e.jsx("td",{className:"cart-price-cell","data-cart-title":"Price",children:n(o.price)}),e.jsx("td",{className:"cart-qty-cell","data-cart-title":"Quantity",children:e.jsxs("div",{className:"qty-stepper",children:[e.jsx("button",{type:"button",onClick:()=>l(o.quantity-1),"aria-label":"Decrease quantity",children:"−"}),e.jsx("span",{className:"qty-val",children:o.quantity}),e.jsx("button",{type:"button",onClick:()=>{o.stock!==void 0&&o.quantity>=o.stock||l(o.quantity+1)},"aria-label":"Increase quantity",disabled:o.stock!==void 0&&o.quantity>=o.stock,style:o.stock!==void 0&&o.quantity>=o.stock?{opacity:.5,cursor:"not-allowed"}:{},title:o.stock!==void 0&&o.quantity>=o.stock?`Only ${o.stock} in stock`:"",children:"+"})]})}),e.jsx("td",{className:"cart-total-cell",children:n(k)})]})}),ae=ye("View cart","Review items in your bag, apply discounts, and proceed to checkout."),Me=()=>e.jsxs(e.Fragment,{children:[e.jsx(je,{title:ae.title,description:ae.description}),e.jsx(ve,{}),e.jsx(ke,{}),e.jsx(be,{})]});export{Me as default};
