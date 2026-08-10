import{k as _,o as B,r as n,v as g,j as e}from"./index-Dv-IsVb5.js";import{A as E,a as z}from"./AccountSection-ChMgveFA.js";import{M as F,f as D,i as I,a as W,t as q}from"./malaysiaPhone-B0OpccwC.js";import{P as R}from"./PageMeta-BknDIRfU.js";const T=["Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang","Perak","Perlis","Pulau Pinang","Sabah","Sarawak","Selangor","Terengganu","W.P. Kuala Lumpur","W.P. Labuan","W.P. Putrajaya"],f={full_name:"",phone:"",line1:"",line2:"",city:"",state:"",pincode:"",country:"Malaysia",company_name:"",label:"Home",is_default:0,address_type:"shipping"};function Y(a){return e.jsxs("svg",{className:a.className,width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 11.5 12 4l9 7.5"}),e.jsx("path",{d:"M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"})]})}function H(a){return e.jsxs("svg",{className:a.className,width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"7.5",width:"18",height:"12",rx:"2"}),e.jsx("path",{d:"M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5"}),e.jsx("path",{d:"M3 12.5h18"})]})}function C(a){return e.jsxs("svg",{className:a.className,width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M12 21s7-6.4 7-11.6A7 7 0 0 0 5 9.4C5 14.6 12 21 12 21Z"}),e.jsx("circle",{cx:"12",cy:"9.4",r:"2.4"})]})}function O(a){return e.jsx("svg",{className:a.className,width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"})})}function V(a){return e.jsx("svg",{className:a.className,width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6 9 17l-5-5"})})}function K(a){return e.jsxs("svg",{className:a.className,width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 7h16"}),e.jsx("path",{d:"M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"}),e.jsx("path",{d:"M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"})]})}function w(a){return e.jsx("svg",{className:a.className,width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M12 5v14M5 12h14"})})}function Z(a){return e.jsx("svg",{className:a.className,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M18 6 6 18M6 6l12 12"})})}function $(a){return e.jsxs("svg",{className:a.className,width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"9"}),e.jsx("path",{d:"M12 8v5"}),e.jsx("path",{d:"M12 16.2v.1"})]})}function J(a){const d=a.trim().toLowerCase();return d.includes("office")||d.includes("work")?H:d.includes("home")?Y:C}function U(){const[a]=_(),d=B(),u=a.get("redirect"),[b,p]=n.useState([]),[A,S]=n.useState(!0),[x,c]=n.useState(!!u),[t,h]=n.useState({...f}),[v,j]=n.useState(!1),[k,o]=n.useState(null),[N,y]=n.useState(null);n.useEffect(()=>{g.getAddresses().then(s=>p(s.data.data??[])).catch(()=>{}).finally(()=>S(!1))},[]);function r(s,i){h(l=>({...l,[s]:i}))}async function M(s){if(s.preventDefault(),o(null),!t.full_name.trim())return o("Full name is required.");if(!t.phone.trim()||!I(t.phone.trim()))return o(W);if(!t.line1.trim())return o("Address line 1 is required.");if(!t.city.trim())return o("City is required.");if(!t.state)return o("State is required.");if(!t.pincode.trim()||!/^\d{5}$/.test(t.pincode.trim()))return o("Enter a valid 5-digit postcode.");j(!0);try{const i={...t,phone:q(t.phone)},m=(await g.saveAddress(i)).data;m.success&&m.data?.addresses&&(p(m.data.addresses),c(!1),h({...f}),u&&d(u))}catch{o("Failed to save address. Please try again.")}finally{j(!1)}}async function L(s){y(s);try{const l=(await g.deleteAddress(s)).data.data;l?.addresses?p(l.addresses):p(m=>m.filter(P=>P.id!==s))}catch{}finally{y(null)}}return e.jsx(E,{title:"My Addresses",children:e.jsxs("div",{className:"address-container-custom",children:[e.jsx("style",{children:`
          .address-container-custom {
            --teal: #3EC1BC;
            --teal-dark: #2FA6A1;
            --teal-darker: #24807C;
            --teal-tint: #EAFAF9;
            --teal-tint-2: #DBF5F3;
            --ink: #16232B;
            --muted: #64748B;
            --line: #E7ECEC;
            --danger: #DC2626;
            --danger-tint: #FDEDED;
            font-family: 'Inter', sans-serif;
            color: var(--ink);
          }

          .address-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--line);
            gap: 16px;
          }

          @media (max-width: 576px) {
            .address-header {
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 20px;
              padding-bottom: 16px;
            }
            .address-header h5 {
              font-size: 19px !important;
            }
            .btn-add-address-custom {
              width: 100%;
              justify-content: center;
            }
            .form-card-custom {
              padding: 20px 16px 20px !important;
            }
            .address-card-custom {
              padding: 16px !important;
            }
          }

          .address-header h5 {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin: 0;
            color: var(--ink);
          }

          .address-header .subtext {
            font-size: 13.5px;
            color: var(--muted);
            margin-top: 4px;
          }

          .btn-add-address-custom {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--teal);
            color: #fff;
            border: 1px solid var(--teal);
            border-radius: 10px;
            padding: 11px 20px;
            font-size: 13.5px;
            font-weight: 600;
            letter-spacing: 0.1px;
            cursor: pointer;
            transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.05s ease;
            box-shadow: 0 1px 2px rgba(22, 35, 43, 0.06);
          }

          .btn-add-address-custom:hover {
            background: var(--teal-dark);
            box-shadow: 0 4px 14px rgba(62, 193, 188, 0.35);
          }

          .btn-add-address-custom:active {
            transform: translateY(1px);
          }

          /* ---- cards ---- */
          .address-card-custom {
            background: #fff;
            padding: 22px 22px 18px;
            border: 1px solid var(--line);
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
            box-shadow: 0 1px 2px rgba(22, 35, 43, 0.04);
          }

          .address-card-custom:hover {
            border-color: var(--teal);
            box-shadow: 0 10px 24px rgba(22, 35, 43, 0.08);
            transform: translateY(-2px);
          }

          .address-card-custom.default-active {
            border-color: var(--teal);
            box-shadow: 0 0 0 1px var(--teal), 0 10px 24px rgba(62, 193, 188, 0.14);
          }

          .card-top-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .address-label-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--teal-darker);
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }

          .address-label-icon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--teal-tint);
            color: var(--teal-darker);
            flex-shrink: 0;
          }

          .badge-default-custom {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: var(--teal-tint);
            color: var(--teal-darker);
            border: 1px solid var(--teal-tint-2);
            font-size: 10.5px;
            font-weight: 700;
            padding: 4px 9px 4px 7px;
            border-radius: 999px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }

          .badge-default-custom svg {
            color: var(--teal-darker);
          }

          .address-name-custom {
            font-size: 15.5px;
            font-weight: 700;
            margin-bottom: 6px;
            color: var(--ink);
            letter-spacing: -0.01em;
          }

          .address-details-custom {
            color: var(--muted);
            font-size: 13.8px;
            line-height: 1.65;
            flex: 1;
            margin-bottom: 18px;
          }

          .address-phone-row {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
            color: var(--ink);
            font-weight: 500;
          }

          .address-phone-row svg {
            color: var(--teal);
          }

          .address-actions-custom {
            display: flex;
            gap: 10px;
            border-top: 1px solid var(--line);
            padding-top: 14px;
          }

          .btn-remove-custom {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: none;
            color: var(--muted);
            font-size: 12.5px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            padding: 4px 0;
            transition: color 0.18s ease;
          }

          .btn-remove-custom:hover {
            color: var(--danger);
          }

          .btn-remove-custom:disabled {
            opacity: 0.6;
            cursor: default;
          }

          /* ---- form card ---- */
          .form-card-custom {
            background: #fff;
            padding: 30px 30px 26px;
            border: 1px solid var(--line);
            border-radius: 16px;
            margin-bottom: 36px;
            box-shadow: 0 6px 24px rgba(22, 35, 43, 0.06);
          }

          .form-title {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin-bottom: 22px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--line);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--ink);
          }

          .form-close-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 8px;
            border: none;
            background: transparent;
            color: var(--muted);
            cursor: pointer;
            transition: background 0.18s ease, color 0.18s ease;
          }

          .form-close-btn:hover {
            background: var(--teal-tint);
            color: var(--teal-darker);
          }

          .form-label-custom {
            font-size: 12px;
            font-weight: 600;
            color: var(--muted);
            letter-spacing: 0.3px;
            margin-bottom: 8px;
            display: block;
          }

          .form-label-custom .text-danger {
            color: var(--teal-darker) !important;
          }

          .form-input-custom {
            width: 100%;
            padding: 11px 13px;
            border: 1.5px solid var(--line);
            border-radius: 10px;
            font-size: 14.5px;
            color: var(--ink);
            background: #fbfcfc;
            outline: none;
            transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
          }

          .form-input-custom:focus {
            border-color: var(--teal);
            background: #fff;
            box-shadow: 0 0 0 3.5px var(--teal-tint);
          }

          .form-input-custom::placeholder {
            color: #A6B0B4;
            font-weight: 400;
          }

          .btn-primary-custom {
            background: var(--teal);
            color: #fff;
            border: 1px solid var(--teal);
            border-radius: 10px;
            padding: 13px 28px;
            font-size: 13.5px;
            font-weight: 700;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.05s ease;
            width: 100%;
            box-shadow: 0 1px 2px rgba(22, 35, 43, 0.06);
          }

          .btn-primary-custom:hover:not(:disabled) {
            background: var(--teal-dark);
            box-shadow: 0 6px 18px rgba(62, 193, 188, 0.35);
          }

          .btn-primary-custom:active:not(:disabled) {
            transform: translateY(1px);
          }

          .btn-primary-custom:disabled {
            opacity: 0.65;
            cursor: default;
          }

          .btn-secondary-custom {
            background: #fff;
            border: 1.5px solid var(--line);
            color: var(--ink);
            border-radius: 10px;
            padding: 13px 28px;
            font-size: 13.5px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
            width: 100%;
          }

          .btn-secondary-custom:hover {
            border-color: var(--teal);
            color: var(--teal-darker);
            background: var(--teal-tint);
          }

          .form-select-custom {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 34px;
          }

          .checkbox-row-custom {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-size: 13.5px;
            font-weight: 500;
            color: var(--ink);
            background: #fbfcfc;
            border: 1.5px solid var(--line);
            border-radius: 10px;
            padding: 13px 15px;
            transition: border-color 0.18s ease, background 0.18s ease;
          }

          .checkbox-row-custom:hover {
            border-color: var(--teal);
            background: var(--teal-tint);
          }

          .checkbox-row-custom input {
            width: 17px;
            height: 17px;
            accent-color: var(--teal);
            cursor: pointer;
          }

          .alert-custom {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: var(--danger-tint);
            color: #9B1C1C;
            border: 1px solid #F6C9C9;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 13.5px;
            font-weight: 500;
            margin-bottom: 20px;
          }

          .alert-custom svg {
            flex-shrink: 0;
            margin-top: 1px;
            color: #C0392B;
          }

          /* ---- empty state ---- */
          .empty-state {
            text-align: center;
            padding: 64px 20px;
            background: #fbfcfc;
            border: 1.5px dashed var(--line);
            border-radius: 16px;
          }

          .empty-state-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: var(--teal-tint);
            color: var(--teal-darker);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .empty-state p.empty-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--ink);
          }

          .empty-state p.empty-sub {
            color: var(--muted);
            margin-bottom: 28px;
            font-size: 14px;
          }

          .spinner-teal {
            width: 34px;
            height: 34px;
            border: 3px solid var(--teal-tint);
            border-top-color: var(--teal);
            border-radius: 50%;
            animation: spin-teal 0.7s linear infinite;
            margin: 0 auto;
          }

          @keyframes spin-teal {
            to { transform: rotate(360deg); }
          }
        `}),e.jsxs("div",{className:"address-header",children:[e.jsxs("div",{children:[e.jsx("h5",{children:"My Addresses"}),e.jsx("div",{className:"subtext",children:"Manage the addresses we deliver your orders to."})]}),!x&&e.jsxs("button",{type:"button",className:"btn-add-address-custom",onClick:()=>{c(!0),o(null),h({...f})},children:[e.jsx(w,{}),"Add Address"]})]}),x&&e.jsxs("div",{className:"form-card-custom",children:[e.jsxs("div",{className:"form-title",children:[e.jsx("span",{children:"New Delivery Address"}),e.jsx("button",{type:"button",className:"form-close-btn",onClick:()=>c(!1),"aria-label":"Close form",children:e.jsx(Z,{})})]}),k&&e.jsxs("div",{className:"alert-custom",children:[e.jsx($,{}),e.jsx("span",{children:k})]}),e.jsxs("form",{onSubmit:M,noValidate:!0,children:[e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"form-label-custom",children:["Address Label ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{className:"form-input-custom",value:t.label,onChange:s=>r("label",s.target.value),placeholder:"e.g. Home, Office",required:!0})]}),e.jsxs("div",{className:"row mb-4",children:[e.jsxs("div",{className:"col-md-6 mb-4 mb-md-0",children:[e.jsxs("label",{className:"form-label-custom",children:["Recipient Name ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{className:"form-input-custom",value:t.full_name,onChange:s=>r("full_name",s.target.value),placeholder:"Full Name",required:!0})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsxs("label",{className:"form-label-custom",children:["Phone Number ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("div",{className:"d-flex align-items-center form-input-custom",style:{padding:0,overflow:"hidden"},children:[e.jsxs("span",{className:"px-3 fw-medium",style:{backgroundColor:"#f8fafc",borderRight:"1px solid #e2e8f0",alignSelf:"stretch",display:"flex",alignItems:"center"},children:["+",F]}),e.jsx("input",{className:"form-input-custom",value:D(t.phone),maxLength:12,onChange:s=>r("phone",s.target.value.replace(/\D/g,"").slice(0,11)),placeholder:"12-345 6789",required:!0,style:{border:"none",borderRadius:0}})]})]})]}),e.jsxs("div",{className:"row mb-4",children:[e.jsxs("div",{className:"col-md-6 mb-4 mb-md-0",children:[e.jsxs("label",{className:"form-label-custom",children:["Company Name ",e.jsx("span",{className:"text-muted",children:"(optional)"})]}),e.jsx("input",{className:"form-input-custom",value:t.company_name,onChange:s=>r("company_name",s.target.value),placeholder:"Shown on invoice if provided"})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label-custom",children:"Address Type"}),e.jsxs("select",{className:"form-input-custom",value:t.address_type,onChange:s=>r("address_type",s.target.value),children:[e.jsx("option",{value:"shipping",children:"Shipping"}),e.jsx("option",{value:"billing",children:"Billing"})]})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"form-label-custom",children:["Address Line 1 ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{className:"form-input-custom",value:t.line1,onChange:s=>r("line1",s.target.value),placeholder:"House / Flat / Block, Street Name",required:!0})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"form-label-custom",children:["Address Line 2 ",e.jsx("span",{className:"text-muted text-lowercase",style:{fontSize:"10px"},children:"(optional)"})]}),e.jsx("input",{className:"form-input-custom",value:t.line2,onChange:s=>r("line2",s.target.value),placeholder:"Colony / Sector / Landmark"})]}),e.jsxs("div",{className:"row mb-4",children:[e.jsxs("div",{className:"col-md-4 mb-4 mb-md-0",children:[e.jsxs("label",{className:"form-label-custom",children:["City ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{className:"form-input-custom",value:t.city,onChange:s=>r("city",s.target.value),placeholder:"City",required:!0})]}),e.jsxs("div",{className:"col-md-4 mb-4 mb-md-0",children:[e.jsxs("label",{className:"form-label-custom",children:["State ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-input-custom form-select-custom",value:t.state,onChange:s=>r("state",s.target.value),required:!0,children:[e.jsx("option",{value:"",children:"Select State"}),T.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label-custom",children:["Postcode ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{className:"form-input-custom",value:t.pincode,maxLength:5,onChange:s=>r("pincode",s.target.value.replace(/\D/g,"")),placeholder:"5-digit Postcode",required:!0})]})]}),e.jsx("div",{className:"mb-4",children:e.jsxs("label",{className:"checkbox-row-custom",children:[e.jsx("input",{type:"checkbox",checked:t.is_default===1,onChange:s=>r("is_default",s.target.checked?1:0)}),"Set as default address"]})}),e.jsxs("div",{className:"row g-3",children:[e.jsx("div",{className:"col-sm-6",children:e.jsx("button",{type:"submit",className:"btn-primary-custom",disabled:v,children:v?"Saving...":"Save Address"})}),e.jsx("div",{className:"col-sm-6",children:e.jsx("button",{type:"button",className:"btn-secondary-custom",onClick:()=>c(!1),children:"Cancel"})})]})]})]}),A?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-teal",role:"status"})}):b.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-state-icon",children:e.jsx(C,{})}),e.jsx("p",{className:"empty-title",children:"No Saved Addresses"}),e.jsx("p",{className:"empty-sub",children:"Add delivery details for a smoother checkout experience."}),!x&&e.jsxs("button",{type:"button",className:"btn-add-address-custom",onClick:()=>c(!0),children:[e.jsx(w,{}),"Add New Address"]})]}):e.jsx("div",{className:"row g-4",children:b.map(s=>{const i=Number(s.is_default)===1,l=J(s.label||"");return e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:`address-card-custom ${i?"default-active":""}`,children:[e.jsxs("div",{className:"card-top-row",children:[e.jsxs("span",{className:"address-label-badge",children:[e.jsx("span",{className:"address-label-icon",children:e.jsx(l,{})}),s.label]}),i&&e.jsxs("span",{className:"badge-default-custom",children:[e.jsx(V,{}),"Default"]})]}),e.jsx("div",{className:"address-name-custom",children:s.full_name}),s.company_name?e.jsx("div",{className:"small text-muted",children:s.company_name}):null,e.jsxs("div",{className:"address-details-custom",children:[e.jsx("div",{children:s.line1}),s.line2&&e.jsx("div",{children:s.line2}),e.jsxs("div",{children:[s.city,", ",s.state," ",s.pincode]}),e.jsxs("div",{className:"address-phone-row",children:[e.jsx(O,{}),s.phone]})]}),e.jsx("div",{className:"address-actions-custom",children:e.jsxs("button",{type:"button",className:"btn-remove-custom",onClick:()=>L(s.id),disabled:N===s.id,children:[e.jsx(K,{}),N===s.id?"Removing…":"Remove"]})})]})},s.id)})})]})})}const se=()=>e.jsxs(e.Fragment,{children:[e.jsx(R,{title:"My Address | 2Deal - Incense Sticks, Soaps & Food Products Store",description:"2Deal - Incense Sticks, Soaps & Food Products Store"}),e.jsx(z,{}),e.jsx(U,{})]});export{se as default};
