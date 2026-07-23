import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{h as n}from"./api-C_c3O5NQ.js";import{D as r,S as i,s as a,t as o}from"./index-DgTCE27D.js";import{n as s,t as c}from"./AccountSection-DDXWBgYj.js";import{t as l}from"./PageMeta-CyS8ELM3.js";var u=e(t(),1),d=a();function f(){let[e,t]=r(),[a,s]=(0,u.useState)(null),[l,f]=(0,u.useState)(null),[p,m]=(0,u.useState)([]),[h,g]=(0,u.useState)(0),[_,v]=(0,u.useState)(!0),[y,b]=(0,u.useState)(!0),[x,S]=(0,u.useState)(1);(0,u.useEffect)(()=>{let n=e.get(`topup`);if(n===`success`){s({type:`success`,text:`Wallet topped up successfully!`});let n=new URLSearchParams(e);n.delete(`topup`),t(n,{replace:!0})}else if(n===`failed`){s({type:`error`,text:`Payment was not completed. No amount was added.`});let n=new URLSearchParams(e);n.delete(`topup`),t(n,{replace:!0})}},[e,t]),(0,u.useEffect)(()=>{n.getWallet().then(e=>{e.data?.success&&f(e.data.data)}).catch(console.error).finally(()=>v(!1))},[]),(0,u.useEffect)(()=>{b(!0);let e=(x-1)*10;n.getWalletTransactions({limit:10,offset:e}).then(e=>{if(e.data?.success){let t=e.data.data;m(t.rows??t.transactions??[]),g(t.total??0)}}).catch(console.error).finally(()=>b(!1))},[x]);let C=Math.ceil(h/10);function w(e){try{return new Date(e).toLocaleDateString(`en-MY`,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}catch{return e}}function T(e){switch(e){case`admin_add`:return`Admin Credit`;case`order_payment`:return`Order Payment`;case`refund`:return`Order Refund`;case`promo`:return`Promo Bonus`;case`topup`:case`topup_sandbox`:return`Wallet Top-Up`;case`adjustment`:return`Wallet Adjustment`;default:return e}}return(0,d.jsx)(c,{title:`My Wallet`,children:(0,d.jsxs)(`div`,{className:`wallet-container-custom`,children:[(0,d.jsx)(`style`,{children:`
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
        `}),a&&(0,d.jsx)(`div`,{className:`alert alert-${a.type===`success`?`success`:`danger`} mb-3`,children:a.text}),_?(0,d.jsx)(`div`,{className:`wallet-card-custom`,children:(0,d.jsxs)(`div`,{className:`wallet-info-part`,style:{width:`100%`},children:[(0,d.jsx)(`div`,{className:`pulse`,style:{width:`120px`,marginBottom:`12px`}}),(0,d.jsx)(`div`,{className:`pulse`,style:{width:`240px`,height:`38px`}})]})}):l?(0,d.jsxs)(`div`,{className:`wallet-card-custom`,children:[(0,d.jsxs)(`div`,{className:`wallet-info-part`,children:[(0,d.jsx)(`h4`,{children:`Available Balance`}),(0,d.jsx)(`div`,{className:`wallet-balance`,children:o(l.balance)}),(0,d.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,alignItems:`center`,flexWrap:`wrap`,marginTop:`10px`},children:[l.enabled&&(0,d.jsxs)(`div`,{className:`wallet-status-badge`,style:{marginTop:0},children:[(0,d.jsx)(`span`,{className:`dot`}),(0,d.jsx)(`span`,{children:`Wallet Active`})]}),(0,d.jsx)(i,{to:`/account-wallet/topup`,className:`topup-btn-custom`,children:`➕ Add Funds`})]})]}),l.enabled&&l.discount_percent>0&&(0,d.jsxs)(`div`,{className:`wallet-benefit-card`,children:[(0,d.jsx)(`h5`,{children:`👛 Wallet Pay Benefit`}),(0,d.jsxs)(`p`,{children:[`Pay with wallet during checkout and receive an extra`,` `,(0,d.jsxs)(`strong`,{children:[l.discount_percent,`% off`]}),` on your entire purchase!`]})]})]}):(0,d.jsx)(`div`,{className:`alert alert-danger`,children:`Failed to load wallet information.`}),(0,d.jsx)(`h3`,{className:`tx-history-title`,children:`Transaction History`}),(0,d.jsx)(`div`,{className:`tx-table-wrapper`,children:y?(0,d.jsxs)(`div`,{style:{padding:`30px`},children:[(0,d.jsx)(`div`,{className:`pulse`,style:{width:`100%`,marginBottom:`15px`,height:`40px`}}),(0,d.jsx)(`div`,{className:`pulse`,style:{width:`100%`,marginBottom:`15px`,height:`30px`}}),(0,d.jsx)(`div`,{className:`pulse`,style:{width:`100%`,marginBottom:`15px`,height:`30px`}}),(0,d.jsx)(`div`,{className:`pulse`,style:{width:`100%`,height:`30px`}})]}):p.length>0?(0,d.jsxs)(`table`,{className:`tx-table`,children:[(0,d.jsx)(`thead`,{children:(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`th`,{children:`Date`}),(0,d.jsx)(`th`,{children:`Reference`}),(0,d.jsx)(`th`,{children:`Type`}),(0,d.jsx)(`th`,{children:`Description`}),(0,d.jsx)(`th`,{style:{textAlign:`right`},children:`Amount`}),(0,d.jsx)(`th`,{style:{textAlign:`right`},children:`Balance`})]})}),(0,d.jsx)(`tbody`,{children:p.map(e=>{let t=e.type===`credit`;return(0,d.jsxs)(`tr`,{children:[(0,d.jsx)(`td`,{children:(0,d.jsx)(`div`,{className:`tx-date`,children:w(e.created_at)})}),(0,d.jsx)(`td`,{children:(0,d.jsx)(`span`,{className:`tx-ref`,children:e.reference||`TX-${e.id}`})}),(0,d.jsx)(`td`,{children:(0,d.jsx)(`span`,{className:`tx-type-badge ${e.type}`,children:t?`Credit`:`Debit`})}),(0,d.jsx)(`td`,{children:(0,d.jsx)(`div`,{style:{fontWeight:500,fontSize:`14px`},children:e.description||T(e.source)})}),(0,d.jsx)(`td`,{style:{textAlign:`right`},children:(0,d.jsxs)(`span`,{className:`tx-amount ${e.type}`,children:[t?`+`:`-`,o(e.amount)]})}),(0,d.jsx)(`td`,{style:{textAlign:`right`,fontWeight:600},children:o(e.balance_after)})]},e.id)})})]}):(0,d.jsxs)(`div`,{className:`wallet-empty-state`,children:[(0,d.jsx)(`span`,{className:`icon`,children:`👛`}),(0,d.jsx)(`p`,{className:`mb-0 fw-semibold`,children:`No transactions found.`}),(0,d.jsx)(`span`,{className:`text-muted`,style:{fontSize:`13px`},children:`Transactions will appear here when you pay with your wallet or get credits.`})]})}),!y&&h>10&&(0,d.jsxs)(`div`,{className:`tx-pagination`,children:[(0,d.jsxs)(`div`,{className:`tx-pagination-info`,children:[`Showing `,(x-1)*10+1,` to `,Math.min(x*10,h),` of `,h,` entries`]}),(0,d.jsxs)(`div`,{className:`tx-pagination-buttons`,children:[(0,d.jsx)(`button`,{type:`button`,className:`tx-page-btn`,disabled:x===1,onClick:()=>S(e=>e-1),children:`Previous`}),(0,d.jsx)(`button`,{type:`button`,className:`tx-page-btn`,disabled:x>=C,onClick:()=>S(e=>e+1),children:`Next`})]})]})]})})}var p=()=>(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(l,{title:`My Wallet | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,d.jsx)(s,{}),(0,d.jsx)(f,{})]});export{p as default};