import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{l as n,s as r}from"./chunk-QFMPRPBF-BNQPla1W.js";import{h as i}from"./api-CLcNGb5M.js";import{t as a}from"./jsx-runtime-DdEXjPBp.js";import{n as o,t as s}from"./AccountSection-CIbDtcCp.js";import{t as c}from"./PageMeta-6gZ1jYam.js";var l=e(t(),1),u=a(),d=`Andhra Pradesh.Arunachal Pradesh.Assam.Bihar.Chhattisgarh.Goa.Gujarat.Haryana.Himachal Pradesh.Jharkhand.Karnataka.Kerala.Madhya Pradesh.Maharashtra.Manipur.Meghalaya.Mizoram.Nagaland.Odisha.Punjab.Rajasthan.Sikkim.Tamil Nadu.Telangana.Tripura.Uttar Pradesh.Uttarakhand.West Bengal.Andaman & Nicobar Islands.Chandigarh.Dadra & Nagar Haveli and Daman & Diu.Delhi.Jammu & Kashmir.Ladakh.Lakshadweep.Puducherry`.split(`.`),f={full_name:``,phone:``,line1:``,line2:``,city:``,state:``,pincode:``,country:`India`,label:`Home`,is_default:0};function p(){let[e]=n(),t=r(),a=e.get(`redirect`),[o,c]=(0,l.useState)([]),[p,m]=(0,l.useState)(!0),[h,g]=(0,l.useState)(!!a),[_,v]=(0,l.useState)({...f}),[y,b]=(0,l.useState)(!1),[x,S]=(0,l.useState)(null),[C,w]=(0,l.useState)(null);(0,l.useEffect)(()=>{i.getAddresses().then(e=>c(e.data.data??[])).catch(()=>{}).finally(()=>m(!1))},[]);function T(e,t){v(n=>({...n,[e]:t}))}async function E(e){if(e.preventDefault(),S(null),!_.full_name.trim())return S(`Full name is required.`);if(!_.phone.trim()||!/^\d{10}$/.test(_.phone.trim()))return S(`Enter a valid 10-digit phone number.`);if(!_.line1.trim())return S(`Address line 1 is required.`);if(!_.city.trim())return S(`City is required.`);if(!_.state)return S(`State is required.`);if(!_.pincode.trim()||!/^\d{6}$/.test(_.pincode.trim()))return S(`Enter a valid 6-digit PIN code.`);b(!0);try{let e=(await i.saveAddress(_)).data;e.success&&e.data?.addresses&&(c(e.data.addresses),g(!1),v({...f}),a&&t(a))}catch{S(`Failed to save address. Please try again.`)}finally{b(!1)}}async function D(e){w(e);try{let t=(await i.deleteAddress(e)).data.data;t?.addresses?c(t.addresses):c(t=>t.filter(t=>t.id!==e))}catch{}finally{w(null)}}return(0,u.jsx)(s,{title:`My Address`,children:(0,u.jsxs)(`div`,{className:`address-container-custom`,children:[(0,u.jsx)(`style`,{children:`
          .address-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .address-card-custom {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            transition: all 0.3s ease;
          }

          .address-card-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(193, 16, 105, 0.04);
          }

          .address-card-custom.default-active {
            border-color: #c11069;
            background: #fdfafb;
          }

          .badge-default-custom {
            background: #c11069;
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .address-label-badge {
            font-weight: 700;
            font-size: 11px;
            color: #c11069;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #faf0f2;
            padding: 4px 10px;
            border-radius: 6px;
            display: inline-block;
          }

          .address-name-custom {
            font-weight: 700;
            font-size: 16px;
            color: #111111;
            margin-top: 14px;
            margin-bottom: 8px;
          }

          .address-details-custom {
            color: #555555;
            font-size: 14px;
            line-height: 1.7;
            flex: 1;
          }

          .address-actions-custom {
            margin-top: 20px;
            display: flex;
            gap: 12px;
          }

          .btn-remove-custom {
            background: transparent;
            border: none;
            color: #dc2626;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s ease;
            outline: none;
          }

          .btn-remove-custom:hover {
            color: #991b1b;
            text-decoration: underline;
          }

          /* Form inputs styling */
          .form-card-custom {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(193, 16, 105, 0.08);
            padding: 24px;
            box-shadow: 0 4px 20px rgba(193, 16, 105, 0.02);
            margin-bottom: 30px;
          }

          .form-label-custom {
            font-weight: 600;
            font-size: 13px;
            color: #333333;
            margin-bottom: 6px;
            display: block;
          }

          .form-input-custom {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(193, 16, 105, 0.15);
            border-radius: 10px;
            font-size: 14px;
            color: #111111;
            background: #ffffff;
            outline: none;
            transition: all 0.25s ease;
          }

          .form-input-custom:focus {
            border-color: #c11069;
            box-shadow: 0 0 0 3px rgba(193, 16, 105, 0.1);
          }

          .form-input-custom::placeholder {
            color: #999999;
          }

          .btn-primary-custom {
            background: #c11069;
            color: #ffffff;
            border: 1px solid #c11069;
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-primary-custom:hover {
            background: #920b4e;
            border-color: #920b4e;
          }

          .btn-secondary-custom {
            background: transparent;
            border: 1px solid #e2e8f0;
            color: #64748b;
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-secondary-custom:hover {
            background: #f8fafc;
            color: #334155;
            border-color: #cbd5e1;
          }

          .btn-add-address-custom {
            background: #ffffff;
            border: 1px solid #c11069;
            color: #c11069;
            border-radius: 30px;
            padding: 8px 20px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-add-address-custom:hover {
            background: #c11069;
            color: #ffffff;
          }

          .form-select-custom {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23c11069' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 36px;
          }
        `}),(0,u.jsxs)(`div`,{className:`d-flex align-items-center justify-content-between mb-4`,children:[(0,u.jsx)(`h5`,{className:`fw-semibold mb-0`,style:{fontSize:18},children:`My Addresses`}),!h&&(0,u.jsx)(`button`,{type:`button`,className:`btn-add-address-custom`,onClick:()=>{g(!0),S(null),v({...f})},children:`+ Add New Address`})]}),h&&(0,u.jsxs)(`div`,{className:`form-card-custom`,children:[(0,u.jsxs)(`div`,{className:`d-flex align-items-center justify-content-between mb-4`,children:[(0,u.jsx)(`h6`,{className:`fw-bold m-0`,style:{color:`#c11069`,fontSize:15},children:`New Delivery Address`}),(0,u.jsx)(`button`,{type:`button`,className:`btn-close`,onClick:()=>g(!1)})]}),x&&(0,u.jsxs)(`div`,{className:`alert alert-danger py-2 px-3 fs-14`,style:{borderRadius:10,marginBottom:20},children:[`✕ `,x]}),(0,u.jsxs)(`form`,{onSubmit:E,noValidate:!0,children:[(0,u.jsxs)(`div`,{className:`mb-3`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`Address Label (e.g. Home, Office) `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.label,onChange:e=>T(`label`,e.target.value),placeholder:`e.g. Home, Office, Work`,required:!0})]}),(0,u.jsxs)(`div`,{className:`row mb-3`,children:[(0,u.jsxs)(`div`,{className:`col-md-6 mb-3 mb-md-0`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`Recipient Name `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.full_name,onChange:e=>T(`full_name`,e.target.value),placeholder:`Full Name`,required:!0})]}),(0,u.jsxs)(`div`,{className:`col-md-6`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`Phone Number `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.phone,maxLength:10,onChange:e=>T(`phone`,e.target.value.replace(/\D/g,``)),placeholder:`10-digit mobile number`,required:!0})]})]}),(0,u.jsxs)(`div`,{className:`mb-3`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`Address Line 1 `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.line1,onChange:e=>T(`line1`,e.target.value),placeholder:`House / Flat / Block, Street Name`,required:!0})]}),(0,u.jsxs)(`div`,{className:`mb-3`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`Address Line 2 `,(0,u.jsx)(`span`,{style:{color:`#888888`,fontWeight:400},children:`(Optional)`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.line2,onChange:e=>T(`line2`,e.target.value),placeholder:`Colony / Sector / Landmark`})]}),(0,u.jsxs)(`div`,{className:`row mb-4`,children:[(0,u.jsxs)(`div`,{className:`col-md-4 mb-3 mb-md-0`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`City `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.city,onChange:e=>T(`city`,e.target.value),placeholder:`City`,required:!0})]}),(0,u.jsxs)(`div`,{className:`col-md-4 mb-3 mb-md-0`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`State `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsxs)(`select`,{className:`form-input-custom form-select-custom`,value:_.state,onChange:e=>T(`state`,e.target.value),required:!0,children:[(0,u.jsx)(`option`,{value:``,children:`Select State`}),d.map(e=>(0,u.jsx)(`option`,{value:e,children:e},e))]})]}),(0,u.jsxs)(`div`,{className:`col-md-4`,children:[(0,u.jsxs)(`label`,{className:`form-label-custom`,children:[`PIN Code `,(0,u.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,u.jsx)(`input`,{className:`form-input-custom`,value:_.pincode,maxLength:6,onChange:e=>T(`pincode`,e.target.value.replace(/\D/g,``)),placeholder:`6-digit PIN`,required:!0})]})]}),(0,u.jsx)(`div`,{className:`mb-4`,children:(0,u.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:10,cursor:`pointer`,fontSize:14,fontWeight:500,color:`#444444`},children:[(0,u.jsx)(`input`,{type:`checkbox`,checked:_.is_default===1,onChange:e=>T(`is_default`,+!!e.target.checked),style:{width:18,height:18,accentColor:`#c11069`}}),`Set as my primary delivery address`]})}),(0,u.jsxs)(`div`,{className:`d-flex gap-3`,children:[(0,u.jsx)(`button`,{type:`submit`,className:`btn-primary-custom`,disabled:y,children:y?`Saving Address...`:`Save Address`}),(0,u.jsx)(`button`,{type:`button`,className:`btn-secondary-custom`,onClick:()=>g(!1),children:`Cancel`})]})]})]}),p?(0,u.jsx)(`div`,{className:`text-center py-5`,children:(0,u.jsx)(`div`,{className:`spinner-border text-dark`,role:`status`})}):o.length===0?(0,u.jsxs)(`div`,{className:`text-center py-5 rounded-3`,style:{background:`#fdfafb`,border:`1px dashed rgba(193, 16, 105, 0.15)`},children:[(0,u.jsx)(`div`,{style:{fontSize:44,marginBottom:12},children:`📍`}),(0,u.jsx)(`p`,{className:`fw-bold mb-1`,children:`No Saved Addresses`}),(0,u.jsx)(`p`,{className:`text-muted mb-4 fs-14`,children:`Add delivery details to speed up your checkout process.`}),!h&&(0,u.jsx)(`button`,{type:`button`,className:`btn-primary-custom`,onClick:()=>g(!0),children:`Add First Address`})]}):(0,u.jsx)(`div`,{className:`row g-4`,children:o.map(e=>{let t=Number(e.is_default)===1;return(0,u.jsx)(`div`,{className:`col-md-6`,children:(0,u.jsxs)(`div`,{className:`address-card-custom ${t?`default-active`:``}`,children:[(0,u.jsxs)(`div`,{className:`d-flex align-items-center justify-content-between mb-2`,children:[(0,u.jsxs)(`span`,{className:`address-label-badge`,children:[`📍 `,e.label]}),t&&(0,u.jsx)(`span`,{className:`badge-default-custom`,children:`Default`})]}),(0,u.jsx)(`div`,{className:`address-name-custom`,children:e.full_name}),(0,u.jsxs)(`div`,{className:`address-details-custom`,children:[(0,u.jsx)(`div`,{children:e.line1}),e.line2&&(0,u.jsx)(`div`,{children:e.line2}),(0,u.jsxs)(`div`,{children:[e.city,`, `,e.state,` – `,e.pincode]}),(0,u.jsxs)(`div`,{style:{marginTop:8,fontWeight:500,color:`#111`},children:[`📞 `,e.phone]})]}),(0,u.jsx)(`div`,{className:`address-actions-custom`,children:(0,u.jsx)(`button`,{type:`button`,className:`btn-remove-custom`,onClick:()=>D(e.id),disabled:C===e.id,children:C===e.id?`Removing…`:`Remove Address`})})]})},e.id)})})]})})}var m=()=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(c,{title:`My Address | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,u.jsx)(o,{}),(0,u.jsx)(p,{})]});export{m as default};