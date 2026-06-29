import{n as e,o as t,s as n}from"./chunk-QFMPRPBF-BNQPla1W.js";import{t as r}from"./authStore-cePwo9pG.js";import{t as i}from"./jsx-runtime-DdEXjPBp.js";var a=i();function o({heading:t=`My Account`,description:n=`Manage your profile, track orders, and easily update your personal details anytime,`}){return(0,a.jsx)(`section`,{className:`section-page-title text-center flat-spacing-2 pb-0`,children:(0,a.jsx)(`div`,{className:`container`,children:(0,a.jsxs)(`div`,{className:`main-page-title`,children:[(0,a.jsxs)(`div`,{className:`breadcrumbs`,children:[(0,a.jsx)(e,{to:`/`,className:`text-caption-01 cl-text-3 link`,children:`Home`}),(0,a.jsx)(`i`,{className:`icon icon-CaretRightThin cl-text-3`}),(0,a.jsx)(`p`,{className:`text-caption-01`,children:t})]}),(0,a.jsx)(`h3`,{children:t}),(0,a.jsxs)(`p`,{className:`text-body-1 cl-text-2`,children:[n,(0,a.jsx)(`br`,{className:`d-none d-lg-block`}),`all in one convenient place.`]})]})})})}var s=[{href:`/account-page`,label:`Dashboard`,icon:`icon-HouseLine`},{href:`/account-orders`,label:`My Orders`,icon:`icon-Package`},{href:`/account-addresses`,label:`My Addresses`,icon:`icon-storefront`},{href:`/account-setting`,label:`Settings`,icon:`icon-GearSix`}];function c(){let{pathname:i}=t(),o=n(),{logout:c}=r();function l(){c(),o(`/`)}return(0,a.jsxs)(`div`,{className:`sidebar-account-custom`,children:[(0,a.jsx)(`style`,{children:`
        .sidebar-account-custom {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(193, 16, 105, 0.06);
          box-shadow: 0 8px 30px rgba(193, 16, 105, 0.03);
          padding: 16px 12px;
          margin-bottom: 30px;
          position: sticky;
          top: 100px;
        }

        .my-account-nav-custom {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .link-account-custom {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          color: #555555;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 500;
          border-radius: 10px;
          border-left: 3px solid transparent;
          background: transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none !important;
          width: 100%;
          text-align: left;
          border-top: none;
          border-right: none;
          border-bottom: none;
        }

        .link-account-custom .icon {
          font-size: 20px;
          color: #777777;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .link-account-custom:hover {
          color: #c11069;
          background: #fdfafb;
          border-left-color: rgba(193, 16, 105, 0.3);
        }

        .link-account-custom:hover .icon {
          color: #c11069;
          transform: translateX(2px);
        }

        .link-account-custom.active {
          color: #c11069;
          background: #faf0f2;
          font-weight: 600;
          border-left-color: #c11069;
        }

        .link-account-custom.active .icon {
          color: #c11069;
        }

        .logout-btn-custom {
          border-top: 1px dashed rgba(193, 16, 105, 0.1) !important;
          border-radius: 0 !important;
          margin-top: 12px;
          padding-top: 18px;
        }
      `}),(0,a.jsxs)(`div`,{className:`my-account-nav-custom`,children:[s.map(t=>{let n=i===t.href;return(0,a.jsxs)(e,{to:t.href,className:`link-account-custom ${n?`active`:``}`,children:[(0,a.jsx)(`i`,{className:`icon ${t.icon}`}),(0,a.jsx)(`span`,{children:t.label})]},t.href)}),(0,a.jsxs)(`button`,{type:`button`,onClick:l,className:`link-account-custom logout-btn-custom`,children:[(0,a.jsx)(`i`,{className:`icon icon-SignOut`}),(0,a.jsx)(`span`,{children:`Logout`})]})]})]})}function l({title:e,sectionClassName:t=`flat-spacing`,children:n}){return(0,a.jsx)(`section`,{className:t,children:(0,a.jsx)(`div`,{className:`container`,children:(0,a.jsxs)(`div`,{className:`row`,children:[(0,a.jsx)(`div`,{className:`col-lg-3`,children:(0,a.jsx)(c,{})}),(0,a.jsx)(`div`,{className:`col-lg-9`,children:(0,a.jsx)(`div`,{className:`my-account-content`,children:n})})]})})})}export{o as n,l as t};