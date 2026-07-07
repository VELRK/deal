import{C as e,E as t,S as n,T as r,c as i}from"./index-DCCHIcBT.js";var a=i();function o({heading:t=`My Account`,description:n=`Manage your profile, track orders, and easily update your personal details anytime,`}){return(0,a.jsxs)(`section`,{className:`section-page-title text-center pb-0 pt-4`,children:[(0,a.jsx)(`style`,{children:`
        .classic-page-title {
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111;
          margin-bottom: 12px;
          position: relative;
          display: inline-block;
        }
        .classic-page-title::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 2px;
          background-color: #3ec1bc;
          transition: width 0.3s ease;
        }
        .main-page-title:hover .classic-page-title::after {
          width: 50px;
        }
        .classic-page-desc {
          font-size: 0.85rem;
          color: #666;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
          letter-spacing: 0.02em;
        }
        .classic-breadcrumbs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
          color: #888;
        }
        .classic-breadcrumbs a {
          color: #111;
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 500;
        }
        .classic-breadcrumbs a:hover {
          color: #3ec1bc;
        }
      `}),(0,a.jsx)(`div`,{className:`container`,children:(0,a.jsxs)(`div`,{className:`main-page-title`,style:{padding:`20px 0 30px`},children:[(0,a.jsxs)(`div`,{className:`classic-breadcrumbs`,children:[(0,a.jsx)(e,{to:`/`,children:`Home`}),(0,a.jsx)(`span`,{style:{fontSize:`10px`,color:`#ccc`},children:`/`}),(0,a.jsx)(`span`,{style:{color:`#999`},children:t})]}),(0,a.jsx)(`h1`,{className:`classic-page-title`,children:t}),(0,a.jsxs)(`p`,{className:`classic-page-desc`,children:[n,(0,a.jsx)(`br`,{className:`d-none d-lg-block`}),`all in one convenient place.`]})]})})]})}var s=[{href:`/account-page`,label:`Dashboard`,icon:`icon-HouseLine`},{href:`/account-orders`,label:`My Orders`,icon:`icon-Package`},{href:`/account-addresses`,label:`My Addresses`,icon:`icon-storefront`},{href:`/account-setting`,label:`Settings`,icon:`icon-GearSix`}];function c(){let{pathname:i}=r(),o=t(),{logout:c}=n();function l(){c(),o(`/`)}return(0,a.jsxs)(`div`,{className:`sidebar-account-custom`,children:[(0,a.jsx)(`style`,{children:`
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
          color: #3ec1bc;
          background: #fdfafb;
          border-left-color: #3ec1bc;
        }

        .link-account-custom:hover .icon {
          color: #3ec1bc;
          transform: translateX(2px);
        }

        .link-account-custom.active {
          color: #3ec1bc;
          background: #faf0f2;
          font-weight: 600;
          border-left-color: #3ec1bc;
        }

        .link-account-custom.active .icon {
          color: #3ec1bc;
        }

        .logout-btn-custom {
          border-top: 1px dashed rgba(193, 16, 105, 0.1) !important;
          border-radius: 0 !important;
          margin-top: 12px;
          padding-top: 18px;
        }
      `}),(0,a.jsxs)(`div`,{className:`my-account-nav-custom`,children:[s.map(t=>{let n=i===t.href;return(0,a.jsxs)(e,{to:t.href,className:`link-account-custom ${n?`active`:``}`,children:[(0,a.jsx)(`i`,{className:`icon ${t.icon}`}),(0,a.jsx)(`span`,{children:t.label})]},t.href)}),(0,a.jsxs)(`button`,{type:`button`,onClick:l,className:`link-account-custom logout-btn-custom`,children:[(0,a.jsx)(`i`,{className:`icon icon-SignOut`}),(0,a.jsx)(`span`,{children:`Logout`})]})]})]})}function l({title:e,sectionClassName:t=`flat-spacing`,children:n}){return(0,a.jsx)(`section`,{className:t,children:(0,a.jsx)(`div`,{className:`container`,children:(0,a.jsxs)(`div`,{className:`row`,children:[(0,a.jsx)(`div`,{className:`col-lg-3`,children:(0,a.jsx)(c,{})}),(0,a.jsx)(`div`,{className:`col-lg-9`,children:(0,a.jsx)(`div`,{className:`my-account-content`,children:n})})]})})})}export{o as n,l as t};