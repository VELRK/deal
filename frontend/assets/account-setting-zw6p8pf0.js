import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{h as n}from"./api-B-MPbqi2.js";import{s as r,x as i}from"./index-jgSBcv-B.js";import{a,i as o,n as s,o as c,t as l}from"./malaysiaPhone-Bpv5FhOl.js";import{n as u,t as d}from"./AccountSection-Bas4Ro7M.js";import{t as f}from"./PageMeta-CyS8ELM3.js";var p=e(t(),1),m=r();function h(){let{user:e,setUser:t}=i(),[r,u]=(0,p.useState)(e?.name??``),[f,h]=(0,p.useState)(()=>{let t=e?.phone??``;if(!t)return``;let n=a(t);return n.startsWith(`60`)?`0`+n.slice(2):n}),g=e?.email??``,_=g.startsWith(`ph_`)||g.includes(`@Indian Ladies Fashion.app`),[v,y]=(0,p.useState)(_?``:g),[b,x]=(0,p.useState)(!1),[S,C]=(0,p.useState)(null);async function w(e){if(e.preventDefault(),!r.trim())return C({type:`error`,text:`Full name is required.`});if(f.trim()&&!o(f))return C({type:`error`,text:l});C(null),x(!0);try{let e={name:r.trim(),phone:f.trim()?c(f):``};_&&v.trim()&&(e.email=v.trim());let i=(await n.updateProfile(e)).data.data;i&&t(i),C({type:`success`,text:`Profile updated successfully.`})}catch(e){let t=e?.response?.data?.message;C({type:`error`,text:t??`Failed to save changes. Please try again.`})}finally{x(!1)}}return(0,m.jsx)(d,{title:`Account Details`,children:(0,m.jsxs)(`div`,{className:`settings-container-custom`,children:[(0,m.jsx)(`style`,{children:`
          .settings-container-custom {
            font-family: 'Inter', sans-serif;
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
            border-color: #3EC1BC;
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
            background: #3EC1BC;
            color: #ffffff;
            border: 1px solid #3EC1BC;
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
        `}),(0,m.jsxs)(`div`,{className:`settings-card-custom`,children:[(0,m.jsx)(`h5`,{className:`settings-title-custom`,children:`Personal Details`}),_&&(0,m.jsxs)(`div`,{className:`alert-custom warning`,children:[(0,m.jsx)(`span`,{children:`📧`}),(0,m.jsx)(`span`,{children:`Your account doesn't have an email address yet. Add one below to enable email login.`})]}),S&&(0,m.jsxs)(`div`,{className:`alert-custom ${S.type===`success`?`success`:`danger`}`,children:[(0,m.jsx)(`span`,{children:S.type===`success`?`✓`:`✕`}),(0,m.jsx)(`span`,{children:S.text})]}),(0,m.jsxs)(`form`,{onSubmit:w,children:[(0,m.jsxs)(`div`,{className:`row`,children:[(0,m.jsxs)(`div`,{className:`col-12 mb-4`,children:[(0,m.jsxs)(`label`,{className:`form-label-custom`,children:[`Full Name `,(0,m.jsx)(`span`,{style:{color:`#dc2626`},children:`*`})]}),(0,m.jsx)(`input`,{className:`form-input-custom`,type:`text`,value:r,onChange:e=>u(e.target.value),placeholder:`Your full name`,required:!0})]}),(0,m.jsxs)(`div`,{className:`col-12 mb-4`,children:[(0,m.jsx)(`label`,{className:`form-label-custom`,children:`Phone Number`}),(0,m.jsxs)(`div`,{className:`d-flex align-items-center form-input-custom`,style:{padding:0,overflow:`hidden`},children:[(0,m.jsxs)(`span`,{className:`px-3 fw-medium`,style:{backgroundColor:`#f8fafc`,borderRight:`1px solid #e2e8f0`,alignSelf:`stretch`,display:`flex`,alignItems:`center`},children:[`+`,`60`]}),(0,m.jsx)(`input`,{className:`form-input-custom`,type:`tel`,value:s(f),onChange:e=>h(e.target.value.replace(/\D/g,``).slice(0,11)),placeholder:`12-345 6789`,style:{border:`none`,borderRadius:0}})]})]}),(0,m.jsxs)(`div`,{className:`col-12 mb-4`,children:[(0,m.jsxs)(`label`,{className:`form-label-custom`,children:[`Email Address `,_?(0,m.jsx)(`span`,{className:`text-muted fw-normal`,children:`(optional — enables email login)`}):`(Read-only)`]}),_?(0,m.jsx)(`input`,{className:`form-input-custom`,type:`email`,value:v,onChange:e=>y(e.target.value),placeholder:`your@email.com`}):(0,m.jsx)(`input`,{className:`form-input-custom`,type:`email`,value:g,readOnly:!0}),!_&&(0,m.jsx)(`p`,{className:`form-desc-custom`,children:`Account email address cannot be modified.`})]})]}),(0,m.jsx)(`div`,{className:`mt-4`,children:(0,m.jsx)(`button`,{type:`submit`,className:`btn-primary-custom`,disabled:b,children:b?`Saving Changes...`:`Save Changes`})})]})]})]})})}var g=()=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(f,{title:`Setting |2Deal- Online Saree & Ethnic Wear Store`,description:`2Deal - Online Saree & Ethnic Wear Store`}),(0,m.jsx)(u,{}),(0,m.jsx)(h,{})]});export{g as default};