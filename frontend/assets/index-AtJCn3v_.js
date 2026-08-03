import{j as e,L as b,m as G,n as J,r as n,s as X,p as U,q as Z,v as C,f as c,D as ee}from"./index-9tzjSN1n.js";import{a as te,s as I,b as S,M as ae}from"./MayBe-D3s1fP_u.js";import{s as oe}from"./shop-DlOE07eP.js";import{P as re}from"./PageMeta-IC4-gMZV.js";import"./ProductCard-DEJONhc8.js";import"./WishlistButton-DKAF29O1.js";import"./productViewStore-4rcO9nNT.js";import"./TfSwiper-CA-_DhKn.js";import"./shop-product-DqSqTXVQ.js";function se(){return e.jsx("section",{className:"section-page-title text-center flat-spacing-2 pb-0",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(b,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01",children:"Shopping Cart"})]}),e.jsx("h3",{children:"Shopping Cart"})]})})})}function ne(){const{cartProducts:i,setCartProducts:r,updateQuantity:z,totalPrice:s}=G(),{isLoggedIn:u}=J(),[y,j]=n.useState(""),[h,f]=n.useState(""),[M,v]=n.useState(0),[E,m]=n.useState(""),[P,w]=n.useState(!1),[p,R]=n.useState(null),[x,_]=n.useState(!1),[W,B]=n.useState(50),[q,Y]=n.useState(999);n.useMemo(()=>{X.get().then(t=>{if(t.data.success&&t.data.data){const o=t.data.data;typeof o.shipping_charge=="number"&&B(o.shipping_charge),typeof o.free_shipping_above=="number"&&Y(o.free_shipping_above)}}).catch(t=>console.error("Failed to load settings",t))},[]),n.useEffect(()=>{if(!u||s<=0)return;const t=te();if(t){f(t.code),v(t.discount);return}const o=sessionStorage.getItem("sk_affiliate_ref");if(!o)return;let a=!1;return w(!0),U.apply({code:o,order_amount:s}).then(d=>{if(a)return;const l=d.data;l.success&&l.data?(f(l.data.code),v(l.data.discount),I({code:l.data.code,discount:l.data.discount})):m(l.message??"Invalid affiliate promo code.")}).catch(d=>{if(a)return;const l=d?.response?.data?.message;m(l??"Could not apply affiliate promo code.")}).finally(()=>{a||w(!1)}),()=>{a=!0}},[u,s]),n.useEffect(()=>{if(!u){R(null);return}let t=!1;const o=a=>{t||(R(a),a&&!a.can_redeem&&x&&(_(!1),S(!1)))};return Z.getRoyalty().then(a=>{const d=a.data?.data??null;if(d){o(d);return}return C.get().then(l=>{o(l.data?.data?.summary?.royalty??null)})}).catch(()=>{C.get().then(a=>o(a.data?.data?.summary?.royalty??null)).catch(()=>{t||R(null)})}),()=>{t=!0}},[u,i.length,s]);const D=t=>{_(t),S(t)};n.useEffect(()=>{i.length===0&&x&&(_(!1),S(!1))},[i.length,x]);const L=async()=>{const t=y.trim().toUpperCase();if(t){if(!u){m("Please login to apply a promo code.");return}w(!0),m("");try{const a=(await U.apply({code:t,order_amount:s})).data;a.success&&a.data?(f(a.data.code),v(a.data.discount),j(""),I({code:a.data.code,discount:a.data.discount})):m(a.message??"Invalid promo code.")}catch(o){const a=o?.response?.data?.message;m(a??"Invalid or expired promo code.")}finally{w(!1)}}},O=()=>{f(""),v(0),m(""),I(null)},A=M,k=s<=0||s>=q?0:W,N=Math.max(0,s-A)+k,$=!!p&&p.enabled!==!1&&(!!p.show_on_cart||!!p.can_redeem||Number(p.points)>0),T=$&&N>0,g=x&&T?Math.min(Number(p?.balance_rm||0),N):0,V=Math.max(0,N-g),H=Math.max(0,q-s),F=(t,o)=>{r(a=>a.filter(d=>d.id!==t?!0:o==null?d.selectedVariantId!=null:d.selectedVariantId!==o)),C.remove({product_id:Number(t),...o!=null?{variant_id:o}:{}}).catch(()=>{})},K=(t,o,a)=>{if(o<1){F(t,a);return}z(t,o,a),C.update({product_id:Number(t),quantity:o,...a!=null?{variant_id:a}:{}}).catch(()=>{})};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
        .royalty-box .royalty-title { font-size: 13px; font-weight: 700; color: #92400e; }
        .royalty-box .royalty-sub { font-size: 12px; color: #78350f; margin-top: 3px; }
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
      `}),e.jsx("section",{className:"classic-cart-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h1",{className:"classic-cart-title",children:"Shopping Cart"}),e.jsx("p",{className:"classic-cart-subtitle",children:i.length===0?"Your cart is empty":`${i.length} item${i.length>1?"s":""} in your cart`}),e.jsx("div",{className:"row",children:i.length===0?e.jsx("div",{className:"col-12",children:e.jsxs("div",{className:"classic-cart-empty",children:[e.jsx("span",{className:"empty-icon",children:"🛒"}),e.jsx("h4",{children:"Your cart is empty"}),e.jsx("p",{children:"Add items from the shop to see them here."}),e.jsx(b,{to:"/shop-default",children:"Continue Shopping"})]})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"col-lg-8 mb-4 mb-lg-0 animate-fade-in-up delay-100",children:[e.jsx("div",{className:"classic-cart-table-wrap",children:e.jsxs("table",{className:"classic-cart-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"50%"},children:"Product"}),e.jsx("th",{children:"Price"}),e.jsx("th",{className:"col-qty",children:"Quantity"}),e.jsx("th",{className:"col-total",children:"Total"})]})}),e.jsx("tbody",{children:i.map(t=>e.jsx(ce,{item:t,onRemove:()=>F(t.id,t.selectedVariantId),onQtyChange:o=>K(t.id,o,t.selectedVariantId)},`${t.id}-${t.selectedVariantId??"base"}`))})]})}),e.jsxs("div",{className:"classic-promo-wrap",children:[e.jsx("label",{children:"Voucher / Promo Code"}),h?e.jsxs("div",{className:"promo-applied-row",children:[e.jsxs("span",{className:"promo-applied-text",children:["✓ ",e.jsx("strong",{children:h})," applied — you save ",c(M)]}),e.jsx("button",{type:"button",className:"promo-remove-btn",onClick:O,children:"Remove"})]}):e.jsxs("div",{className:"promo-input-row",children:[e.jsx("input",{type:"text",placeholder:"Enter promo code",value:y,onChange:t=>{j(t.target.value.toUpperCase()),m("")},onKeyDown:t=>t.key==="Enter"&&L(),disabled:P}),e.jsx("button",{className:"promo-apply-btn",type:"button",onClick:L,disabled:P,children:P?"…":"Apply"})]}),E&&e.jsx("p",{className:"promo-error",children:E}),$&&e.jsx("div",{className:`royalty-box${x?" active":""}`,children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{className:"royalty-title",children:"💎 Pay with Royalty Points"}),e.jsxs("div",{className:"royalty-sub",children:["You have ",e.jsx("strong",{children:p.points})," pts (",c(p.balance_rm),")  · ",p.conversion_label??"500 pts = RM 100",N<=0?" · Add items to apply":x&&g>0?` · Pays ${c(g)}; due ${c(V)}`:" · Deducts from bill at checkout"]})]}),x?e.jsx("button",{type:"button",className:"royalty-remove-btn",onClick:()=>D(!1),children:"Remove"}):e.jsx("button",{type:"button",className:"royalty-apply-btn",disabled:!T,onClick:()=>D(!0),children:"Apply"})]})})]})]}),e.jsx("div",{className:"col-lg-4 animate-fade-in-up delay-200",children:e.jsxs("div",{className:"classic-summary-card",children:[e.jsx("div",{className:"summary-card-header",children:e.jsx("h5",{children:"Order Summary"})}),e.jsxs("div",{className:"summary-card-body",children:[e.jsxs("div",{className:"summary-line",children:[e.jsxs("span",{className:"label",children:["Subtotal (",i.length," item",i.length>1?"s":"",")"]}),e.jsx("span",{className:"value",children:c(s)})]}),A>0&&e.jsxs("div",{className:"summary-line",children:[e.jsxs("span",{className:"label",children:["Discount (",h,")"]}),e.jsxs("span",{className:"value discount",children:["−",c(A)]})]}),e.jsxs("div",{className:"summary-line",children:[e.jsx("span",{className:"label",children:"Shipping"}),e.jsx("span",{className:`value${k===0?" free":""}`,children:k===0?"Free":c(k)})]}),s>0&&s<q&&e.jsxs("div",{className:"summary-freeship-note",children:["🚚 Spend ",c(H)," more to unlock ",e.jsx("strong",{children:"free shipping"})]}),g>0&&e.jsxs("div",{className:"summary-line",children:[e.jsx("span",{className:"label",children:"Royalty Points"}),e.jsxs("span",{className:"value royalty",children:["−",c(g)]})]}),e.jsx("div",{className:"summary-divider"}),e.jsxs("div",{className:"summary-total-row",children:[e.jsx("span",{className:"summary-total-label",children:g>0?"Amount Due":"Total"}),e.jsx("span",{className:"summary-total-value",children:c(V)})]}),e.jsx(b,{to:"/checkout",id:"checkout-btn",className:"checkout-action-btn",onClick:t=>{u?S(x):(t.preventDefault(),ee.getState().openModal("signIn",{redirect:"/checkout"}))},children:"Proceed to Checkout"}),e.jsx(b,{to:"/shop-default",className:"continue-shopping-link",children:"← Continue Shopping"}),e.jsxs("div",{className:"secure-badge",children:[e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]}),"Secure checkout · SSL encrypted"]})]})]})})]})})]})})]})}const ce=n.memo(function({item:r,onRemove:z,onQtyChange:s}){const u=r.img??r.images?.[0]?.src??"/deal/frontend/assets/images/product/product-1.jpg",y=r.selectedColor??r.colors?.[0]?.label??null,j=r.selectedSize??null,h=r.unit_label??null,f=r.price*r.quantity;return e.jsxs("tr",{className:"tf-cart_item each-prd file-delete",children:[e.jsx("td",{children:e.jsxs("div",{className:"cart-product-cell",children:[e.jsx("div",{className:"cart-product-img",children:e.jsx(b,{to:`/product-detail/${r.id}`,children:e.jsx("img",{loading:"lazy",src:u,alt:r.name})})}),e.jsxs("div",{className:"cart-product-info",children:[e.jsx(b,{to:`/product-detail/${r.id}`,className:"product-name",children:r.name}),r.category&&e.jsxs("div",{className:"product-meta",children:["Category: ",e.jsx("span",{children:r.category})]}),h&&e.jsxs("div",{className:"product-meta",children:["Pack: ",e.jsx("span",{children:h})]}),y&&e.jsxs("div",{className:"product-meta",children:["Color: ",e.jsx("span",{children:y})]}),j&&e.jsxs("div",{className:"product-meta",children:["Size: ",e.jsx("span",{children:j})]}),e.jsxs("button",{type:"button",className:"cart-remove-btn",onClick:z,children:[e.jsxs("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}),"Remove"]})]})]})}),e.jsx("td",{className:"cart-price-cell","data-cart-title":"Price",children:c(r.price)}),e.jsx("td",{className:"cart-qty-cell","data-cart-title":"Quantity",children:e.jsxs("div",{className:"qty-stepper",children:[e.jsx("button",{type:"button",onClick:()=>s(r.quantity-1),"aria-label":"Decrease quantity",children:"−"}),e.jsx("span",{className:"qty-val",children:r.quantity}),e.jsx("button",{type:"button",onClick:()=>s(r.quantity+1),"aria-label":"Increase quantity",children:"+"})]})}),e.jsx("td",{className:"cart-total-cell",children:c(f)})]})}),Q=oe("View cart","Review items in your bag, apply discounts, and proceed to checkout."),be=()=>e.jsxs(e.Fragment,{children:[e.jsx(re,{title:Q.title,description:Q.description}),e.jsx(se,{}),e.jsx(ne,{}),e.jsx(ae,{})]});export{be as default};
