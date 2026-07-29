import{r as s,p as x,j as e,f as h}from"./index-DB7CXzJY.js";import{A as N,a as v}from"./AccountSection-6DC47EDv.js";import{P}from"./PageMeta-CB1VWvf6.js";function R(){const[a,f]=s.useState(null),[l,y]=s.useState([]),[m,b]=s.useState(0),[g,u]=s.useState(!0),[j,d]=s.useState(!0),[o,c]=s.useState(1),r=10;s.useEffect(()=>{x.getRoyalty().then(t=>{t.data?.success&&f(t.data.data)}).catch(console.error).finally(()=>u(!1))},[]),s.useEffect(()=>{d(!0);const t=(o-1)*r;x.getRoyaltyTransactions({limit:r,offset:t}).then(p=>{if(p.data?.success){const i=p.data.data;y(i.rows??i.transactions??[]),b(i.total??0)}}).catch(console.error).finally(()=>d(!1))},[o]);const n=Math.ceil(m/r);function w(t){try{return new Date(t).toLocaleDateString("en-MY",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return t}}return e.jsx(N,{title:"Royalty Points",children:e.jsxs("div",{className:"royalty-page",children:[e.jsx("style",{children:`
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
          .royalty-rm { font-size: 15px; color: #64748b; margin-top: 4px; }
          .royalty-hint {
            margin-top: 14px; font-size: 13px; color: #92400e;
            background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 12px;
          }
          .tx-table-wrapper {
            background: #fff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;
          }
          .tx-table { width: 100%; border-collapse: collapse; text-align: left; }
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
        `}),g?e.jsx("div",{className:"royalty-card",children:"Loading…"}):a?e.jsxs("div",{className:"royalty-card",children:[e.jsx("h4",{children:"Available Royalty Points"}),e.jsxs("div",{className:"royalty-points",children:[a.points," pts"]}),e.jsxs("div",{className:"royalty-rm",children:["≈ ",h(a.balance_rm)," · ",a.conversion_label??"500 pts = RM 100"]}),a.hint&&e.jsx("div",{className:"royalty-hint",children:a.hint}),e.jsxs("p",{className:"mt-3 mb-0 small text-muted",children:["Royalty points are separate from your wallet balance. Earn after paid / COD orders; redeem on cart when you have RM ",Number(a.min_redeem_rm??100),"+ (",a.min_redeem_points,"+ pts)."]})]}):e.jsx("div",{className:"royalty-card",children:"Could not load royalty points."}),e.jsx("h5",{className:"mb-3",children:"Royalty history"}),e.jsx("div",{className:"tx-table-wrapper",children:j?e.jsx("div",{className:"p-4 text-muted",children:"Loading…"}):l.length===0?e.jsx("div",{className:"p-4 text-muted text-center",children:"No royalty activity yet."}):e.jsxs("table",{className:"tx-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Date"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Points"}),e.jsx("th",{children:"Value"}),e.jsx("th",{children:"Balance"}),e.jsx("th",{children:"Details"})]})}),e.jsx("tbody",{children:l.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:w(t.created_at)}),e.jsx("td",{children:e.jsx("span",{className:t.type==="earn"?"badge-earn":"badge-redeem",children:t.type==="earn"?"Earn":"Redeem"})}),e.jsxs("td",{children:[t.type==="earn"?"+":"−",t.points," pts"]}),e.jsx("td",{children:h(t.amount_rm)}),e.jsxs("td",{children:[t.balance_after_points," pts"]}),e.jsx("td",{className:"small text-muted",children:t.description||t.reference})]},t.id))})]})}),n>1&&e.jsxs("div",{className:"tx-pagination",children:[e.jsxs("span",{className:"small text-muted",children:["Page ",o," of ",n]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("button",{className:"tx-page-btn",disabled:o<=1,onClick:()=>c(t=>t-1),children:"Prev"}),e.jsx("button",{className:"tx-page-btn",disabled:o>=n,onClick:()=>c(t=>t+1),children:"Next"})]})]})]})})}const z=()=>e.jsxs(e.Fragment,{children:[e.jsx(P,{title:"Royalty Points | Indian Ladies Fashion - Online Saree & Ethnic Wear Store",description:"View and track your royalty points separately from wallet balance."}),e.jsx(v,{}),e.jsx(R,{})]});export{z as default};
