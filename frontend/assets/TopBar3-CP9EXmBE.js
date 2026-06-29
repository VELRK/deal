import{r as e}from"./chunk-DECur_0Z.js";import{t}from"./react-DhTzgwgF.js";import{n}from"./chunk-QFMPRPBF-BNQPla1W.js";import{t as r}from"./authStore-cePwo9pG.js";import{d as i,o as a,s as o,t as s}from"./useApi-D8wOgl2I.js";import{t as c}from"./jsx-runtime-DdEXjPBp.js";import{t as l}from"./CartIconCount-DlNQadOX.js";var u={supportLabel:`24/7 Support Center:`,phone:`+91 95972 20129`,phoneHref:`tel:+919597220129`,address:`Opp to SNS Tech Arch, Sathy Main Road, Saravanampatti Post, Coimbatore – 641035`,addressHref:`https://www.google.com/maps?q=Saravanampatti,Coimbatore`,email:`info@indianladiesfashion.in`},d={title:`COMPANY`,links:[{label:`About Us`,href:`/about`},{label:`Contact Us`,href:`/contact`},{label:`Blog`,href:`/blog`},{label:`My Account`,href:`/account-page`}]},f={title:`CUSTOMER`,links:[{label:`Track Order`,href:`/track-order`},{label:`Return & Refund`,href:`/return-refund`},{label:`Privacy Policy`,href:`/privacy-policy`},{label:`Terms & Conditions`,href:`/terms-and-conditions`},{label:`Orders FAQs`,href:`/orders-faq`}]},p={title:`MY ACCOUNT`,links:[{label:`Login`,href:`/login`},{label:`Sign up`,href:`/register`},{label:`My Account`,href:`/account-page`},{label:`My Orders`,href:`/account-orders`},{label:`Wish List`,href:`/wishlist`},{label:`View Cart`,href:`/view-cart`}]},m=[{src:`/deal/frontend/assets/images/payment/visa.svg`,alt:`Visa`},{src:`/deal/frontend/assets/images/payment/master-card.svg`,alt:`Mastercard`},{src:`/deal/frontend/assets/images/payment/amex.svg`,alt:`Amex`},{src:`/deal/frontend/assets/images/payment/paypal.svg`,alt:`PayPal`},{src:`/deal/frontend/assets/images/payment/discover.svg`,alt:`Discover`}],h=e(t(),1),g=c(),_=`(max-width: 575px)`,v=(0,h.createContext)(null);function y(){let e=(0,h.useContext)(v);if(!e)throw Error(`FooterAccordionItem must be used inside FooterAccordionWrapper`);return e}function b({children:e}){let[t,n]=(0,h.useState)(!1),[r,i]=(0,h.useState)({});(0,h.useEffect)(()=>{let e=window.matchMedia(_),t=()=>n(e.matches);return t(),e.addEventListener(`change`,t),()=>e.removeEventListener(`change`,t)},[]);let a={isMobile:t,isOpen:e=>!!r[e],toggle:e=>{t&&i(t=>({...t,[e]:!t[e]}))}};return(0,g.jsx)(v.Provider,{value:a,children:e})}function x({id:e,className:t,heading:n,headingClassName:r,children:i}){let{isMobile:a,isOpen:o,toggle:s}=y(),c=a&&o(e);return(0,g.jsxs)(`div`,{className:`${t} ${c?`open`:``}`.trim(),children:[(0,g.jsx)(`button`,{type:`button`,className:`${r} border-0 bg-transparent p-0 w-100 text-start`,"aria-controls":e,"aria-expanded":a?c:!0,onClick:()=>s(e),children:n}),(0,g.jsx)(`div`,{id:e,className:`tf-collapse-content`,children:i})]})}function S({parentClass:e=`tf-footer footer-s5`}){let t=e=>e.split(` `).map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(` `);return(0,g.jsxs)(`footer`,{className:`${e} luxury-fashion-footer`,style:{backgroundColor:`#faf0f2`,padding:`60px 0 30px 0`,fontFamily:`'Outfit', sans-serif`},children:[(0,g.jsx)(`style`,{children:`
        .luxury-fashion-footer {
          background-color: #faf0f2 !important;
          color: #222222 !important;
          padding: 60px 0 30px 0 !important;
        }
        
        .luxury-footer-body {
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          position: relative;
          padding: 0 !important;
          box-shadow: none !important;
        }

        .luxury-footer-col {
          padding: 0 15px;
          margin-bottom: 30px;
        }

        .footer-brand-info {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        .footer-logo {
          max-width: 100px !important;
          height: auto !important;
          display: block !important;
          margin-bottom: 14px !important;
          border-radius: 50% !important;
        }

        .luxury-tagline {
          font-size: 13px !important;
          color: #555555 !important;
          margin-bottom: 12px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;
        }

        .luxury-brand-contact {
          font-size: 13px !important;
          color: #555555 !important;
          margin-bottom: 22px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }

        .luxury-brand-contact-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
          line-height: 1.4 !important;
        }

        .luxury-brand-contact-item a {
          color: #555555 !important;
          text-decoration: none !important;
          transition: color 0.25s ease !important;
        }

        .luxury-brand-contact-item a:hover {
          color: #c11069 !important;
        }

        .luxury-brand-icon {
          color: #c11069 !important;
          font-size: 14px !important;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .luxury-social-list {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .luxury-social-link {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 34px !important;
          height: 34px !important;
          background-color: #c11069 !important;
          color: #ffffff !important;
          border-radius: 50% !important;
          font-size: 14px !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          text-decoration: none !important;
        }

        .luxury-social-link:hover {
          background-color: #920b4e !important;
          transform: translateY(-3px) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 8px rgba(193, 16, 105, 0.25) !important;
        }

        .luxury-footer-heading {
          color: #111111 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          margin-bottom: 20px !important;
          text-transform: capitalize !important;
          letter-spacing: 0.05em !important;
          position: relative !important;
          display: block !important;
          width: 100% !important;
          border-bottom: none !important;
        }

        .luxury-footer-heading::after {
          display: none !important;
        }

        .luxury-footer-links {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .luxury-footer-links li {
          margin-bottom: 10px !important;
        }

        .luxury-footer-link {
          color: #555555 !important;
          font-size: 13px !important;
          text-decoration: none !important;
          transition: all 0.25s ease !important;
          display: inline-block !important;
        }

        .luxury-footer-link:hover {
          color: #c11069 !important;
          transform: translateX(4px) !important;
        }

        .luxury-footer-bottom {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          padding-top: 25px !important;
          border-top: 1px solid rgba(193, 16, 105, 0.08) !important;
          margin-top: 30px !important;
          gap: 15px !important;
        }

        .luxury-copyright {
          font-size: 12px !important;
          color: #666666 !important;
          margin: 0 !important;
          text-align: center !important;
          letter-spacing: 0.02em !important;
        }

        .luxury-payment-list {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .luxury-payment-list img {
          opacity: 0.85 !important;
          transition: all 0.3s ease !important;
          border-radius: 3px;
          width: 38px !important;
          height: 24px !important;
        }

        .luxury-payment-list img:hover {
          opacity: 1 !important;
          transform: scale(1.08) !important;
        }

        @media (max-width: 767px) {
          .luxury-fashion-footer {
            padding: 40px 0 20px 0 !important;
          }
          .luxury-footer-col {
            margin-bottom: 25px;
          }
          .footer-brand-info {
            align-items: center !important;
            text-align: center !important;
            margin-bottom: 20px !important;
          }
          .luxury-social-list {
            justify-content: center !important;
          }
        }

        @media (max-width: 575px) {
          .luxury-footer-heading {
            position: relative !important;
            padding-right: 20px !important;
            margin-bottom: 0 !important;
            padding-top: 14px !important;
            padding-bottom: 14px !important;
            border-bottom: 1px solid rgba(193, 16, 105, 0.06) !important;
          }

          .luxury-footer-heading::before {
            content: "+";
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #c11069;
            font-size: 16px;
            transition: transform 0.3s ease;
          }
          
          .footer-col-block.open .luxury-footer-heading::before {
            content: "−";
            transform: translateY(-50%) rotate(180deg);
          }

          .footer-col-block .tf-collapse-content {
            padding-top: 14px !important;
            padding-bottom: 14px !important;
            border-bottom: 1px solid rgba(193, 16, 105, 0.04) !important;
          }
        }
      `}),(0,g.jsx)(`div`,{className:`container`,children:(0,g.jsxs)(`div`,{className:`luxury-footer-body`,children:[(0,g.jsx)(b,{children:(0,g.jsxs)(`div`,{className:`row`,children:[(0,g.jsx)(`div`,{className:`col-lg-3 col-md-6 luxury-footer-col`,children:(0,g.jsxs)(`div`,{className:`footer-brand-info`,children:[(0,g.jsx)(n,{to:`/`,className:`logo-site mb-16 d-block`,children:(0,g.jsx)(`img`,{loading:`lazy`,width:100,src:`/deal/frontend/assets/logo/logo.png`,alt:`Indian Ladies Fashion`,className:`footer-logo`})}),(0,g.jsx)(`p`,{className:`luxury-tagline`,children:`Explore the art of fashion`}),(0,g.jsxs)(`div`,{className:`luxury-brand-contact`,children:[(0,g.jsxs)(`div`,{className:`luxury-brand-contact-item`,children:[(0,g.jsx)(`span`,{className:`luxury-brand-icon`,children:`📍`}),(0,g.jsx)(`a`,{href:u.addressHref,target:`_blank`,rel:`noopener noreferrer`,children:u.address})]}),(0,g.jsxs)(`div`,{className:`luxury-brand-contact-item`,children:[(0,g.jsx)(`span`,{className:`luxury-brand-icon`,children:`📞`}),(0,g.jsx)(`a`,{href:u.phoneHref,children:u.phone})]}),(0,g.jsxs)(`div`,{className:`luxury-brand-contact-item`,children:[(0,g.jsx)(`span`,{className:`luxury-brand-icon`,children:`✉️`}),(0,g.jsx)(`a`,{href:`mailto:${u.email}`,children:u.email})]})]}),(0,g.jsxs)(`ul`,{className:`luxury-social-list`,children:[(0,g.jsx)(`li`,{children:(0,g.jsx)(`a`,{href:`https://www.instagram.com/`,target:`_blank`,rel:`noopener noreferrer`,className:`luxury-social-link`,children:(0,g.jsx)(`i`,{className:`icon icon-InstagramLogo`})})}),(0,g.jsx)(`li`,{children:(0,g.jsx)(`a`,{href:`https://www.facebook.com/`,target:`_blank`,rel:`noopener noreferrer`,className:`luxury-social-link`,children:(0,g.jsx)(`i`,{className:`icon icon-FacebookLogo`})})}),(0,g.jsx)(`li`,{children:(0,g.jsx)(`a`,{href:`https://x.com/`,target:`_blank`,rel:`noopener noreferrer`,className:`luxury-social-link`,children:(0,g.jsx)(`i`,{className:`icon icon-XLogo`})})})]})]})}),(0,g.jsx)(`div`,{className:`col-lg-3 col-md-6 luxury-footer-col`,children:(0,g.jsx)(x,{id:`footer9-company`,className:`footer-col-block`,heading:t(d.title),headingClassName:`luxury-footer-heading`,children:(0,g.jsx)(`ul`,{className:`luxury-footer-links`,children:d.links.map(e=>(0,g.jsx)(`li`,{children:(0,g.jsx)(n,{to:e.href,className:`luxury-footer-link`,children:e.label})},e.href+e.label))})})}),(0,g.jsx)(`div`,{className:`col-lg-3 col-md-6 luxury-footer-col`,children:(0,g.jsx)(x,{id:`footer9-customer`,className:`footer-col-block`,heading:t(f.title),headingClassName:`luxury-footer-heading`,children:(0,g.jsx)(`ul`,{className:`luxury-footer-links`,children:f.links.map(e=>(0,g.jsx)(`li`,{children:(0,g.jsx)(n,{to:e.href,className:`luxury-footer-link`,children:e.label})},e.href+e.label))})})}),(0,g.jsx)(`div`,{className:`col-lg-3 col-md-6 luxury-footer-col`,children:(0,g.jsx)(x,{id:`footer9-account`,className:`footer-col-block`,heading:t(p.title),headingClassName:`luxury-footer-heading`,children:(0,g.jsx)(`ul`,{className:`luxury-footer-links`,children:p.links.map(e=>(0,g.jsx)(`li`,{children:(0,g.jsx)(n,{to:e.href,className:`luxury-footer-link`,children:e.label})},e.href+e.label))})})})]})}),(0,g.jsxs)(`div`,{className:`luxury-footer-bottom`,children:[(0,g.jsxs)(`p`,{className:`luxury-copyright`,children:[`©`,new Date().getFullYear(),` Indian Ladies Fashion. All Rights Reserved.`]}),(0,g.jsx)(`ul`,{className:`luxury-payment-list`,children:m.map(e=>(0,g.jsx)(`li`,{children:(0,g.jsx)(`img`,{src:e.src,alt:e.alt,width:38,height:24,loading:`lazy`})},e.src))})]})]})})]})}function C({hasText:e=!1}){let{isLoggedIn:t,user:i}=r(),[a,o]=(0,h.useState)(!1);return(0,h.useEffect)(()=>{o(!0)},[]),a?t?(0,g.jsxs)(n,{to:`/account-page`,className:`nav-icon-item link ${e?`has-text`:``}`,children:[(0,g.jsx)(`i`,{className:`icon icon-User`}),e&&(0,g.jsxs)(`span`,{className:`d-none d-xl-block`,children:[` `,i?.name?.split(` `)[0]??`Account`,` `]})]}):(0,g.jsxs)(`a`,{href:`#sign`,"data-bs-toggle":`modal`,className:`nav-icon-item link ${e?`has-text`:``}`,children:[(0,g.jsx)(`i`,{className:`icon icon-User`}),e&&(0,g.jsx)(`span`,{className:`d-none d-xl-block`,children:` Login/Register `})]}):null}function w(e){return`/shop-default?category_id=${e.id}`}function T(e){return`/shop-default?subcategory_id=${e.id}`}function E({variant2:e=!1,variant3:t=!1}){let{categories:r}=a();return o(2),r.length?(0,g.jsx)(g.Fragment,{children:r.map(e=>{let t=(e.children??[]).length>0,r={};(e.children??[]).forEach(e=>{let t=e.mega_group||`All`;r[t]||(r[t]=[]),r[t].push(e)});let i=Object.keys(r);return(0,g.jsxs)(`li`,{className:`menu-item`,children:[(0,g.jsxs)(n,{to:w(e),className:`item-link`,style:{whiteSpace:`nowrap`},children:[(0,g.jsx)(`span`,{className:`text cus-text`,children:e.name}),t&&(0,g.jsx)(`i`,{className:`icon icon-CaretDown`,"aria-hidden":!0})]}),t&&(0,g.jsx)(`div`,{className:`sub-menu mega-menu`,children:(0,g.jsx)(`div`,{className:`container-full`,children:(0,g.jsxs)(`div`,{className:`row`,children:[i.map(t=>(0,g.jsx)(`div`,{className:`col-2`,children:(0,g.jsxs)(`div`,{className:`mega-menu-item menu-lv-2`,children:[(0,g.jsx)(`p`,{className:`menu-heading`,children:t===`All`?e.name:t}),(0,g.jsx)(`ul`,{className:`sub-menu_list`,children:r[t].map(e=>(0,g.jsx)(`li`,{children:(0,g.jsx)(n,{to:T(e),className:`sub-menu_link has-text`,children:(0,g.jsx)(`span`,{className:`cus-text`,children:e.name})})},e.id))})]})},t)),e.nav_products&&e.nav_products.length>0&&(0,g.jsxs)(`div`,{className:`col-4 d-none d-lg-block`,children:[(0,g.jsx)(`p`,{className:`menu-heading mb-12`,children:`Featured`}),(0,g.jsx)(`div`,{style:{display:`flex`,gap:12},children:e.nav_products.slice(0,4).map(e=>(0,g.jsxs)(n,{to:`/product-detail/${e.id}`,style:{flex:1,textDecoration:`none`,color:`inherit`,minWidth:0},children:[(0,g.jsx)(`img`,{src:e.thumbnail_url||s(e.thumbnail),alt:e.name,style:{width:`100%`,aspectRatio:`3/4`,objectFit:`cover`,borderRadius:6,display:`block`,marginBottom:8}}),(0,g.jsx)(`span`,{className:`text-line-clamp-2 d-block`,style:{fontSize:12,fontWeight:500,color:`#111`,marginBottom:4,lineHeight:1.4},children:e.name}),(0,g.jsxs)(`div`,{children:[(0,g.jsxs)(`span`,{style:{fontSize:12,fontWeight:700,color:`#f59e0b`},children:[`₹`,Number(e.sale_price??e.price).toLocaleString()]}),e.sale_price!=null&&(0,g.jsxs)(`span`,{style:{fontSize:11,color:`#999`,textDecoration:`line-through`,marginLeft:5},children:[`₹`,Number(e.price).toLocaleString()]})]})]},e.id))})]})]})})})]},e.id)})}):null}var D=250;function O(e=D){let[t,n]=(0,h.useState)(!1),r=(0,h.useRef)(0);return(0,h.useEffect)(()=>{r.current=window.scrollY;let t=()=>{let t=window.scrollY,i=t<r.current;r.current=t,t>e&&i?n(!0):(t<=e||!i)&&n(!1)};return window.addEventListener(`scroll`,t,{passive:!0}),()=>window.removeEventListener(`scroll`,t)},[e]),t}function k(){let e=O();return(0,g.jsx)(`header`,{className:`tf-header header-s2 scr-box-shadow${e?` header-sticky`:``}`,style:{top:e?`0px`:`-200px`,transition:`top 0.3s ease-in-out`},children:(0,g.jsx)(`div`,{className:`container-full`,children:(0,g.jsxs)(`div`,{className:`header-inner`,style:{padding:`0`,minHeight:`50px`},children:[(0,g.jsx)(`div`,{className:`box-open-menu-mobile d-xl-none`,children:(0,g.jsx)(`a`,{href:`#mobileMenu`,"data-bs-toggle":`offcanvas`,className:`btn-open-menu`,children:(0,g.jsx)(`i`,{className:`icon icon-List`})})}),(0,g.jsxs)(`div`,{className:`header-left d-flex align-items-center`,children:[(0,g.jsx)(n,{to:`/`,className:`logo-site flex-shrink-0 me-4`,children:(0,g.jsx)(`img`,{loading:`lazy`,src:`/deal/frontend/assets/logo/logo.png`,alt:`Indian Ladies Fashion`,style:{width:`80px`,height:`80px`,objectFit:`contain`}})}),(0,g.jsx)(`span`,{className:`d-none d-xl-block flex-shrink-0 me-4`,style:{width:1,height:24,background:`#e5e7eb`}}),(0,g.jsx)(`nav`,{className:`box-navigation d-none d-xl-block`,children:(0,g.jsx)(`ul`,{className:`box-nav-menu`,children:(0,g.jsx)(E,{})})})]}),(0,g.jsx)(`div`,{className:`header-right`,children:(0,g.jsxs)(`ul`,{className:`nav-icon-list`,children:[(0,g.jsx)(`li`,{className:`d-none d-sm-block`,children:(0,g.jsx)(`a`,{href:`#search`,"data-bs-toggle":`modal`,className:`nav-icon-item link`,children:(0,g.jsx)(`i`,{className:`icon icon-MagnifyingGlass`})})}),(0,g.jsx)(`li`,{children:(0,g.jsx)(C,{})}),(0,g.jsx)(`li`,{className:`d-none d-sm-block`,children:(0,g.jsx)(n,{to:`/wishlist`,className:`nav-icon-item link`,children:(0,g.jsx)(`i`,{className:`icon icon-HeartStraight`})})}),(0,g.jsx)(`li`,{children:(0,g.jsxs)(`a`,{href:`#shoppingCart`,"data-bs-toggle":`offcanvas`,className:`nav-icon-item link shop-cart`,children:[(0,g.jsx)(`i`,{className:`icon icon-Handbag`}),(0,g.jsx)(l,{})]})})]})})]})})})}var A=[`Easy Returns & Refunds`,`Enjoy FREE DELIVERY on all international orders above Rs. 30,000!`,`Order with Confidence. 100% Easy Returns Guaranteed for All Domestic Orders *T&C`];function j(){let{settings:e}=i(),[t,n]=(0,h.useState)(0),[r,a]=(0,h.useState)(!1);return(0,h.useEffect)(()=>{let e=setInterval(()=>{a(!0),setTimeout(()=>{n(e=>(e+1)%A.length),a(!1)},500)},3500);return()=>clearInterval(e)},[]),e&&e.top_bar_enabled===!1?null:(0,g.jsx)(`div`,{className:`tf-topbar topbar-s3`,style:{backgroundColor:`#c11069`},children:(0,g.jsx)(`div`,{className:`container-full`,children:(0,g.jsx)(`div`,{className:`d-flex align-items-center justify-content-center`,style:{minHeight:26,overflow:`hidden`,position:`relative`},children:(0,g.jsx)(`p`,{className:`text-white text-line-clamp-1 text-center mb-0`,style:{fontSize:14,letterSpacing:`0.5px`,transition:`transform 0.5s ease, opacity 0.5s ease`,transform:r?`translateY(-100%)`:`translateY(0)`,opacity:+!r},children:A[t]})})})})}export{k as n,S as r,j as t};