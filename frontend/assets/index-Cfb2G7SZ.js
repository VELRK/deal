import{o as j,r as m,j as e,L as k,v,z as N}from"./index-D7yv3sCU.js";import{A as P,a as R}from"./AccountSection-DGgBjZjy.js";import{l as M}from"./razorpay-BfB91405.js";import{a as F}from"./curlecPayment-DemEZ6o4.js";import{P as S}from"./PageMeta-2yz2WCDg.js";const T=[100,150,200,250],d=100;function A(){const b=j(),[c,g]=m.useState(""),[l,n]=m.useState(!1),[y,o]=m.useState(null),[h,x]=m.useState(null),r=parseFloat(c),f=c.trim()!==""&&(!Number.isFinite(r)||r<d);function w(a){g(String(a)),o(null)}async function _(a){if(!await M()){o("Could not load payment gateway. Please try again."),n(!1);return}new window.Razorpay({key:a.key_id,amount:a.amount,currency:a.currency,order_id:a.razorpay_order_id,name:"2Deal",description:`Wallet top-up RM ${(a.amount_rm??r).toFixed(2)}`,image:new URL("assets/logo/logo.png",window.location.origin+"/frontend/").href,prefill:a.prefill??{},theme:{color:"#3EC1BC"},...F(a.callback_url),handler:async i=>{try{const p=await N.verifyWalletTopup({razorpay_order_id:i.razorpay_order_id,razorpay_payment_id:i.razorpay_payment_id,razorpay_signature:i.razorpay_signature,reference:a.reference});if(p.data?.success){const u=p.data.data?.balance??p.data.data?.balance_rm;x(p.data.message||(u!=null?`RM ${Number(u).toFixed(2)} added to your wallet.`:`RM ${r.toFixed(2)} added to your wallet.`)),setTimeout(()=>b("/account-wallet?topup=success"),1200)}else o(p.data?.message||"Payment verification failed.")}catch(p){const u=p?.response?.data?.message;o(u??"Payment received but verification failed. Contact support.")}finally{n(!1)}},modal:{ondismiss:()=>{o("Payment cancelled. No amount was charged."),n(!1)}}}).open()}async function z(a){if(a.preventDefault(),o(null),x(null),isNaN(r)||r<=0){o("Enter a valid amount to top up.");return}if(r<d){o(`Minimum top-up is RM ${d.toFixed(2)}. Please enter RM ${d} or more.`);return}n(!0);try{const s=await v.topupWallet({amount:r});if(!s.data?.success){o(s.data?.message||"Failed to start top-up."),n(!1);return}const t=s.data.data,i=t.gateway??(t.payment_url?"toyyibpay":t.credited?"sandbox":void 0);if(i==="razorpay"&&t.razorpay_order_id&&t.key_id&&t.amount&&t.currency&&t.reference){await _({reference:t.reference,amount_rm:t.amount_rm,points:t.points,razorpay_order_id:t.razorpay_order_id,amount:t.amount,currency:t.currency,key_id:t.key_id,prefill:t.prefill,callback_url:t.callback_url});return}if(i==="toyyibpay"&&t.payment_url){window.location.href=t.payment_url;return}if(t.credited||i==="sandbox"){x(s.data.message||`RM ${r.toFixed(2)} added to your wallet.`),n(!1),setTimeout(()=>b("/account-wallet?topup=success"),1500);return}o("Payment gateway did not return a checkout URL. Contact support."),n(!1)}catch(s){const t=s?.response?.data?.message;o(t??"Failed to start top-up. Please try again."),n(!1)}}return e.jsx(P,{title:"Add Funds to Wallet",children:e.jsxs("div",{className:"topup-container-custom",children:[e.jsx("style",{children:`
          .topup-container-custom { font-family: 'Inter', sans-serif; color: #222; }
          .topup-card-custom {
            background: #fff; border-radius: 20px; border: 1px solid rgba(193,16,105,.06);
            padding: 32px; box-shadow: 0 4px 24px rgba(193,16,105,.02); max-width: 600px;
          }
          
          .form-group-custom { margin-bottom: 22px; }
          .form-group-custom label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
          .input-amount-wrapper { position: relative; display: flex; align-items: center; }
          .input-amount {
            width: 100%; height: 52px; padding: 10px 16px; font-size: 20px; font-weight: 700;
            border: 1px solid #d1d5db; border-radius: 10px; outline: none;
          }
          .input-amount:focus { border-color: #3ec1bc; box-shadow: 0 0 0 4px rgba(62,193,188,.1); }
          
          .presets-list { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
          .preset-btn {
            background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 12px 16px;
            font-size: 14px; font-weight: 600; border-radius: 10px; cursor: pointer;
            transition: all 0.2s ease;
          }
          .preset-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
          .preset-btn.selected { background: #f0fdfa; border-color: #3ec1bc; color: #0f766e; box-shadow: 0 0 0 1px #3ec1bc; }
          .preset-btn:disabled { opacity: .6; cursor: not-allowed; }
          
          .gateway-note {
            background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px;
            font-size: 13px; color: #115e59; margin-bottom: 20px;
          }
          .form-actions {
            display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
            border-top: 1px solid #f1f5f9; padding-top: 20px;
          }
          .btn-cancel, .btn-topup {
            padding: 12px 24px; font-size: 14.5px; font-weight: 600; border-radius: 8px; text-decoration: none !important;
            display: inline-flex; align-items: center; justify-content: center;
          }
          .btn-cancel { background: #fff; border: 1px solid #d1d5db; color: #475569; }
          .btn-cancel:hover { background: #f8fafc; color: #334155; }
          .btn-topup { background: #3ec1bc; border: 1px solid #3ec1bc; color: #fff; cursor: pointer; transition: all 0.2s ease; }
          .btn-topup:hover:not(:disabled) { background: #2bb0ab; border-color: #2bb0ab; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(62,193,188,.2); }
          .btn-topup:disabled { opacity: .7; cursor: not-allowed; }

          @media (max-width: 767px) {
            .topup-card-custom { padding: 24px 20px; border-radius: 16px; }
            .presets-list { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 12px; 
              margin-top: 16px;
            }
            .preset-btn { 
              width: 100%; 
              padding: 14px 10px; 
              font-size: 14.5px; 
              text-align: center;
              border-radius: 12px;
            }
            .input-amount { height: 56px; font-size: 22px; }
            .form-actions { flex-direction: column-reverse; gap: 12px; padding-top: 16px; margin-top: 20px; }
            .btn-cancel, .btn-topup { width: 100%; padding: 14px 20px; font-size: 15px; }
          }
          
          @media (max-width: 480px) {
            .topup-card-custom { padding: 20px 16px; }
            .gateway-note { font-size: 12.5px; padding: 10px 12px; }
          }
        `}),e.jsxs("div",{className:"topup-card-custom",children:[e.jsxs("div",{className:"gateway-note",children:["Pay securely via ",e.jsx("strong",{children:"FPX / Net Banking / card"})," (Razorpay or ToyyibPay). Funds are added to your wallet after payment is confirmed."]}),y&&e.jsx("div",{className:"alert alert-danger mb-4",children:y}),h&&e.jsxs("div",{className:"alert alert-success mb-4",children:["✓ ",h]}),e.jsxs("form",{onSubmit:z,children:[e.jsxs("div",{className:"form-group-custom",children:[e.jsx("label",{htmlFor:"amount",children:"Top-up amount (MYR)"}),e.jsx("div",{className:"input-amount-wrapper",children:e.jsx("input",{type:"number",id:"amount",className:"input-amount",placeholder:"100.00",value:c,onChange:a=>{g(a.target.value),o(null)},required:!0,min:d,step:"0.01",disabled:l})}),e.jsxs("p",{style:{margin:"8px 0 0",fontSize:13,color:f?"#b91c1c":"#64748b"},children:["Minimum top-up is RM ",d.toFixed(2),". Amounts below this cannot be paid."]}),f&&e.jsxs("p",{style:{margin:"6px 0 0",fontSize:13,color:"#b91c1c",fontWeight:600},children:["Enter RM ",d," or more to continue."]}),e.jsx("div",{className:"presets-list",children:T.map(a=>e.jsxs("button",{type:"button",className:`preset-btn ${c===String(a)?"selected":""}`,onClick:()=>w(a),disabled:l,children:["RM ",a]},a))})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx(k,{to:"/account-wallet",className:"btn-cancel",children:"Cancel"}),e.jsx("button",{type:"submit",className:"btn-topup",disabled:l||f||!c.trim(),children:l?"Opening payment…":"Pay & Add to Wallet"})]})]})]})]})})}const I=()=>e.jsxs(e.Fragment,{children:[e.jsx(S,{title:"Top Up Wallet",description:"Shop incense, soaps, and food products online."}),e.jsx(R,{}),e.jsx(A,{})]});export{I as default};
