import{j as e,L as C,k as I,r as c,B as S}from"./index-Cw6ZkRnq.js";import{s as D}from"./shop-D2QgFNTd.js";import{P as E}from"./PageMeta-DLSp0NhZ.js";import"./shop-product-DggKgXmd.js";function B(){return e.jsx(e.Fragment,{children:e.jsx("section",{className:"section-page-title text-center flat-spacing-2",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"main-page-title",children:[e.jsxs("div",{className:"breadcrumbs",children:[e.jsx(C,{to:"/",className:"text-caption-01 cl-text-3 link",children:"Home"}),e.jsx("i",{className:"icon icon-CaretRightThin cl-text-3"}),e.jsx("p",{className:"text-caption-01",children:"Order Tracking"})]}),e.jsx("h3",{children:"Order Tracking"}),e.jsxs("p",{className:"text-body-1 cl-text-2",children:["Enter your tracking ID (AWB) or order number and press Track.",e.jsx("br",{className:"d-none d-lg-block"}),"Tracking appears after your shipment is created with JT Express."]})]})})})})}function z(d){const s=d.replace(/^[\s\u2014\-–]+/,"").replace(/[【\[]/g,"").replace(/[】\]]/g,"").trim(),r=s.match(/^(.*?reason\s+is\s+)(.+?)\s*\/\s*(.+)$/i);if(r)return{en:`${r[1]}${r[2]}`.replace(/,\s*/g,", ").trim(),ms:r[3].trim()};const o=s.match(/^(.+?)\s*\/\s*(.+)$/);return o&&/[A-Za-z]/.test(o[1])&&/[A-Za-z]/.test(o[2])?{en:o[1].trim(),ms:o[2].trim()}:{en:s.replace(/,\s*/g,", ")}}function L(d,s){const r=(d||"").toLowerCase(),o=(s||"").toLowerCase();return r==="delivered"||o.includes("delivered")?"ok":r==="cancelled"||r==="returned"||o.includes("return")?"warn":o.includes("on hold")||o.includes("exception")||o.includes("failed")?"hold":r==="shipped"||r==="processing"||r==="confirmed"?"ship":"neutral"}function O(){const[d]=I(),s=d.get("tracking")||d.get("awb")||d.get("order")||"",[r,o]=c.useState(s),[h,k]=c.useState(!1),[v,m]=c.useState(null),[t,j]=c.useState(null),w=c.useCallback(async(n,a)=>{n?.preventDefault();const i=(a??r).trim();if(!i){m("Enter your tracking ID (AWB) or order number.");return}const f=/^SK/i.test(i)||i.includes("-");k(!0),m(null),j(null);try{const u=f?{order_number:i,tracking_number:i}:{tracking_number:i},x=await S.track(u),T=x.data?.data;if(!x.data?.success||!T){m(x.data?.message||"Shipment not found.");return}j(T)}catch(u){const x=u?.response?.data?.message||"Could not fetch tracking. Check the ID and try again.";m(x)}finally{k(!1)}},[r]);c.useEffect(()=>{s&&w(void 0,s)},[s]);const g=c.useMemo(()=>t?.events?.length?t.events:(t?.tracks??[]).map(n=>{const a=n;return{time:a.scanTime||a.time||"",desc:a.desc||a.remark||a.scanType||"",label:[a.scanTime||a.time,a.desc||a.remark||a.scanType].filter(Boolean).join(" — ")}}),[t]),b=g[0],N=(b?.desc||b?.label||t?.courier_status||"").replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*[—\-–]\s*/,""),l=N?z(N):null,y=b?.time||"",p=L(t?.order_status,l?.en);return e.jsxs("div",{className:"flat-spacing pt-0",children:[e.jsx("style",{children:`
        .ot-wrap { max-width: 720px; margin: 0 auto; }
        .ot-search {
          background: linear-gradient(180deg, #f3fbfa 0%, #ffffff 100%);
          border: 1px solid #d9efed;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(15, 118, 110, 0.05);
        }
        .ot-form {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }
        .ot-form input {
          flex: 1;
          min-width: 0;
          height: 52px;
          border: 1px solid #d7e3e2;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 15px;
          background: #fff;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .ot-form input:focus {
          border-color: #3ec1bc;
          box-shadow: 0 0 0 4px rgba(62, 193, 188, 0.16);
        }
        .ot-form button {
          flex: 0 0 auto;
          min-width: 120px;
          height: 52px;
          border: 0;
          border-radius: 12px;
          background: #0f766e;
          color: #fff;
          font-weight: 650;
          font-size: 15px;
          padding: 0 22px;
          transition: background .15s, transform .15s;
        }
        .ot-form button:hover:not(:disabled) { background: #0d9488; }
        .ot-form button:active:not(:disabled) { transform: translateY(1px); }
        .ot-form button:disabled { opacity: .65; cursor: wait; }
        @media (max-width: 560px) {
          .ot-form { flex-direction: column; }
          .ot-form button { width: 100%; min-width: 0; }
        }
        .ot-error {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-size: 14px;
        }
        .ot-card {
          margin-top: 22px;
          background: #fff;
          border: 1px solid #e6eceb;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(17, 24, 39, 0.05);
        }
        .ot-card-head {
          padding: 20px 22px 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: start;
          background:
            linear-gradient(90deg, rgba(62,193,188,.12), transparent 55%),
            #fafcfb;
          border-bottom: 1px solid #eef3f2;
        }
        .ot-meta-label {
          font-size: 11px;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #7b8790;
          margin-bottom: 6px;
          font-weight: 650;
        }
        .ot-meta-value {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          word-break: break-all;
          line-height: 1.3;
        }
        .ot-meta-side { text-align: right; }
        .ot-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px 22px 0;
        }
        .ot-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 650;
          text-transform: capitalize;
          background: #f3f4f6;
          color: #374151;
        }
        .ot-badge::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: .7;
        }
        .ot-badge--ship { background: #111827; color: #fff; }
        .ot-badge--ok { background: #059669; color: #fff; }
        .ot-badge--warn { background: #b45309; color: #fff; }
        .ot-badge--carrier {
          background: #e6f7f6;
          color: #0f766e;
        }
        .ot-badge--carrier::before { background: #3ec1bc; opacity: 1; }
        .ot-empty {
          padding: 18px 22px 8px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }
        .ot-latest {
          margin: 16px 22px 0;
          padding: 16px 16px 16px 18px;
          border-radius: 14px;
          position: relative;
          overflow: hidden;
        }
        .ot-latest::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
        }
        .ot-latest--ship { background: #f0fdfa; border: 1px solid #99f6e4; }
        .ot-latest--ship::before { background: #14b8a6; }
        .ot-latest--ok { background: #ecfdf5; border: 1px solid #a7f3d0; }
        .ot-latest--ok::before { background: #10b981; }
        .ot-latest--hold { background: #fffbeb; border: 1px solid #fde68a; }
        .ot-latest--hold::before { background: #f59e0b; }
        .ot-latest--warn { background: #fff7ed; border: 1px solid #fed7aa; }
        .ot-latest--warn::before { background: #ea580c; }
        .ot-latest--neutral { background: #f8fafc; border: 1px solid #e2e8f0; }
        .ot-latest--neutral::before { background: #94a3b8; }
        .ot-latest-kicker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }
        .ot-latest-label {
          font-size: 11px;
          letter-spacing: .06em;
          text-transform: uppercase;
          font-weight: 700;
          color: #64748b;
        }
        .ot-latest-time {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .ot-latest-en {
          font-size: 15px;
          line-height: 1.5;
          color: #0f172a;
          font-weight: 650;
        }
        .ot-latest-ms {
          font-size: 13px;
          line-height: 1.45;
          color: #64748b;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed rgba(100, 116, 139, 0.25);
        }
        .ot-timeline { padding: 20px 22px 10px; }
        .ot-timeline-title {
          font-size: 11px;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #7b8790;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .ot-event {
          position: relative;
          padding: 0 0 18px 20px;
          border-left: 2px solid #d8f0ee;
        }
        .ot-event:last-child { border-left-color: transparent; padding-bottom: 2px; }
        .ot-event::before {
          content: "";
          position: absolute;
          left: -5px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3ec1bc;
          box-shadow: 0 0 0 3px #e6f7f6;
        }
        .ot-event.is-first::before {
          background: #0f766e;
          box-shadow: 0 0 0 3px #ccfbf1;
        }
        .ot-event-en { font-size: 14px; line-height: 1.45; color: #111827; font-weight: 600; }
        .ot-event-ms { font-size: 12.5px; line-height: 1.4; color: #6b7280; margin-top: 4px; }
        .ot-event-time {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 6px;
          font-variant-numeric: tabular-nums;
        }
        .ot-foot {
          margin-top: 8px;
          padding: 14px 22px 16px;
          border-top: 1px solid #eef3f2;
          font-size: 13px;
          color: #6b7280;
          background: #fafcfb;
        }
        .ot-foot a { color: #0f766e; font-weight: 700; text-decoration: none; }
        .ot-foot a:hover { text-decoration: underline; }
      `}),e.jsx("div",{className:"container",children:e.jsxs("div",{className:"ot-wrap",children:[e.jsx("div",{className:"ot-search",children:e.jsxs("form",{className:"ot-form form-tracking",onSubmit:w,children:[e.jsx("input",{type:"text",value:r,onChange:n=>o(n.target.value),placeholder:"Tracking ID (AWB) or order number",required:!0,autoComplete:"off","aria-label":"Tracking ID or order number"}),e.jsx("button",{type:"submit",disabled:h,children:h?"Tracking…":"Track"})]})}),v&&e.jsx("div",{className:"ot-error",role:"alert",children:v}),t&&e.jsxs("div",{className:"ot-card",children:[e.jsxs("div",{className:"ot-card-head",children:[e.jsxs("div",{children:[e.jsx("div",{className:"ot-meta-label",children:"Tracking ID"}),e.jsx("div",{className:"ot-meta-value",children:t.tracking_number||"—"})]}),t.order_number&&e.jsxs("div",{className:"ot-meta-side",children:[e.jsx("div",{className:"ot-meta-label",children:"Order"}),e.jsx("div",{className:"ot-meta-value",children:t.order_number})]})]}),e.jsxs("div",{className:"ot-badges",children:[t.order_status&&e.jsx("span",{className:`ot-badge ${p==="ok"?"ot-badge--ok":p==="warn"?"ot-badge--warn":p==="ship"||p==="hold"?"ot-badge--ship":""}`,children:t.order_status}),t.courier==="jt_express"&&e.jsx("span",{className:"ot-badge ot-badge--carrier",children:"JT Express"})]}),!t.has_tracking&&!t.tracking_number?e.jsx("p",{className:"ot-empty",children:t.message||"No tracking ID yet. It will appear once the shipment is created."}):g.length===0?e.jsx("p",{className:"ot-empty",children:"Tracking ID found. No scan events yet — check again after pickup."}):e.jsxs(e.Fragment,{children:[l&&e.jsxs("div",{className:`ot-latest ot-latest--${p}`,children:[e.jsxs("div",{className:"ot-latest-kicker",children:[e.jsx("span",{className:"ot-latest-label",children:"Current status"}),y&&e.jsx("span",{className:"ot-latest-time",children:y})]}),e.jsx("div",{className:"ot-latest-en",children:l.en}),l.ms&&e.jsx("div",{className:"ot-latest-ms",children:l.ms})]}),g.length>1&&e.jsxs("div",{className:"ot-timeline",children:[e.jsx("div",{className:"ot-timeline-title",children:"Shipment history"}),g.slice(1).map((n,a)=>{const i=(n.desc||n.label||"Update").replace(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*[—\-–]\s*/,""),f=z(i);return e.jsxs("div",{className:`ot-event${a===0?" is-first":""}`,children:[e.jsx("div",{className:"ot-event-en",children:f.en}),f.ms&&e.jsx("div",{className:"ot-event-ms",children:f.ms}),n.time&&e.jsx("div",{className:"ot-event-time",children:n.time})]},a)})]})]}),e.jsxs("div",{className:"ot-foot",children:["Logged-in customers can also open"," ",e.jsx(C,{to:"/account-orders",children:"My Orders"})," to track shipments."]})]})]})})]})}const _=D("Track order","Enter your details to check the status of your order."),R=()=>e.jsxs(e.Fragment,{children:[e.jsx(E,{title:_.title,description:_.description}),e.jsx(B,{}),e.jsx(O,{})]});export{R as default};
