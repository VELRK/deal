import{j as e,L as _,k as S,r as d,C}from"./index-ejBncXcv.js";import{s as E}from"./shop-BhyYwhS0.js";import{P as I}from"./PageMeta-De2H6axw.js";import"./shop-product-Dc95bkV4.js";function D(){return e.jsx(e.Fragment,{children:e.jsx("section",{className:"section-page-title text-center flat-spacing-2",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(_,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01",children:"Order Tracking"})]}),e.jsx("h3",{children:"Order Tracking"}),e.jsxs("p",{className:"text-body-1 cl-text-2",children:["Enter your tracking ID (AWB) or order number and press Track.",e.jsx("br",{className:"d-none d-lg-block"}),"Tracking appears after your shipment is created with JT Express."]})]})})})})}function T(i){const s=i.replace(/^[\s\u2014\-–]+/,"").replace(/[【\[]/g,"").replace(/[】\]]/g,"").trim(),o=s.match(/^(.*?reason\s+is\s+)(.+?)\s*\/\s*(.+)$/i);if(o)return{en:`${o[1]}${o[2]}`.replace(/,\s*/g,", ").trim(),ms:o[3].trim()};const c=s.match(/^(.+?)\s*\/\s*(.+)$/);return c&&/[A-Za-z]/.test(c[1])&&/[A-Za-z]/.test(c[2])?{en:c[1].trim(),ms:c[2].trim()}:{en:s.replace(/,\s*/g,", ")}}function O(i){const s=(i||"").toLowerCase();return s==="delivered"?"ot-badge ot-badge--ok":s==="shipped"||s==="processing"||s==="confirmed"?"ot-badge ot-badge--ship":s==="cancelled"||s==="returned"?"ot-badge ot-badge--warn":"ot-badge"}function B(){const[i]=S(),s=i.get("tracking")||i.get("awb")||i.get("order")||"",[o,c]=d.useState(s),[h,b]=d.useState(!1),[j,m]=d.useState(null),[t,k]=d.useState(null),v=d.useCallback(async(a,r)=>{a?.preventDefault();const n=(r??o).trim();if(!n){m("Enter your tracking ID (AWB) or order number.");return}const l=/^SK/i.test(n)||n.includes("-");b(!0),m(null),k(null);try{const u=l?{order_number:n,tracking_number:n}:{tracking_number:n},p=await C.track(u),y=p.data?.data;if(!p.data?.success||!y){m(p.data?.message||"Shipment not found.");return}k(y)}catch(u){const p=u?.response?.data?.message||"Could not fetch tracking. Check the ID and try again.";m(p)}finally{b(!1)}},[o]);d.useEffect(()=>{s&&v(void 0,s)},[s]);const x=d.useMemo(()=>t?.events?.length?t.events:(t?.tracks??[]).map(a=>{const r=a;return{time:r.scanTime||r.time||"",desc:r.desc||r.remark||r.scanType||"",label:[r.scanTime||r.time,r.desc||r.remark||r.scanType].filter(Boolean).join(" — ")}}),[t]),f=x[0],N=(f?.desc||f?.label||t?.courier_status||"").replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*[—\-–]\s*/,""),g=N?T(N):null,w=f?.time||"";return e.jsxs("div",{className:"flat-spacing pt-0",children:[e.jsx("style",{children:`
        .ot-wrap { max-width: 640px; margin: 0 auto; }
        .ot-form { display: flex; flex-direction: column; gap: 12px; }
        .ot-form input {
          width: 100%; height: 52px; border: 1px solid #e5e7eb; border-radius: 10px;
          padding: 0 16px; font-size: 15px; outline: none;
        }
        .ot-form input:focus { border-color: #3ec1bc; box-shadow: 0 0 0 3px rgba(62,193,188,.15); }
        .ot-form button {
          height: 52px; border: 0; border-radius: 10px; background: #111; color: #fff;
          font-weight: 600; font-size: 15px;
        }
        .ot-form button:disabled { opacity: .65; }
        .ot-card {
          margin-top: 24px; background: #fff; border: 1px solid #e8eaed;
          border-radius: 14px; overflow: hidden;
        }
        .ot-card-head {
          padding: 18px 20px; display: flex; flex-wrap: wrap; justify-content: space-between;
          gap: 12px; border-bottom: 1px solid #f0f1f3;
        }
        .ot-meta-label { font-size: 11px; letter-spacing: .04em; text-transform: uppercase; color: #8b919a; margin-bottom: 4px; }
        .ot-meta-value { font-size: 15px; font-weight: 650; color: #111; word-break: break-all; }
        .ot-badges { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 20px 0; }
        .ot-badge {
          display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px;
          font-size: 12px; font-weight: 600; text-transform: capitalize;
          background: #f3f4f6; color: #374151;
        }
        .ot-badge--ship { background: #111; color: #fff; }
        .ot-badge--ok { background: #059669; color: #fff; }
        .ot-badge--warn { background: #b45309; color: #fff; }
        .ot-badge--carrier { background: #e6f7f6; color: #0f766e; }
        .ot-latest {
          margin: 14px 20px 0; padding: 14px 16px; border-radius: 12px;
          background: #fff8e8; border: 1px solid #fde68a;
        }
        .ot-latest-time { font-size: 12px; color: #92400e; margin-bottom: 6px; font-weight: 600; }
        .ot-latest-en { font-size: 14.5px; line-height: 1.45; color: #111; font-weight: 600; }
        .ot-latest-ms { font-size: 13px; line-height: 1.4; color: #6b7280; margin-top: 6px; }
        .ot-timeline { padding: 18px 20px 8px; }
        .ot-timeline-title {
          font-size: 12px; letter-spacing: .04em; text-transform: uppercase;
          color: #8b919a; margin-bottom: 14px; font-weight: 650;
        }
        .ot-event {
          position: relative; padding: 0 0 18px 18px;
          border-left: 2px solid #d8f0ee;
        }
        .ot-event:last-child { border-left-color: transparent; padding-bottom: 4px; }
        .ot-event::before {
          content: ""; position: absolute; left: -5px; top: 4px;
          width: 8px; height: 8px; border-radius: 50%; background: #3ec1bc;
          box-shadow: 0 0 0 3px #e6f7f6;
        }
        .ot-event.is-first::before { background: #111; box-shadow: 0 0 0 3px #e5e7eb; }
        .ot-event-en { font-size: 14px; line-height: 1.45; color: #111; font-weight: 550; }
        .ot-event-ms { font-size: 12.5px; line-height: 1.4; color: #6b7280; margin-top: 4px; }
        .ot-event-time { font-size: 12px; color: #9ca3af; margin-top: 6px; }
        .ot-foot {
          padding: 14px 20px; border-top: 1px solid #f0f1f3;
          font-size: 13px; color: #6b7280;
        }
        .ot-foot a { color: #0f766e; font-weight: 600; }
      `}),e.jsx("div",{className:"container",children:e.jsxs("div",{className:"ot-wrap",children:[e.jsxs("form",{className:"ot-form form-tracking",onSubmit:v,children:[e.jsx("input",{type:"text",value:o,onChange:a=>c(a.target.value),placeholder:"Tracking ID (AWB) or Order Number*",required:!0,autoComplete:"off"}),e.jsx("button",{type:"submit",disabled:h,children:h?"Tracking…":"Track"})]}),j&&e.jsx("div",{className:"alert alert-danger mt-3 mb-0",role:"alert",style:{borderRadius:10},children:j}),t&&e.jsxs("div",{className:"ot-card",children:[e.jsxs("div",{className:"ot-card-head",children:[e.jsxs("div",{children:[e.jsx("div",{className:"ot-meta-label",children:"Tracking ID"}),e.jsx("div",{className:"ot-meta-value",children:t.tracking_number||"—"})]}),t.order_number&&e.jsxs("div",{className:"text-end",children:[e.jsx("div",{className:"ot-meta-label",children:"Order"}),e.jsx("div",{className:"ot-meta-value",children:t.order_number})]})]}),e.jsxs("div",{className:"ot-badges",children:[t.order_status&&e.jsx("span",{className:O(t.order_status),children:t.order_status}),t.courier==="jt_express"&&e.jsx("span",{className:"ot-badge ot-badge--carrier",children:"JT Express"})]}),!t.has_tracking&&!t.tracking_number?e.jsx("p",{className:"px-4 py-3 mb-0 text-muted",children:t.message||"No tracking ID yet. It will appear once the shipment is created."}):x.length===0?e.jsx("p",{className:"px-4 py-3 mb-0 text-muted",children:"Tracking ID found. No scan events yet — check again after pickup."}):e.jsxs(e.Fragment,{children:[g&&e.jsxs("div",{className:"ot-latest",children:[w&&e.jsx("div",{className:"ot-latest-time",children:w}),e.jsx("div",{className:"ot-latest-en",children:g.en}),g.ms&&e.jsx("div",{className:"ot-latest-ms",children:g.ms})]}),x.length>1&&e.jsxs("div",{className:"ot-timeline",children:[e.jsx("div",{className:"ot-timeline-title",children:"Shipment history"}),x.slice(1).map((a,r)=>{const n=(a.desc||a.label||"Update").replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*[—\-–]\s*/,""),l=T(n);return e.jsxs("div",{className:`ot-event${r===0?" is-first":""}`,children:[e.jsx("div",{className:"ot-event-en",children:l.en}),l.ms&&e.jsx("div",{className:"ot-event-ms",children:l.ms}),a.time&&e.jsx("div",{className:"ot-event-time",children:a.time})]},r)})]})]}),e.jsxs("div",{className:"ot-foot",children:["Logged-in customers can also open"," ",e.jsx(_,{to:"/account-orders",children:"My Orders"})," to track shipments."]})]})]})})]})}const z=E("Track order","Enter your details to check the status of your order."),R=()=>e.jsxs(e.Fragment,{children:[e.jsx(I,{title:z.title,description:z.description}),e.jsx(D,{}),e.jsx(B,{})]});export{R as default};
