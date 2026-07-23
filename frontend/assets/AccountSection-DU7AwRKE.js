import{S as e,T as t,s as n,w as r,x as i}from"./index-CFlLXPh7.js";function a(e){return null}var o=[{href:`/account-page`,label:`Dashboard`,icon:`icon-HouseLine`},{href:`/account-orders`,label:`My Orders`,icon:`icon-Package`},{href:`/account-addresses`,label:`My Addresses`,icon:`icon-storefront`},{href:`/account-setting`,label:`Settings`,icon:`icon-GearSix`},{href:`/account-wallet`,label:`My Wallet`,icon:`icon-Wallet`}],s=n();function c(){let{pathname:n}=r(),a=t(),{logout:c}=i();function l(){c(),a(`/`)}return(0,s.jsxs)(`div`,{className:`sidebar-account-custom`,children:[(0,s.jsx)(`style`,{children:`
        .sidebar-account-custom {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
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
          padding: 12px 18px;
          color: #666666;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          border-radius: 8px;
          background: transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none !important;
          width: 100%;
          text-align: left;
          border: none !important;
        }

        .link-account-custom .icon {
          font-size: 20px;
          color: #888888;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .link-account-custom:hover {
          color: #3ec1bc;
          background: #faf5f6;
        }

        .link-account-custom:hover .icon {
          color: #3ec1bc;
          transform: scale(1.05);
        }

        .link-account-custom.active {
          color: #3ec1bc;
          background: #faf0f2;
          font-weight: 600;
        }

        .link-account-custom.active .icon {
          color: #3ec1bc;
        }

        .logout-btn-custom {
          border-top: 1px dashed rgba(62, 193, 188, 0.1) !important;
          border-radius: 0 !important;
          margin-top: 12px;
          padding-top: 18px;
        }
      `}),(0,s.jsxs)(`div`,{className:`my-account-nav-custom`,children:[o.map(t=>{let r=n===t.href;return(0,s.jsxs)(e,{to:t.href,className:`link-account-custom ${r?`active`:``}`,children:[t.icon===`icon-Wallet`?(0,s.jsx)(`span`,{className:`icon`,style:{display:`flex`},children:(0,s.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.8`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,s.jsx)(`path`,{d:`M21 12V7H5a2 2 0 0 1 0-4h14v4`}),(0,s.jsx)(`path`,{d:`M3 5v14a2 2 0 0 0 2 2h16v-5`}),(0,s.jsx)(`path`,{d:`M18 12a2 2 0 0 0 0 4h4v-4Z`})]})}):(0,s.jsx)(`i`,{className:`icon ${t.icon}`}),(0,s.jsx)(`span`,{children:t.label})]},t.href)}),(0,s.jsxs)(`button`,{type:`button`,onClick:l,className:`link-account-custom logout-btn-custom`,children:[(0,s.jsx)(`i`,{className:`icon icon-SignOut`}),(0,s.jsx)(`span`,{children:`Logout`})]})]})]})}function l({title:t,sectionClassName:n=`flat-spacing`,children:r,customBreadcrumbs:i,hideSidebar:a=!1}){return(0,s.jsxs)(`section`,{className:n,style:{paddingTop:`30px`,paddingBottom:`60px`},children:[(0,s.jsx)(`style`,{children:`
        .classic-breadcrumb-wrapper {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .classic-breadcrumb-wrapper a, .classic-breadcrumb-wrapper .breadcrumb-link {
          color: #555;
          text-decoration: none !important;
          transition: color 0.2s ease;
        }
        .classic-breadcrumb-wrapper a:hover, .classic-breadcrumb-wrapper .breadcrumb-link:hover {
          color: #3ec1bc;
        }
        .classic-breadcrumb-wrapper .separator {
          color: #ccc;
          font-size: 11px;
          margin: 0 2px;
          display: inline-block;
        }
        .classic-breadcrumb-wrapper .current {
          color: #111;
          font-weight: 600;
        }
      `}),(0,s.jsx)(`div`,{className:`container`,children:(0,s.jsxs)(`div`,{className:`row`,children:[!a&&(0,s.jsx)(`div`,{className:`col-lg-3`,children:(0,s.jsx)(c,{})}),(0,s.jsxs)(`div`,{className:a?`col-lg-12`:`col-lg-9`,children:[i?(0,s.jsx)(`div`,{className:`classic-breadcrumb-wrapper`,children:i}):(0,s.jsxs)(`div`,{className:`classic-breadcrumb-wrapper`,children:[(0,s.jsx)(e,{to:`/`,children:`Home`}),(0,s.jsx)(`span`,{className:`separator`,children:`>`}),(0,s.jsx)(e,{to:`/account-page`,children:`My Account`}),t&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`span`,{className:`separator`,children:`>`}),(0,s.jsx)(`span`,{className:`current`,children:t})]})]}),(0,s.jsx)(`div`,{className:a?``:`my-account-content`,children:r})]})]})})]})}export{a as n,l as t};