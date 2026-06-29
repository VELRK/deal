import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{n}from"./chunk-QFMPRPBF-BNQPla1W.js";import{t as r}from"./authStore-cePwo9pG.js";import{h as i}from"./api-CLcNGb5M.js";import{t as a}from"./jsx-runtime-DdEXjPBp.js";import{t as o}from"./formatPrice-BTsvo7Cc.js";import{n as s,t as c}from"./AccountSection-CIbDtcCp.js";import{t as l}from"./PageMeta-6gZ1jYam.js";var u=e(t(),1),d=a(),f=[{key:`total_orders`,label:`Total Orders`,icon:`📦`,bg:`#fdfafb`,text:`#c11069`,border:`rgba(193, 16, 105, 0.12)`},{key:`pending`,label:`Pending Orders`,icon:`⏳`,bg:`#fffbeb`,text:`#b45309`,border:`#fef3c7`},{key:`delivered`,label:`Delivered`,icon:`✅`,bg:`#f0fdf4`,text:`#15803d`,border:`#dcfce7`},{key:`addresses`,label:`Saved Addresses`,icon:`📍`,bg:`#faf5ff`,text:`#6b21a8`,border:`#f3e8ff`}];function p(){r();let[e,t]=(0,u.useState)(null),[a,s]=(0,u.useState)([]),[l,p]=(0,u.useState)(!0);return(0,u.useEffect)(()=>{i.dashboard().then(e=>{let n=e.data.data;n&&(t(n.stats),s(n.recent_orders))}).catch(()=>{}).finally(()=>p(!1))},[]),(0,d.jsx)(c,{title:`Dashboard`,children:(0,d.jsxs)(`div`,{className:`dashboard-container-custom`,children:[(0,d.jsx)(`style`,{children:`
          .dashboard-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .stat-card-custom {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(193, 16, 105, 0.05);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            transition: all 0.3s ease;
          }

          .stat-card-custom:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 24px rgba(193, 16, 105, 0.05);
            border-color: rgba(193, 16, 105, 0.12);
          }

          .stat-info-custom .stat-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666666;
            margin-bottom: 6px;
          }

          .stat-info-custom .stat-value {
            font-size: 26px;
            font-weight: 700;
            color: #111111;
            margin: 0;
            line-height: 1;
          }

          .stat-icon-custom {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            transition: all 0.3s ease;
          }

          .stat-card-custom:hover .stat-icon-custom {
            transform: scale(1.1);
          }

          .recent-orders-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.01);
            border: 1px solid rgba(0,0,0,0.03);
          }

          .recent-orders-title-wrap {
            border-bottom: 1px solid rgba(193, 16, 105, 0.06);
            padding-bottom: 16px;
          }

          .recent-orders-title {
            font-size: 18px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 0;
          }

          .table-custom {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px;
          }

          .table-custom th {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #888888;
            padding: 10px 16px;
            border: none;
          }

          .table-custom tbody tr {
            background: #ffffff;
            transition: all 0.2s ease;
          }

          .table-custom tbody tr:hover {
            background: #fdfafb;
          }

          .table-custom td {
            padding: 14px 16px;
            vertical-align: middle;
            border-top: 1px solid #f5f5f5;
            border-bottom: 1px solid #f5f5f5;
            font-size: 14px;
            color: #444444;
          }

          .table-custom td:first-child {
            border-left: 1px solid #f5f5f5;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            font-weight: 600;
            color: #111111;
          }

          .table-custom td:last-child {
            border-right: 1px solid #f5f5f5;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
          }

          .status-badge-custom {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
          }

          .status-badge-custom.delivered {
            background: #eafaf1;
            color: #15803d;
            border: 1px solid #bbf7d0;
          }

          .status-badge-custom.pending {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fef3c7;
          }

          .status-badge-custom.shipped {
            background: #f0f9ff;
            color: #0369a1;
            border: 1px solid #e0f2fe;
          }

          .status-badge-custom.cancelled {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fee2e2;
          }

          .btn-view-custom {
            color: #c11069 !important;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .btn-view-custom:hover {
            color: #920b4e !important;
            text-decoration: underline !important;
          }
        `}),l?(0,d.jsx)(`div`,{className:`text-center py-5`,children:(0,d.jsx)(`div`,{className:`spinner-border text-dark`,role:`status`})}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`div`,{className:`row g-4 mb-4`,children:f.map(t=>(0,d.jsx)(`div`,{className:`col-6 col-md-3`,children:(0,d.jsxs)(`div`,{className:`stat-card-custom`,children:[(0,d.jsxs)(`div`,{className:`stat-info-custom`,children:[(0,d.jsx)(`div`,{className:`stat-label`,children:t.label}),(0,d.jsx)(`h4`,{className:`stat-value`,children:t.key===`total_orders`?e?.total_orders??0:t.key===`pending`?e?.pending??0:t.key===`delivered`?e?.delivered??0:e?.addresses??0})]}),(0,d.jsx)(`div`,{className:`stat-icon-custom`,style:{background:t.bg,color:t.text,border:`1px solid ${t.border}`},children:(0,d.jsx)(`span`,{children:t.icon})})]})},t.key))}),(0,d.jsxs)(`div`,{className:`recent-orders-card mt-5`,children:[(0,d.jsxs)(`div`,{className:`recent-orders-title-wrap mb-3 d-flex justify-content-between align-items-center`,children:[(0,d.jsx)(`h5`,{className:`recent-orders-title`,children:`Recent Orders`}),(0,d.jsx)(n,{to:`/account-orders`,className:`btn-view-custom`,children:`View All`})]}),a.length===0?(0,d.jsx)(`div`,{className:`text-center py-5 rounded-3`,style:{background:`#fdfafb`,border:`1px dashed rgba(193, 16, 105, 0.15)`},children:(0,d.jsx)(`p`,{className:`mb-0 text-muted`,children:`No recent orders found.`})}):(0,d.jsx)(`div`,{className:`table-responsive`,children:(0,d.jsxs)(`table`,{className:`table-custom`,children:[(0,d.jsx)(`thead`,{children:(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{children:`Order`}),(0,d.jsx)(`th`,{children:`Date`}),(0,d.jsx)(`th`,{children:`Status`}),(0,d.jsx)(`th`,{children:`Total`}),(0,d.jsx)(`th`,{children:`Actions`})]})}),(0,d.jsx)(`tbody`,{children:a.map(e=>{let t=e.status===`delivered`?`delivered`:e.status===`cancelled`?`cancelled`:e.status===`shipped`?`shipped`:`pending`,r=e.status.charAt(0).toUpperCase()+e.status.slice(1);return(0,d.jsxs)(`tr`,{children:[(0,d.jsxs)(`td`,{children:[`#`,e.order_number??e.id]}),(0,d.jsx)(`td`,{children:new Date(e.created_at).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})}),(0,d.jsx)(`td`,{children:(0,d.jsx)(`span`,{className:`status-badge-custom ${t}`,children:r})}),(0,d.jsx)(`td`,{className:`fw-bold`,children:o(e.total)}),(0,d.jsx)(`td`,{children:(0,d.jsx)(n,{to:`/account-orders`,className:`btn-view-custom`,children:`View`})})]},e.id)})})]})})]})]})]})})}var m=()=>(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{title:`My Account | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,d.jsx)(s,{}),(0,d.jsx)(p,{})]});export{m as default};