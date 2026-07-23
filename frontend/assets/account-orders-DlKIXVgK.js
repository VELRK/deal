import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{s as n}from"./api-DtMI-EuY.js";import{S as r,s as i,t as a,u as o}from"./index-BMmZ-2Cs.js";import{n as s,t as c}from"./AccountSection-BjrNKsia.js";import{t as l}from"./PageMeta-CyS8ELM3.js";var u=e(t(),1),d=i(),f=[{id:`all`,label:`All`},{id:`in-progress`,label:`In Progress`},{id:`delivered`,label:`Delivered`},{id:`cancelled`,label:`Cancelled`}];function p(){let[e,t]=(0,u.useState)([]),[i,s]=(0,u.useState)(!0),[l,p]=(0,u.useState)(`all`),[m,h]=(0,u.useState)(`all`),[g,_]=(0,u.useState)(null),[v,y]=(0,u.useState)(null),[b,x]=(0,u.useState)(null);(0,u.useEffect)(()=>{n.getAll().then(e=>t(e.data.data??[])).catch(()=>{}).finally(()=>s(!1))},[]);let S=e=>{let t=e.toLowerCase();return[`pending`,`confirmed`,`processing`,`shipped`].includes(t)?`in-progress`:t===`delivered`?`delivered`:[`cancelled`,`returned`].includes(t)?`cancelled`:`in-progress`},C=e.filter(e=>l===`all`||S(e.status)===l).filter(e=>{if(m===`all`)return!0;let t=new Date(e.created_at),n=new Date;if(m===`30days`){let e=Math.abs(n.getTime()-t.getTime());return Math.ceil(e/(1e3*60*60*24))<=30}if(m===`6months`){let e=Math.abs(n.getTime()-t.getTime());return Math.ceil(e/(1e3*60*60*24))<=180}return m===`2026`?t.getFullYear()===2026:m===`2025`?t.getFullYear()===2025:!0}),w=e.find(e=>e.id===g),T=g!==null&&w!==void 0,E=e=>{x(e),setTimeout(()=>{x(null)},4e3)},D=()=>{if(!v)return;let{type:e,orderId:n}=v;t(t=>t.map(t=>t.id===n?{...t,status:e===`cancel`?`cancelled`:`returned`}:t)),E(e===`cancel`?`Order cancellation request has been successfully processed.`:e===`return`?`Return request submitted. Pickup will be arranged within 2-3 business days.`:`Exchange ticket created. Our support team will contact you to confirm the items.`),y(null)},O=()=>(0,d.jsx)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,d.jsx)(`polyline`,{points:`9 18 15 12 9 6`})}),k=()=>(0,d.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`3`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,d.jsx)(`polyline`,{points:`20 6 9 17 4 12`})});return(0,d.jsx)(c,{title:`My Orders`,hideSidebar:T,customBreadcrumbs:T?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r,{to:`/`,children:`Home`}),(0,d.jsx)(`span`,{className:`separator`,children:`>`}),(0,d.jsx)(r,{to:`/account-page`,children:`My Account`}),(0,d.jsx)(`span`,{className:`separator`,children:`>`}),(0,d.jsx)(`span`,{className:`breadcrumb-link`,onClick:()=>_(null),style:{cursor:`pointer`},children:`My Orders`}),(0,d.jsx)(`span`,{className:`separator`,children:`>`}),(0,d.jsxs)(`span`,{className:`current`,children:[`Order ID: `,w?.order_number??w?.id]})]}):null,children:(0,d.jsxs)(`div`,{className:`classic-orders-theme`,children:[(0,d.jsx)(`style`,{children:`
          .classic-orders-theme {
            font-family: 'Inter', sans-serif;
            color: #333333;
          }

          /* Toast style */
          .classic-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #2e7d32;
            color: #ffffff;
            padding: 14px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
            font-size: 14px;
            z-index: 9999;
            animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes toastIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          /* Modal style */
          .classic-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
          }
          .classic-modal {
            background: #ffffff;
            border-radius: 12px;
            width: 90%;
            max-width: 440px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes modalIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .modal-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #111;
          }
          .modal-body {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.5;
          }
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .btn-modal-cancel {
            background: #f5f5f5;
            color: #666;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .btn-modal-cancel:hover { background: #e8e8e8; }
          .btn-modal-confirm {
            background: #3ec1bc;
            color: #fff;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          .btn-modal-confirm:hover { opacity: 0.9; }

          /* Filter area styling */
          .classic-filter-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }
          .tabs-pills {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .tab-pill {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            cursor: pointer;
            transition: all 0.25s ease;
          }
          .tab-pill:hover {
            border-color: #3ec1bc;
            color: #3ec1bc;
            transform: translateY(-1px);
          }
          .tab-pill.active {
            border-color: #3ec1bc;
            background: #faf0f2;
            color: #3ec1bc;
            font-weight: 600;
          }

          /* Date dropdown select styling */
          .date-select-wrap {
            position: relative;
          }
          .date-select {
            appearance: none;
            background: #f7f7f7;
            border: 1px solid #e0e0e0;
            padding: 8px 36px 8px 16px;
            border-radius: 50px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            font-weight: 500;
            outline: none;
            transition: background 0.2s;
          }
          .date-select:hover {
            background: #eeeeee;
          }
          .date-select-icon {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #666;
            display: flex;
            align-items: center;
          }

          /* LIST VIEW: CARDS */
          .order-list-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .classic-order-card {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e5e5e5;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            cursor: pointer;
            animation: orderCardFade 0.4s ease both;
          }
          @keyframes orderCardFade {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .classic-order-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
            border-color: #3ec1bc;
            transform: translateY(-2px);
          }

          /* Top meta strip of card */
          .card-top-strip {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            background: #fafafa;
            border-bottom: 1px solid #eeeeee;
            font-size: 13px;
          }
          .status-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 50px;
            font-weight: 600;
            text-transform: capitalize;
          }
          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            display: inline-block;
          }
          
          /* Badges by status */
          .badge-in-progress { background: #fff6e6; color: #ff9800; }
          .badge-in-progress .status-dot { background: #ff9800; }
          
          .badge-delivered { background: #eafaf1; color: #2e7d32; }
          .badge-delivered .status-dot { background: #2e7d32; }
          
          .badge-cancelled { background: #fdf2f2; color: #d32f2f; }
          .badge-cancelled .status-dot { background: #d32f2f; }

          .strip-divider {
            color: #cccccc;
            margin: 0 12px;
          }
          .strip-date {
            color: #666666;
            font-weight: 500;
          }

          /* Card main row content */
          .card-main-body {
            display: flex;
            align-items: center;
            padding: 20px;
            gap: 20px;
            justify-content: space-between;
          }
          .card-left-section {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
          }
          
          /* Image container with optional overlay */
          .thumb-img-wrapper {
            position: relative;
            width: 70px;
            height: 85px;
            border-radius: 8px;
            overflow: hidden;
            background: #f8f8f8;
            flex-shrink: 0;
            border: 1px solid #f0f0f0;
          }
          .thumb-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .more-items-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
          }

          .card-details-info {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .order-id-label {
            font-size: 14px;
            font-weight: 700;
            color: #3ec1bc;
          }
          .order-items-summary {
            font-size: 14px;
            color: #555555;
            line-height: 1.4;
          }
          .order-total-price {
            font-size: 15px;
            font-weight: 700;
            color: #111111;
          }
          
          .card-right-section {
            color: #3ec1bc;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 10px;
          }

          /* DETAILS VIEW */
          .details-view-container {
            animation: detailsFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          @keyframes detailsFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Details header summary banner */
          .details-summary-banner {
            display: flex;
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px 24px;
            margin-bottom: 30px;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
          }
          .summary-col {
            flex: 1;
            min-width: 140px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .summary-col:not(:last-child) {
            border-right: 1px solid #e5e5e5;
            padding-right: 20px;
          }
          @media (max-width: 600px) {
            .summary-col:not(:last-child) {
              border-right: none;
              border-bottom: 1px solid #e5e5e5;
              padding-right: 0;
              padding-bottom: 12px;
            }
          }
          .summary-col-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #777777;
            font-weight: 600;
          }
          .summary-col-value {
            font-size: 15px;
            font-weight: 700;
            color: #111111;
          }
          .summary-col-value.highlight-red {
            color: #3ec1bc;
          }
          .savings-pill {
            display: inline-block;
            background: #eafaf1;
            color: #2e7d32;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 8px;
          }

          /* Layout structure for two columns */
          .details-columns-layout {
            display: flex;
            flex-wrap: wrap;
            margin: -12px;
          }
          .col-left-details {
            flex: 1 1 64%;
            min-width: 320px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .col-right-details {
            flex: 1 1 36%;
            min-width: 280px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .section-group-title {
            font-size: 16px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 16px;
          }

          /* Stepper progress tracker */
          .stepper-box {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 16px;
          }
          .stepper-header {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #333;
          }
          .horizontal-stepper {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            position: relative;
            margin-bottom: 20px;
            padding: 0 10px;
          }
          .stepper-progress-line {
            position: absolute;
            top: 14px;
            left: 24px;
            right: 24px;
            height: 4px;
            background: #e9ecef;
            z-index: 1;
            border-radius: 2px;
            overflow: hidden;
          }
          .stepper-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3ec1bc 0%, #2b9d99 100%);
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 10px rgba(62, 193, 188, 0.5);
          }
          .step-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
            flex: 1;
            transition: all 0.4s ease;
          }
          .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999999;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }
          .step-node.completed .step-circle {
            background: #3ec1bc;
            border-color: #3ec1bc;
            color: #ffffff;
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(62, 193, 188, 0.3);
          }
          .step-node.completed .step-circle svg {
            animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .step-node.active .step-circle {
            border-color: #3ec1bc;
            color: #3ec1bc;
            background: #ffffff;
            font-weight: 700;
            transform: scale(1.15);
            box-shadow: 0 0 0 6px rgba(62, 193, 188, 0.15);
            animation: pulseGlow 2s infinite;
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(62, 193, 188, 0.4); }
            70% { box-shadow: 0 0 0 12px rgba(62, 193, 188, 0); }
            100% { box-shadow: 0 0 0 0 rgba(62, 193, 188, 0); }
          }
          .step-label {
            margin-top: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #888;
            text-align: center;
            transition: all 0.4s ease;
          }
          .step-node.completed .step-label {
            color: #111;
          }
          .step-node.active .step-label {
            color: #3ec1bc;
            transform: translateY(-2px);
          }
          .step-date {
            font-size: 11px;
            color: #999;
            margin-top: 4px;
            font-weight: 500;
            opacity: 0;
            animation: fadeIn 0.5s ease forwards 0.3s;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }

          /* Details Product cards list */
          .shipment-items-box {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .product-detail-card {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
          }
          .product-card-body {
            display: flex;
            padding: 16px;
            gap: 16px;
          }
          .product-card-body img {
            width: 60px;
            height: 75px;
            object-fit: cover;
            border-radius: 6px;
            background: #f8f8f8;
            border: 1px solid #eeeeee;
          }
          .product-card-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
          }
          .product-title {
            font-size: 14px;
            font-weight: 600;
            color: #111111;
          }
          .product-meta-specs {
            font-size: 13px;
            color: #777777;
            font-weight: 500;
          }
          .product-price-qty {
            font-size: 14px;
            font-weight: 700;
            color: #333333;
            margin-top: 2px;
          }
          .product-item-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 4px;
            padding: 2px 8px;
            border-radius: 4px;
            align-self: flex-start;
          }
          
          /* Action buttons at bottom of product detail card */
          .product-card-footer {
            border-top: 1px solid #eeeeee;
            display: flex;
          }
          .action-btn-flat {
            flex: 1;
            background: transparent;
            border: none;
            color: #3ec1bc;
            font-size: 13px;
            font-weight: 600;
            padding: 12px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            text-align: center;
            text-decoration: none;
          }
          .action-btn-flat:hover {
            background: #faf0f2;
          }
          .action-btn-flat:not(:last-child) {
            border-right: 1px solid #eeeeee;
          }

          /* RIGHT COLUMN CARDS */
          .classic-panel-card {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
          }
          .panel-card-title {
            font-size: 15px;
            font-weight: 700;
            color: #111;
            margin-bottom: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .address-home-badge {
            font-size: 12px;
            font-weight: 700;
            color: #666;
            margin-bottom: 8px;
            display: block;
          }
          .address-detail-text {
            font-size: 14px;
            line-height: 1.6;
            color: #555555;
          }
          .address-phone-strip {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 14px;
            font-size: 14px;
            color: #111;
            font-weight: 600;
          }

          /* Payment Details styling */
          .payment-panel-card {
            background: #faf5f6; /* Subtle pink tint classic style */
            border: 1px solid #eee1e3;
            border-radius: 8px;
            padding: 20px;
          }
          .payment-items-summary-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .summary-item-row {
            display: flex;
            justify-content: space-between;
            font-size: 13.5px;
            color: #555555;
            font-weight: 500;
          }
          .summary-item-row.green-text {
            color: #2e7d32;
            font-weight: 600;
          }
          .summary-item-row.total-row {
            border-top: 1px dashed #cccccc;
            margin-top: 10px;
            padding-top: 14px;
            font-size: 16px;
            font-weight: 800;
            color: #111111;
          }
        `}),b&&(0,d.jsx)(`div`,{className:`classic-toast`,children:b}),v&&(0,d.jsx)(`div`,{className:`classic-modal-overlay`,children:(0,d.jsxs)(`div`,{className:`classic-modal`,children:[(0,d.jsxs)(`div`,{className:`modal-title`,children:[v.type===`cancel`&&`Cancel Order`,v.type===`return`&&`Return Order Item`,v.type===`exchange`&&`Exchange Order Item`]}),(0,d.jsxs)(`div`,{className:`modal-body`,children:[v.type===`cancel`&&`Are you sure you want to cancel this order? This action will cancel your pending shipment and issue a refund if you already paid.`,v.type===`return`&&`Are you sure you want to return this item? We will dispatch a courier pickup agent to retrieve the item in original packaging.`,v.type===`exchange`&&`Are you sure you want to exchange this item? Our support team will create a ticket and assist with sizing/color availability.`]}),(0,d.jsxs)(`div`,{className:`modal-actions`,children:[(0,d.jsx)(`button`,{className:`btn-modal-cancel`,onClick:()=>y(null),children:`Go Back`}),(0,d.jsx)(`button`,{className:`btn-modal-confirm`,onClick:D,children:`Confirm`})]})]})}),i?(0,d.jsx)(`div`,{className:`text-center py-5`,children:(0,d.jsx)(`div`,{className:`spinner-border text-danger`,role:`status`,style:{borderWidth:`2px`,width:`2.5rem`,height:`2.5rem`}})}):T?(0,d.jsxs)(`div`,{className:`details-view-container`,children:[(0,d.jsxs)(`div`,{className:`details-summary-banner`,children:[(0,d.jsxs)(`div`,{className:`summary-col`,children:[(0,d.jsx)(`span`,{className:`summary-col-label`,children:`Order ID`}),(0,d.jsx)(`span`,{className:`summary-col-value highlight-red`,children:w.order_number??`ABC-${1e6+w.id}`}),(0,d.jsxs)(`span`,{style:{fontSize:`12px`,color:`#888`,fontWeight:500},children:[w.items?.length??0,` `,w.items?.length===1?`item`:`items`]})]}),(0,d.jsxs)(`div`,{className:`summary-col`,children:[(0,d.jsx)(`span`,{className:`summary-col-label`,children:`Amount`}),(0,d.jsxs)(`span`,{className:`summary-col-value`,style:{display:`flex`,alignItems:`center`},children:[a(w.total),(w.discount??0)>0&&(0,d.jsxs)(`span`,{className:`savings-pill`,children:[`You saved `,a(w.discount)]})]})]}),(0,d.jsxs)(`div`,{className:`summary-col`,children:[(0,d.jsx)(`span`,{className:`summary-col-label`,children:`Date Placed`}),(0,d.jsx)(`span`,{className:`summary-col-value`,children:new Date(w.created_at).toLocaleDateString(`en-US`,{day:`numeric`,month:`short`,year:`numeric`})})]})]}),(0,d.jsxs)(`div`,{className:`details-columns-layout`,children:[(0,d.jsx)(`div`,{className:`col-left-details`,children:(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`div`,{className:`section-group-title`,children:`Items Ordered & Delivery Details`}),(0,d.jsxs)(`div`,{className:`stepper-box`,children:[(0,d.jsx)(`div`,{className:`stepper-header`,children:`Shipment 1`}),w.status===`cancelled`||w.status===`returned`?(0,d.jsxs)(`div`,{className:`status-badge-pill badge-cancelled`,style:{padding:`8px 18px`,fontSize:`13.5px`},children:[(0,d.jsx)(`span`,{className:`status-dot`}),w.status===`cancelled`?`Order Cancelled`:`Return Request Processed`]}):(0,d.jsx)(`div`,{children:(0,d.jsxs)(`div`,{className:`horizontal-stepper`,children:[(0,d.jsx)(`div`,{className:`stepper-progress-line`,children:(0,d.jsx)(`div`,{className:`stepper-progress-fill`,style:{width:w.status===`delivered`?`100%`:w.status===`shipped`?`66%`:w.status===`processing`?`33%`:`0%`}})}),[{key:`confirmed`,label:`Order confirmed`,date:w.created_at,activeFor:[`pending`,`confirmed`]},{key:`processing`,label:`Processing`,date:null,activeFor:[`processing`]},{key:`shipped`,label:`Shipped`,date:w.shipped_at,activeFor:[`shipped`]},{key:`delivered`,label:w.status===`delivered`?`Delivered`:`Delivery pending`,date:w.delivered_at,activeFor:[`delivered`]}].map((e,t)=>{let n=[`pending`,`confirmed`,`processing`,`shipped`,`delivered`],r=n.indexOf(w.status.toLowerCase()),i=n.findIndex(t=>e.activeFor.includes(t)),a=r>=i,o=r===i&&e.key!==`delivered`;return(0,d.jsxs)(`div`,{className:`step-node ${a?`completed`:``} ${o?`active`:``}`,children:[(0,d.jsx)(`div`,{className:`step-circle`,children:a?(0,d.jsx)(k,{}):(t+1).toString()}),(0,d.jsx)(`span`,{className:`step-label`,children:e.label}),e.date?(0,d.jsx)(`span`,{className:`step-date`,children:new Date(e.date).toLocaleDateString(`en-US`,{day:`numeric`,month:`short`})}):a&&e.key===`shipped`?(0,d.jsx)(`span`,{className:`step-date`,children:`In Transit`}):null]},e.key)})]})}),(0,d.jsx)(`div`,{className:`shipment-items-box`,style:{marginTop:`30px`},children:(w.items??[]).map((e,t)=>{let n=S(w.status);return(0,d.jsxs)(`div`,{className:`product-detail-card`,children:[(0,d.jsxs)(`div`,{className:`product-card-body`,children:[(0,d.jsx)(`img`,{src:o(e.thumbnail),alt:e.product_name}),(0,d.jsxs)(`div`,{className:`product-card-info`,children:[(0,d.jsx)(`span`,{className:`product-title`,children:e.product_name}),(0,d.jsxs)(`span`,{className:`product-meta-specs`,children:[`Qty: `,e.quantity]}),(0,d.jsx)(`span`,{className:`product-price-qty`,children:a(e.price)}),(0,d.jsxs)(`span`,{className:`product-item-status badge-${n}`,children:[(0,d.jsx)(`span`,{className:`status-dot`}),w.status===`delivered`?`Delivered`:w.status===`cancelled`?`Cancelled`:w.status===`returned`?`Returned`:`Arriving soon`]})]})]}),(0,d.jsx)(`div`,{className:`product-card-footer`,children:n===`in-progress`?(0,d.jsx)(`button`,{className:`action-btn-flat`,onClick:e=>{e.stopPropagation(),y({type:`cancel`,orderId:w.id})},children:`Cancel Item`}):n===`delivered`?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`button`,{className:`action-btn-flat`,onClick:e=>{e.stopPropagation(),y({type:`return`,orderId:w.id})},children:`Return`}),(0,d.jsx)(`button`,{className:`action-btn-flat`,onClick:e=>{e.stopPropagation(),y({type:`exchange`,orderId:w.id})},children:`Exchange`})]}):(0,d.jsx)(`span`,{style:{padding:`10px 16px`,fontSize:`12px`,color:`#888`,fontWeight:600},children:`No actions available`})})]},t)})})]})]})}),(0,d.jsxs)(`div`,{className:`col-right-details`,children:[(0,d.jsxs)(`div`,{className:`classic-panel-card`,children:[(0,d.jsxs)(`div`,{className:`panel-card-title`,style:{display:`flex`,gap:`8px`,alignItems:`center`},children:[(0,d.jsx)(()=>(0,d.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,d.jsx)(`path`,{d:`M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z`}),(0,d.jsx)(`circle`,{cx:`12`,cy:`10`,r:`3`})]}),{}),(0,d.jsx)(`span`,{children:`Delivery Address`})]}),(0,d.jsx)(`span`,{className:`address-home-badge`,children:`Home`}),(0,d.jsxs)(`div`,{className:`address-detail-text`,children:[(0,d.jsx)(`strong`,{style:{display:`block`,color:`#111`,marginBottom:`4px`},children:w.shipping_name??`User Customer`}),w.shipping_line1??`Address Line 1`,(0,d.jsx)(`br`,{}),w.shipping_city??`City`,w.shipping_state?`, ${w.shipping_state}`:``,(0,d.jsx)(`br`,{}),`Pincode: `,w.shipping_pincode??`N/A`]}),w.shipping_phone&&(0,d.jsxs)(`div`,{className:`address-phone-strip`,children:[(0,d.jsx)(()=>(0,d.jsx)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{color:`#a12c3f`},children:(0,d.jsx)(`path`,{d:`M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z`})}),{}),(0,d.jsx)(`span`,{children:w.shipping_phone})]})]}),(0,d.jsxs)(`div`,{className:`payment-panel-card`,children:[(0,d.jsxs)(`div`,{className:`panel-card-title`,style:{display:`flex`,gap:`8px`,alignItems:`center`,borderColor:`rgba(161, 44, 63, 0.15)`},children:[(0,d.jsx)(()=>(0,d.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,d.jsx)(`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,ry:`2`}),(0,d.jsx)(`line`,{x1:`12`,y1:`4`,x2:`12`,y2:`20`})]}),{}),(0,d.jsx)(`span`,{children:`Payment details`})]}),(0,d.jsxs)(`div`,{className:`payment-items-summary-list`,children:[(w.items??[]).map((e,t)=>(0,d.jsxs)(`div`,{className:`summary-item-row`,children:[(0,d.jsx)(`span`,{style:{maxWidth:`70%`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:e.product_name}),(0,d.jsx)(`span`,{children:a(e.subtotal)})]},t)),(w.discount??0)>0&&(0,d.jsxs)(`div`,{className:`summary-item-row green-text`,children:[(0,d.jsx)(`span`,{children:`Coupon savings`}),(0,d.jsxs)(`span`,{children:[`-`,a(w.discount)]})]}),(0,d.jsxs)(`div`,{className:`summary-item-row`,children:[(0,d.jsx)(`span`,{children:`Delivery`}),(w.shipping??0)===0?(0,d.jsx)(`span`,{style:{color:`#2e7d32`,fontWeight:700},children:`FREE`}):(0,d.jsx)(`span`,{children:a(w.shipping)})]}),(0,d.jsxs)(`div`,{className:`summary-item-row total-row`,children:[(0,d.jsx)(`span`,{children:`Total`}),(0,d.jsx)(`span`,{children:a(w.total)})]})]})]})]})]})]}):(0,d.jsxs)(`div`,{children:[(0,d.jsxs)(`div`,{className:`classic-filter-row`,children:[(0,d.jsx)(`div`,{className:`tabs-pills`,children:f.map(t=>{let n=l===t.id,r=t.id===`all`?e.length:e.filter(e=>S(e.status)===t.id).length;return(0,d.jsxs)(`button`,{type:`button`,className:`tab-pill ${n?`active`:``}`,onClick:()=>p(t.id),children:[t.label,r>0&&(0,d.jsxs)(`span`,{style:{marginLeft:`6px`,fontSize:`12px`,opacity:.75},children:[`(`,r,`)`]})]},t.id)})}),(0,d.jsxs)(`div`,{className:`date-select-wrap`,children:[(0,d.jsxs)(`select`,{className:`date-select`,value:m,onChange:e=>h(e.target.value),children:[(0,d.jsx)(`option`,{value:`all`,children:`Select date range`}),(0,d.jsx)(`option`,{value:`30days`,children:`Last 30 days`}),(0,d.jsx)(`option`,{value:`6months`,children:`Last 6 months`}),(0,d.jsx)(`option`,{value:`2026`,children:`Year 2026`}),(0,d.jsx)(`option`,{value:`2025`,children:`Year 2025`})]}),(0,d.jsx)(`div`,{className:`date-select-icon`,children:(0,d.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,d.jsx)(`polyline`,{points:`6 9 12 15 18 9`})})})]})]}),C.length===0?(0,d.jsxs)(`div`,{className:`text-center py-5 rounded-3`,style:{background:`#ffffff`,border:`1px dashed #e0e0e0`},children:[(0,d.jsx)(()=>(0,d.jsxs)(`svg`,{width:`64`,height:`64`,viewBox:`0 0 24 24`,fill:`none`,stroke:`#a12c3f`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,style:{marginBottom:`20px`,opacity:.8},children:[(0,d.jsx)(`path`,{d:`M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z`}),(0,d.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,d.jsx)(`path`,{d:`M16 10a4 4 0 0 1-8 0`})]}),{}),(0,d.jsx)(`p`,{className:`mb-4 text-muted fs-6 fw-semibold`,children:`No orders found in this filter.`}),(0,d.jsx)(r,{to:`/shop-default`,className:`tf-btn btn-sm`,style:{background:`#a12c3f`,color:`#fff`,borderRadius:50,padding:`12px 30px`,fontWeight:700,border:`none`},children:`START SHOPPING`})]}):(0,d.jsx)(`div`,{className:`order-list-container`,children:C.map((e,t)=>{let n=S(e.status),r=(e.items?.length??0)>1,i=e.items?.[0],s=(e.items??[]).map(e=>e.product_name).join(` | `);return(0,d.jsxs)(`div`,{className:`classic-order-card`,style:{animationDelay:`${t*.05}s`},onClick:()=>_(e.id),children:[(0,d.jsxs)(`div`,{className:`card-top-strip`,children:[(0,d.jsxs)(`span`,{className:`status-badge-pill badge-${n}`,children:[(0,d.jsx)(`span`,{className:`status-dot`}),n===`in-progress`?`In progress`:n]}),(0,d.jsx)(`span`,{className:`strip-divider`,children:`|`}),(0,d.jsx)(`span`,{className:`strip-date`,children:new Date(e.created_at).toLocaleDateString(`en-US`,{day:`numeric`,month:`short`,year:`numeric`})})]}),(0,d.jsxs)(`div`,{className:`card-main-body`,children:[(0,d.jsxs)(`div`,{className:`card-left-section`,children:[(0,d.jsxs)(`div`,{className:`thumb-img-wrapper`,children:[(0,d.jsx)(`img`,{src:o(i?.thumbnail),alt:i?.product_name??`Product`}),r&&(0,d.jsxs)(`div`,{className:`more-items-overlay`,children:[`+`,(e.items?.length??1)-1]})]}),(0,d.jsxs)(`div`,{className:`card-details-info`,children:[(0,d.jsxs)(`div`,{className:`order-id-label`,children:[`Order ID: `,e.order_number??`ABC-${1e6+e.id}`]}),(0,d.jsx)(`div`,{className:`order-items-summary text-line-clamp-2`,title:s,children:s}),(0,d.jsx)(`div`,{className:`order-total-price`,children:a(e.total)})]})]}),(0,d.jsx)(`div`,{className:`card-right-section`,children:(0,d.jsx)(O,{})})]})]},e.id)})})]})]})})}var m=()=>(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{title:`Your Orders | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,d.jsx)(s,{}),(0,d.jsx)(p,{})]});export{m as default};