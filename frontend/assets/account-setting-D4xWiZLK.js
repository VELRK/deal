import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{t as n}from"./authStore-cePwo9pG.js";import{m as r}from"./api-jlSlTj-g.js";import{t as i}from"./jsx-runtime-DdEXjPBp.js";import{n as a,t as o}from"./AccountSection-D9hxhYUg.js";import{t as s}from"./PageMeta-Crd6kKGb.js";var c=e(t(),1),l=i();function u(){let{user:e,setUser:t}=n(),[i,a]=(0,c.useState)(e?.name??``),[s,u]=(0,c.useState)(e?.phone??``),d=e?.email??``,f=d.startsWith(`ph_`)||d.includes(`@Indian Ladies Fashion.app`),[p,m]=(0,c.useState)(f?``:d),[h,g]=(0,c.useState)(!1),[_,v]=(0,c.useState)(null);async function y(e){if(e.preventDefault(),!i.trim())return v({type:`error`,text:`Full name is required.`});v(null),g(!0);try{let e={name:i.trim(),phone:s.trim()};f&&p.trim()&&(e.email=p.trim());let n=(await r.updateProfile(e)).data.data;n&&t(n),v({type:`success`,text:`Profile updated successfully.`})}catch(e){let t=e?.response?.data?.message;v({type:`error`,text:t??`Failed to save changes. Please try again.`})}finally{g(!1)}}return(0,l.jsx)(o,{title:`Account Details`,children:(0,l.jsxs)(`div`,{className:`settings-container-custom`,children:[(0,l.jsx)(`style`,{children:`
          .settings-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .settings-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
          }

          @media (max-width: 576px) {
            .settings-card-custom {
              padding: 20px;
            }
          }

          .settings-title-custom {
            font-size: 18px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(193, 16, 105, 0.08);
            padding-bottom: 12px;
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

          .form-input-custom:read-only {
            background: #f8fafc;
            border-color: #e2e8f0;
            color: #64748b;
            cursor: not-allowed;
          }

          .alert-custom {
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13.5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
          }

          .alert-custom.warning {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fef3c7;
          }

          .alert-custom.success {
            background: #f0fdf4;
            color: #15803d;
            border: 1px solid #bbf7d0;
          }

          .alert-custom.danger {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fee2e2;
          }

          .btn-primary-custom {
            background: #c11069;
            color: #ffffff;
            border: 1px solid #c11069;
            border-radius: 10px;
            padding: 12px 28px;
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

          .btn-primary-custom:disabled {
            background: #cbd5e1;
            border-color: #cbd5e1;
            color: #94a3b8;
            cursor: not-allowed;
          }

          .form-desc-custom {
            margin-top: 6px;
            color: #64748b;
            font-size: 12px;
          }
        `}),(0,l.jsxs)(`div`,{className:`settings-card-custom`,children:[(0,l.jsx)(`h5`,{className:`settings-title-custom`,children:`Personal Details`}),f&&(0,l.jsxs)(`div`,{className:`alert-custom warning`,children:[(0,l.jsx)(`span`,{children:`📧`}),(0,l.jsx)(`span`,{children:`Your account doesn't have an email address yet. Add one below to enable email login.`})]}),_&&(0,l.jsxs)(`div`,{className:`alert-custom ${_.type===`success`?`success`:`danger`}`,children:[(0,l.jsx)(`span`,{children:_.type===`success`?`✓`:`✕`}),(0,l.jsx)(`span`,{children:_.text})]}),(0,l.jsxs)(`form`,{onSubmit:y,children:[(0,l.jsxs)(`div`,{className:`row`,children:[(0,l.jsxs)(`div`,{className:`col-12 mb-4`,children:[(0,l.jsxs)(`label`,{className:`form-label-custom`,children:[`Full Name `,(0,l.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,l.jsx)(`input`,{className:`form-input-custom`,type:`text`,value:i,onChange:e=>a(e.target.value),placeholder:`Your full name`,required:!0})]}),(0,l.jsxs)(`div`,{className:`col-12 mb-4`,children:[(0,l.jsx)(`label`,{className:`form-label-custom`,children:`Phone Number`}),(0,l.jsx)(`input`,{className:`form-input-custom`,type:`tel`,value:s,onChange:e=>u(e.target.value.replace(/\D/g,``).slice(0,10)),placeholder:`10-digit mobile number`})]}),(0,l.jsxs)(`div`,{className:`col-12 mb-4`,children:[(0,l.jsxs)(`label`,{className:`form-label-custom`,children:[`Email Address `,f?(0,l.jsx)(`span`,{className:`text-muted fw-normal`,children:`(optional — enables email login)`}):`(Read-only)`]}),f?(0,l.jsx)(`input`,{className:`form-input-custom`,type:`email`,value:p,onChange:e=>m(e.target.value),placeholder:`your@email.com`}):(0,l.jsx)(`input`,{className:`form-input-custom`,type:`email`,value:d,readOnly:!0}),!f&&(0,l.jsx)(`p`,{className:`form-desc-custom`,children:`Account email address cannot be modified.`})]})]}),(0,l.jsx)(`div`,{className:`mt-4`,children:(0,l.jsx)(`button`,{type:`submit`,className:`btn-primary-custom`,disabled:h,children:h?`Saving Changes...`:`Save Changes`})})]})]})]})})}var d=()=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(s,{title:`Setting | Indian Ladies Fashion - Online Saree & Ethnic Wear Store`,description:`Indian Ladies Fashion - Online Saree & Ethnic Wear Store`}),(0,l.jsx)(a,{}),(0,l.jsx)(u,{})]});export{d as default};