import{n as e}from"./store-B6PDfdRl.js";import{C as t,a as n,c as r,l as i,t as a}from"./index-CnLeq_4D.js";import{t as o}from"./PageMeta-CyS8ELM3.js";import{n as s}from"./shop-DFypr1Uc.js";var c=r();function l(){return(0,c.jsx)(c.Fragment,{children:(0,c.jsx)(`section`,{className:`section-page-title text-center flat-spacing-2 pb-0`,children:(0,c.jsx)(`div`,{className:`container`,children:(0,c.jsxs)(`div`,{className:`main-page-title`,children:[(0,c.jsxs)(`div`,{className:`breadcrumbs`,children:[(0,c.jsx)(t,{to:`/`,className:`text-caption-01 cl-text-3 link`,children:`Home`}),(0,c.jsx)(`i`,{className:`icon icon-CaretRightThin cl-text-3`}),(0,c.jsx)(`p`,{className:`text-caption-01`,children:`Your Wishlist`})]}),(0,c.jsx)(`h3`,{children:`Your Wishlist`}),(0,c.jsxs)(`p`,{className:`text-body-1 cl-text-2`,children:[`Explore your saved favorites, manage your wishlist effortlessly,`,(0,c.jsx)(`br`,{className:`d-none d-lg-block`}),`and keep track of the items you love most.`]})]})})})})}function u({product:r,removeFromWishlist:i}){let o=r.img||`/deal/frontend/assets/images/product/product-1.jpg`;return(0,c.jsxs)(`div`,{className:`classic-wishlist-item`,children:[(0,c.jsx)(`div`,{className:`wishlist-item-image`,children:(0,c.jsx)(t,{to:`/product-detail/${r.id}`,children:(0,c.jsx)(`img`,{loading:`lazy`,src:o,alt:r.name})})}),(0,c.jsxs)(`div`,{className:`wishlist-item-details`,children:[(0,c.jsx)(t,{to:`/product-detail/${r.id}`,className:`wishlist-item-name`,children:r.name}),(0,c.jsxs)(`div`,{className:`wishlist-item-price`,children:[(0,c.jsx)(`span`,{className:`current-price`,children:a(r.price)}),r.priceOld&&(0,c.jsx)(`span`,{className:`old-price`,children:a(r.priceOld)})]}),(0,c.jsxs)(`div`,{className:`wishlist-item-stock`,children:[(0,c.jsx)(`span`,{className:`status-dot`}),` In Stock`]})]}),(0,c.jsxs)(`div`,{className:`wishlist-item-actions`,children:[(0,c.jsx)(`button`,{type:`button`,className:`classic-btn-primary`,onClick:t=>{t.preventDefault();let{setQuickAddItem:i,setQuickAddProduct:a}=e.getState();i(r.id),a(r),n.getState().openModal(`quickAdd`)},children:`ADD TO CART`}),(0,c.jsxs)(`button`,{type:`button`,className:`classic-btn-remove`,onClick:()=>i(r.id),children:[(0,c.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,c.jsx)(`path`,{d:`M18 6L6 18`}),(0,c.jsx)(`path`,{d:`M6 6l12 12`})]}),`REMOVE`]})]})]})}function d(){let{items:e,toggle:n,loading:r}=i(),a=t=>{let r=e.find(e=>e.id===t);r&&n(r)};return(0,c.jsxs)(`div`,{className:`section-wishlist flat-spacing-2`,children:[(0,c.jsx)(`style`,{children:`
        .classic-wishlist-container {
          max-width: 1000px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .classic-wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 30px;
        }
        .classic-wishlist-title {
          font-size: 1.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #111;
          margin: 0;
        }
        .classic-wishlist-count {
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .classic-wishlist-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .classic-wishlist-item {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .classic-wishlist-item:hover {
          border-color: #ddd;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transform: translateY(-2px);
        }
        .wishlist-item-image {
          width: 100px;
          height: 133px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background: #f9f9f9;
        }
        .wishlist-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .classic-wishlist-item:hover .wishlist-item-image img {
          transform: scale(1.05);
        }
        .wishlist-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wishlist-item-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: color 0.2s;
        }
        .wishlist-item-name:hover {
          color: #3ec1bc;
        }
        .wishlist-item-price {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .current-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111;
        }
        .old-price {
          font-size: 0.95rem;
          color: #999;
          text-decoration: line-through;
        }
        .wishlist-item-stock {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #15803d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #15803d;
        }
        .wishlist-item-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
          min-width: 160px;
        }
        .classic-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #111;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid #111;
          width: 100%;
        }
        .classic-btn-primary:hover {
          background: #fff;
          color: #111;
        }
        .classic-btn-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          color: #666;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 8px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .classic-btn-remove:hover {
          color: #dc2626;
        }
        .empty-wishlist {
          text-align: center;
          padding: 80px 20px;
          background: #fdfdfd;
          border: 1px dashed #e5e5e5;
          border-radius: 16px;
        }
        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          color: #ccc;
        }
        @media (max-width: 768px) {
          .classic-wishlist-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .wishlist-item-actions {
            width: 100%;
            align-items: stretch;
            flex-direction: row;
            justify-content: space-between;
          }
          .classic-btn-primary {
            flex: 1;
          }
        }
      `}),(0,c.jsx)(`div`,{className:`container`,children:(0,c.jsxs)(`div`,{className:`classic-wishlist-container`,children:[(0,c.jsxs)(`div`,{className:`classic-wishlist-header`,children:[(0,c.jsx)(`h2`,{className:`classic-wishlist-title`,children:`My Wishlist`}),(0,c.jsxs)(`span`,{className:`classic-wishlist-count`,children:[e.length,` `,e.length===1?`Item`:`Items`]})]}),r?(0,c.jsx)(`div`,{className:`d-flex justify-content-center py-5`,children:(0,c.jsx)(`div`,{className:`spinner-border text-secondary`,role:`status`})}):e&&e.length>0?(0,c.jsx)(`div`,{className:`classic-wishlist-list`,children:e.map(e=>(0,c.jsx)(u,{product:e,removeFromWishlist:a},e.id))}):(0,c.jsxs)(`div`,{className:`empty-wishlist`,children:[(0,c.jsx)(`svg`,{className:`empty-icon`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,c.jsx)(`path`,{d:`M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z`})}),(0,c.jsx)(`h3`,{className:`mb-3`,style:{fontSize:`1.25rem`,fontWeight:600,color:`#111`},children:`Your wishlist is empty`}),(0,c.jsx)(`p`,{className:`mb-4`,style:{color:`#666`,fontSize:`0.95rem`},children:`You haven't added any products to your wishlist yet.`}),(0,c.jsx)(t,{to:`/shop-default`,className:`classic-btn-primary`,style:{display:`inline-flex`,width:`auto`},children:`Return to Shop`})]})]})})]})}var f=s(`Wishlist`,`Review and manage products you have saved for later.`),p=()=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(o,{title:f.title,description:f.description}),(0,c.jsx)(l,{}),(0,c.jsx)(d,{})]});export{p as default};