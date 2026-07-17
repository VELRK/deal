import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{h as n}from"./api-BFkhFdfc.js";import{S as r,s as i,t as a}from"./index-gu2YDSTq.js";import{n as o,t as s}from"./AccountSection-CqhpG03u.js";import{t as c}from"./PageMeta-CyS8ELM3.js";var l=e(t(),1),u=i();function d(){let[e,t]=(0,l.useState)(null),[i,o]=(0,l.useState)([]),[c,d]=(0,l.useState)(0),[f,p]=(0,l.useState)(!0),[m,h]=(0,l.useState)(!0),[g,_]=(0,l.useState)(1);(0,l.useEffect)(()=>{n.getWallet().then(e=>{e.data?.success&&t(e.data.data)}).catch(console.error).finally(()=>p(!1))},[]),(0,l.useEffect)(()=>{h(!0);let e=(g-1)*10;n.getWalletTransactions({limit:10,offset:e}).then(e=>{if(e.data?.success){let t=e.data.data;o(t.rows??t.transactions??[]),d(t.total??0)}}).catch(console.error).finally(()=>h(!1))},[g]);let v=Math.ceil(c/10);function y(e){try{return new Date(e).toLocaleDateString(`en-MY`,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}catch{return e}}function b(e){switch(e){case`admin_add`:return`Admin Credit`;case`order_payment`:return`Order Payment`;case`refund`:return`Order Refund`;case`promo`:return`Promo Bonus`;case`topup`:return`Wallet Top-Up`;case`adjustment`:return`Wallet Adjustment`;default:return e}}return(0,u.jsx)(s,{title:`My Wallet`,children:(0,u.jsxs)(`div`,{className:`wallet-container-custom`,children:[(0,u.jsx)(`style`,{children:`
          .wallet-container-custom {
            font-family: 'Inter', sans-serif;
            color: #222222;
          }

          .wallet-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          .wallet-card-custom::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: #3ec1bc;
          }

          .wallet-info-part h4 {
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 6px 0;
          }

          .wallet-balance {
            font-size: 38px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
          }

          .wallet-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #065f46;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid #a7f3d0;
          }

          .topup-btn-custom {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #3ec1bc;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 20px;
            border: 1px solid #3ec1bc;
            transition: all 0.2s;
            text-decoration: none !important;
            cursor: pointer;
          }

          .topup-btn-custom:hover {
            background: #35a29f;
            border-color: #35a29f;
            color: #ffffff;
            transform: translateY(-1px);
          }

          .wallet-status-badge .dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
          }

          .wallet-benefit-card {
            background: #f0fdfa;
            border: 1px solid #ccfbf1;
            border-radius: 12px;
            padding: 16px 20px;
            max-width: 320px;
          }

          .wallet-benefit-card h5 {
            font-size: 14px;
            font-weight: 700;
            color: #0f766e;
            margin: 0 0 4px 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .wallet-benefit-card p {
            font-size: 13px;
            color: #115e59;
            margin: 0;
            line-height: 1.5;
          }

          .tx-history-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
          }

          /* Classic Table Style */
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

          .tx-type-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 6px;
          }

          .tx-type-badge.credit {
            background: #e6f4ea;
            color: #137333;
          }

          .tx-type-badge.debit {
            background: #fce8e6;
            color: #c5221f;
          }

          .tx-amount {
            font-weight: 700;
            font-size: 15px;
          }

          .tx-amount.credit {
            color: #137333;
          }

          .tx-amount.debit {
            color: #c5221f;
          }

          .tx-ref {
            font-family: monospace;
            font-size: 13px;
            color: #64748b;
          }

          .tx-date {
            font-size: 13px;
            color: #64748b;
          }

          .wallet-empty-state {
            padding: 40px 20px;
            text-align: center;
            color: #64748b;
          }

          .wallet-empty-state .icon {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
          }

          /* Pagination */
          .tx-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 0 4px;
          }

          .tx-pagination-info {
            font-size: 13px;
            color: #64748b;
          }

          .tx-pagination-buttons {
            display: flex;
            gap: 8px;
          }

          .tx-page-btn {
            background: #ffffff;
            border: 1px solid #d1d5db;
            color: #374151;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .tx-page-btn:hover:not(:disabled) {
            background: #f9fafb;
            border-color: #9ca3af;
          }

          .tx-page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Skeletal Pulse */
          .pulse {
            animation: pulse-animation 1.5s infinite ease-in-out;
            background: #f1f5f9;
            height: 14px;
            border-radius: 4px;
          }

          @keyframes pulse-animation {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}),f?(0,u.jsx)(`div`,{className:`wallet-card-custom`,children:(0,u.jsxs)(`div`,{className:`wallet-info-part`,style:{width:`100%`},children:[(0,u.jsx)(`div`,{className:`pulse`,style:{width:`120px`,marginBottom:`12px`}}),(0,u.jsx)(`div`,{className:`pulse`,style:{width:`240px`,height:`38px`}})]})}):e?(0,u.jsxs)(`div`,{className:`wallet-card-custom`,children:[(0,u.jsxs)(`div`,{className:`wallet-info-part`,children:[(0,u.jsx)(`h4`,{children:`Available Balance`}),(0,u.jsx)(`div`,{className:`wallet-balance`,children:a(e.balance)}),(0,u.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,alignItems:`center`,flexWrap:`wrap`,marginTop:`10px`},children:[e.enabled&&(0,u.jsxs)(`div`,{className:`wallet-status-badge`,style:{marginTop:0},children:[(0,u.jsx)(`span`,{className:`dot`}),(0,u.jsx)(`span`,{children:`Wallet Active`})]}),(0,u.jsx)(r,{to:`/account-wallet/topup`,className:`topup-btn-custom`,children:`➕ Add Funds`})]})]}),e.enabled&&e.discount_percent>0&&(0,u.jsxs)(`div`,{className:`wallet-benefit-card`,children:[(0,u.jsx)(`h5`,{children:`👛 Wallet Pay Benefit`}),(0,u.jsxs)(`p`,{children:[`Pay with wallet during checkout and receive an extra`,` `,(0,u.jsxs)(`strong`,{children:[e.discount_percent,`% off`]}),` on your entire purchase!`]})]})]}):(0,u.jsx)(`div`,{className:`alert alert-danger`,children:`Failed to load wallet information.`}),(0,u.jsx)(`h3`,{className:`tx-history-title`,children:`Transaction History`}),(0,u.jsx)(`div`,{className:`tx-table-wrapper`,children:m?(0,u.jsxs)(`div`,{style:{padding:`30px`},children:[(0,u.jsx)(`div`,{className:`pulse`,style:{width:`100%`,marginBottom:`15px`,height:`40px`}}),(0,u.jsx)(`div`,{className:`pulse`,style:{width:`100%`,marginBottom:`15px`,height:`30px`}}),(0,u.jsx)(`div`,{className:`pulse`,style:{width:`100%`,marginBottom:`15px`,height:`30px`}}),(0,u.jsx)(`div`,{className:`pulse`,style:{width:`100%`,height:`30px`}})]}):i.length>0?(0,u.jsxs)(`table`,{className:`tx-table`,children:[(0,u.jsx)(`thead`,{children:(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`th`,{children:`Date`}),(0,u.jsx)(`th`,{children:`Reference`}),(0,u.jsx)(`th`,{children:`Type`}),(0,u.jsx)(`th`,{children:`Description`}),(0,u.jsx)(`th`,{style:{textAlign:`right`},children:`Amount`}),(0,u.jsx)(`th`,{style:{textAlign:`right`},children:`Balance`})]})}),(0,u.jsx)(`tbody`,{children:i.map(e=>{let t=e.type===`credit`;return(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`td`,{children:(0,u.jsx)(`div`,{className:`tx-date`,children:y(e.created_at)})}),(0,u.jsx)(`td`,{children:(0,u.jsx)(`span`,{className:`tx-ref`,children:e.reference||`TX-${e.id}`})}),(0,u.jsx)(`td`,{children:(0,u.jsx)(`span`,{className:`tx-type-badge ${e.type}`,children:t?`Credit`:`Debit`})}),(0,u.jsx)(`td`,{children:(0,u.jsx)(`div`,{style:{fontWeight:500,fontSize:`14px`},children:e.description||b(e.source)})}),(0,u.jsx)(`td`,{style:{textAlign:`right`},children:(0,u.jsxs)(`span`,{className:`tx-amount ${e.type}`,children:[t?`+`:`-`,a(e.amount)]})}),(0,u.jsx)(`td`,{style:{textAlign:`right`,fontWeight:600},children:a(e.balance_after)})]},e.id)})})]}):(0,u.jsxs)(`div`,{className:`wallet-empty-state`,children:[(0,u.jsx)(`span`,{className:`icon`,children:`👛`}),(0,u.jsx)(`p`,{className:`mb-0 fw-semibold`,children:`No transactions found.`}),(0,u.jsx)(`span`,{className:`text-muted`,style:{fontSize:`13px`},children:`Transactions will appear here when you pay with your wallet or get credits.`})]})}),!m&&c>10&&(0,u.jsxs)(`div`,{className:`tx-pagination`,children:[(0,u.jsxs)(`div`,{className:`tx-pagination-info`,children:[`Showing `,(g-1)*10+1,` to `,Math.min(g*10,c),` of `,c,` entries`]}),(0,u.jsxs)(`div`,{className:`tx-pagination-buttons`,children:[(0,u.jsx)(`button`,{type:`button`,className:`tx-page-btn`,disabled:g===1,onClick:()=>_(e=>e-1),children:`Previous`}),(0,u.jsx)(`button`,{type:`button`,className:`tx-page-btn`,disabled:g>=v,onClick:()=>_(e=>e+1),children:`Next`})]})]})]})})}var f=()=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(c,{title:`My Wallet | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,u.jsx)(o,{}),(0,u.jsx)(d,{})]});export{f as default};