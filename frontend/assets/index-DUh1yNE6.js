import{n as p,r,p as b,j as e,L as o,f}from"./index-DB7CXzJY.js";import{A as g,a as m}from"./AccountSection-6DC47EDv.js";import{P as u}from"./PageMeta-CB1VWvf6.js";const j=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M21 8l-9-5-9 5 9 5 9-5z"}),e.jsx("path",{d:"M3 8v8l9 5 9-5V8"}),e.jsx("path",{d:"M12 13v8"})]}),v=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("circle",{cx:"12",cy:"12",r:"9"}),e.jsx("path",{d:"M12 7v5l3.5 2"})]}),w=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("circle",{cx:"12",cy:"12",r:"9"}),e.jsx("path",{d:"M8 12.5l2.5 2.5L16 9.5"})]}),y=()=>e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"}),e.jsx("circle",{cx:"12",cy:"9.5",r:"2.25"})]}),k=[{key:"total_orders",label:"Total Orders",Icon:j},{key:"pending",label:"Pending Orders",Icon:v},{key:"delivered",label:"Delivered",Icon:w},{key:"addresses",label:"Saved Addresses",Icon:y}];function N(){p();const[a,n]=r.useState(null),[c,d]=r.useState([]),[l,x]=r.useState(!0);return r.useEffect(()=>{b.dashboard().then(t=>{const s=t.data.data;s&&(n(s.stats),d(s.recent_orders))}).catch(()=>{}).finally(()=>x(!1))},[]),e.jsx(g,{title:"Dashboard",children:e.jsxs("div",{className:"dashboard-classic-wrapper",children:[e.jsx("style",{children:`
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
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 0;
            margin-bottom: 36px;
            border: 1px solid var(--hairline);
            border-radius: 2px;
            background: var(--paper);
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

          .tx-table-wrapper {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
          }

          .tx-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
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
        `}),l?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-secondary",role:"status"})}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"classic-stat-grid",children:k.map(({key:t,label:s,Icon:i})=>{const h=t==="total_orders"?a?.total_orders??0:t==="pending"?a?.pending??0:t==="delivered"?a?.delivered??0:a?.addresses??0;return e.jsxs("div",{className:"classic-stat-card",children:[e.jsx("div",{className:"classic-stat-icon",children:e.jsx(i,{})}),e.jsxs("div",{className:"classic-stat-info",children:[e.jsx("div",{className:"stat-label",children:s}),e.jsx("h4",{className:"stat-value",children:h})]})]},t)})}),e.jsxs("div",{className:"tx-history-header",children:[e.jsx("h3",{className:"tx-history-title",children:"Recent Orders"}),e.jsx(o,{to:"/account-orders",className:"classic-btn-view",children:"View All"})]}),e.jsx("div",{className:"tx-table-wrapper",children:c.length===0?e.jsx("div",{className:"classic-empty",children:"No recent orders found."}):e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"tx-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Order"}),e.jsx("th",{children:"Date"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Total"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:c.map(t=>{const s=t.status==="delivered"?"delivered":t.status==="cancelled"?"cancelled":t.status==="shipped"?"shipped":"pending",i=t.status.charAt(0).toUpperCase()+t.status.slice(1);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("span",{style:{fontWeight:600},children:["#",t.order_number??t.id]})}),e.jsx("td",{children:new Date(t.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}),e.jsx("td",{children:e.jsx("span",{className:`tx-status-badge ${s}`,children:i})}),e.jsx("td",{style:{fontWeight:500},children:f(t.total)}),e.jsx("td",{children:e.jsx(o,{to:"/account-orders",className:"classic-btn-view",style:{fontSize:"11px",borderBottom:"none",padding:0},children:"View"})})]},t.id)})})]})})})]})]})})}const C=()=>e.jsxs(e.Fragment,{children:[e.jsx(u,{title:"My Account | 2Deal - Online Saree & Ethnic Wear Store",description:"2Deal - Online Saree & Ethnic Wear Store"}),e.jsx(m,{}),e.jsx(N,{})]});export{C as default};
