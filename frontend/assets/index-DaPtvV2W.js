import{o as w,r as l,j as t,L as _,v as j,y as z}from"./index-BilRDpFa.js";import{A as v,a as P}from"./AccountSection-BlYYUYxq.js";import{P as k}from"./PageMeta-DGVEsdwV.js";function N(){return new Promise(c=>{if(window.Razorpay){c(!0);return}const n=document.createElement("script");n.src="https://checkout.razorpay.com/v1/checkout.js",n.onload=()=>c(!0),n.onerror=()=>c(!1),document.body.appendChild(n)})}function S(){const c=w(),[n,x]=l.useState(""),[u,r]=l.useState(!1),[f,o]=l.useState(null),[y,m]=l.useState(null),d=parseFloat(n);async function g(a){if(!await N()){o("Could not load payment gateway. Please try again."),r(!1);return}new window.Razorpay({key:a.key_id,amount:a.amount,currency:a.currency,order_id:a.razorpay_order_id,name:"2Deal",description:`Wallet top-up RM ${(a.amount_rm??d).toFixed(2)}`,image:"/deal/frontend/assets/logo/logo.png",prefill:a.prefill??{},theme:{color:"#3EC1BC"},handler:async i=>{try{const p=await z.verifyWalletTopup({razorpay_order_id:i.razorpay_order_id,razorpay_payment_id:i.razorpay_payment_id,razorpay_signature:i.razorpay_signature,reference:a.reference});p.data?.success?(m(p.data.message||`RM ${d.toFixed(2)} added to your wallet.`),setTimeout(()=>c("/account-wallet?topup=success"),1200)):o(p.data?.message||"Payment verification failed.")}catch(p){const h=p?.response?.data?.message;o(h??"Payment received but verification failed. Contact support.")}finally{r(!1)}},modal:{ondismiss:()=>{o("Payment cancelled. No amount was charged."),r(!1)}}}).open()}async function b(a){if(a.preventDefault(),o(null),m(null),isNaN(d)||d<1){o("Enter at least RM 1.00 to top up.");return}r(!0);try{const s=await j.topupWallet({amount:d});if(!s.data?.success){o(s.data?.message||"Failed to start top-up."),r(!1);return}const e=s.data.data,i=e.gateway??(e.payment_url?"toyyibpay":e.credited?"sandbox":void 0);if(i==="razorpay"&&e.razorpay_order_id&&e.key_id&&e.amount&&e.currency&&e.reference){await g({reference:e.reference,amount_rm:e.amount_rm,points:e.points,razorpay_order_id:e.razorpay_order_id,amount:e.amount,currency:e.currency,key_id:e.key_id,prefill:e.prefill});return}if(i==="toyyibpay"&&e.payment_url){window.location.href=e.payment_url;return}if(e.credited||i==="sandbox"){m(s.data.message||`RM ${d.toFixed(2)} added to your wallet.`),r(!1),setTimeout(()=>c("/account-wallet?topup=success"),1500);return}o("Payment gateway did not return a checkout URL. Contact support."),r(!1)}catch(s){const e=s?.response?.data?.message;o(e??"Failed to start top-up. Please try again."),r(!1)}}return t.jsx(v,{title:"Add Funds to Wallet",children:t.jsxs("div",{className:"topup-container-custom",children:[t.jsx("style",{children:`
          .topup-container-custom { font-family: 'Inter', sans-serif; color: #222; }
          .topup-card-custom {
            background: #fff; border-radius: 20px; border: 1px solid rgba(193,16,105,.06);
            padding: 32px; box-shadow: 0 4px 24px rgba(193,16,105,.02); max-width: 600px;
          }
          @media (max-width: 576px) {
            .topup-card-custom { padding: 20px 16px; }
            .form-actions { flex-direction: column-reverse; gap: 10px; }
            .btn-cancel, .btn-topup { width: 100%; text-align: center; justify-content: center; }
          }
          .form-group-custom { margin-bottom: 22px; }
          .form-group-custom label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
          .input-amount-wrapper { position: relative; display: flex; align-items: center; }
          .input-amount {
            width: 100%; height: 52px; padding: 10px 16px; font-size: 20px; font-weight: 700;
            border: 1px solid #d1d5db; border-radius: 10px; outline: none;
          }
          .input-amount:focus { border-color: #3ec1bc; box-shadow: 0 0 0 4px rgba(62,193,188,.1); }
          .gateway-note {
            background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px;
            font-size: 13px; color: #115e59; margin-bottom: 20px;
          }
          .form-actions {
            display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
            border-top: 1px solid #f1f5f9; padding-top: 20px;
          }
          .btn-cancel, .btn-topup {
            padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none !important;
          }
          .btn-cancel { background: #fff; border: 1px solid #d1d5db; color: #475569; }
          .btn-topup { background: #3ec1bc; border: 1px solid #3ec1bc; color: #fff; cursor: pointer; }
          .btn-topup:disabled { opacity: .7; cursor: not-allowed; }
        `}),t.jsxs("div",{className:"topup-card-custom",children:[t.jsxs("div",{className:"gateway-note",children:["Pay securely via ",t.jsx("strong",{children:"FPX / Net Banking / card"})," (Razorpay or ToyyibPay). Funds are added to your wallet after payment is confirmed."]}),f&&t.jsx("div",{className:"alert alert-danger mb-4",children:f}),y&&t.jsxs("div",{className:"alert alert-success mb-4",children:["✓ ",y]}),t.jsxs("form",{onSubmit:b,children:[t.jsxs("div",{className:"form-group-custom",children:[t.jsx("label",{htmlFor:"amount",children:"Top-up amount (MYR)"}),t.jsx("div",{className:"input-amount-wrapper",children:t.jsx("input",{type:"number",id:"amount",className:"input-amount",placeholder:"0.00",value:n,onChange:a=>{x(a.target.value),o(null)},required:!0,min:"1",step:"0.01",disabled:u})})]}),t.jsxs("div",{className:"form-actions",children:[t.jsx(_,{to:"/account-wallet",className:"btn-cancel",children:"Cancel"}),t.jsx("button",{type:"submit",className:"btn-topup",disabled:u,children:u?"Opening payment…":"Pay & Add to Wallet"})]})]})]})]})})}const T=()=>t.jsxs(t.Fragment,{children:[t.jsx(k,{title:"Top Up Wallet | 2Deal - Incense Sticks, Soaps & Food Products Store",description:"2Deal - Incense Sticks, Soaps & Food Products Store"}),t.jsx(P,{}),t.jsx(S,{})]});export{T as default};
