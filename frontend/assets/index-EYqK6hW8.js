import{r as s,v as m,j as e,f as l,X as w}from"./index-BT6F90xi.js";import{A as N,a as v}from"./AccountSection-CzlUs1Rl.js";import{P as _}from"./PageMeta-CFpsRWYl.js";function k(){const[a,y]=s.useState(null),[d,h]=s.useState([]),[f,b]=s.useState(0),[u,g]=s.useState(!0),[j,c]=s.useState(!0),[o,p]=s.useState(1),r=10;s.useEffect(()=>{m.getRoyalty().then(t=>{t.data?.success&&y(t.data.data)}).catch(console.error).finally(()=>g(!1))},[]),s.useEffect(()=>{c(!0);const t=(o-1)*r;m.getRoyaltyTransactions({limit:r,offset:t}).then(x=>{if(x.data?.success){const i=x.data.data;h(i.rows??i.transactions??[]),b(i.total??0)}}).catch(console.error).finally(()=>c(!1))},[o]);const n=Math.ceil(f/r);return e.jsx(N,{title:"Royalty Points",children:e.jsxs("div",{className:"royalty-page",children:[e.jsx("style",{children:`
          .royalty-page { font-family: 'Inter', sans-serif; color: #222; }
          .royalty-card {
            background: #fff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.08);
            padding: 28px;
            margin-bottom: 24px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
            position: relative;
            overflow: hidden;
          }
          @media (max-width: 576px) {
            .royalty-card { padding: 20px 16px; }
            .royalty-points { font-size: 28px !important; }
            .royalty-meta { font-size: 13.5px !important; }
          }
          .royalty-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 6px; height: 100%;
            background: #f59e0b;
          }
          .royalty-card h4 {
            font-size: 14px; font-weight: 600; color: #64748b;
            text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px;
          }
          .royalty-points {
            font-size: 36px; font-weight: 800; color: #0f172a; line-height: 1.2;
          }
          .royalty-meta { font-size: 15px; color: #64748b; margin-top: 4px; }
          .royalty-hint {
            margin-top: 14px; font-size: 13px; color: #92400e;
            background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 12px;
          }
          .tx-table-wrapper {
            background: #fff; border: 1px solid #eaeaea; border-radius: 12px; overflow-x: auto;
          }
          .tx-table { width: 100%; min-width: 600px; border-collapse: collapse; text-align: left; }
          .tx-table th {
            background: #f8fafc; padding: 14px 18px; font-size: 13px; font-weight: 600;
            color: #475569; border-bottom: 1px solid #eaeaea; text-transform: uppercase;
          }
          .tx-table td {
            padding: 14px 18px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9;
          }
          .badge-earn { background: #e6f4ea; color: #137333; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
          .badge-redeem { background: #fce8e6; color: #c5221f; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
          .tx-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
          .tx-page-btn {
            background: #fff; border: 1px solid #d1d5db; padding: 6px 14px; border-radius: 6px; cursor: pointer;
          }
          .tx-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        `}),u?e.jsx("div",{className:"royalty-card",children:"Loading…"}):a?e.jsxs("div",{className:"royalty-card",children:[e.jsx("h4",{children:"Available Royalty Points"}),e.jsxs("div",{className:"royalty-points",children:[a.points," pts"]}),e.jsxs("div",{className:"royalty-meta",children:["≈ ",l(a.balance_rm)," · ",a.conversion_label??"500 pts = RM 100"]}),a.hint&&e.jsx("div",{className:"royalty-hint",children:a.hint}),!a.can_redeem&&Number(a.remaining_rm_to_unlock??0)>0&&e.jsxs("div",{className:"royalty-hint",style:{marginTop:10},children:["You have ",l(Number(a.remaining_rm_to_unlock))," left to unlock royalty points."]}),e.jsxs("p",{className:"mt-3 mb-0 small text-muted",children:["Royalty points are separate from your wallet. Earn after paid / COD orders. Pay with points when you have RM ",Number(a.unlock_min_rm??a.min_redeem_rm??100),"+ (",a.unlock_min_points??a.min_redeem_points,"+ pts); any remaining bill uses wallet or online payment."]})]}):e.jsx("div",{className:"royalty-card",children:"Could not load royalty points."}),e.jsx("h5",{className:"mb-3",children:"Royalty history"}),e.jsx("div",{className:"tx-table-wrapper",children:j?e.jsx("div",{className:"p-4 text-muted",children:"Loading…"}):d.length===0?e.jsx("div",{className:"p-4 text-muted text-center",children:"No royalty activity yet."}):e.jsxs("table",{className:"tx-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Date"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Points"}),e.jsx("th",{children:"Value"}),e.jsx("th",{children:"Balance"}),e.jsx("th",{children:"Details"})]})}),e.jsx("tbody",{children:d.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:w(t.created_at)}),e.jsx("td",{children:e.jsx("span",{className:t.type==="earn"?"badge-earn":"badge-redeem",children:t.type==="earn"?"Earn":"Redeem"})}),e.jsxs("td",{children:[t.type==="earn"?"+":"−",t.points," pts"]}),e.jsx("td",{children:l(t.amount_rm)}),e.jsxs("td",{children:[t.balance_after_points," pts"]}),e.jsx("td",{className:"small text-muted",children:t.description||t.reference})]},t.id))})]})}),n>1&&e.jsxs("div",{className:"tx-pagination",children:[e.jsxs("span",{className:"small text-muted",children:["Page ",o," of ",n]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("button",{className:"tx-page-btn",disabled:o<=1,onClick:()=>p(t=>t-1),children:"Prev"}),e.jsx("button",{className:"tx-page-btn",disabled:o>=n,onClick:()=>p(t=>t+1),children:"Next"})]})]})]})})}const T=()=>e.jsxs(e.Fragment,{children:[e.jsx(_,{title:"Royalty Points",description:"View and track your royalty points separately from wallet balance."}),e.jsx(v,{}),e.jsx(k,{})]});export{T as default};
