import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{n}from"./chunk-QFMPRPBF-UM0d5nzd.js";import{s as r}from"./api-7JImQkTb.js";import{t as i}from"./useApi-RdyAaYCR.js";import{t as a}from"./jsx-runtime-DdEXjPBp.js";import{t as o}from"./formatPrice-BTsvo7Cc.js";import{n as s,t as c}from"./AccountSection-CKN7l2lG.js";import{t as l}from"./PageMeta-6gZ1jYam.js";var u=e(t(),1),d=a(),f=[{key:`pending`,label:`Order Placed`,icon:`📋`},{key:`confirmed`,label:`Confirmed`,icon:`✅`},{key:`processing`,label:`Processing`,icon:`🔧`},{key:`shipped`,label:`Shipped`,icon:`🚚`},{key:`delivered`,label:`Delivered`,icon:`📦`}],p={pending:{bg:`#fffbeb`,color:`#b45309`,border:`#fef3c7`,label:`Pending`},confirmed:{bg:`#f0f9ff`,color:`#0369a1`,border:`#e0f2fe`,label:`Confirmed`},processing:{bg:`#faf5ff`,color:`#6b21a8`,border:`#f3e8ff`,label:`Processing`},shipped:{bg:`#e0f2fe`,color:`#0284c7`,border:`#bae6fd`,label:`Shipped`},delivered:{bg:`#f0fdf4`,color:`#15803d`,border:`#dcfce7`,label:`Delivered`},cancelled:{bg:`#fef2f2`,color:`#dc2626`,border:`#fee2e2`,label:`Cancelled`},returned:{bg:`#fff7ed`,color:`#c2410c`,border:`#ffedd5`,label:`Returned`}},m=[{id:`all`,label:`All Orders`},{id:`pending`,label:`Pending`},{id:`shipped`,label:`Shipped`},{id:`delivered`,label:`Delivered`},{id:`cancelled`,label:`Cancelled`}];function h({status:e}){if(e===`cancelled`||e===`returned`){let t=p[e]??p.cancelled;return(0,d.jsx)(`div`,{style:{padding:`12px 16px`,background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.color,fontWeight:600,fontSize:14,display:`inline-flex`,alignItems:`center`,gap:8},children:e===`cancelled`?`❌ Order Cancelled`:`↩️ Return Requested`})}let t=f.findIndex(t=>t.key===e);return(0,d.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:0,marginTop:12,overflowX:`auto`,paddingBottom:6},children:f.map((e,n)=>{let r=n<t,i=n===t,a=r||i;return(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,flexShrink:0},children:[(0,d.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,d.jsx)(`div`,{style:{width:32,height:32,borderRadius:`50%`,background:a?`#c11069`:`#f1f5f9`,color:a?`#fff`:`#94a3b8`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:i?16:13,border:i?`3px solid #c11069`:`2px solid `+(r?`#c11069`:`#e2e8f0`),transition:`all 0.2s`,boxShadow:i?`0 0 0 4px rgba(193, 16, 105, 0.15)`:`none`},children:r?`✓`:e.icon}),(0,d.jsx)(`span`,{style:{fontSize:11,color:a?`#c11069`:`#94a3b8`,fontWeight:a?600:400,whiteSpace:`nowrap`},children:e.label})]}),n<f.length-1&&(0,d.jsx)(`div`,{style:{height:2,width:40,background:r?`#c11069`:`#e2e8f0`,marginBottom:22,flexShrink:0}})]},e.key)})})}function g(){let[e,t]=(0,u.useState)([]),[a,s]=(0,u.useState)(!0),[l,f]=(0,u.useState)(`all`),[g,_]=(0,u.useState)(null);(0,u.useEffect)(()=>{r.getAll().then(e=>t(e.data.data??[])).catch(()=>{}).finally(()=>s(!1))},[]);let v=l===`all`?e:e.filter(e=>e.status===l),y=t=>t===`all`?e.length:e.filter(e=>e.status===t).length;return(0,d.jsx)(c,{title:`My Orders`,children:(0,d.jsxs)(`div`,{className:`orders-container-custom`,children:[(0,d.jsx)(`style`,{children:`
          .orders-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .orders-tabs-custom {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            list-style: none;
            padding: 0;
            margin: 0 0 28px 0;
            border-bottom: 1px solid rgba(193, 16, 105, 0.08);
          }

          .orders-tab-item-custom {
            margin-bottom: -1px;
          }

          .orders-tab-btn-custom {
            display: inline-block;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            transition: all 0.25s ease;
            text-decoration: none !important;
          }

          .orders-tab-btn-custom:hover {
            color: #c11069;
          }

          .orders-tab-btn-custom.active {
            color: #c11069;
            font-weight: 600;
            border-bottom-color: #c11069;
          }

          .orders-tab-count {
            margin-left: 6px;
            font-size: 11px;
            opacity: 0.65;
            background: rgba(193, 16, 105, 0.06);
            padding: 2px 6px;
            border-radius: 10px;
            color: #c11069;
          }

          .order-card-custom {
            background: #ffffff;
            border: 1px solid rgba(193, 16, 105, 0.06);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
            margin-bottom: 24px;
            transition: box-shadow 0.3s ease;
          }

          .order-card-custom:hover {
            box-shadow: 0 8px 24px rgba(193, 16, 105, 0.04);
          }

          .order-header-custom {
            padding: 18px 24px;
            background: #fdfafb;
            border-bottom: 1px solid rgba(193, 16, 105, 0.06);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }

          .order-header-info {
            display: flex;
            flex-wrap: wrap;
            gap: 28px;
          }

          .order-header-col .col-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #888888;
            margin-bottom: 4px;
          }

          .order-header-col .col-value {
            font-size: 14px;
            font-weight: 600;
            color: #111111;
          }

          .order-header-col .col-value.total {
            color: #c11069;
            font-weight: 700;
          }

          .status-badge-timeline {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
            border: 1px solid transparent;
          }

          .btn-details-custom {
            background: #ffffff;
            border: 1px solid rgba(193, 16, 105, 0.18);
            color: #c11069;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 16px;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-details-custom:hover {
            background: #c11069;
            color: #ffffff;
            border-color: #c11069;
          }

          .timeline-container-custom {
            padding: 18px 24px;
            border-bottom: 1px solid #fdfafb;
            background: #ffffff;
          }

          .items-preview-custom {
            padding: 20px 24px;
            background: #ffffff;
          }

          .items-scroll-custom {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding-bottom: 6px;
          }

          .item-thumb-card {
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid #f3f3f3;
            padding: 10px 14px;
            border-radius: 12px;
            background: #ffffff;
            flex-shrink: 0;
            transition: border-color 0.2s ease;
          }

          .item-thumb-card:hover {
            border-color: rgba(193, 16, 105, 0.15);
          }

          .item-thumb-img {
            width: 48px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            background: #fafafa;
          }

          .item-thumb-details {
            font-size: 13px;
          }

          .item-thumb-title {
            font-weight: 600;
            color: #111111;
            max-width: 140px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-thumb-qty {
            color: #777777;
            font-size: 12px;
            margin-bottom: 2px;
          }

          .item-thumb-price {
            font-weight: 700;
            color: #111111;
          }

          .order-expanded-custom {
            padding: 0 24px 24px 24px;
            border-top: 1px dashed rgba(193, 16, 105, 0.12);
            background: #ffffff;
          }

          .expanded-grid-custom {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }

          @media (max-width: 768px) {
            .expanded-grid-custom {
              grid-template-columns: 1fr;
            }
          }

          .expanded-panel-custom {
            background: #fdfafb;
            border: 1px solid rgba(193, 16, 105, 0.05);
            border-radius: 12px;
            padding: 20px;
          }

          .panel-title-custom {
            font-size: 13px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 14px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            border-bottom: 1px dashed rgba(193, 16, 105, 0.1);
            padding-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .row-summary-custom {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: #555555;
            margin-bottom: 8px;
          }

          .row-summary-custom.total {
            font-weight: 700;
            font-size: 15px;
            color: #c11069;
            border-top: 1px solid rgba(193, 16, 105, 0.1);
            padding-top: 10px;
            margin-top: 6px;
          }

          .address-info-custom {
            font-size: 13.5px;
            line-height: 1.7;
            color: #444444;
          }
        `}),(0,d.jsx)(`ul`,{className:`orders-tabs-custom`,children:m.map(e=>{let t=l===e.id,n=y(e.id);return(0,d.jsx)(`li`,{className:`orders-tab-item-custom`,children:(0,d.jsxs)(`button`,{type:`button`,className:`orders-tab-btn-custom ${t?`active`:``}`,onClick:()=>f(e.id),children:[e.label,n>0&&(0,d.jsx)(`span`,{className:`orders-tab-count`,children:n})]})},e.id)})}),a?(0,d.jsx)(`div`,{className:`text-center py-5`,children:(0,d.jsx)(`div`,{className:`spinner-border text-dark`,role:`status`})}):v.length===0?(0,d.jsxs)(`div`,{className:`text-center py-5 rounded-3`,style:{background:`#fdfafb`,border:`1px dashed rgba(193, 16, 105, 0.15)`},children:[(0,d.jsx)(`p`,{className:`mb-3 text-muted`,children:`No orders found in this filter.`}),(0,d.jsx)(n,{to:`/shop-default`,className:`tf-btn btn-sm animate-btn`,style:{background:`#c11069`,borderColor:`#c11069`},children:`Shop Now`})]}):(0,d.jsx)(`div`,{className:`d-flex flex-column gap-2`,children:v.map(e=>{let t=p[e.status]??p.pending,n=g===e.id;return(0,d.jsxs)(`div`,{className:`order-card-custom`,children:[(0,d.jsxs)(`div`,{className:`order-header-custom`,children:[(0,d.jsxs)(`div`,{className:`order-header-info`,children:[(0,d.jsxs)(`div`,{className:`order-header-col`,children:[(0,d.jsx)(`div`,{className:`col-label`,children:`Order ID`}),(0,d.jsxs)(`div`,{className:`col-value`,children:[`#`,e.order_number??e.id]})]}),(0,d.jsxs)(`div`,{className:`order-header-col`,children:[(0,d.jsx)(`div`,{className:`col-label`,children:`Placed On`}),(0,d.jsx)(`div`,{className:`col-value`,children:new Date(e.created_at).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})})]}),(0,d.jsxs)(`div`,{className:`order-header-col`,children:[(0,d.jsx)(`div`,{className:`col-label`,children:`Total Amount`}),(0,d.jsx)(`div`,{className:`col-value total`,children:o(e.total)})]})]}),(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,d.jsx)(`span`,{className:`status-badge-timeline`,style:{background:t.bg,color:t.color,borderColor:t.border},children:t.label}),(0,d.jsx)(`button`,{type:`button`,onClick:()=>_(n?null:e.id),className:`btn-details-custom`,children:n?`Hide Details`:`Details`})]})]}),(0,d.jsxs)(`div`,{className:`timeline-container-custom`,children:[(0,d.jsx)(h,{status:e.status}),e.tracking_number&&(0,d.jsxs)(`div`,{style:{marginTop:12,fontSize:13,color:`#c11069`,fontWeight:600},children:[`🚚 Tracking Code: `,(0,d.jsx)(`span`,{style:{background:`#faf0f2`,padding:`2px 8px`,borderRadius:4,letterSpacing:`0.5px`},children:e.tracking_number})]})]}),(0,d.jsx)(`div`,{className:`items-preview-custom`,children:(0,d.jsxs)(`div`,{className:`items-scroll-custom`,children:[(e.items??[]).slice(0,4).map((e,t)=>(0,d.jsxs)(`div`,{className:`item-thumb-card`,children:[(0,d.jsx)(`img`,{src:i(e.thumbnail),alt:e.product_name,className:`item-thumb-img`}),(0,d.jsxs)(`div`,{className:`item-thumb-details`,children:[(0,d.jsx)(`div`,{className:`item-thumb-title`,title:e.product_name,children:e.product_name}),(0,d.jsxs)(`div`,{className:`item-thumb-qty`,children:[`Qty: `,e.quantity]}),(0,d.jsx)(`div`,{className:`item-thumb-price`,children:o(e.subtotal)})]})]},t)),(e.items?.length??0)>4&&(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,color:`#c11069`,fontSize:13,fontWeight:600,paddingLeft:10},children:[`+`,(e.items?.length??0)-4,` more items`]})]})}),n&&(0,d.jsx)(`div`,{className:`order-expanded-custom`,children:(0,d.jsxs)(`div`,{className:`expanded-grid-custom`,children:[(0,d.jsxs)(`div`,{className:`expanded-panel-custom`,children:[(0,d.jsx)(`div`,{className:`panel-title-custom`,children:`🧾 Billing Details`}),(0,d.jsxs)(`div`,{className:`row-summary-custom`,children:[(0,d.jsx)(`span`,{children:`Subtotal`}),(0,d.jsx)(`span`,{children:o(e.subtotal??e.total)})]}),(e.discount??0)>0&&(0,d.jsxs)(`div`,{className:`row-summary-custom`,style:{color:`#15803d`,fontWeight:500},children:[(0,d.jsxs)(`span`,{children:[`Promo Discount (`,e.promo_code,`)`]}),(0,d.jsxs)(`span`,{children:[`-`,o(e.discount)]})]}),(0,d.jsxs)(`div`,{className:`row-summary-custom`,children:[(0,d.jsx)(`span`,{children:`Shipping Costs`}),(0,d.jsx)(`span`,{children:(e.shipping??0)===0?(0,d.jsx)(`span`,{style:{color:`#15803d`,fontWeight:600},children:`Free`}):o(e.shipping)})]}),(0,d.jsxs)(`div`,{className:`row-summary-custom total`,children:[(0,d.jsx)(`span`,{children:`Grand Total`}),(0,d.jsx)(`span`,{children:o(e.total)})]}),(0,d.jsxs)(`div`,{style:{marginTop:12,fontSize:12,color:`#666666`,display:`flex`,gap:10},children:[(0,d.jsxs)(`span`,{children:[`Method: `,(0,d.jsx)(`strong`,{style:{color:`#333`},children:e.payment_method?.toUpperCase()})]}),(0,d.jsx)(`span`,{children:`·`}),(0,d.jsxs)(`span`,{children:[`Status: `,(0,d.jsx)(`strong`,{style:{color:`#333`},children:e.payment_status})]})]})]}),(0,d.jsxs)(`div`,{className:`expanded-panel-custom`,children:[(0,d.jsx)(`div`,{className:`panel-title-custom`,children:`📍 Delivery Address`}),(0,d.jsxs)(`div`,{className:`address-info-custom`,children:[(0,d.jsx)(`div`,{style:{fontWeight:700,color:`#111`,marginBottom:4},children:e.shipping_name}),(0,d.jsx)(`div`,{children:e.shipping_line1}),(0,d.jsxs)(`div`,{children:[e.shipping_city,e.shipping_state?`, `+e.shipping_state:``,` – `,e.shipping_pincode]}),e.shipping_phone&&(0,d.jsxs)(`div`,{style:{marginTop:8,fontWeight:500},children:[`📞 Phone: `,e.shipping_phone]})]})]})]})})]},e.id)})})]})})}var _=()=>(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{title:`Your Orders | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,d.jsx)(s,{}),(0,d.jsx)(g,{})]});export{_ as default};