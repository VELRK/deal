import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{c as n,h as r}from"./api-C_c3O5NQ.js";import{S as i,T as a,s as o}from"./index-CFlLXPh7.js";import{n as s,t as c}from"./AccountSection-DU7AwRKE.js";import{t as l}from"./PageMeta-CyS8ELM3.js";var u=e(t(),1);function d(){return new Promise(e=>{if(window.Razorpay){e(!0);return}let t=document.createElement(`script`);t.src=`https://checkout.razorpay.com/v1/checkout.js`,t.onload=()=>e(!0),t.onerror=()=>e(!1),document.body.appendChild(t)})}var f=o(),p=5,m=[50,100,200,500];function h(){let e=a(),[t,o]=(0,u.useState)(``),[s,l]=(0,u.useState)(!1),[h,g]=(0,u.useState)(null),[_,v]=(0,u.useState)(null),y=parseFloat(t),b=(0,u.useMemo)(()=>isNaN(y)||y<=0?0:Math.round(y*p),[y]);function x(e){o(e.toString()),g(null)}async function S(t){if(!await d()){g(`Could not load payment gateway. Please try again.`),l(!1);return}new window.Razorpay({key:t.key_id,amount:t.amount,currency:t.currency,order_id:t.razorpay_order_id,name:`2Deal`,description:`Wallet top-up RM ${(t.amount_rm??y).toFixed(2)}`,image:`/deal/assets/logo/logo.png`,prefill:t.prefill??{},theme:{color:`#3EC1BC`},handler:async r=>{try{let i=await n.verifyWalletTopup({razorpay_order_id:r.razorpay_order_id,razorpay_payment_id:r.razorpay_payment_id,razorpay_signature:r.razorpay_signature,reference:t.reference});i.data?.success?(v(i.data.message||`RM ${y.toFixed(2)} added to your wallet${t.points?` (${t.points} pts)`:``}.`),setTimeout(()=>e(`/account-wallet?topup=success`),1200)):g(i.data?.message||`Payment verification failed.`)}catch(e){let t=e?.response?.data?.message;g(t??`Payment received but verification failed. Contact support.`)}finally{l(!1)}},modal:{ondismiss:()=>{g(`Payment cancelled. No amount was charged.`),l(!1)}}}).open()}async function C(t){if(t.preventDefault(),g(null),v(null),isNaN(y)||y<1){g(`Enter at least RM 1.00 to top up.`);return}l(!0);try{let t=await r.topupWallet({amount:y});if(!t.data?.success){g(t.data?.message||`Failed to start top-up.`),l(!1);return}let n=t.data.data,i=n.gateway??(n.payment_url?`toyyibpay`:n.credited?`sandbox`:void 0);if(i===`razorpay`&&n.razorpay_order_id&&n.key_id&&n.amount&&n.currency&&n.reference){await S({reference:n.reference,amount_rm:n.amount_rm,points:n.points,razorpay_order_id:n.razorpay_order_id,amount:n.amount,currency:n.currency,key_id:n.key_id,prefill:n.prefill});return}if(i===`toyyibpay`&&n.payment_url){window.location.href=n.payment_url;return}if(n.credited||i===`sandbox`){v(t.data.message||`RM ${y.toFixed(2)} added${n.points?` (${n.points} pts)`:``}.`),l(!1),setTimeout(()=>e(`/account-wallet?topup=success`),1500);return}g(`Payment gateway did not return a checkout URL. Contact support.`),l(!1)}catch(e){let t=e?.response?.data?.message;g(t??`Failed to start top-up. Please try again.`),l(!1)}}return(0,f.jsx)(c,{title:`Add Funds to Wallet`,children:(0,f.jsxs)(`div`,{className:`topup-container-custom`,children:[(0,f.jsx)(`style`,{children:`
          .topup-container-custom { font-family: 'Inter', sans-serif; color: #222; }
          .topup-card-custom {
            background: #fff; border-radius: 20px; border: 1px solid rgba(193,16,105,.06);
            padding: 32px; box-shadow: 0 4px 24px rgba(193,16,105,.02); max-width: 600px;
          }
          .form-group-custom { margin-bottom: 22px; }
          .form-group-custom label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
          .input-amount-wrapper { position: relative; display: flex; align-items: center; }
          .input-amount-prefix {
            position: absolute; left: 16px; font-size: 18px; font-weight: 600; color: #64748b; pointer-events: none;
          }
          .input-amount {
            width: 100%; height: 52px; padding: 10px 16px 10px 52px; font-size: 20px; font-weight: 700;
            border: 1px solid #d1d5db; border-radius: 10px; outline: none;
          }
          .input-amount:focus { border-color: #3ec1bc; box-shadow: 0 0 0 4px rgba(62,193,188,.1); }
          .points-preview { font-size: 13px; color: #0f766e; margin-top: 8px; }
          .gateway-note {
            background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px;
            font-size: 13px; color: #115e59; margin-bottom: 20px;
          }
          .presets-list { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
          .preset-btn {
            background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; padding: 8px 16px;
            font-size: 13px; font-weight: 600; border-radius: 8px; cursor: pointer;
          }
          .preset-btn.selected { background: #f0fdfa; border-color: #3ec1bc; color: #0f766e; }
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
        `}),(0,f.jsxs)(`div`,{className:`topup-card-custom`,children:[(0,f.jsxs)(`div`,{className:`gateway-note`,children:[`Pay securely via `,(0,f.jsx)(`strong`,{children:`FPX / online banking / card`}),` (Razorpay or ToyyibPay). Funds are added to your wallet after payment is confirmed.`]}),h&&(0,f.jsx)(`div`,{className:`alert alert-danger mb-4`,children:h}),_&&(0,f.jsxs)(`div`,{className:`alert alert-success mb-4`,children:[`✓ `,_]}),(0,f.jsxs)(`form`,{onSubmit:C,children:[(0,f.jsxs)(`div`,{className:`form-group-custom`,children:[(0,f.jsx)(`label`,{htmlFor:`amount`,children:`Top-up amount (MYR)`}),(0,f.jsxs)(`div`,{className:`input-amount-wrapper`,children:[(0,f.jsx)(`span`,{className:`input-amount-prefix`,children:`RM`}),(0,f.jsx)(`input`,{type:`number`,id:`amount`,className:`input-amount`,placeholder:`0.00`,value:t,onChange:e=>{o(e.target.value),g(null)},required:!0,min:`1`,step:`0.01`,disabled:s})]}),b>0&&(0,f.jsxs)(`div`,{className:`points-preview`,children:[`≈ `,b,` wallet points (500 pts = RM 100)`]}),(0,f.jsx)(`div`,{className:`presets-list`,children:m.map(e=>(0,f.jsxs)(`button`,{type:`button`,className:`preset-btn ${t===e.toString()?`selected`:``}`,onClick:()=>x(e),disabled:s,children:[`+RM `,e]},e))})]}),(0,f.jsxs)(`div`,{className:`form-actions`,children:[(0,f.jsx)(i,{to:`/account-wallet`,className:`btn-cancel`,children:`Cancel`}),(0,f.jsx)(`button`,{type:`submit`,className:`btn-topup`,disabled:s,children:s?`Opening payment…`:`Pay & Add to Wallet`})]})]})]})]})})}var g=()=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(l,{title:`Top Up Wallet | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,f.jsx)(s,{}),(0,f.jsx)(h,{})]});export{g as default};