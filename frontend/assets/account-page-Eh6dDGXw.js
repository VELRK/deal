import { r as e } from "./rolldown-runtime-QTnfLwEv.js"; import { t } from "./react-CZI7_Jkm.js"; import { h as n } from "./api-rGFzbODz.js"; import { C as r, S as i, c as a, t as o } from "./index-CnLeq_4D.js"; import { n as s, t as c } from "./AccountSection-DGRTYlOR.js"; import { t as l } from "./PageMeta-CyS8ELM3.js"; var u = e(t(), 1), d = a(), f = [{ key: `total_orders`, label: `Total Orders`, icon: `📦`, bg: `linear-gradient(135deg, #fdfafb 0%, #fef5f7 100%)`, text: `#3ec1bc`, border: `rgba(193, 16, 105, 0.15)`, shadow: `rgba(193, 16, 105, 0.2)` }, { key: `pending`, label: `Pending Orders`, icon: `⏳`, bg: `linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)`, text: `#b45309`, border: `#fde68a`, shadow: `rgba(245, 158, 11, 0.2)` }, { key: `delivered`, label: `Delivered`, icon: `✅`, bg: `linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)`, text: `#15803d`, border: `#bbf7d0`, shadow: `rgba(34, 197, 94, 0.2)` }, { key: `addresses`, label: `Saved Addresses`, icon: `📍`, bg: `linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)`, text: `#6b21a8`, border: `#e9d5ff`, shadow: `rgba(168, 85, 247, 0.2)` }]; function p() {
  i(); let [e, t] = (0, u.useState)(null), [a, s] = (0, u.useState)([]), [l, p] = (0, u.useState)(!0); return (0, u.useEffect)(() => { n.dashboard().then(e => { let n = e.data.data; n && (t(n.stats), s(n.recent_orders)) }).catch(() => { }).finally(() => p(!1)) }, []), (0, d.jsx)(c, {
    title: `Dashboard`, children: (0, d.jsxs)(`div`, {
      className: `dashboard-premium-wrapper`, children: [(0, d.jsx)(`style`, {
        children: `
          .dashboard-premium-wrapper {
            width: 100%;
          }

          .premium-stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
          }

          .premium-stat-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border: 1px solid rgba(0,0,0,0.04);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            z-index: 1;
            overflow: hidden;
          }

          .premium-stat-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
          }
          
          .premium-stat-card::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 20px;
            background: radial-gradient(circle at top right, rgba(255,255,255,0.8), transparent 70%);
            z-index: -1;
          }

          .premium-stat-info .stat-label {
            font-size: 14px;
            font-weight: 600;
            color: #777777;
            margin-bottom: 8px;
          }

          .premium-stat-info .stat-value {
            font-size: 32px;
            font-weight: 800;
            color: #222222;
            margin: 0;
            line-height: 1;
          }

          .premium-stat-icon {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            border-radius: 16px;
            transition: all 0.4s ease;
          }

          .premium-stat-card:hover .premium-stat-icon {
            transform: scale(1.1) rotate(5deg);
          }

          .premium-orders-section {
            background: #ffffff;
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
            border: 1px solid rgba(0,0,0,0.03);
          }

          .premium-orders-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .premium-orders-title {
            font-size: 22px;
            font-weight: 700;
            color: #111111;
            margin: 0;
          }

          .premium-btn-view {
            font-size: 14px;
            font-weight: 600;
            color: #ffffff !important;
            background: #3ec1bc;
            text-decoration: none;
            padding: 10px 24px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(62, 193, 188, 0.3);
            transition: all 0.3s ease;
          }

          .premium-btn-view:hover {
            background: #35a8a4;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(62, 193, 188, 0.4);
          }

          .premium-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 12px;
          }

          .premium-table th {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #999999;
            padding: 0 20px 10px 20px;
            border: none;
            text-align: left;
          }

          .premium-table tbody tr {
            background: #fdfdfd;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.01);
            transition: all 0.3s ease;
          }

          .premium-table tbody tr:hover {
            background: #ffffff;
            box-shadow: 0 5px 20px rgba(0,0,0,0.04);
            transform: scale(1.005);
          }

          .premium-table td {
            padding: 18px 20px;
            vertical-align: middle;
            font-size: 15px;
            color: #444444;
            font-weight: 500;
            border-top: 1px solid #f7f7f7;
            border-bottom: 1px solid #f7f7f7;
          }

          .premium-table td:first-child {
            border-left: 1px solid #f7f7f7;
            border-top-left-radius: 16px;
            border-bottom-left-radius: 16px;
            font-weight: 700;
            color: #111111;
          }

          .premium-table td:last-child {
            border-right: 1px solid #f7f7f7;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
          }

          .premium-status {
            display: inline-flex;
            align-items: center;
            font-size: 13px;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: 50px;
          }
          
          .premium-status.delivered {
            background: #eafaf1;
            color: #15803d;
          }

          .premium-status.pending {
            background: #fffbeb;
            color: #b45309;
          }

          .premium-status.shipped {
            background: #f0f9ff;
            color: #0369a1;
          }

          .premium-status.cancelled {
            background: #fef2f2;
            color: #dc2626;
          }

          .premium-action-link {
            font-size: 14px;
            font-weight: 600;
            color: #3ec1bc !important;
            text-decoration: none;
            background: rgba(62, 193, 188, 0.1);
            padding: 6px 16px;
            border-radius: 50px;
            transition: all 0.2s ease;
          }

          .premium-action-link:hover {
            background: #3ec1bc;
            color: #ffffff !important;
          }
        `}), l ? (0, d.jsx)(`div`, { className: `text-center py-5`, children: (0, d.jsx)(`div`, { className: `spinner-border text-info`, role: `status` }) }) : (0, d.jsxs)(d.Fragment, { children: [(0, d.jsx)(`div`, { className: `premium-stat-grid`, children: f.map(t => (0, d.jsxs)(`div`, { className: `premium-stat-card`, children: [(0, d.jsxs)(`div`, { className: `premium-stat-info`, children: [(0, d.jsx)(`div`, { className: `stat-label`, children: t.label }), (0, d.jsx)(`h4`, { className: `stat-value`, children: t.key === `total_orders` ? e?.total_orders ?? 0 : t.key === `pending` ? e?.pending ?? 0 : t.key === `delivered` ? e?.delivered ?? 0 : e?.addresses ?? 0 })] }), (0, d.jsx)(`div`, { className: `premium-stat-icon`, style: { background: t.bg, border: `1px solid ${t.border}`, boxShadow: `0 8px 16px ${t.shadow}` }, children: t.icon })] }, t.key)) }), (0, d.jsxs)(`div`, { className: `premium-orders-section`, children: [(0, d.jsxs)(`div`, { className: `premium-orders-header`, children: [(0, d.jsx)(`h5`, { className: `premium-orders-title`, children: `Recent Orders` }), (0, d.jsx)(r, { to: `/account-orders`, className: `premium-btn-view`, children: `View All` })] }), a.length === 0 ? (0, d.jsx)(`div`, { className: `text-center py-5 rounded-4`, style: { background: `#f8f9fa`, border: `1px dashed #e9ecef` }, children: (0, d.jsx)(`p`, { className: `mb-0 text-muted fs-5`, children: `No recent orders found.` }) }) : (0, d.jsx)(`div`, { className: `table-responsive`, children: (0, d.jsxs)(`table`, { className: `premium-table`, children: [(0, d.jsx)(`thead`, { children: (0, d.jsxs)(`tr`, { children: [(0, d.jsx)(`th`, { children: `Order` }), (0, d.jsx)(`th`, { children: `Date` }), (0, d.jsx)(`th`, { children: `Status` }), (0, d.jsx)(`th`, { children: `Total` }), (0, d.jsx)(`th`, { children: `Actions` })] }) }), (0, d.jsx)(`tbody`, { children: a.map(e => { let t = e.status === `delivered` ? `delivered` : e.status === `cancelled` ? `cancelled` : e.status === `shipped` ? `shipped` : `pending`, n = e.status.charAt(0).toUpperCase() + e.status.slice(1); return (0, d.jsxs)(`tr`, { children: [(0, d.jsxs)(`td`, { children: [`#`, e.order_number ?? e.id] }), (0, d.jsx)(`td`, { children: new Date(e.created_at).toLocaleDateString(`en-IN`, { day: `numeric`, month: `short`, year: `numeric` }) }), (0, d.jsx)(`td`, { children: (0, d.jsx)(`span`, { className: `premium-status ${t}`, children: n }) }), (0, d.jsx)(`td`, { children: o(e.total) }), (0, d.jsx)(`td`, { children: (0, d.jsx)(r, { to: `/account-orders`, className: `premium-action-link`, children: `View` }) })] }, e.id) }) })] }) })] })] })]
    })
  })
} var m = () => (0, d.jsxs)(d.Fragment, { children: [(0, d.jsx)(l, { title: `My Account | 2Deal - Online Saree & Ethnic Wear Store`, description: `2Deal - Online Saree & Ethnic Wear Store` }), (0, d.jsx)(s, {}), (0, d.jsx)(p, {})] }); export { m as default };