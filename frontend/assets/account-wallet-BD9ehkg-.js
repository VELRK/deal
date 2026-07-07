import { r as e } from "./rolldown-runtime-QTnfLwEv.js"; import { t } from "./react-CZI7_Jkm.js"; import { h as n } from "./api-DfkJ5d7t.js"; import { c as r, t as i } from "./index-CKqq9D3X.js"; import { n as a, t as o } from "./AccountSection-sDnMMCEz.js"; import { t as s } from "./PageMeta-CyS8ELM3.js"; var c = e(t(), 1), l = r(); function u() {
  let [e, t] = (0, c.useState)(null), [r, a] = (0, c.useState)([]), [s, u] = (0, c.useState)(0), [d, f] = (0, c.useState)(!0), [p, m] = (0, c.useState)(!0), [h, g] = (0, c.useState)(1); (0, c.useEffect)(() => { n.getWallet().then(e => { e.data?.success && t(e.data.data) }).catch(console.error).finally(() => f(!1)) }, []), (0, c.useEffect)(() => { m(!0); let e = (h - 1) * 10; n.getWalletTransactions({ limit: 10, offset: e }).then(e => { e.data?.success && (a(e.data.data.rows), u(e.data.data.total)) }).catch(console.error).finally(() => m(!1)) }, [h]); let _ = Math.ceil(s / 10); function v(e) { try { return new Date(e).toLocaleDateString(`en-MY`, { year: `numeric`, month: `short`, day: `numeric`, hour: `2-digit`, minute: `2-digit` }) } catch { return e } } function y(e) { switch (e) { case `admin_add`: return `Admin Credit`; case `order_payment`: return `Order Payment`; case `refund`: return `Order Refund`; case `promo`: return `Promo Bonus`; case `adjustment`: return `Wallet Adjustment`; default: return e } } return (0, l.jsx)(o, {
    title: `My Wallet`, children: (0, l.jsxs)(`div`, {
      className: `wallet-container-custom`, children: [(0, l.jsx)(`style`, {
        children: `
          .wallet-container-custom {
            font-family: 'Inter', sans-serif;
            color: #222222;
          }

          .wallet-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          .wallet-card-custom::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: #3ec1bc;
          }

          .wallet-info-part h4 {
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 6px 0;
          }

          .wallet-balance {
            font-size: 38px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
          }

          .wallet-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #065f46;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            margin-top: 10px;
            border: 1px solid #a7f3d0;
          }

          .wallet-status-badge .dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
          }

          .wallet-benefit-card {
            background: #f0fdfa;
            border: 1px solid #ccfbf1;
            border-radius: 12px;
            padding: 16px 20px;
            max-width: 320px;
          }

          .wallet-benefit-card h5 {
            font-size: 14px;
            font-weight: 700;
            color: #0f766e;
            margin: 0 0 4px 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .wallet-benefit-card p {
            font-size: 13px;
            color: #115e59;
            margin: 0;
            line-height: 1.5;
          }

          .tx-history-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
          }

          /* Classic Table Style */
          .tx-table-wrapper {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
          }

          .tx-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          .tx-table th {
            background: #f8fafc;
            padding: 14px 18px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            border-bottom: 1px solid #eaeaea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .tx-table td {
            padding: 16px 18px;
            font-size: 14px;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .tx-table tr:last-child td {
            border-bottom: none;
          }

          .tx-type-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 6px;
          }

          .tx-type-badge.credit {
            background: #e6f4ea;
            color: #137333;
          }

          .tx-type-badge.debit {
            background: #fce8e6;
            color: #c5221f;
          }

          .tx-amount {
            font-weight: 700;
            font-size: 15px;
          }

          .tx-amount.credit {
            color: #137333;
          }

          .tx-amount.debit {
            color: #c5221f;
          }

          .tx-ref {
            font-family: monospace;
            font-size: 13px;
            color: #64748b;
          }

          .tx-date {
            font-size: 13px;
            color: #64748b;
          }

          .wallet-empty-state {
            padding: 40px 20px;
            text-align: center;
            color: #64748b;
          }

          .wallet-empty-state .icon {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
          }

          /* Pagination */
          .tx-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 0 4px;
          }

          .tx-pagination-info {
            font-size: 13px;
            color: #64748b;
          }

          .tx-pagination-buttons {
            display: flex;
            gap: 8px;
          }

          .tx-page-btn {
            background: #ffffff;
            border: 1px solid #d1d5db;
            color: #374151;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .tx-page-btn:hover:not(:disabled) {
            background: #f9fafb;
            border-color: #9ca3af;
          }

          .tx-page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Skeletal Pulse */
          .pulse {
            animation: pulse-animation 1.5s infinite ease-in-out;
            background: #f1f5f9;
            height: 14px;
            border-radius: 4px;
          }

          @keyframes pulse-animation {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}), d ? (0, l.jsx)(`div`, { className: `wallet-card-custom`, children: (0, l.jsxs)(`div`, { className: `wallet-info-part`, style: { width: `100%` }, children: [(0, l.jsx)(`div`, { className: `pulse`, style: { width: `120px`, marginBottom: `12px` } }), (0, l.jsx)(`div`, { className: `pulse`, style: { width: `240px`, height: `38px` } })] }) }) : e ? (0, l.jsxs)(`div`, { className: `wallet-card-custom`, children: [(0, l.jsxs)(`div`, { className: `wallet-info-part`, children: [(0, l.jsx)(`h4`, { children: `Available Balance` }), (0, l.jsx)(`div`, { className: `wallet-balance`, children: i(e.balance) }), e.enabled && (0, l.jsxs)(`div`, { className: `wallet-status-badge`, children: [(0, l.jsx)(`span`, { className: `dot` }), (0, l.jsx)(`span`, { children: `Wallet Active` })] })] }), e.enabled && e.discount_percent > 0 && (0, l.jsxs)(`div`, { className: `wallet-benefit-card`, children: [(0, l.jsx)(`h5`, { children: `👛 Wallet Pay Benefit` }), (0, l.jsxs)(`p`, { children: [`Pay with wallet during checkout and receive an extra`, ` `, (0, l.jsxs)(`strong`, { children: [e.discount_percent, `% off`] }), ` on your entire purchase!`] })] })] }) : (0, l.jsx)(`div`, { className: `alert alert-danger`, children: `Failed to load wallet information.` }), (0, l.jsx)(`h3`, { className: `tx-history-title`, children: `Transaction History` }), (0, l.jsx)(`div`, { className: `tx-table-wrapper`, children: p ? (0, l.jsxs)(`div`, { style: { padding: `30px` }, children: [(0, l.jsx)(`div`, { className: `pulse`, style: { width: `100%`, marginBottom: `15px`, height: `40px` } }), (0, l.jsx)(`div`, { className: `pulse`, style: { width: `100%`, marginBottom: `15px`, height: `30px` } }), (0, l.jsx)(`div`, { className: `pulse`, style: { width: `100%`, marginBottom: `15px`, height: `30px` } }), (0, l.jsx)(`div`, { className: `pulse`, style: { width: `100%`, height: `30px` } })] }) : r.length > 0 ? (0, l.jsxs)(`table`, { className: `tx-table`, children: [(0, l.jsx)(`thead`, { children: (0, l.jsxs)(`tr`, { children: [(0, l.jsx)(`th`, { children: `Date` }), (0, l.jsx)(`th`, { children: `Reference` }), (0, l.jsx)(`th`, { children: `Type` }), (0, l.jsx)(`th`, { children: `Description` }), (0, l.jsx)(`th`, { style: { textAlign: `right` }, children: `Amount` }), (0, l.jsx)(`th`, { style: { textAlign: `right` }, children: `Balance` })] }) }), (0, l.jsx)(`tbody`, { children: r.map(e => { let t = e.type === `credit`; return (0, l.jsxs)(`tr`, { children: [(0, l.jsx)(`td`, { children: (0, l.jsx)(`div`, { className: `tx-date`, children: v(e.created_at) }) }), (0, l.jsx)(`td`, { children: (0, l.jsx)(`span`, { className: `tx-ref`, children: e.reference || `TX-${e.id}` }) }), (0, l.jsx)(`td`, { children: (0, l.jsx)(`span`, { className: `tx-type-badge ${e.type}`, children: t ? `Credit` : `Debit` }) }), (0, l.jsx)(`td`, { children: (0, l.jsx)(`div`, { style: { fontWeight: 500, fontSize: `14px` }, children: e.description || y(e.source) }) }), (0, l.jsx)(`td`, { style: { textAlign: `right` }, children: (0, l.jsxs)(`span`, { className: `tx-amount ${e.type}`, children: [t ? `+` : `-`, i(e.amount)] }) }), (0, l.jsx)(`td`, { style: { textAlign: `right`, fontWeight: 600 }, children: i(e.balance_after) })] }, e.id) }) })] }) : (0, l.jsxs)(`div`, { className: `wallet-empty-state`, children: [(0, l.jsx)(`span`, { className: `icon`, children: `👛` }), (0, l.jsx)(`p`, { className: `mb-0 fw-semibold`, children: `No transactions found.` }), (0, l.jsx)(`span`, { className: `text-muted`, style: { fontSize: `13px` }, children: `Transactions will appear here when you pay with your wallet or get credits.` })] }) }), !p && s > 10 && (0, l.jsxs)(`div`, { className: `tx-pagination`, children: [(0, l.jsxs)(`div`, { className: `tx-pagination-info`, children: [`Showing `, (h - 1) * 10 + 1, ` to `, Math.min(h * 10, s), ` of `, s, ` entries`] }), (0, l.jsxs)(`div`, { className: `tx-pagination-buttons`, children: [(0, l.jsx)(`button`, { type: `button`, className: `tx-page-btn`, disabled: h === 1, onClick: () => g(e => e - 1), children: `Previous` }), (0, l.jsx)(`button`, { type: `button`, className: `tx-page-btn`, disabled: h >= _, onClick: () => g(e => e + 1), children: `Next` })] })] })]
    })
  })
} var d = () => (0, l.jsxs)(l.Fragment, { children: [(0, l.jsx)(s, { title: `My Wallet | 2Deal - Online Saree & Ethnic Wear Store`, description: `2Deal - Online Saree & Ethnic Wear Store` }), (0, l.jsx)(a, {}), (0, l.jsx)(u, {})] }); export { d as default };