import{y as i,o as l,n as p,j as c,L as r}from"./index-DwuSKPAv.js";function m(o){return null}const d=[{href:"/account-page",label:"Dashboard",icon:"icon-HouseLine"},{href:"/account-orders",label:"My Orders",icon:"icon-Package"},{href:"/account-addresses",label:"My Addresses",icon:"icon-storefront"},{href:"/account-setting",label:"Settings",icon:"icon-GearSix"},{href:"/account-wallet",label:"My Wallet",icon:"icon-Wallet"}];function u(){const{pathname:o}=i(),e=l(),{logout:s}=p();function n(){s(),e("/")}return c.jsxs("div",{className:"sidebar-account-custom",children:[c.jsx("style",{children:`
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
      `}),c.jsxs("div",{className:"my-account-nav-custom",children:[d.map(a=>{const t=o===a.href;return c.jsxs(r,{to:a.href,className:`link-account-custom ${t?"active":""}`,children:[a.icon==="icon-Wallet"?c.jsx("span",{className:"icon",style:{display:"flex"},children:c.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[c.jsx("path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4"}),c.jsx("path",{d:"M3 5v14a2 2 0 0 0 2 2h16v-5"}),c.jsx("path",{d:"M18 12a2 2 0 0 0 0 4h4v-4Z"})]})}):c.jsx("i",{className:`icon ${a.icon}`}),c.jsx("span",{children:a.label})]},a.href)}),c.jsxs("button",{type:"button",onClick:n,className:"link-account-custom logout-btn-custom",children:[c.jsx("i",{className:"icon icon-SignOut"}),c.jsx("span",{children:"Logout"})]})]})]})}function b({title:o,sectionClassName:e="flat-spacing",children:s,customBreadcrumbs:n,hideSidebar:a=!1}){return c.jsxs("section",{className:e,style:{paddingTop:"30px",paddingBottom:"60px"},children:[c.jsx("style",{children:`
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
      `}),c.jsx("div",{className:"container",children:c.jsxs("div",{className:"row",children:[!a&&c.jsx("div",{className:"col-lg-3",children:c.jsx(u,{})}),c.jsxs("div",{className:a?"col-lg-12":"col-lg-9",children:[n?c.jsx("div",{className:"classic-breadcrumb-wrapper",children:n}):c.jsxs("div",{className:"classic-breadcrumb-wrapper",children:[c.jsx(r,{to:"/",children:"Home"}),c.jsx("span",{className:"separator",children:">"}),c.jsx(r,{to:"/account-page",children:"My Account"}),o&&c.jsxs(c.Fragment,{children:[c.jsx("span",{className:"separator",children:">"}),c.jsx("span",{className:"current",children:o})]})]}),c.jsx("div",{className:a?"":"my-account-content",children:s})]})]})})]})}export{b as A,m as a};
