import { r as e } from "./rolldown-runtime-QTnfLwEv.js"; import { t } from "./react-CZI7_Jkm.js"; import { s as n } from "./api-rGFzbODz.js"; import { C as r, c as i, t as a, u as o } from "./index-DrT5bmpx.js"; import { n as s, t as c } from "./AccountSection-BUlXY9iW.js"; import { t as l } from "./PageMeta-CyS8ELM3.js"; var u = e(t(), 1), d = i(), f = [{ key: `pending`, label: `Placed`, icon: `📋` }, { key: `confirmed`, label: `Confirmed`, icon: `✅` }, { key: `processing`, label: `Processing`, icon: `🔧` }, { key: `shipped`, label: `Shipped`, icon: `🚚` }, { key: `delivered`, label: `Delivered`, icon: `📦` }], p = { pending: { bg: `linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)`, color: `#b45309`, border: `#fde68a`, label: `Pending`, shadow: `rgba(245, 158, 11, 0.2)` }, confirmed: { bg: `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)`, color: `#0369a1`, border: `#bae6fd`, label: `Confirmed`, shadow: `rgba(14, 165, 233, 0.2)` }, processing: { bg: `linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)`, color: `#6b21a8`, border: `#e9d5ff`, label: `Processing`, shadow: `rgba(168, 85, 247, 0.2)` }, shipped: { bg: `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)`, color: `#0284c7`, border: `#bae6fd`, label: `Shipped`, shadow: `rgba(14, 165, 233, 0.2)` }, delivered: { bg: `linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)`, color: `#15803d`, border: `#bbf7d0`, label: `Delivered`, shadow: `rgba(34, 197, 94, 0.2)` }, cancelled: { bg: `linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)`, color: `#dc2626`, border: `#fecaca`, label: `Cancelled`, shadow: `rgba(239, 68, 68, 0.2)` }, returned: { bg: `linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)`, color: `#c2410c`, border: `#fed7aa`, label: `Returned`, shadow: `rgba(249, 115, 22, 0.2)` } }, m = [{ id: `all`, label: `All Orders` }, { id: `pending`, label: `Pending` }, { id: `shipped`, label: `Shipped` }, { id: `delivered`, label: `Delivered` }, { id: `cancelled`, label: `Cancelled` }]; function h({ status: e }) { if (e === `cancelled` || e === `returned`) { let t = p[e] ?? p.cancelled; return (0, d.jsx)(`div`, { style: { padding: `12px 20px`, background: t.bg, border: `1px solid ${t.border}`, boxShadow: `0 4px 15px ${t.shadow}`, borderRadius: 50, color: t.color, fontWeight: 700, fontSize: 14, display: `inline-flex`, alignItems: `center`, gap: 8, animation: `fadeIn 0.5s ease` }, children: e === `cancelled` ? `❌ Order Cancelled` : `↩️ Return Requested` }) } let t = f.findIndex(t => t.key === e), n = t === -1 ? 0 : t; return (0, d.jsx)(`div`, { className: `animated-stepper-wrapper`, children: f.map((e, t) => { let r = t <= n, i = t === n, a = t === f.length - 1; return (0, d.jsxs)(`div`, { className: `stepper-step`, children: [(0, d.jsxs)(`div`, { className: `stepper-icon-wrap`, children: [(0, d.jsx)(`div`, { className: `stepper-icon ${r ? `completed` : ``} ${i ? `active pulse-anim` : ``}`, children: e.icon }), (0, d.jsx)(`span`, { className: `stepper-label ${r ? `completed-label` : ``}`, children: e.label })] }), !a && (0, d.jsx)(`div`, { className: `stepper-line`, children: (0, d.jsx)(`div`, { className: `stepper-line-fill ${r && !i ? `filled` : ``}`, style: { animationDelay: `${t * .2}s` } }) })] }, e.key) }) }) } function g() {
  let [e, t] = (0, u.useState)([]), [i, s] = (0, u.useState)(!0), [l, f] = (0, u.useState)(`all`), [g, _] = (0, u.useState)(null); (0, u.useEffect)(() => { n.getAll().then(e => t(e.data.data ?? [])).catch(() => { }).finally(() => s(!1)) }, []); let v = l === `all` ? e : e.filter(e => e.status === l), y = t => t === `all` ? e.length : e.filter(e => e.status === t).length; return (0, d.jsx)(c, {
    title: `My Orders`, children: (0, d.jsxs)(`div`, {
      className: `premium-orders-wrapper`, children: [(0, d.jsx)(`style`, {
        children: `
          .premium-orders-wrapper {
            font-family: inherit;
            color: #222;
          }

          /* TABS STYLING */
          .premium-tabs-container {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }

          .premium-tab-btn {
            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.05);
            padding: 10px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            color: #666;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            white-space: nowrap;
          }

          .premium-tab-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.05);
            color: #3ec1bc;
          }

          .premium-tab-btn.active {
            background: #3ec1bc;
            color: #ffffff;
            border-color: #3ec1bc;
            box-shadow: 0 8px 25px rgba(62, 193, 188, 0.35);
          }

          .premium-tab-count {
            background: rgba(0,0,0,0.06);
            color: inherit;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
          }
          .premium-tab-btn.active .premium-tab-count {
            background: rgba(255,255,255,0.2);
            color: #ffffff;
          }

          /* ORDER CARD */
          .premium-order-card {
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
            border: 1px solid rgba(0,0,0,0.04);
            margin-bottom: 30px;
            transition: all 0.4s ease;
          }

          .premium-order-card:hover {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
            transform: translateY(-2px);
          }

          .premium-order-header {
            padding: 24px 32px;
            background: #fdfdfd;
            border-bottom: 1px solid rgba(0,0,0,0.03);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
          }

          .order-meta-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
          }

          .meta-item .meta-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #888;
            margin-bottom: 6px;
          }

          .meta-item .meta-value {
            font-size: 16px;
            font-weight: 700;
            color: #222;
          }

          .meta-item .meta-value.highlight {
            color: #3ec1bc;
            font-size: 18px;
          }

          .premium-status-badge {
            display: inline-flex;
            align-items: center;
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.03em;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }

          .btn-details-premium {
            background: #ffffff;
            border: 2px solid #e5e5e5;
            color: #222;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 24px;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .btn-details-premium:hover {
            background: #222;
            color: #ffffff;
            border-color: #222;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          }
          
          .btn-details-premium.expanded {
            background: #3ec1bc;
            color: #ffffff;
            border-color: #3ec1bc;
            box-shadow: 0 8px 20px rgba(62, 193, 188, 0.3);
          }

          /* STEPPER ANIMATIONS */
          .animated-stepper-wrapper {
            display: flex;
            align-items: center;
            padding: 32px;
            background: #ffffff;
            border-bottom: 1px solid rgba(0,0,0,0.02);
            overflow-x: auto;
          }

          .stepper-step {
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }

          .stepper-icon-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            width: 80px;
          }

          .stepper-icon {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #94a3b8;
            border: 2px solid #e2e8f0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            z-index: 2;
          }

          .stepper-icon.completed {
            background: #3ec1bc;
            color: #ffffff;
            border-color: #3ec1bc;
            box-shadow: 0 4px 15px rgba(62, 193, 188, 0.4);
          }

          .stepper-label {
            font-size: 12px;
            font-weight: 500;
            color: #94a3b8;
            text-align: center;
            transition: color 0.3s;
          }

          .stepper-label.completed-label {
            color: #3ec1bc;
            font-weight: 700;
          }

          .pulse-anim {
            animation: pulse-ring 2s infinite;
          }

          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(62, 193, 188, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(62, 193, 188, 0); }
            100% { box-shadow: 0 0 0 0 rgba(62, 193, 188, 0); }
          }

          .stepper-line {
            height: 4px;
            width: 60px;
            background: #e2e8f0;
            margin-bottom: 28px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
          }

          .stepper-line-fill {
            position: absolute;
            top: 0; left: 0; bottom: 0;
            width: 0%;
            background: #3ec1bc;
            border-radius: 4px;
          }

          .stepper-line-fill.filled {
            animation: fillLine 0.6s ease forwards;
          }

          @keyframes fillLine {
            to { width: 100%; }
          }

          /* ITEMS PREVIEW */
          .premium-items-preview {
            padding: 24px 32px;
            background: #ffffff;
          }

          .items-scroll-row {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            padding-bottom: 12px;
          }

          .item-thumb-premium {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px;
            border-radius: 16px;
            background: #fdfdfd;
            border: 1px solid rgba(0,0,0,0.03);
            flex-shrink: 0;
            transition: all 0.3s ease;
          }

          .item-thumb-premium:hover {
            background: #ffffff;
            border-color: rgba(62, 193, 188, 0.3);
            box-shadow: 0 5px 15px rgba(0,0,0,0.03);
            transform: translateY(-2px);
          }

          .item-thumb-premium img {
            width: 60px;
            height: 75px;
            object-fit: cover;
            border-radius: 12px;
            background: #f8f8f8;
          }

          .item-details-mini .item-title {
            font-weight: 700;
            font-size: 14px;
            color: #222;
            max-width: 160px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
          }

          .item-details-mini .item-qty {
            font-size: 13px;
            color: #777;
            margin-bottom: 6px;
          }

          .item-details-mini .item-price {
            font-weight: 800;
            color: #3ec1bc;
            font-size: 15px;
          }

          /* EXPANDED DETAILS WITH ANIMATION */
          .premium-expanded-area {
            padding: 0 32px 32px 32px;
            background: #ffffff;
            animation: slideDown 0.4s ease forwards;
            transform-origin: top;
          }
          
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .expanded-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 24px;
            border-top: 1px dashed rgba(0,0,0,0.08);
            padding-top: 32px;
          }

          @media (max-width: 768px) {
            .expanded-grid {
              grid-template-columns: 1fr;
            }
          }

          .premium-detail-panel {
            background: #fdfdfd;
            border-radius: 20px;
            padding: 28px;
            border: 1px solid rgba(0,0,0,0.03);
            box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          }

          .panel-header-rich {
            font-size: 14px;
            font-weight: 800;
            color: #222;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .panel-header-rich span {
            background: rgba(62, 193, 188, 0.1);
            color: #3ec1bc;
            width: 32px; height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
          }

          .summary-row.total-row {
            font-size: 18px;
            font-weight: 800;
            color: #3ec1bc;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 2px dashed rgba(0,0,0,0.05);
          }

          .premium-address-text {
            font-size: 15px;
            line-height: 1.8;
            color: #555;
          }

          .premium-address-text strong {
            color: #222;
            font-size: 16px;
            display: block;
            margin-bottom: 8px;
          }
        `}), (0, d.jsx)(`div`, { className: `premium-tabs-container`, children: m.map(e => { let t = l === e.id, n = y(e.id); return (0, d.jsxs)(`button`, { type: `button`, className: `premium-tab-btn ${t ? `active` : ``}`, onClick: () => f(e.id), children: [e.label, n > 0 && (0, d.jsx)(`span`, { className: `premium-tab-count`, children: n })] }, e.id) }) }), i ? (0, d.jsx)(`div`, { className: `text-center py-5`, children: (0, d.jsx)(`div`, { className: `spinner-border text-info`, role: `status`, style: { borderWidth: `3px`, width: `3rem`, height: `3rem` } }) }) : v.length === 0 ? (0, d.jsxs)(`div`, { className: `text-center py-5 rounded-4`, style: { background: `#fdfdfd`, border: `1px dashed rgba(0,0,0,0.05)` }, children: [(0, d.jsx)(`div`, { style: { fontSize: 40, marginBottom: 16 }, children: `🛍️` }), (0, d.jsx)(`p`, { className: `mb-4 text-muted fs-5 fw-semibold`, children: `No orders found in this filter.` }), (0, d.jsx)(r, { to: `/shop-default`, className: `tf-btn btn-sm`, style: { background: `#3ec1bc`, color: `#fff`, borderRadius: 50, padding: `12px 30px`, fontWeight: 700, letterSpacing: `0.05em` }, children: `START SHOPPING` })] }) : (0, d.jsx)(`div`, { children: v.map(e => { let t = p[e.status] ?? p.pending, n = g === e.id; return (0, d.jsxs)(`div`, { className: `premium-order-card`, children: [(0, d.jsxs)(`div`, { className: `premium-order-header`, children: [(0, d.jsxs)(`div`, { className: `order-meta-grid`, children: [(0, d.jsxs)(`div`, { className: `meta-item`, children: [(0, d.jsx)(`div`, { className: `meta-label`, children: `Order ID` }), (0, d.jsxs)(`div`, { className: `meta-value`, children: [`#`, e.order_number ?? e.id] })] }), (0, d.jsxs)(`div`, { className: `meta-item`, children: [(0, d.jsx)(`div`, { className: `meta-label`, children: `Date Placed` }), (0, d.jsx)(`div`, { className: `meta-value`, children: new Date(e.created_at).toLocaleDateString(`en-US`, { day: `numeric`, month: `short`, year: `numeric` }) })] }), (0, d.jsxs)(`div`, { className: `meta-item`, children: [(0, d.jsx)(`div`, { className: `meta-label`, children: `Total Amount` }), (0, d.jsx)(`div`, { className: `meta-value highlight`, children: a(e.total) })] })] }), (0, d.jsxs)(`div`, { style: { display: `flex`, alignItems: `center`, gap: 16 }, children: [(0, d.jsx)(`span`, { className: `premium-status-badge`, style: { background: t.bg, color: t.color, border: `1px solid ${t.border}`, boxShadow: `0 4px 15px ${t.shadow}` }, children: t.label }), (0, d.jsxs)(`button`, { type: `button`, onClick: () => _(n ? null : e.id), className: `btn-details-premium ${n ? `expanded` : ``}`, children: [n ? `Close Details` : `View Details`, (0, d.jsx)(`span`, { style: { transition: `transform 0.3s`, transform: n ? `rotate(180deg)` : `rotate(0deg)` }, children: `▼` })] })] })] }), (0, d.jsx)(h, { status: e.status }), e.tracking_number && (0, d.jsx)(`div`, { style: { padding: `0 32px 16px 32px`, fontSize: 14, color: `#444`, fontWeight: 600 }, children: (0, d.jsxs)(`span`, { style: { display: `inline-flex`, alignItems: `center`, gap: 8, background: `#fdfdfd`, padding: `8px 16px`, borderRadius: 8, border: `1px solid #eee` }, children: [`🚚 Tracking Number: `, (0, d.jsx)(`strong`, { style: { color: `#3ec1bc`, letterSpacing: `0.05em` }, children: e.tracking_number })] }) }), (0, d.jsx)(`div`, { className: `premium-items-preview`, children: (0, d.jsxs)(`div`, { className: `items-scroll-row`, children: [(e.items ?? []).slice(0, 4).map((e, t) => (0, d.jsxs)(`div`, { className: `item-thumb-premium`, children: [(0, d.jsx)(`img`, { src: o(e.thumbnail), alt: e.product_name }), (0, d.jsxs)(`div`, { className: `item-details-mini`, children: [(0, d.jsx)(`div`, { className: `item-title`, title: e.product_name, children: e.product_name }), (0, d.jsxs)(`div`, { className: `item-qty`, children: [`Quantity: `, e.quantity] }), (0, d.jsx)(`div`, { className: `item-price`, children: a(e.subtotal) })] })] }, t)), (e.items?.length ?? 0) > 4 && (0, d.jsxs)(`div`, { style: { display: `flex`, alignItems: `center`, justifyContent: `center`, width: 100, color: `#3ec1bc`, fontSize: 14, fontWeight: 700 }, children: [`+`, (e.items?.length ?? 0) - 4, ` More`] })] }) }), n && (0, d.jsx)(`div`, { className: `premium-expanded-area`, children: (0, d.jsxs)(`div`, { className: `expanded-grid`, children: [(0, d.jsxs)(`div`, { className: `premium-detail-panel`, children: [(0, d.jsxs)(`div`, { className: `panel-header-rich`, children: [(0, d.jsx)(`span`, { children: `🧾` }), ` Billing Summary`] }), (0, d.jsxs)(`div`, { className: `summary-row`, children: [(0, d.jsx)(`span`, { children: `Subtotal` }), (0, d.jsx)(`span`, { style: { fontWeight: 600, color: `#222` }, children: a(e.subtotal ?? e.total) })] }), (e.discount ?? 0) > 0 && (0, d.jsxs)(`div`, { className: `summary-row`, style: { color: `#15803d`, fontWeight: 600 }, children: [(0, d.jsxs)(`span`, { children: [`Promo (`, e.promo_code, `)`] }), (0, d.jsxs)(`span`, { children: [`-`, a(e.discount)] })] }), (0, d.jsxs)(`div`, { className: `summary-row`, children: [(0, d.jsx)(`span`, { children: `Shipping` }), (0, d.jsx)(`span`, { children: (e.shipping ?? 0) === 0 ? (0, d.jsx)(`span`, { style: { color: `#15803d`, fontWeight: 700, background: `#eafaf1`, padding: `2px 8px`, borderRadius: 4 }, children: `FREE` }) : (0, d.jsx)(`span`, { style: { fontWeight: 600, color: `#222` }, children: a(e.shipping) }) })] }), (0, d.jsxs)(`div`, { className: `summary-row total-row`, children: [(0, d.jsx)(`span`, { children: `Grand Total` }), (0, d.jsx)(`span`, { children: a(e.total) })] }), (0, d.jsxs)(`div`, { style: { marginTop: 20, paddingTop: 20, borderTop: `1px solid rgba(0,0,0,0.05)`, fontSize: 13, color: `#666`, display: `flex`, flexWrap: `wrap`, gap: 16 }, children: [(0, d.jsxs)(`div`, { style: { display: `flex`, flexDirection: `column`, gap: 4 }, children: [(0, d.jsx)(`span`, { style: { textTransform: `uppercase`, fontSize: 11, letterSpacing: `0.05em`, fontWeight: 700 }, children: `Payment Method` }), (0, d.jsx)(`strong`, { style: { color: `#222`, fontSize: 14 }, children: e.payment_method?.toUpperCase() })] }), (0, d.jsxs)(`div`, { style: { display: `flex`, flexDirection: `column`, gap: 4 }, children: [(0, d.jsx)(`span`, { style: { textTransform: `uppercase`, fontSize: 11, letterSpacing: `0.05em`, fontWeight: 700 }, children: `Payment Status` }), (0, d.jsx)(`strong`, { style: { color: e.payment_status === `paid` ? `#15803d` : `#b45309`, fontSize: 14, textTransform: `capitalize` }, children: e.payment_status })] })] })] }), (0, d.jsxs)(`div`, { className: `premium-detail-panel`, children: [(0, d.jsxs)(`div`, { className: `panel-header-rich`, children: [(0, d.jsx)(`span`, { children: `📍` }), ` Shipping Address`] }), (0, d.jsxs)(`div`, { className: `premium-address-text`, children: [(0, d.jsx)(`strong`, { children: e.shipping_name }), (0, d.jsx)(`div`, { children: e.shipping_line1 }), (0, d.jsxs)(`div`, { children: [e.shipping_city, e.shipping_state ? `, ` + e.shipping_state : ``, ` – `, e.shipping_pincode] }), e.shipping_phone && (0, d.jsxs)(`div`, { style: { marginTop: 16, display: `inline-flex`, alignItems: `center`, gap: 8, background: `#fff`, padding: `10px 16px`, borderRadius: 12, border: `1px solid #f0f0f0` }, children: [`📞 `, (0, d.jsx)(`span`, { style: { fontWeight: 600, color: `#222` }, children: e.shipping_phone })] })] })] })] }) })] }, e.id) }) })]
    })
  })
} var _ = () => (0, d.jsxs)(d.Fragment, { children: [(0, d.jsx)(l, { title: `Your Orders | 2Deal - Online Saree & Ethnic Wear Store`, description: `2Deal - Online Saree & Ethnic Wear Store` }), (0, d.jsx)(s, {}), (0, d.jsx)(g, {})] }); export { _ as default };