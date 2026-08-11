import{r as o,x as U,j as e,L as u,a as A,f as c,B as q}from"./index-DUbP1h-v.js";import{A as H,a as V}from"./AccountSection-kSVKQhRA.js";import{P as K}from"./PageMeta-BVTzPYqk.js";const Q=[{id:"all",label:"All"},{id:"in-progress",label:"In Progress"},{id:"delivered",label:"Delivered"},{id:"cancelled",label:"Cancelled"}];function J(){const[h,b]=o.useState([]),[T,L]=o.useState(!0),[y,O]=o.useState("all"),[x,P]=o.useState("all"),[j,w]=o.useState(null),[k,N]=o.useState([]),[z,S]=o.useState(!1),[l,m]=o.useState(null),[I,_]=o.useState(null);o.useEffect(()=>{U.getAll().then(t=>b(t.data.data??[])).catch(()=>{}).finally(()=>L(!1))},[]);const g=t=>{const a=t.toLowerCase();return a==="payment_attempt"?"abandoned":["pending","confirmed","processing","shipped"].includes(a)?"in-progress":a==="delivered"?"delivered":["cancelled","returned"].includes(a)?"cancelled":"in-progress"},W=t=>{if(x==="all")return!0;const a=new Date(t.created_at),i=new Date;if(x==="30days"){const r=Math.abs(i.getTime()-a.getTime());return Math.ceil(r/(1e3*60*60*24))<=30}if(x==="6months"){const r=Math.abs(i.getTime()-a.getTime());return Math.ceil(r/(1e3*60*60*24))<=180}return x==="2026"?a.getFullYear()===2026:x==="2025"?a.getFullYear()===2025:!0},C=h.filter(t=>{const a=g(t.status);return y==="all"?a!=="abandoned":a===y}).filter(W),s=h.find(t=>t.id===j),v=j!==null&&s!==void 0,p=t=>{_(t),setTimeout(()=>{_(null)},4e3)},D=async t=>{const a=(t.tracking_number||"").trim();if(!a){p("No tracking ID yet for this order.");return}S(!0);try{const i=await q.track({tracking_number:a,order_number:t.order_number}),r=i.data?.data;if(!i.data?.success||!r){p(i.data?.message||"Could not refresh tracking.");return}N(r.events??[]),b(d=>d.map(n=>n.id===t.id?{...n,tracking_number:r.tracking_number||n.tracking_number,courier_status:r.courier_status||n.courier_status,status:r.order_status||n.status,latest_track:r.events?.[0]?.label||r.courier_status||n.latest_track}:n)),p("Tracking updated.")}catch{p("Could not refresh tracking. Try again shortly.")}finally{S(!1)}};o.useEffect(()=>{N([]),s?.tracking_number&&D(s)},[j]);const B=()=>{if(!l)return;const{type:t,orderId:a}=l;b(i=>i.map(r=>r.id===a?{...r,status:t==="cancel"?"cancelled":"returned"}:r)),p(t==="cancel"?"Order cancellation request has been successfully processed.":t==="return"?"Return request submitted. Pickup will be arranged within 2-3 business days.":"Exchange ticket created. Our support team will contact you to confirm the items."),m(null)},F=()=>e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})}),M=()=>e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),R=()=>e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{color:"#a12c3f"},children:e.jsx("path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"})}),E=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",ry:"2"}),e.jsx("line",{x1:"12",y1:"4",x2:"12",y2:"20"})]}),Y=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]}),$=()=>e.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"#a12c3f",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",style:{marginBottom:"20px",opacity:.8},children:[e.jsx("path",{d:"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"}),e.jsx("line",{x1:"3",y1:"6",x2:"21",y2:"6"}),e.jsx("path",{d:"M16 10a4 4 0 0 1-8 0"})]});return e.jsx(H,{title:"My Orders",hideSidebar:v,customBreadcrumbs:v?e.jsxs(e.Fragment,{children:[e.jsx(u,{to:"/",children:"Home"}),e.jsx("span",{className:"separator",children:">"}),e.jsx(u,{to:"/account-page",children:"My Account"}),e.jsx("span",{className:"separator",children:">"}),e.jsx("span",{className:"breadcrumb-link",onClick:()=>w(null),style:{cursor:"pointer"},children:"My Orders"}),e.jsx("span",{className:"separator",children:">"}),e.jsxs("span",{className:"current",children:["Order ID: ",s?.order_number??s?.id]})]}):null,children:e.jsxs("div",{className:"classic-orders-theme",children:[e.jsx("style",{children:`
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

          .badge-abandoned { background: #f3f4f6; color: #6b7280; }
          .badge-abandoned .status-dot { background: #6b7280; }

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

          /* Mobile adjustments for filter, cards, and stepper */
          @media (max-width: 576px) {
            .classic-filter-row {
              gap: 10px;
              margin-bottom: 16px;
            }
            .tabs-pills {
              width: 100%;
              overflow-x: auto;
              flex-wrap: nowrap;
              padding-bottom: 4px;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .tabs-pills::-webkit-scrollbar {
              display: none;
            }
            .tab-pill {
              padding: 6px 14px;
              font-size: 12.5px;
              white-space: nowrap;
              flex-shrink: 0;
            }
            .date-select-wrap {
              width: 100%;
            }
            .date-select {
              width: 100%;
            }
            .card-top-strip {
              padding: 10px 14px;
              font-size: 12px;
            }
            .card-main-body {
              padding: 14px;
              gap: 12px;
            }
            .thumb-img-wrapper {
              width: 56px;
              height: 70px;
            }
            .order-id-label {
              font-size: 13px;
            }
            .order-items-summary {
              font-size: 12.5px;
            }
            .order-total-price {
              font-size: 14px;
            }
            .stepper-box {
              padding: 14px 10px;
            }
            .horizontal-stepper {
              padding: 0 4px;
            }
            .stepper-progress-line {
              top: 11px;
              left: 12px;
              right: 12px;
              height: 3px;
            }
            .step-circle {
              width: 24px;
              height: 24px;
              font-size: 10px;
            }
            .step-circle svg {
              width: 10px;
              height: 10px;
            }
            .step-label {
              margin-top: 6px;
              font-size: 10px;
              line-height: 1.2;
            }
            .step-date {
              font-size: 9px;
            }
            .col-left-details, .col-right-details {
              flex: 1 1 100%;
              min-width: 100%;
            }
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
        `}),I&&e.jsx("div",{className:"classic-toast",children:I}),l&&e.jsx("div",{className:"classic-modal-overlay",children:e.jsxs("div",{className:"classic-modal",children:[e.jsxs("div",{className:"modal-title",children:[l.type==="cancel"&&"Cancel Order",l.type==="return"&&"Return Order Item",l.type==="exchange"&&"Exchange Order Item"]}),e.jsxs("div",{className:"modal-body",children:[l.type==="cancel"&&"Are you sure you want to cancel this order? This action will cancel your pending shipment and issue a refund if you already paid.",l.type==="return"&&"Are you sure you want to return this item? We will dispatch a courier pickup agent to retrieve the item in original packaging.",l.type==="exchange"&&"Are you sure you want to exchange this item? Our support team will create a ticket and assist with sizing/color availability."]}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{className:"btn-modal-cancel",onClick:()=>m(null),children:"Go Back"}),e.jsx("button",{className:"btn-modal-confirm",onClick:B,children:"Confirm"})]})]})}),T?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-danger",role:"status",style:{borderWidth:"2px",width:"2.5rem",height:"2.5rem"}})}):v?e.jsxs("div",{className:"details-view-container",children:[e.jsxs("div",{className:"details-summary-banner",children:[e.jsxs("div",{className:"summary-col",children:[e.jsx("span",{className:"summary-col-label",children:"Order ID"}),e.jsx("span",{className:"summary-col-value highlight-red",children:s.order_number??`ABC-${1e6+s.id}`}),e.jsxs("span",{style:{fontSize:"12px",color:"#888",fontWeight:500},children:[s.items?.length??0," ",s.items?.length===1?"item":"items"]})]}),e.jsxs("div",{className:"summary-col",children:[e.jsx("span",{className:"summary-col-label",children:"Amount"}),e.jsxs("span",{className:"summary-col-value",style:{display:"flex",alignItems:"center"},children:[c(s.total),(s.discount??0)>0&&e.jsxs("span",{className:"savings-pill",children:["You saved ",c(s.discount)]})]})]}),e.jsxs("div",{className:"summary-col",children:[e.jsx("span",{className:"summary-col-label",children:"Date Placed"}),e.jsx("span",{className:"summary-col-value",children:new Date(s.created_at).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"})})]})]}),e.jsxs("div",{className:"details-columns-layout",children:[e.jsx("div",{className:"col-left-details",children:e.jsxs("div",{children:[e.jsx("div",{className:"section-group-title",children:"Items Ordered & Delivery Details"}),e.jsxs("div",{className:"stepper-box",children:[e.jsx("div",{className:"stepper-header",children:"Shipment 1"}),s.status==="cancelled"||s.status==="returned"?e.jsxs("div",{className:"status-badge-pill badge-cancelled",style:{padding:"8px 18px",fontSize:"13.5px"},children:[e.jsx("span",{className:"status-dot"}),s.status==="cancelled"?"Order Cancelled":"Return Request Processed"]}):s.status==="payment_attempt"?e.jsxs("div",{className:"status-badge-pill badge-abandoned",style:{padding:"8px 18px",fontSize:"13.5px"},children:[e.jsx("span",{className:"status-dot"}),"Abandoned — awaiting payment"]}):e.jsx("div",{children:e.jsxs("div",{className:"horizontal-stepper",children:[e.jsx("div",{className:"stepper-progress-line",children:e.jsx("div",{className:"stepper-progress-fill",style:{width:s.status==="delivered"?"100%":s.status==="shipped"?"66%":s.status==="processing"?"33%":"0%"}})}),[{key:"confirmed",label:"Order confirmed",date:s.created_at,activeFor:["pending","confirmed"]},{key:"processing",label:"Processing",date:null,activeFor:["processing"]},{key:"shipped",label:"Shipped",date:s.shipped_at,activeFor:["shipped"]},{key:"delivered",label:s.status==="delivered"?"Delivered":"Delivery pending",date:s.delivered_at,activeFor:["delivered"]}].map((t,a)=>{const i=["pending","confirmed","processing","shipped","delivered"],r=i.indexOf(s.status.toLowerCase()),d=i.findIndex(G=>t.activeFor.includes(G)),n=r>=d,f=r===d&&t.key!=="delivered";return e.jsxs("div",{className:`step-node ${n?"completed":""} ${f?"active":""}`,children:[e.jsx("div",{className:"step-circle",children:n?e.jsx(M,{}):(a+1).toString()}),e.jsx("span",{className:"step-label",children:t.label}),t.date?e.jsx("span",{className:"step-date",children:new Date(t.date).toLocaleDateString("en-US",{day:"numeric",month:"short"})}):n&&t.key==="shipped"?e.jsx("span",{className:"step-date",children:"In Transit"}):null]},t.key)})]})}),s.tracking_number&&e.jsxs("div",{className:"mt-4 p-3",style:{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:10},children:[e.jsxs("div",{className:"d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2",children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:12,color:"#0f766e",fontWeight:700},children:"SHIPMENT TRACKING"}),e.jsxs("div",{style:{fontWeight:700,color:"#111"},children:["AWB: ",s.tracking_number]}),s.courier_status&&e.jsx("div",{style:{fontSize:13,color:"#555"},children:s.courier_status})]}),e.jsxs("div",{className:"d-flex gap-2",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-success",disabled:z,onClick:()=>D(s),children:z?"Updating…":"Refresh"}),e.jsx(u,{to:`/track-order?tracking=${encodeURIComponent(s.tracking_number)}`,className:"btn btn-sm btn-success",children:"Open tracker"})]})]}),(()=>{const t=k.length>0?k:(s.jt_tracks??[]).map(a=>({time:a.scanTime||a.time||"",desc:a.desc||a.remark||a.scanType||"",label:[a.scanTime||a.time,a.desc||a.remark||a.scanType].filter(Boolean).join(" — ")}));return t.length===0?e.jsx("p",{className:"mb-0 small text-muted",children:"Tracking ID is ready. No courier scans yet — refresh after pickup."}):e.jsx("ul",{className:"list-unstyled mb-0 small",style:{borderLeft:"2px solid #14b8a6",paddingLeft:12},children:t.slice(0,8).map((a,i)=>e.jsxs("li",{className:"mb-2",children:[e.jsx("div",{style:{fontWeight:600},children:a.desc||a.label}),a.time&&e.jsx("div",{className:"text-muted",children:a.time})]},i))})})()]}),e.jsx("div",{className:"shipment-items-box",style:{marginTop:"30px"},children:(s.items??[]).map((t,a)=>{const i=g(s.status);return e.jsxs("div",{className:"product-detail-card",children:[e.jsxs("div",{className:"product-card-body",children:[e.jsx("img",{src:A(t.thumbnail),alt:t.product_name}),e.jsxs("div",{className:"product-card-info",children:[e.jsx("span",{className:"product-title",children:t.product_name}),e.jsxs("span",{className:"product-meta-specs",children:["Qty: ",t.quantity]}),e.jsx("span",{className:"product-price-qty",children:c(t.price)}),e.jsxs("span",{className:`product-item-status badge-${i}`,children:[e.jsx("span",{className:"status-dot"}),s.status==="delivered"?"Delivered":s.status==="cancelled"?"Cancelled":s.status==="returned"?"Returned":s.status==="payment_attempt"?"Abandoned":"Arriving soon"]})]})]}),e.jsx("div",{className:"product-card-footer",children:i==="in-progress"?e.jsx("button",{className:"action-btn-flat",onClick:r=>{r.stopPropagation(),m({type:"cancel",orderId:s.id})},children:"Cancel Item"}):i==="delivered"?e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"action-btn-flat",onClick:r=>{r.stopPropagation(),m({type:"return",orderId:s.id})},children:"Return"}),e.jsx("button",{className:"action-btn-flat",onClick:r=>{r.stopPropagation(),m({type:"exchange",orderId:s.id})},children:"Exchange"})]}):e.jsx("span",{style:{padding:"10px 16px",fontSize:"12px",color:"#888",fontWeight:600},children:"No actions available"})})]},a)})})]})]})}),e.jsxs("div",{className:"col-right-details",children:[e.jsxs("div",{className:"classic-panel-card",children:[e.jsxs("div",{className:"panel-card-title",style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsx(Y,{}),e.jsx("span",{children:"Delivery Address"})]}),e.jsx("span",{className:"address-home-badge",children:"Home"}),e.jsxs("div",{className:"address-detail-text",children:[e.jsx("strong",{style:{display:"block",color:"#111",marginBottom:"4px"},children:s.shipping_name??"User Customer"}),s.shipping_line1??"Address Line 1",e.jsx("br",{}),s.shipping_city??"City",s.shipping_state?`, ${s.shipping_state}`:"",e.jsx("br",{}),"Pincode: ",s.shipping_pincode??"N/A"]}),s.shipping_phone&&e.jsxs("div",{className:"address-phone-strip",children:[e.jsx(R,{}),e.jsx("span",{children:s.shipping_phone})]})]}),e.jsxs("div",{className:"payment-panel-card",children:[e.jsxs("div",{className:"panel-card-title",style:{display:"flex",gap:"8px",alignItems:"center",borderColor:"rgba(161, 44, 63, 0.15)"},children:[e.jsx(E,{}),e.jsx("span",{children:"Payment details"})]}),e.jsxs("div",{className:"payment-items-summary-list",children:[(s.items??[]).map((t,a)=>e.jsxs("div",{className:"summary-item-row",children:[e.jsx("span",{style:{maxWidth:"70%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:t.product_name}),e.jsx("span",{children:c(t.subtotal)})]},a)),(s.discount??0)>0&&e.jsxs("div",{className:"summary-item-row green-text",children:[e.jsx("span",{children:"Coupon savings"}),e.jsxs("span",{children:["-",c(s.discount)]})]}),e.jsxs("div",{className:"summary-item-row",children:[e.jsx("span",{children:"Delivery"}),(s.shipping??0)===0?e.jsx("span",{style:{color:"#2e7d32",fontWeight:700},children:"FREE"}):e.jsx("span",{children:c(s.shipping)})]}),e.jsxs("div",{className:"summary-item-row total-row",children:[e.jsx("span",{children:"Total"}),e.jsx("span",{children:c(s.total)})]})]})]})]})]})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"classic-filter-row",children:[e.jsx("div",{className:"tabs-pills",children:Q.map(t=>{const a=y===t.id,i=t.id==="all"?h.length:h.filter(r=>g(r.status)===t.id).length;return e.jsxs("button",{type:"button",className:`tab-pill ${a?"active":""}`,onClick:()=>O(t.id),children:[t.label,i>0&&e.jsxs("span",{style:{marginLeft:"6px",fontSize:"12px",opacity:.75},children:["(",i,")"]})]},t.id)})}),e.jsxs("div",{className:"date-select-wrap",children:[e.jsxs("select",{className:"date-select",value:x,onChange:t=>P(t.target.value),children:[e.jsx("option",{value:"all",children:"Select date range"}),e.jsx("option",{value:"30days",children:"Last 30 days"}),e.jsx("option",{value:"6months",children:"Last 6 months"}),e.jsx("option",{value:"2026",children:"Year 2026"}),e.jsx("option",{value:"2025",children:"Year 2025"})]}),e.jsx("div",{className:"date-select-icon",children:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]})]}),C.length===0?e.jsxs("div",{className:"text-center py-5 rounded-3",style:{background:"#ffffff",border:"1px dashed #e0e0e0"},children:[e.jsx($,{}),e.jsx("p",{className:"mb-4 text-muted fs-6 fw-semibold",children:"No orders found in this filter."}),e.jsx(u,{to:"/shop-default",className:"tf-btn btn-sm",style:{background:"#a12c3f",color:"#fff",borderRadius:50,padding:"12px 30px",fontWeight:700,border:"none"},children:"START SHOPPING"})]}):e.jsx("div",{className:"order-list-container",children:C.map((t,a)=>{const i=g(t.status),r=(t.items?.length??0)>1,d=t.items?.[0],n=(t.items??[]).map(f=>f.product_name).join(" | ");return e.jsxs("div",{className:"classic-order-card",style:{animationDelay:`${a*.05}s`},onClick:()=>w(t.id),children:[e.jsxs("div",{className:"card-top-strip",children:[e.jsxs("span",{className:`status-badge-pill badge-${i}`,children:[e.jsx("span",{className:"status-dot"}),i==="abandoned"?"Abandoned":i==="in-progress"?"In progress":i]}),e.jsx("span",{className:"strip-divider",children:"|"}),e.jsx("span",{className:"strip-date",children:new Date(t.created_at).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"})})]}),e.jsxs("div",{className:"card-main-body",children:[e.jsxs("div",{className:"card-left-section",children:[e.jsxs("div",{className:"thumb-img-wrapper",children:[e.jsx("img",{src:A(d?.thumbnail),alt:d?.product_name??"Product"}),r&&e.jsxs("div",{className:"more-items-overlay",children:["+",(t.items?.length??1)-1]})]}),e.jsxs("div",{className:"card-details-info",children:[e.jsxs("div",{className:"order-id-label",children:["Order ID: ",t.order_number??`ABC-${1e6+t.id}`]}),e.jsx("div",{className:"order-items-summary text-line-clamp-2",title:n,children:n}),e.jsx("div",{className:"order-total-price",children:c(t.total)}),t.tracking_number&&e.jsxs("div",{style:{marginTop:6,fontSize:12,color:"#0f766e",fontWeight:600},children:["Track: ",t.tracking_number,t.courier_status?` · ${t.courier_status}`:""]})]})]}),e.jsxs("div",{className:"card-right-section",style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8},children:[t.tracking_number&&e.jsx(u,{to:`/track-order?tracking=${encodeURIComponent(t.tracking_number)}`,className:"tf-btn btn-sm",style:{background:"#0f766e",color:"#fff",borderRadius:50,padding:"6px 14px",fontSize:12,fontWeight:700},onClick:f=>f.stopPropagation(),children:"Track"}),e.jsx(F,{})]})]})]},t.id)})})]})]})})}const te=()=>e.jsxs(e.Fragment,{children:[e.jsx(K,{title:"Your Orders | 2Deal - Incense Sticks, Soaps & Food Products Store",description:"2Deal - Incense Sticks, Soaps & Food Products Store"}),e.jsx(V,{}),e.jsx(J,{})]});export{te as default};
