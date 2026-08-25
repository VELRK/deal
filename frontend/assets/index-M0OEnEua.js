import{l as x,r as s,m as g,a as f,j as e}from"./index-B59pIOF0.js";import{S as b}from"./Shop-CktL4LI9.js";import{P as u}from"./PageMeta-Cb5gV0n-.js";import"./ShopListingUi-DyAFEIBz.js";import"./index-CidjLA_k.js";import"./ProductCard-M6XeMvRl.js";import"./WishlistButton-D5PTsClA.js";import"./productViewStore-BRPit4Lv.js";function z(){const[l]=x(),t=l.get("category_slug")??"",[o,i]=s.useState(null);s.useEffect(()=>{if(!t){i(null);return}g.getAll().then(p=>{const h=p.data.data??[];let r=null;const a=m=>{for(const n of m){if(n.slug===t){r=n;return}if(n.children&&a(n.children),r)return}};a(h),i(r)}).catch(()=>i(null))},[t]);const c=o?.name??"Incense Cone Collection",d=o?.image_url?o.image_url:o?.image?f(o.image):"https://plain-apac-prod-public.komododecks.com/202607/04/kRRb75cQ5wV0IBnHrw04/image.png";return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:`${c} | 2Deal`,description:"Discover our sacred collection."}),e.jsx("style",{children:`
        /* Global Background Override for Shop Page */
        body {
          background-color: #fdfaf3 !important;
        }
        
        .shop-custom-banner {
          background: linear-gradient(to right, #dbcca8, #f5eadd);
          margin-top: 0;
          border-radius: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
          min-height: 380px;
          position: relative;
        }

        /* ... (previous styles) ... */
        .shop-banner-image-placeholder {
          flex: 1;
          height: 100%;
          min-height: 380px;
          background-color: #d9cec1;
          background-position: left center;
          background-size: cover;
          background-repeat: no-repeat;
          position: relative;
        }

        .shop-banner-content {
          flex: 1.2;
          padding: 40px;
          text-align: center;
          color: #432215;
          position: relative;
          z-index: 2;
        }

        .shop-banner-content h1 {
          font-family: 'Times New Roman', serif;
          font-size: 42px;
          font-style: italic;
          font-weight: 500;
          line-height: 1.2;
          margin-bottom: 15px;
          color: #452417;
        }


        .shop-banner-content h4 {
          font-size: 18px;
          color: #1a5951;
          display: inline-block;
          border-bottom: 1px solid #1a5951;
          padding-bottom: 6px;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .shop-banner-icons {
          display: flex;
          justify-content: center;
          gap: 50px;
        }

        .shop-banner-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .shop-banner-icon-circle {
          width: 50px;
          height: 50px;
          border: 1.5px solid #432215;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shop-banner-icon-item p {
          font-size: 13px;
          line-height: 1.4;
          font-weight: 500;
          margin: 0;
        }

        @media (max-width: 992px) {
          .shop-custom-banner {
            flex-direction: column;
            min-height: auto;
          }
          .shop-banner-image-placeholder {
            width: 100%;
            min-height: 250px;
          }
          .shop-banner-content {
            display: none !important;
          }
        }


        /* Shop Header Overrides */
        .flat-spacing {
          padding-top: 0 !important;
        }
        .tf-shop-control {
          background-color: #fdfaf3 !important;
          padding: 15px 0 !important;
          margin-top: 0 !important;
          margin-bottom: 30px !important;
          box-shadow: none !important;
          border-top: 1px solid #efe5d5 !important;
          border-bottom: 1px solid #efe5d5 !important;
          z-index: 100 !important;
          transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        header.header-sticky ~ * .tf-shop-control,
        header.header-sticky ~ .tf-shop-control {
          top: 85px !important;
        }
        .shop-default-top {
          display: none !important;
        }

      `}),e.jsx("div",{children:e.jsxs("div",{className:"shop-custom-banner",children:[e.jsx("div",{className:"shop-banner-image-placeholder",style:{backgroundImage:`url("${d}")`}}),e.jsxs("div",{className:"shop-banner-content",children:[e.jsxs("h1",{children:["Discover",e.jsx("br",{}),"golden2deal's",e.jsx("br",{}),o?.name?`${o.name} Collection`:"Incense Cone Collection"]}),e.jsx("h4",{children:"Made From Sacred Temple Flowers"}),e.jsxs("div",{className:"shop-banner-icons",children:[e.jsxs("div",{className:"shop-banner-icon-item",children:[e.jsx("div",{className:"shop-banner-icon-circle",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"}),e.jsx("path",{d:"M8 11.5c1.5 0 2.5-1 4-1s2.5 1 4 1"}),e.jsx("path",{d:"M12 15v-4"})]})}),e.jsxs("p",{children:["100%",e.jsx("br",{}),"Charcoal Free"]})]}),e.jsxs("div",{className:"shop-banner-icon-item",children:[e.jsx("div",{className:"shop-banner-icon-circle",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"}),e.jsx("path",{d:"M9 12h6"}),e.jsx("path",{d:"M12 9v6"})]})}),e.jsxs("p",{children:["Crafted By",e.jsx("br",{}),"Hand"]})]}),e.jsxs("div",{className:"shop-banner-icon-item",children:[e.jsx("div",{className:"shop-banner-icon-circle",children:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M10 2v7.31M14 2v7.31M8.5 2h7"}),e.jsx("path",{d:"M14 9.31a4 4 0 1 1-4 0"}),e.jsx("path",{d:"M5 21h14"}),e.jsx("path",{d:"M19 21v-4l-5-4v-4"}),e.jsx("path",{d:"M5 21v-4l5-4v-4"}),e.jsx("line",{x1:"2",y1:"2",x2:"22",y2:"22"})]})}),e.jsx("p",{children:"No Chemicals"})]})]})]})]})}),e.jsx(b,{variant:["infinityScroll"]})]})}export{z as default};
