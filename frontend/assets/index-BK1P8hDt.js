import{n as b,r as d,v as m,x as u,j as t,L as x,f as v}from"./index-DUbP1h-v.js";import{A as j,a as w}from"./AccountSection-kSVKQhRA.js";import{P as y}from"./PageMeta-BVTzPYqk.js";const k=()=>t.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[t.jsx("path",{d:"M21 8l-9-5-9 5 9 5 9-5z"}),t.jsx("path",{d:"M3 8v8l9 5 9-5V8"}),t.jsx("path",{d:"M12 13v8"})]}),N=()=>t.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[t.jsx("circle",{cx:"12",cy:"12",r:"9"}),t.jsx("path",{d:"M12 7v5l3.5 2"})]}),S=()=>t.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[t.jsx("circle",{cx:"12",cy:"12",r:"9"}),t.jsx("path",{d:"M8 12.5l2.5 2.5L16 9.5"})]}),A=()=>t.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[t.jsx("path",{d:"M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"}),t.jsx("circle",{cx:"12",cy:"9.5",r:"2.25"})]}),z=[{key:"total_orders",label:"Total Orders",Icon:k},{key:"pending",label:"Pending Orders",Icon:N},{key:"delivered",label:"Delivered",Icon:S},{key:"addresses",label:"Saved Addresses",Icon:A}];function C(){b();const[c,p]=d.useState(null),[l,h]=d.useState([]),[f,g]=d.useState(!0);return d.useEffect(()=>{Promise.all([m.dashboard().catch(()=>null),u.getAll().catch(()=>null)]).then(([e,a])=>{if(!e)return;const r=e.data.data;if(r){const i={...r.stats};if(a&&a.data){const o=a.data.data||[];i.total_orders=o.filter(s=>{const n=s.status?.toLowerCase();return n!=="payment_attempt"&&n!=="abandoned"}).length,i.pending=o.filter(s=>{const n=s.status?.toLowerCase();return["pending","confirmed","processing","shipped"].includes(n||"")}).length,i.delivered=o.filter(s=>s.status?.toLowerCase()==="delivered").length}p(i),h(r.recent_orders.filter(o=>{const s=o.status?.toLowerCase();return s!=="payment_attempt"&&s!=="abandoned"}))}}).finally(()=>g(!1))},[]),t.jsx(j,{title:"Dashboard",children:t.jsxs("div",{className:"dashboard-classic-wrapper",children:[t.jsx("style",{children:`
          .dashboard-classic-wrapper {
            width: 100%;
            --ink: #24262b;
            --muted: #6b6f76;
            --hairline: #dcd7ca;
            --paper: #ffffff;
            --brass: #3ec1bc;
            --brass-dark: #2e9a96;
            --navy: #1f2d3d;
          }

          .dashboard-classic-wrapper * {
            box-sizing: border-box;
          }

          /* ---------- Stat grid ---------- */
          .classic-stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0;
            margin-bottom: 36px;
            border: 1px solid var(--hairline);
            border-radius: 8px;
            background: var(--paper);
            overflow: hidden;
          }

          .classic-stat-card {
            padding: 22px 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-right: 1px solid var(--hairline);
            border-bottom: 1px solid var(--hairline);
          }

          .classic-stat-grid .classic-stat-card:last-child {
            border-right: none;
          }

          @media (max-width: 900px) {
            .classic-stat-card {
              border-right: none;
            }
          }

          @media (max-width: 576px) {
            .classic-stat-grid {
              grid-template-columns: 1fr 1fr;
              margin-bottom: 24px;
            }
            .classic-stat-card {
              padding: 14px 12px;
              gap: 10px;
              border-right: 1px solid var(--hairline);
            }
            .classic-stat-card:nth-child(2n) {
              border-right: none;
            }
            .classic-stat-icon {
              width: 36px !important;
              height: 36px !important;
            }
            .classic-stat-icon svg {
              width: 17px;
              height: 17px;
            }
            .classic-stat-info .stat-label {
              font-size: 10px;
              margin-bottom: 4px;
            }
            .classic-stat-info .stat-value {
              font-size: 22px;
            }
          }

          .classic-stat-icon {
            width: 42px;
            height: 42px;
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--hairline);
            border-radius: 50%;
            color: var(--brass);
            background: #faf7ef;
          }

          .classic-stat-info .stat-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 6px;
          }

          .classic-stat-info .stat-value {
            font-size: 28px;
            font-weight: 400;
            color: var(--navy);
            margin: 0;
            line-height: 1;
          }

          /* ---------- Orders section (Matched to Transaction History) ---------- */
          .tx-history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .tx-history-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
          }

          @media (max-width: 576px) {
            .tx-history-title {
              font-size: 17px;
            }
          }

          .tx-table-wrapper {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
            -webkit-overflow-scrolling: touch;
          }

          .tx-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            min-width: 500px;
          }

          .tx-table th {
            background: #f8fafc;
            padding: 14px 18px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            border-bottom: 1px solid #eaeaea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .tx-table td {
            padding: 16px 18px;
            font-size: 14px;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .tx-table tr:last-child td {
            border-bottom: none;
          }

          .tx-status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .tx-status-badge.delivered { background: #ecfdf5; color: #059669; }
          .tx-status-badge.pending { background: #fffbeb; color: #d97706; }
          .tx-status-badge.shipped { background: #eff6ff; color: #2563eb; }
          .tx-status-badge.cancelled { background: #fef2f2; color: #dc2626; }

          .classic-btn-view {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--brass) !important;
            text-decoration: none;
            padding-bottom: 2px;
            border-bottom: 1px solid var(--brass);
            transition: color 0.2s ease, border-color 0.2s ease;
          }

          .classic-btn-view:hover {
            color: var(--brass-dark) !important;
            border-color: var(--brass-dark);
          }

          .classic-empty {
            text-align: center;
            padding: 48px 0;
            color: var(--muted);
            font-size: 15px;
          }
        `}),f?t.jsx("div",{className:"text-center py-5",children:t.jsx("div",{className:"spinner-border text-secondary",role:"status"})}):t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"classic-stat-grid",children:z.map(({key:e,label:a,Icon:r})=>{const i=e==="total_orders"?c?.total_orders??0:e==="pending"?c?.pending??0:e==="delivered"?c?.delivered??0:c?.addresses??0;return t.jsxs("div",{className:"classic-stat-card",children:[t.jsx("div",{className:"classic-stat-icon",children:t.jsx(r,{})}),t.jsxs("div",{className:"classic-stat-info",children:[t.jsx("div",{className:"stat-label",children:a}),t.jsx("h4",{className:"stat-value",children:i})]})]},e)})}),t.jsxs("div",{className:"tx-history-header",children:[t.jsx("h3",{className:"tx-history-title",children:"Recent Orders"}),t.jsx(x,{to:"/account-orders",className:"classic-btn-view",children:"View All"})]}),t.jsx("div",{className:"tx-table-wrapper",children:l.length===0?t.jsx("div",{className:"classic-empty",children:"No recent orders found."}):t.jsx("div",{className:"table-responsive",children:t.jsxs("table",{className:"tx-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:"Order"}),t.jsx("th",{children:"Date"}),t.jsx("th",{children:"Status"}),t.jsx("th",{children:"Total"}),t.jsx("th",{children:"Actions"})]})}),t.jsx("tbody",{children:l.map(e=>{const a=e.status==="delivered"?"delivered":e.status==="cancelled"?"cancelled":e.status==="shipped"?"shipped":"pending",r=e.status.charAt(0).toUpperCase()+e.status.slice(1);return t.jsxs("tr",{children:[t.jsx("td",{children:t.jsxs("span",{style:{fontWeight:600},children:["#",e.order_number??e.id]})}),t.jsx("td",{children:new Date(e.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}),t.jsx("td",{children:t.jsx("span",{className:`tx-status-badge ${a}`,children:r})}),t.jsx("td",{style:{fontWeight:500},children:v(e.total)}),t.jsx("td",{children:t.jsx(x,{to:"/account-orders",className:"classic-btn-view",style:{fontSize:"11px",borderBottom:"none",padding:0},children:"View"})})]},e.id)})})]})})})]})]})})}const _=()=>t.jsxs(t.Fragment,{children:[t.jsx(y,{title:"My Account | 2Deal - Incense Sticks, Soaps & Food Products Store",description:"2Deal - Incense Sticks, Soaps & Food Products Store"}),t.jsx(w,{}),t.jsx(C,{})]});export{_ as default};
