import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{h as n}from"./api-B-MPbqi2.js";import{S as r,T as i,s as a}from"./index-hjKFKyKu.js";import{n as o,t as s}from"./AccountSection-CjoE2WZS.js";import{t as c}from"./PageMeta-CyS8ELM3.js";var l=e(t(),1),u=a();function d(){let e=i(),[t,a]=(0,l.useState)(``),[o,c]=(0,l.useState)(``),[d,f]=(0,l.useState)(!1),[p,m]=(0,l.useState)(null),[h,g]=(0,l.useState)(null),_=[50,100,200,500];function v(e){a(e.toString()),m(null)}async function y(r){r.preventDefault(),m(null),g(null);let i=parseFloat(t);if(isNaN(i)||i<=0){m(`Please enter a valid amount greater than 0.`);return}f(!0);try{let t=await n.topupWallet({amount:i});if(t.data?.success){let n=t.data.data;if(n?.payment_url){window.location.href=n.payment_url;return}g(t.data.message||`Funds added${n?.points?` (${n.points} pts)`:``} successfully!`),setTimeout(()=>{e(`/account-wallet`)},1500)}else m(t.data?.message||`Failed to add funds. Please try again.`)}catch(e){let t=e?.response?.data?.message;m(t??`Failed to perform deposit. Please verify connection and try again.`)}finally{f(!1)}}return(0,u.jsx)(s,{title:`Add Funds to Wallet`,children:(0,u.jsxs)(`div`,{className:`topup-container-custom`,children:[(0,u.jsx)(`style`,{children:`
          .topup-container-custom {
            font-family: 'Inter', sans-serif;
            color: #222222;
          }

          .topup-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
            max-width: 600px;
          }

          @media (max-width: 576px) {
            .topup-card-custom {
              padding: 20px;
            }
          }

          .form-group-custom {
            margin-bottom: 22px;
          }

          .form-group-custom label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 8px;
          }

          .input-amount-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-amount-prefix {
            position: absolute;
            left: 16px;
            font-size: 18px;
            font-weight: 600;
            color: #94a3b8;
            pointer-events: none;
          }

          .input-amount {
            width: 100%;
            height: 52px;
            padding: 10px 16px;
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            outline: none;
            transition: all 0.2s ease-in-out;
          }

          .input-amount:focus {
            border-color: #3ec1bc;
            box-shadow: 0 0 0 4px rgba(62, 193, 188, 0.1);
          }

          .presets-list {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 10px;
          }

          .preset-btn {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            color: #475569;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .preset-btn:hover {
            background: #e2e8f0;
            color: #0f172a;
          }

          .preset-btn.selected {
            background: #f0fdfa;
            border-color: #3ec1bc;
            color: #0f766e;
          }

          .payment-card-grid {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border-radius: 16px;
            padding: 24px;
            color: #ffffff;
            margin-bottom: 24px;
            position: relative;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            overflow: hidden;
          }

          .payment-card-grid::before {
            content: "";
            position: absolute;
            top: -20px;
            right: -20px;
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.03);
            border-radius: 50%;
          }

          .card-chip {
            width: 44px;
            height: 32px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-radius: 6px;
            margin-bottom: 24px;
          }

          .card-num-display {
            font-family: 'Courier New', Courier, monospace;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 24px;
            min-height: 24px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          }

          .card-meta-display {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          .card-meta-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
            margin-bottom: 4px;
          }

          .card-meta-val {
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          .classic-input {
            width: 100%;
            height: 44px;
            padding: 8px 14px;
            font-size: 14px;
            color: #334155;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            outline: none;
            transition: all 0.2s ease-in-out;
          }

          .classic-input:focus {
            border-color: #3ec1bc;
            box-shadow: 0 0 0 3px rgba(62, 193, 188, 0.1);
          }

          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          @media (max-width: 480px) {
            .grid-2 {
              grid-template-columns: 1fr;
            }
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 12px;
            margin-top: 30px;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
          }

          .btn-cancel {
            background: #ffffff;
            border: 1px solid #d1d5db;
            color: #475569;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none !important;
          }

          .btn-cancel:hover {
            background: #f8fafc;
            color: #1e293b;
          }

          .btn-topup {
            background: #3ec1bc;
            border: 1px solid #3ec1bc;
            color: #ffffff;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-topup:hover:not(:disabled) {
            background: #35a29f;
            border-color: #35a29f;
          }

          .btn-topup:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}),(0,u.jsxs)(`div`,{className:`topup-card-custom`,children:[p&&(0,u.jsx)(`div`,{className:`alert alert-danger mb-4`,children:p}),h&&(0,u.jsxs)(`div`,{className:`alert alert-success mb-4`,children:[`✓ `,h]}),(0,u.jsxs)(`form`,{onSubmit:y,children:[(0,u.jsxs)(`div`,{className:`form-group-custom`,children:[(0,u.jsx)(`label`,{htmlFor:`amount`,children:`Enter Top-Up Amount`}),(0,u.jsx)(`div`,{className:`input-amount-wrapper`,children:(0,u.jsx)(`input`,{type:`number`,id:`amount`,className:`input-amount`,placeholder:`0.00`,value:t,onChange:e=>{a(e.target.value),m(null)},required:!0,min:`1`,step:`any`,disabled:d})}),(0,u.jsx)(`div`,{className:`presets-list`,children:_.map(e=>(0,u.jsxs)(`button`,{type:`button`,className:`preset-btn ${t===e.toString()?`selected`:``}`,onClick:()=>v(e),disabled:d,children:[`+RM `,e]},e))})]}),(0,u.jsxs)(`div`,{className:`form-group-custom`,children:[(0,u.jsx)(`label`,{htmlFor:`cardName`,children:`Cardholder Name`}),(0,u.jsx)(`input`,{type:`text`,id:`cardName`,className:`classic-input`,placeholder:`Full Name as printed on card`,value:o,onChange:e=>c(e.target.value),required:!0,disabled:d})]}),(0,u.jsxs)(`div`,{className:`form-actions`,children:[(0,u.jsx)(r,{to:`/account-wallet`,className:`btn-cancel`,children:`Cancel`}),(0,u.jsx)(`button`,{type:`submit`,className:`btn-topup`,disabled:d,children:d?`Processing Deposit...`:`➕ Add Funds Now`})]})]})]})]})})}var f=()=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(c,{title:`Top Up Wallet | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,u.jsx)(o,{}),(0,u.jsx)(d,{})]});export{f as default};