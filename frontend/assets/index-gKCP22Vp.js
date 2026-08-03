import{k as A,r as s,q as b,j as e,f as x,L as W}from"./index-DNhiH3Rj.js";import{A as T,a as B}from"./AccountSection-zbCzOqsH.js";import{P as D}from"./PageMeta-DjHK_elp.js";function L(){const[l,c]=A(),[d,f]=s.useState(null),[n,w]=s.useState(null),[u,y]=s.useState([]),[r,j]=s.useState(0),[N,v]=s.useState(!0),[h,m]=s.useState(!0),[i,g]=s.useState(1),o=10;s.useEffect(()=>{const t=l.get("topup");if(t==="success"){f({type:"success",text:"Wallet topped up successfully!"});const a=new URLSearchParams(l);a.delete("topup"),c(a,{replace:!0})}else if(t==="failed"){f({type:"error",text:"Payment was not completed. No amount was added."});const a=new URLSearchParams(l);a.delete("topup"),c(a,{replace:!0})}},[l,c]),s.useEffect(()=>{b.getWallet().then(t=>{t.data?.success&&w(t.data.data)}).catch(console.error).finally(()=>v(!1))},[]),s.useEffect(()=>{m(!0);const t=(i-1)*o;b.getWalletTransactions({limit:o,offset:t}).then(a=>{if(a.data?.success){const p=a.data.data,z=p.rows??p.transactions??[];y(z),j(p.total??0)}}).catch(console.error).finally(()=>m(!1))},[i]);const k=Math.ceil(r/o);function S(t){try{return new Date(t).toLocaleDateString("en-MY",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return t}}function P(t){switch(t){case"admin_add":return"Admin Credit";case"order_payment":return"Order Payment";case"refund":return"Order Refund";case"promo":return"Promo Bonus";case"topup":case"topup_sandbox":return"Wallet Top-Up";case"adjustment":return"Wallet Adjustment";default:return t}}return e.jsx(T,{title:"My Wallet",children:e.jsxs("div",{className:"wallet-container-custom",children:[e.jsx("style",{children:`
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

          @media (max-width: 576px) {
            .wallet-card-custom {
              padding: 20px 16px;
              gap: 16px;
            }
            .wallet-balance {
              font-size: 28px !important;
            }
            .wallet-benefit-card {
              max-width: 100% !important;
              width: 100%;
            }
            .tx-history-title {
              font-size: 17px !important;
              margin-bottom: 14px;
            }
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
            overflow-x: auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
          }

          .tx-table {
            width: 100%;
            min-width: 600px;
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
        `}),d&&e.jsx("div",{className:`alert alert-${d.type==="success"?"success":"danger"} mb-3`,children:d.text}),N?e.jsx("div",{className:"wallet-card-custom",children:e.jsxs("div",{className:"wallet-info-part",style:{width:"100%"},children:[e.jsx("div",{className:"pulse",style:{width:"120px",marginBottom:"12px"}}),e.jsx("div",{className:"pulse",style:{width:"240px",height:"38px"}})]})}):n?e.jsxs("div",{className:"wallet-card-custom",children:[e.jsxs("div",{className:"wallet-info-part",children:[e.jsx("h4",{children:"Available Balance"}),e.jsx("div",{className:"wallet-balance",children:x(n.balance)}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap",marginTop:"10px"},children:[n.enabled&&e.jsxs("div",{className:"wallet-status-badge",style:{marginTop:0},children:[e.jsx("span",{className:"dot"}),e.jsx("span",{children:"Wallet Active"})]}),e.jsx(W,{to:"/account-wallet/topup",className:"topup-btn-custom",children:"➕ Add Funds"})]})]}),n.enabled&&n.discount_percent>0&&e.jsxs("div",{className:"wallet-benefit-card",children:[e.jsx("h5",{children:"👛 Wallet Pay Benefit"}),e.jsxs("p",{children:["Pay with wallet during checkout and receive an extra"," ",e.jsxs("strong",{children:[n.discount_percent,"% off"]})," on your entire purchase!"]})]})]}):e.jsx("div",{className:"alert alert-danger",children:"Failed to load wallet information."}),e.jsx("h3",{className:"tx-history-title",children:"Transaction History"}),e.jsx("div",{className:"tx-table-wrapper",children:h?e.jsxs("div",{style:{padding:"30px"},children:[e.jsx("div",{className:"pulse",style:{width:"100%",marginBottom:"15px",height:"40px"}}),e.jsx("div",{className:"pulse",style:{width:"100%",marginBottom:"15px",height:"30px"}}),e.jsx("div",{className:"pulse",style:{width:"100%",marginBottom:"15px",height:"30px"}}),e.jsx("div",{className:"pulse",style:{width:"100%",height:"30px"}})]}):u.length>0?e.jsxs("table",{className:"tx-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Date"}),e.jsx("th",{children:"Reference"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Description"}),e.jsx("th",{style:{textAlign:"right"},children:"Amount"}),e.jsx("th",{style:{textAlign:"right"},children:"Balance"})]})}),e.jsx("tbody",{children:u.map(t=>{const a=t.type==="credit";return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("div",{className:"tx-date",children:S(t.created_at)})}),e.jsx("td",{children:e.jsx("span",{className:"tx-ref",children:t.reference||`TX-${t.id}`})}),e.jsx("td",{children:e.jsx("span",{className:`tx-type-badge ${t.type}`,children:a?"Credit":"Debit"})}),e.jsx("td",{children:e.jsx("div",{style:{fontWeight:500,fontSize:"14px"},children:t.description||P(t.source)})}),e.jsx("td",{style:{textAlign:"right"},children:e.jsxs("span",{className:`tx-amount ${t.type}`,children:[a?"+":"-",x(t.amount)]})}),e.jsx("td",{style:{textAlign:"right",fontWeight:600},children:x(t.balance_after)})]},t.id)})})]}):e.jsxs("div",{className:"wallet-empty-state",children:[e.jsx("span",{className:"icon",children:"👛"}),e.jsx("p",{className:"mb-0 fw-semibold",children:"No transactions found."}),e.jsx("span",{className:"text-muted",style:{fontSize:"13px"},children:"Transactions will appear here when you pay with your wallet or get credits."})]})}),!h&&r>o&&e.jsxs("div",{className:"tx-pagination",children:[e.jsxs("div",{className:"tx-pagination-info",children:["Showing ",(i-1)*o+1," to ",Math.min(i*o,r)," of ",r," entries"]}),e.jsxs("div",{className:"tx-pagination-buttons",children:[e.jsx("button",{type:"button",className:"tx-page-btn",disabled:i===1,onClick:()=>g(t=>t-1),children:"Previous"}),e.jsx("button",{type:"button",className:"tx-page-btn",disabled:i>=k,onClick:()=>g(t=>t+1),children:"Next"})]})]})]})})}const E=()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{title:"My Wallet | 2Deal - Incense Sticks, Soaps & Food Products Store",description:"2Deal - Incense Sticks, Soaps & Food Products Store"}),e.jsx(B,{}),e.jsx(L,{})]});export{E as default};
