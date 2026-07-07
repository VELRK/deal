import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{t}from"./react-CZI7_Jkm.js";import{a as n}from"./api-BFkhFdfc.js";import{C as r,O as i,c as a}from"./index-BKMO4tYN.js";import{t as o}from"./PageMeta-CyS8ELM3.js";import{t as s}from"./Shop-Bce9mKA3.js";var c=e(t(),1),l=a();function u(){let[e]=i(),t=e.get(`category_slug`)??``,[a,u]=(0,c.useState)(null);(0,c.useEffect)(()=>{if(!t){u(null);return}n.getAll().then(e=>{u((e.data.data??[]).find(e=>e.slug===t)??null)}).catch(()=>u(null))},[t]);let d=a?.name??`All Product`,f=a?`Explore our ${a.name} collection — handpicked for you.`:`Browse our complete product collection.`;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(o,{title:`${d} | 2Deal`,description:f}),(0,l.jsxs)(`section`,{className:`section-page-title text-center pb-0`,style:{paddingTop:`60px`,paddingBottom:`40px`,backgroundColor:`#fff`},children:[(0,l.jsx)(`style`,{children:`
          .trending-classic-header {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: elegantReveal 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            opacity: 0;
            transform: translateY(15px);
          }
          .trending-breadcrumbs {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #94A3B8;
            margin-bottom: 24px;
          }
          .trending-breadcrumbs a {
            color: #0F172A;
            text-decoration: none;
            transition: opacity 0.3s ease;
          }
          .trending-breadcrumbs a:hover {
            opacity: 0.6;
          }
          .trending-title {
            font-size: 2rem;
            font-weight: 300;
            color: #0F172A;
            letter-spacing: -0.02em;
            margin-bottom: 16px;
            font-family: 'Inter', sans-serif;
            line-height: 1.1;
          }
          .trending-desc {
            font-size: 1.05rem;
            color: #475569;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.7;
            font-weight: 400;
          }
          .trending-divider {
            width: 40px;
            height: 1px;
            background-color: #0F172A;
            margin: 24px auto 0;
          }
          @keyframes elegantReveal {
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 768px) {
            .trending-title { font-size: 1.5rem; }
          }
        `}),(0,l.jsx)(`div`,{className:`container`,children:(0,l.jsxs)(`div`,{className:`trending-classic-header`,children:[(0,l.jsxs)(`div`,{className:`trending-breadcrumbs`,children:[(0,l.jsx)(r,{to:`/`,children:`Home`}),(0,l.jsx)(`span`,{style:{fontSize:`10px`,color:`#CBD5E1`},children:`/`}),a&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(r,{to:`/shop-default`,children:`Shop`}),(0,l.jsx)(`span`,{style:{fontSize:`10px`,color:`#CBD5E1`},children:`/`})]}),(0,l.jsx)(`span`,{style:{color:`#94A3B8`},children:d})]}),(0,l.jsx)(`h1`,{className:`trending-title`,children:d}),(0,l.jsx)(`p`,{className:`trending-desc`,children:f}),(0,l.jsx)(`div`,{className:`trending-divider`})]})})]}),(0,l.jsx)(s,{variant:[`infinityScroll`]})]})}export{u as default};