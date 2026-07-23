import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{a as n}from"./api-C_c3O5NQ.js";import{D as r,s as i,u as a}from"./index-CFlLXPh7.js";import{t as o}from"./PageMeta-CyS8ELM3.js";import{t as s}from"./Shop-Cz-j8e3Z.js";var c=e(t(),1),l=i();function u(){let[e]=r(),t=e.get(`category_slug`)??``,[i,u]=(0,c.useState)(null);(0,c.useEffect)(()=>{if(!t){u(null);return}n.getAll().then(e=>{let n=e.data.data??[],r=null,i=e=>{for(let n of e){if(n.slug===t){r=n;return}if(n.children&&i(n.children),r)return}};i(n),u(r)}).catch(()=>u(null))},[t]);let d=i?.name??`Incense Cone Collection`,f=i?.image_url?i.image_url:i?.image?a(i.image):`https://plain-apac-prod-public.komododecks.com/202607/04/kRRb75cQ5wV0IBnHrw04/image.png`;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(o,{title:`${d} | 2Deal`,description:`Discover our sacred collection.`}),(0,l.jsx)(`style`,{children:`
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
          }
          .shop-banner-image-placeholder {
            width: 100%;
            min-height: 250px;
          }
          .shop-banner-content h1 { font-size: 32px; }
          .shop-banner-icons { gap: 20px; flex-wrap: wrap; }
        }

        /* --- Product Card Overrides to Match Mockup --- */
        .card-product {
          background-color: transparent !important;
          border: none !important;
          padding: 10px;
        }
        .card-product_img {
          border-radius: 4px !important;
          overflow: hidden;
        }
        /* Style the badge */
        .card-product .on-sale {
          background-color: #6a1b21 !important;
          color: #fff !important;
          border-radius: 2px !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
          font-size: 11px !important;
          top: 10px !important;
          left: 10px !important;
        }
        /* Force action buttons to bottom */
        .card-product .list-product-btn {
          position: relative !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          display: block !important;
          width: 100%;
          margin-top: 15px;
          gap: 0 !important;
          background: transparent !important;
        }
        /* Add to cart button */
        .card-product .list-product-btn .box-icon:first-child {
          width: 100% !important;
          height: auto !important;
          background-color: #6a1b21 !important;
          color: #fff !important;
          border-radius: 4px !important;
          padding: 10px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        /* Hide other quick action icons */
        .card-product .list-product-btn .box-icon:not(:first-child) {
          display: none !important;
        }
        /* Product info layout */
        .card-product_info {
          padding-top: 15px !important;
          text-align: left !important;
        }
        .card-product .title {
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #333 !important;
          margin-top: 5px !important;
          margin-bottom: 5px !important;
        }
        .card-product .price {
          font-size: 15px !important;
          color: #333 !important;
          font-weight: 600 !important;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-start !important;
        }
        .card-product .price .price-old {
          font-size: 13px !important;
          color: #999 !important;
          font-weight: normal !important;
          text-decoration: line-through !important;
        }
        
        /* Shop Header Overrides */
        .tf-shop-control {
          background-color: #fdfaf3 !important;
          padding: 15px 0 !important;
          margin-top: 40px !important;
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

      `}),(0,l.jsx)(`div`,{children:(0,l.jsxs)(`div`,{className:`shop-custom-banner`,children:[(0,l.jsx)(`div`,{className:`shop-banner-image-placeholder`,style:{backgroundImage:`url("${f}")`}}),(0,l.jsxs)(`div`,{className:`shop-banner-content`,children:[(0,l.jsxs)(`h1`,{children:[`Discover`,(0,l.jsx)(`br`,{}),`golden2deal's`,(0,l.jsx)(`br`,{}),i?.name?`${i.name} Collection`:`Incense Cone Collection`]}),(0,l.jsx)(`h4`,{children:`Made From Sacred Temple Flowers`}),(0,l.jsxs)(`div`,{className:`shop-banner-icons`,children:[(0,l.jsxs)(`div`,{className:`shop-banner-icon-item`,children:[(0,l.jsx)(`div`,{className:`shop-banner-icon-circle`,children:(0,l.jsxs)(`svg`,{width:`24`,height:`24`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,l.jsx)(`path`,{d:`M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z`}),(0,l.jsx)(`path`,{d:`M8 11.5c1.5 0 2.5-1 4-1s2.5 1 4 1`}),(0,l.jsx)(`path`,{d:`M12 15v-4`})]})}),(0,l.jsxs)(`p`,{children:[`100%`,(0,l.jsx)(`br`,{}),`Charcoal Free`]})]}),(0,l.jsxs)(`div`,{className:`shop-banner-icon-item`,children:[(0,l.jsx)(`div`,{className:`shop-banner-icon-circle`,children:(0,l.jsxs)(`svg`,{width:`24`,height:`24`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,l.jsx)(`path`,{d:`M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z`}),(0,l.jsx)(`path`,{d:`M9 12h6`}),(0,l.jsx)(`path`,{d:`M12 9v6`})]})}),(0,l.jsxs)(`p`,{children:[`Crafted By`,(0,l.jsx)(`br`,{}),`Hand`]})]}),(0,l.jsxs)(`div`,{className:`shop-banner-icon-item`,children:[(0,l.jsx)(`div`,{className:`shop-banner-icon-circle`,children:(0,l.jsxs)(`svg`,{width:`24`,height:`24`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,children:[(0,l.jsx)(`path`,{d:`M10 2v7.31M14 2v7.31M8.5 2h7`}),(0,l.jsx)(`path`,{d:`M14 9.31a4 4 0 1 1-4 0`}),(0,l.jsx)(`path`,{d:`M5 21h14`}),(0,l.jsx)(`path`,{d:`M19 21v-4l-5-4v-4`}),(0,l.jsx)(`path`,{d:`M5 21v-4l5-4v-4`}),(0,l.jsx)(`line`,{x1:`2`,y1:`2`,x2:`22`,y2:`22`})]})}),(0,l.jsx)(`p`,{children:`No Chemicals`})]})]})]})]})}),(0,l.jsx)(s,{variant:[`infinityScroll`]})]})}export{u as default};