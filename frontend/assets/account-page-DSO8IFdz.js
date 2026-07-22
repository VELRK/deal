import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{h as n}from"./api-C_c3O5NQ.js";import{S as r,s as i,t as a,x as o}from"./index-CFlLXPh7.js";import{n as s,t as c}from"./AccountSection-DU7AwRKE.js";import{t as l}from"./PageMeta-CyS8ELM3.js";var u=e(t(),1),d=i(),f=[{key:`total_orders`,label:`Total Orders`,Icon:()=>(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`path`,{d:`M21 8l-9-5-9 5 9 5 9-5z`}),(0,d.jsx)(`path`,{d:`M3 8v8l9 5 9-5V8`}),(0,d.jsx)(`path`,{d:`M12 13v8`})]})},{key:`pending`,label:`Pending Orders`,Icon:()=>(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`circle`,{cx:`12`,cy:`12`,r:`9`}),(0,d.jsx)(`path`,{d:`M12 7v5l3.5 2`})]})},{key:`delivered`,label:`Delivered`,Icon:()=>(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`circle`,{cx:`12`,cy:`12`,r:`9`}),(0,d.jsx)(`path`,{d:`M8 12.5l2.5 2.5L16 9.5`})]})},{key:`addresses`,label:`Saved Addresses`,Icon:()=>(0,d.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,d.jsx)(`path`,{d:`M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z`}),(0,d.jsx)(`circle`,{cx:`12`,cy:`9.5`,r:`2.25`})]})}];function p(){o();let[e,t]=(0,u.useState)(null),[i,s]=(0,u.useState)([]),[l,p]=(0,u.useState)(!0);return(0,u.useEffect)(()=>{n.dashboard().then(e=>{let n=e.data.data;n&&(t(n.stats),s(n.recent_orders))}).catch(()=>{}).finally(()=>p(!1))},[]),(0,d.jsx)(c,{title:`Dashboard`,children:(0,d.jsxs)(`div`,{className:`dashboard-classic-wrapper`,children:[(0,d.jsx)(`style`,{children:`
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
        `}),l?(0,d.jsx)(`div`,{className:`text-center py-5`,children:(0,d.jsx)(`div`,{className:`spinner-border text-secondary`,role:`status`})}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`div`,{className:`classic-stat-grid`,children:f.map(({key:t,label:n,Icon:r})=>{let i=t===`total_orders`?e?.total_orders??0:t===`pending`?e?.pending??0:t===`delivered`?e?.delivered??0:e?.addresses??0;return(0,d.jsxs)(`div`,{className:`classic-stat-card`,children:[(0,d.jsx)(`div`,{className:`classic-stat-icon`,children:(0,d.jsx)(r,{})}),(0,d.jsxs)(`div`,{className:`classic-stat-info`,children:[(0,d.jsx)(`div`,{className:`stat-label`,children:n}),(0,d.jsx)(`h4`,{className:`stat-value`,children:i})]})]},t)})}),(0,d.jsxs)(`div`,{className:`tx-history-header`,children:[(0,d.jsx)(`h3`,{className:`tx-history-title`,children:`Recent Orders`}),(0,d.jsx)(r,{to:`/account-orders`,className:`classic-btn-view`,children:`View All`})]}),(0,d.jsx)(`div`,{className:`tx-table-wrapper`,children:i.length===0?(0,d.jsx)(`div`,{className:`classic-empty`,children:`No recent orders found.`}):(0,d.jsx)(`div`,{className:`table-responsive`,children:(0,d.jsxs)(`table`,{className:`tx-table`,children:[(0,d.jsx)(`thead`,{children:(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{children:`Order`}),(0,d.jsx)(`th`,{children:`Date`}),(0,d.jsx)(`th`,{children:`Status`}),(0,d.jsx)(`th`,{children:`Total`}),(0,d.jsx)(`th`,{children:`Actions`})]})}),(0,d.jsx)(`tbody`,{children:i.map(e=>{let t=e.status===`delivered`?`delivered`:e.status===`cancelled`?`cancelled`:e.status===`shipped`?`shipped`:`pending`,n=e.status.charAt(0).toUpperCase()+e.status.slice(1);return(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{children:(0,d.jsxs)(`span`,{style:{fontWeight:600},children:[`#`,e.order_number??e.id]})}),(0,d.jsx)(`td`,{children:new Date(e.created_at).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})}),(0,d.jsx)(`td`,{children:(0,d.jsx)(`span`,{className:`tx-status-badge ${t}`,children:n})}),(0,d.jsx)(`td`,{style:{fontWeight:500},children:a(e.total)}),(0,d.jsx)(`td`,{children:(0,d.jsx)(r,{to:`/account-orders`,className:`classic-btn-view`,style:{fontSize:`11px`,borderBottom:`none`,padding:0},children:`View`})})]},e.id)})})]})})})]})]})})}var m=()=>(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{title:`My Account | 2Deal - Online Saree & Ethnic Wear Store`,description:`2Deal - Online Saree & Ethnic Wear Store`}),(0,d.jsx)(s,{}),(0,d.jsx)(p,{})]});export{m as default};