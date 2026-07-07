import { r as e } from "./rolldown-runtime-QTnfLwEv.js"; import { t } from "./react-CZI7_Jkm.js"; import { h as n } from "./api-G7zFroc1.js"; import { S as r, c as i } from "./index-BWWdTw7b.js"; import { n as a, t as ee } from "./AccountSection-m8MlHgHT.js"; import { t as o } from "./PageMeta-CyS8ELM3.js"; var s = e(t(), 1), c = i(); function l() {
  let { user: e } = r(), t = e?.id || 999, [i, a] = (0, s.useState)(() => { let e = localStorage.getItem(`amere_wallet_theme`); return e ? e === `dark` : window.matchMedia(`(prefers-color-scheme: dark)`).matches }), [o, l] = (0, s.useState)(() => localStorage.getItem(`amere_wallet_show_balance`) !== `false`), [u, te] = (0, s.useState)(null), [ne, re] = (0, s.useState)(!0), [d, ie] = (0, s.useState)(() => { let e = localStorage.getItem(`amere_wallet_delta_${t}`); return e ? parseFloat(e) : 0 }), [f, p] = (0, s.useState)([]), [m, h] = (0, s.useState)([]), [g, ae] = (0, s.useState)({ pinSet: !0, pin: `123456`, twoFactorEnabled: !0, biometricEnabled: !1, trustedDevices: [`iPhone 15 Pro (This Device)`, `MacBook Pro M3 Max`] }), [_, oe] = (0, s.useState)(``), [v, se] = (0, s.useState)(`all`), [y, ce] = (0, s.useState)(`all`), [b, x] = (0, s.useState)(1), [S, C] = (0, s.useState)(null), [w, le] = (0, s.useState)(null), [ue, T] = (0, s.useState)(!1), [E, D] = (0, s.useState)(1), [de, O] = (0, s.useState)(!1), [k, A] = (0, s.useState)(null), [j, M] = (0, s.useState)(``), [N, P] = (0, s.useState)(100), [F, fe] = (0, s.useState)(`FPX - Maybank2u`), [I, pe] = (0, s.useState)(`Maybank`), [L, R] = (0, s.useState)(``), [z, B] = (0, s.useState)(``), [V, H] = (0, s.useState)(``), [U, me] = (0, s.useState)(``), [he, ge] = (0, s.useState)(``), [W, _e] = (0, s.useState)(``), [ve, ye] = (0, s.useState)(``), [G, be] = (0, s.useState)(`scan`), [xe, Se] = (0, s.useState)([{ id: `v1`, title: `DuitNow RM5 Cashback`, desc: `Claim RM5.00 cash directly into wallet`, claimed: !1, value: 5 }, { id: `v2`, title: `Free Shipping Voucher`, desc: `No min spend for eWallet shoppers`, claimed: !1, value: 0 }, { id: `v3`, title: `10% Wallet Discount Promo`, desc: `Get extra 10% off at checkout`, claimed: !1, value: 0 }]), K = async () => { re(!0); try { let e = await n.getWallet(); e.data?.data && te(e.data.data) } catch (e) { console.error(`Failed to load backend wallet:`, e), te({ enabled: !0, balance: 25.5, discount_percent: 10 }) } finally { re(!1) } }; (0, s.useEffect)(() => { K(); let e = localStorage.getItem(`amere_wallet_txs_${t}`); if (e) p(JSON.parse(e)); else { let e = [{ id: `TXN10001`, reference: `FPX-MYB-78392`, type: `credit`, amount: 250, source: `FPX Maybank2u`, category: `Top Up`, description: `FPX Wallet Top Up`, status: `success`, timestamp: new Date(Date.now() - 36e5 * 2).toISOString() }, { id: `TXN10002`, reference: `ORD-92019`, type: `debit`, amount: 54.2, source: `ShopKart Checkout`, category: `Shopping`, description: `Payment for Order #92019`, status: `success`, timestamp: new Date(Date.now() - 36e5 * 24).toISOString() }, { id: `TXN10003`, reference: `TRF-PPH-01893`, type: `debit`, amount: 25, source: `Sarah Tan`, category: `Transfer`, description: `Transfer to Sarah Tan`, status: `success`, timestamp: new Date(Date.now() - 36e5 * 48).toISOString() }, { id: `TXN10004`, reference: `CBK-DIT-99201`, type: `credit`, amount: 5, source: `DuitNow Promo`, category: `Rewards`, description: `DuitNow Campaign Cashback`, status: `success`, timestamp: new Date(Date.now() - 36e5 * 72).toISOString() }, { id: `TXN10005`, reference: `WTH-MYB-91029`, type: `debit`, amount: 100, source: `Maybank Acc *9102`, category: `Transfer`, description: `Withdrawal to bank account`, status: `pending`, timestamp: new Date(Date.now() - 36e5 * 120).toISOString() }]; p(e), localStorage.setItem(`amere_wallet_txs_${t}`, JSON.stringify(e)) } let n = localStorage.getItem(`amere_wallet_notifs_${t}`); if (n) h(JSON.parse(n)); else { let e = [{ id: `N1`, title: `Wallet Topped Up Successfully`, body: `RM 250.00 has been credited to your wallet via Maybank2u.`, timestamp: new Date(Date.now() - 36e5 * 2).toISOString(), unread: !1 }, { id: `N2`, title: `RM 5.00 Cashback Earned!`, body: `You earned cashback from claiming the DuitNow Welcome Promo.`, timestamp: new Date(Date.now() - 36e5 * 72).toISOString(), unread: !0 }, { id: `N3`, title: `Security PIN Set`, body: `Your 6-digit Wallet PIN has been successfully verified.`, timestamp: new Date(Date.now() - 36e5 * 200).toISOString(), unread: !1 }]; h(e), localStorage.setItem(`amere_wallet_notifs_${t}`, JSON.stringify(e)) } let r = localStorage.getItem(`amere_wallet_sec_${t}`); r && ae(JSON.parse(r)) }, [t]); let q = e => { ie(e), localStorage.setItem(`amere_wallet_delta_${t}`, e.toString()) }, J = e => { let n = [{ ...e, id: `TXN` + Math.floor(1e4 + Math.random() * 9e4), timestamp: new Date().toISOString() }, ...f]; p(n), localStorage.setItem(`amere_wallet_txs_${t}`, JSON.stringify(n)); let r = [{ id: `N` + Math.floor(1e3 + Math.random() * 9e3), title: e.type === `credit` ? `Funds Credited` : `Funds Debited`, body: `${e.type === `credit` ? `+` : `-`} RM ${e.amount.toFixed(2)}: ${e.description}`, timestamp: new Date().toISOString(), unread: !0 }, ...m]; h(r), localStorage.setItem(`amere_wallet_notifs_${t}`, JSON.stringify(r)) }, Ce = u?.balance || 0, Y = Math.max(0, Ce + d), we = (0, s.useMemo)(() => f.filter(e => e.status === `pending`).reduce((e, t) => e + (t.type === `debit` ? 0 : t.amount), 0), [f]), Te = (0, s.useMemo)(() => f.filter(e => e.category === `Rewards` && e.status === `success`).reduce((e, t) => e + t.amount, 0), [f]), Ee = Math.round(Y * 1.5 + Te * 10), De = () => { a(e => { let t = !e; return localStorage.setItem(`amere_wallet_theme`, t ? `dark` : `light`), t }) }, Oe = () => { l(e => { let t = !e; return localStorage.setItem(`amere_wallet_show_balance`, t ? `true` : `false`), t }) }, ke = () => { let e = m.map(e => ({ ...e, unread: !1 })); h(e), localStorage.setItem(`amere_wallet_notifs_${t}`, JSON.stringify(e)) }, X = (0, s.useMemo)(() => f.filter(e => { let t = e.description.toLowerCase().includes(_.toLowerCase()) || e.reference.toLowerCase().includes(_.toLowerCase()) || e.id.toLowerCase().includes(_.toLowerCase()), n = v === `all` ? !0 : e.type === v, r = y === `all` ? !0 : e.category === y; return t && n && r }), [f, _, v, y]), Ae = (0, s.useMemo)(() => { let e = (b - 1) * 5; return X.slice(e, e + 5) }, [X, b]), je = Math.ceil(X.length / 5) || 1, Z = (0, s.useMemo)(() => { let e = [45, 12, 0, 89, 23, 10, 0], t = [0, 250, 0, 0, 50, 0, 5], n = 0, r = 0, i = Date.now(); return f.forEach(e => { (i - new Date(e.timestamp).getTime()) / 36e5 <= 24 && e.status === `success` && (e.type === `credit` ? n += e.amount : r += e.amount) }), e[6] = Math.max(e[6], r), t[6] = Math.max(t[6], n), { days: [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun (Today)`], outflow: e, inflow: t, maxVal: Math.max(...t, ...e, 100) + 50 } }, [f]), Me = () => { O(!0), A(null), setTimeout(() => { q(d + N), J({ reference: `FPX-` + F.substring(0, 3).toUpperCase() + `-` + Math.floor(1e4 + Math.random() * 9e4), type: `credit`, amount: N, source: F, category: `Top Up`, description: `FPX Deposit via ${F}`, status: `success` }), O(!1), D(2) }, 1500) }, Ne = () => { let e = parseFloat(z); if (isNaN(e) || e <= 0) { A(`Please enter a valid withdrawal amount.`); return } if (e > Y) { A(`Insufficient wallet balance.`); return } if (!L.trim()) { A(`Please enter your bank account number.`); return } O(!0), A(null), setTimeout(() => { q(d - e), J({ reference: `WTH-` + I.substring(0, 3).toUpperCase() + `-` + Math.floor(1e4 + Math.random() * 9e4), type: `debit`, amount: e, source: `${I} Acc *${L.slice(-4) || `0000`}`, category: `Transfer`, description: `Withdrawal to ${I} Account`, status: `success` }), O(!1), D(3) }, 1500) }, Pe = () => { let e = parseFloat(U); if (isNaN(e) || e <= 0) { A(`Please enter a valid transfer amount.`); return } if (e > Y) { A(`Insufficient wallet balance.`); return } if (!V.trim()) { A(`Please enter a recipient phone number or email.`); return } O(!0), A(null), setTimeout(() => { q(d - e), J({ reference: `TRF-DIT-` + Math.floor(1e4 + Math.random() * 9e4), type: `debit`, amount: e, source: V, category: `Transfer`, description: `DuitNow Transfer to ${V}`, status: `success` }), O(!1), D(3) }, 1500) }, Fe = () => { let e = parseFloat(W); if (isNaN(e) || e <= 0) { A(`Please enter a valid request amount.`); return } D(2) }, Ie = () => { O(!0), setTimeout(() => { let e = 18.5; if (e > Y) { A(`Insufficient balance to scan and pay.`), O(!1); return } q(d - e), J({ reference: `QRP-DIT-` + Math.floor(1e4 + Math.random() * 9e4), type: `debit`, amount: e, source: `Kedai Kopi DuitNow Merchant`, category: `Food`, description: `DuitNow QR Payment to Kedai Kopi`, status: `success` }), O(!1), D(3) }, 2e3) }, Le = (e, t) => { Se(t => t.map(t => t.id === e ? { ...t, claimed: !0 } : t)), t > 0 && (q(d + t), J({ reference: `CBK-` + Math.floor(1e4 + Math.random() * 9e4), type: `credit`, amount: t, source: `eWallet Campaign Hub`, category: `Rewards`, description: `Cashback Reward Claimed`, status: `success` })) }, Q = (e, n) => { let r = { ...g, [e]: n }; ae(r), localStorage.setItem(`amere_wallet_sec_${t}`, JSON.stringify(r)) }, $ = e => { C(e), D(1), O(!1), A(null), M(``), B(``), R(``), H(``), me(``), ge(``), _e(``), ye(``) }; return (0, c.jsx)(ee, {
    title: `Digital Wallet`, children: (0, c.jsxs)(`div`, {
      className: `amere-wallet-container ${i ? `dark-theme` : `light-theme`}`, children: [(0, c.jsx)(`style`, {
        children: `
          .amere-wallet-container {
            --wallet-bg-primary: #ffffff;
            --wallet-bg-secondary: #f8fafc;
            --wallet-bg-glass: rgba(255, 255, 255, 0.7);
            --wallet-text-primary: #0f172a;
            --wallet-text-secondary: #64748b;
            --wallet-border: rgba(15, 23, 42, 0.08);
            --wallet-accent-teal: #3ec1bc;
            --wallet-accent-pink: #3ec1bc;
            --wallet-accent-emerald: #10b981;
            --wallet-accent-amber: #f59e0b;
            --wallet-accent-red: #ef4444;
            --wallet-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.03);
            --wallet-shadow-md: 0 8px 30px rgba(0, 0, 0, 0.05);
            --wallet-card-grad: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            --wallet-card-blur: blur(16px);
            --wallet-font: 'Inter', system-ui, -apple-system, sans-serif;
            
            font-family: var(--wallet-font);
            background: var(--wallet-bg-secondary);
            border-radius: 24px;
            padding: 24px;
            color: var(--wallet-text-primary);
            border: 1px solid var(--wallet-border);
            box-shadow: var(--wallet-shadow-md);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            width: 100%;
          }

          .amere-wallet-container.dark-theme {
            --wallet-bg-primary: #0f172a;
            --wallet-bg-secondary: #0b0f19;
            --wallet-bg-glass: rgba(15, 23, 42, 0.6);
            --wallet-text-primary: #f8fafc;
            --wallet-text-secondary: #94a3b8;
            --wallet-border: rgba(248, 250, 252, 0.1);
            --wallet-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
            --wallet-shadow-md: 0 12px 40px rgba(0, 0, 0, 0.3);
            --wallet-card-grad: linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #4338ca 100%);
          }

          /* General Layout Grid */
          .wallet-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: 20px;
          }
          
          @media (min-width: 992px) {
            .wallet-grid {
              grid-template-columns: 1.2fr 0.8fr;
            }
          }

          /* Header Section styling */
          .wallet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--wallet-border);
            padding-bottom: 16px;
          }

          .wallet-header-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .wallet-header-title h3 {
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            background: linear-gradient(90deg, var(--wallet-accent-teal), var(--wallet-accent-pink));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .wallet-badge-duitnow {
            background: linear-gradient(45deg, #ea1c24, #f58220);
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 10px;
            border-radius: 50px;
            letter-spacing: 0.5px;
          }

          .wallet-controls {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .control-btn {
            background: var(--wallet-bg-primary);
            border: 1px solid var(--wallet-border);
            color: var(--wallet-text-primary);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--wallet-shadow-sm);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }

          .control-btn:hover {
            transform: scale(1.08);
            border-color: var(--wallet-accent-teal);
          }

          .notif-badge-active {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 10px;
            height: 10px;
            background: var(--wallet-accent-pink);
            border-radius: 50%;
            border: 2px solid var(--wallet-bg-primary);
          }

          /* Card Styling with premium glass and glows */
          .premium-card {
            background: var(--wallet-card-grad);
            border-radius: 24px;
            padding: 28px;
            color: #ffffff;
            position: relative;
            overflow: hidden;
            box-shadow: 0 16px 36px rgba(79, 70, 229, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
          }

          .premium-card::before {
            content: '';
            position: absolute;
            top: -20%;
            right: -20%;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
            border-radius: 50%;
          }

          .premium-card::after {
            content: '';
            position: absolute;
            bottom: -10%;
            left: -10%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(62,193,188,0.2) 0%, transparent 70%);
            border-radius: 50%;
          }

          .card-chip-brand {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }

          .chip-icon {
            width: 48px;
            height: 36px;
            background: linear-gradient(135deg, #f3d052 0%, #caa11f 100%);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.2);
            position: relative;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }

          .chip-icon::after {
            content: '';
            position: absolute;
            top: 10%; left: 10%; right: 10%; bottom: 10%;
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 4px;
          }

          .brand-logo-card {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-style: italic;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .brand-logo-card span {
            color: var(--wallet-accent-teal);
          }

          .card-balance-section {
            margin-bottom: 24px;
          }

          .balance-label-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 6px;
          }

          .btn-eye-toggle {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: color 0.2s ease;
          }

          .btn-eye-toggle:hover {
            color: #ffffff;
          }

          .card-balance-display {
            font-size: 38px;
            font-weight: 800;
            letter-spacing: -0.5px;
            line-height: 1.1;
            display: flex;
            align-items: baseline;
          }

          .card-balance-display .curr {
            font-size: 20px;
            font-weight: 600;
            margin-right: 6px;
            color: rgba(255,255,255,0.8);
          }

          .sub-balance-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 18px;
          }

          .sub-balance-item .lbl {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 4px;
            display: block;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.3px;
          }

          .sub-balance-item .val {
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
          }

          /* Quick Actions Grid layout */
          .actions-card {
            background: var(--wallet-bg-primary);
            border-radius: 20px;
            padding: 24px;
            box-shadow: var(--wallet-shadow-sm);
            border: 1px solid var(--wallet-border);
          }

          .card-section-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--wallet-text-primary);
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .actions-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }

          .action-btn-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            outline: none;
            padding: 6px 0;
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .action-btn-item:hover {
            transform: translateY(-5px);
          }

          .action-icon-circle {
            width: 50px;
            height: 50px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--wallet-shadow-sm);
            transition: all 0.3s ease;
            position: relative;
          }

          .action-btn-item:hover .action-icon-circle {
            box-shadow: 0 8px 20px rgba(62, 193, 188, 0.25);
            background: var(--wallet-accent-teal) !important;
            color: #ffffff !important;
          }

          .action-btn-item:hover .action-icon-circle svg {
            stroke: #ffffff !important;
          }

          .action-btn-label {
            font-size: 11.5px;
            font-weight: 600;
            color: var(--wallet-text-secondary);
            text-align: center;
            line-height: 1.2;
            transition: color 0.2s ease;
          }

          .action-btn-item:hover .action-btn-label {
            color: var(--wallet-text-primary);
          }

          /* Chart Section container styling */
          .chart-card {
            background: var(--wallet-bg-primary);
            border-radius: 20px;
            padding: 24px;
            box-shadow: var(--wallet-shadow-sm);
            border: 1px solid var(--wallet-border);
            margin-top: 24px;
          }

          .svg-chart-container {
            width: 100%;
            height: 220px;
            position: relative;
            margin-top: 10px;
          }

          .chart-legend {
            display: flex;
            gap: 16px;
            font-size: 12px;
            font-weight: 600;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
          }

          /* Transaction Table & Filter styling */
          .tx-section-card {
            background: var(--wallet-bg-primary);
            border-radius: 20px;
            padding: 24px;
            box-shadow: var(--wallet-shadow-sm);
            border: 1px solid var(--wallet-border);
          }

          .tx-filters-row {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
          }

          @media (min-width: 768px) {
            .tx-filters-row {
              flex-direction: row;
              align-items: center;
            }
          }

          .tx-search-input-wrap {
            position: relative;
            flex-grow: 1;
          }

          .tx-search-input {
            width: 100%;
            padding: 10px 16px 10px 40px;
            border-radius: 12px;
            border: 1px solid var(--wallet-border);
            background: var(--wallet-bg-secondary);
            color: var(--wallet-text-primary);
            outline: none;
            font-size: 13.5px;
            transition: all 0.25s ease;
          }

          .tx-search-input:focus {
            border-color: var(--wallet-accent-teal);
            background: var(--wallet-bg-primary);
            box-shadow: 0 0 0 3px rgba(62,193,188,0.1);
          }

          .tx-search-icon-svg {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--wallet-text-secondary);
            pointer-events: none;
          }

          .filter-dropdown-select {
            padding: 10px 16px;
            border-radius: 12px;
            border: 1px solid var(--wallet-border);
            background: var(--wallet-bg-secondary);
            color: var(--wallet-text-primary);
            outline: none;
            font-size: 13.5px;
            cursor: pointer;
            transition: all 0.25s ease;
            min-width: 130px;
          }

          .filter-dropdown-select:focus {
            border-color: var(--wallet-accent-teal);
            background: var(--wallet-bg-primary);
          }

          /* Transaction List design */
          .tx-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .tx-row-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid var(--wallet-border);
            background: var(--wallet-bg-glass);
            cursor: pointer;
            transition: all 0.25s ease;
          }

          .tx-row-item:hover {
            transform: translateY(-2px);
            background: var(--wallet-bg-primary);
            box-shadow: var(--wallet-shadow-sm);
            border-color: var(--wallet-accent-teal);
          }

          .tx-item-left {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .tx-category-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
          }

          .tx-info-block .tx-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--wallet-text-primary);
            margin-bottom: 4px;
          }

          .tx-info-block .tx-meta {
            font-size: 11px;
            color: var(--wallet-text-secondary);
            font-weight: 500;
          }

          .tx-item-right {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
          }

          .tx-amount {
            font-size: 15px;
            font-weight: 800;
          }

          .tx-amount.credit {
            color: var(--wallet-accent-emerald);
          }

          .tx-amount.debit {
            color: var(--wallet-text-primary);
          }

          .tx-badge-status {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 10px;
            border-radius: 50px;
            text-transform: capitalize;
          }

          .tx-badge-status.success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--wallet-accent-emerald);
          }

          .tx-badge-status.pending {
            background: rgba(245, 158, 11, 0.1);
            color: var(--wallet-accent-amber);
          }

          .tx-badge-status.failed {
            background: rgba(239, 68, 68, 0.1);
            color: var(--wallet-accent-red);
          }

          .tx-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 14px;
            border-top: 1px solid var(--wallet-border);
          }

          .pagination-btn {
            padding: 8px 16px;
            border-radius: 8px;
            background: var(--wallet-bg-secondary);
            border: 1px solid var(--wallet-border);
            color: var(--wallet-text-primary);
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.2s ease;
          }

          .pagination-btn:hover:not(:disabled) {
            background: var(--wallet-accent-teal);
            color: #ffffff;
            border-color: var(--wallet-accent-teal);
          }

          .pagination-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          /* Vouchers and Rewards Cards */
          .rewards-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .voucher-card-item {
            background: var(--wallet-bg-primary);
            border: 1px solid var(--wallet-border);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: var(--wallet-shadow-sm);
            position: relative;
            overflow: hidden;
          }

          .voucher-card-item::after {
            content: '';
            position: absolute;
            left: -10px;
            top: calc(50% - 10px);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--wallet-bg-secondary);
            border-right: 1px solid var(--wallet-border);
          }

          .voucher-card-item::before {
            content: '';
            position: absolute;
            right: -10px;
            top: calc(50% - 10px);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--wallet-bg-secondary);
            border-left: 1px solid var(--wallet-border);
          }

          .voucher-info-block {
            padding-left: 12px;
            padding-right: 12px;
          }

          .voucher-title {
            font-size: 13.5px;
            font-weight: 700;
            color: var(--wallet-text-primary);
            margin-bottom: 4px;
          }

          .voucher-desc {
            font-size: 11px;
            color: var(--wallet-text-secondary);
            font-weight: 500;
          }

          .btn-voucher-claim {
            background: var(--wallet-accent-pink);
            color: #ffffff;
            border: none;
            padding: 6px 14px;
            font-size: 11.5px;
            font-weight: 700;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.25s ease;
          }

          .btn-voucher-claim:hover:not(:disabled) {
            transform: scale(1.05);
            background: #920b4e;
          }

          .btn-voucher-claim:disabled {
            background: rgba(15, 23, 42, 0.1);
            color: var(--wallet-text-secondary);
            cursor: not-allowed;
          }

          /* General Modal Layout overlay styles */
          .modal-overlay-custom {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(8px);
            z-index: 1050;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            animation: fadeInOverlay 0.25s ease-out;
          }

          .modal-content-custom {
            background: var(--wallet-bg-primary);
            border-radius: 24px;
            width: 100%;
            max-width: 480px;
            border: 1px solid var(--wallet-border);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            overflow: hidden;
            animation: slideUpModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            color: var(--wallet-text-primary);
          }

          .modal-header-custom {
            padding: 20px 24px;
            border-bottom: 1px solid var(--wallet-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-header-custom h4 {
            font-size: 18px;
            font-weight: 800;
            margin: 0;
          }

          .modal-close-btn {
            background: transparent;
            border: none;
            color: var(--wallet-text-secondary);
            cursor: pointer;
            font-size: 20px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
          }

          .modal-close-btn:hover {
            background: var(--wallet-bg-secondary);
            color: var(--wallet-text-primary);
          }

          .modal-body-custom {
            padding: 24px;
            max-height: 70vh;
            overflow-y: auto;
          }

          /* Top Up Flow styling */
          .grid-amounts-fpx {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }

          .btn-amount-choice {
            background: var(--wallet-bg-secondary);
            border: 1px solid var(--wallet-border);
            color: var(--wallet-text-primary);
            padding: 10px 0;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-amount-choice.active, .btn-amount-choice:hover {
            background: var(--wallet-accent-teal);
            color: #ffffff;
            border-color: var(--wallet-accent-teal);
          }

          .grid-payment-gateways {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }

          .btn-gateway-choice {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid var(--wallet-border);
            background: var(--wallet-bg-secondary);
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;
          }

          .btn-gateway-choice.active, .btn-gateway-choice:hover {
            border-color: var(--wallet-accent-teal);
            background: var(--wallet-bg-primary);
            box-shadow: var(--wallet-shadow-sm);
          }

          .gateway-radio {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid var(--wallet-text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .btn-gateway-choice.active .gateway-radio {
            border-color: var(--wallet-accent-teal);
          }

          .btn-gateway-choice.active .gateway-radio::after {
            content: '';
            width: 10px;
            height: 10px;
            background: var(--wallet-accent-teal);
            border-radius: 50%;
          }

          /* Pin code verification circles */
          .pin-inputs-row {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 20px;
            margin-bottom: 30px;
          }

          .pin-dot {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid var(--wallet-text-secondary);
            transition: all 0.15s ease;
          }

          .pin-dot.filled {
            background: var(--wallet-accent-pink);
            border-color: var(--wallet-accent-pink);
            transform: scale(1.15);
          }

          /* Virtual Numeric Pad */
          .num-pad-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            max-width: 320px;
            margin: 0 auto;
          }

          .btn-numpad {
            background: var(--wallet-bg-secondary);
            border: 1px solid var(--wallet-border);
            color: var(--wallet-text-primary);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .btn-numpad:active {
            background: var(--wallet-accent-teal);
            color: #ffffff;
            transform: scale(0.95);
          }

          /* Notification center drawer panel */
          .notif-drawer-overlay {
            position: fixed;
            top: 0; bottom: 0; left: 0; right: 0;
            background: rgba(15,23,42,0.4);
            z-index: 1060;
            backdrop-filter: blur(4px);
            animation: fadeInOverlay 0.2s ease-out;
          }

          .notif-drawer-content {
            position: fixed;
            top: 0; bottom: 0; right: 0;
            width: 100%;
            max-width: 380px;
            background: var(--wallet-bg-primary);
            border-left: 1px solid var(--wallet-border);
            box-shadow: -10px 0 40px rgba(0,0,0,0.15);
            z-index: 1061;
            display: flex;
            flex-direction: column;
            animation: slideLeftDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            color: var(--wallet-text-primary);
          }

          .drawer-header {
            padding: 20px;
            border-bottom: 1px solid var(--wallet-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .drawer-body {
            flex-grow: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .notif-alert-card {
            padding: 14px;
            border-radius: 12px;
            border: 1px solid var(--wallet-border);
            background: var(--wallet-bg-secondary);
            position: relative;
          }

          .notif-alert-card.unread {
            border-left: 3px solid var(--wallet-accent-pink);
            background: var(--wallet-bg-primary);
          }

          .notif-title {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .notif-body {
            font-size: 11.5px;
            color: var(--wallet-text-secondary);
            line-height: 1.4;
          }

          .notif-time {
            font-size: 9.5px;
            color: var(--wallet-text-secondary);
            margin-top: 8px;
            text-align: right;
          }

          /* Receipt printable voucher styling */
          .digital-receipt-wrap {
            border: 1px dashed var(--wallet-border);
            border-radius: 16px;
            padding: 24px;
            background: #ffffff;
            color: #000000;
            text-align: center;
          }

          .receipt-logo {
            font-weight: 900;
            font-size: 20px;
            margin-bottom: 16px;
            color: #3ec1bc;
          }

          .receipt-amt {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
          }

          .receipt-table {
            width: 100%;
            margin-top: 16px;
            margin-bottom: 24px;
            border-collapse: collapse;
          }

          .receipt-table td {
            padding: 8px 0;
            font-size: 12.5px;
            border-bottom: 1px solid #f1f5f9;
          }

          .receipt-table td:first-child {
            color: #64748b;
            text-align: left;
          }

          .receipt-table td:last-child {
            font-weight: 700;
            text-align: right;
          }

          .receipt-barcode {
            margin: 20px auto 10px auto;
            width: 180px;
            height: 48px;
            background: repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 6px);
            border-radius: 2px;
          }

          /* Camera scanning animation beam */
          .camera-scan-frame {
            width: 220px;
            height: 220px;
            border: 4px solid var(--wallet-accent-teal);
            border-radius: 24px;
            margin: 0 auto 20px auto;
            position: relative;
            background: rgba(0,0,0,0.1);
            overflow: hidden;
          }

          .scan-beam {
            width: 100%;
            height: 4px;
            background: var(--wallet-accent-teal);
            box-shadow: 0 0 10px var(--wallet-accent-teal);
            position: absolute;
            top: 0;
            animation: scanningBeamMotion 2s linear infinite;
          }

          /* Keyframe Animations */
          @keyframes fadeInOverlay {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUpModal {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes slideLeftDrawer {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          @keyframes scanningBeamMotion {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }

          /* Verification Screen Success Circle check */
          .success-circle-draw {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.1);
            border: 2px solid var(--wallet-accent-emerald);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            font-size: 38px;
            color: var(--wallet-accent-emerald);
            animation: bounceInSuccess 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          @keyframes bounceInSuccess {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }

          .tab-bar-sec {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            border-bottom: 1px solid var(--wallet-border);
            padding-bottom: 10px;
          }

          .tab-bar-btn {
            background: transparent;
            border: none;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 700;
            color: var(--wallet-text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
          }

          .tab-bar-btn.active {
            color: var(--wallet-accent-teal);
          }

          .tab-bar-btn.active::after {
            content: '';
            position: absolute;
            bottom: -11px;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--wallet-accent-teal);
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }
        `}), (0, c.jsxs)(`div`, { className: `wallet-header`, children: [(0, c.jsxs)(`div`, { className: `wallet-header-title`, children: [(0, c.jsx)(`h3`, { children: `Digital Wallet` }), (0, c.jsx)(`span`, { className: `wallet-badge-duitnow`, children: `DuitNow` })] }), (0, c.jsxs)(`div`, { className: `wallet-controls`, children: [(0, c.jsx)(`button`, { className: `control-btn`, onClick: De, title: `Toggle Dark/Light Mode`, children: i ? (0, c.jsxs)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: [(0, c.jsx)(`circle`, { cx: `12`, cy: `12`, r: `5` }), (0, c.jsx)(`path`, { d: `M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42` })] }) : (0, c.jsx)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z` }) }) }), (0, c.jsxs)(`button`, { className: `control-btn`, onClick: () => T(!0), title: `Notification Alerts`, children: [(0, c.jsx)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0` }) }), m.some(e => e.unread) && (0, c.jsx)(`div`, { className: `notif-badge-active` })] }), (0, c.jsx)(`button`, { className: `control-btn`, onClick: () => $(`settings`), title: `Security Center & Settings`, children: (0, c.jsx)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z` }) }) })] })] }), ne ? (0, c.jsxs)(`div`, { className: `text-center py-5`, children: [(0, c.jsx)(`div`, { className: `spinner-border text-info`, role: `status`, style: { width: `3rem`, height: `3rem` }, children: (0, c.jsx)(`span`, { className: `visually-hidden`, children: `Loading...` }) }), (0, c.jsx)(`p`, { className: `mt-3 text-muted`, children: `Securing DuitNow Wallet connection...` })] }) : (0, c.jsxs)(`div`, {
          className: `wallet-grid`, children: [(0, c.jsxs)(`div`, {
            className: `d-flex flex-column gap-4`, children: [(0, c.jsxs)(`div`, { className: `premium-card`, children: [(0, c.jsxs)(`div`, { className: `card-chip-brand`, children: [(0, c.jsx)(`div`, { className: `chip-icon` }), (0, c.jsxs)(`div`, { className: `brand-logo-card`, children: [(0, c.jsx)(`span`, { children: `Amere` }), `Wallet`] })] }), (0, c.jsxs)(`div`, { className: `card-balance-section`, children: [(0, c.jsxs)(`div`, { className: `balance-label-row`, children: [(0, c.jsx)(`span`, { children: `AVAILABLE BALANCE` }), (0, c.jsx)(`button`, { className: `btn-eye-toggle`, onClick: Oe, children: o ? (0, c.jsxs)(`svg`, { width: `15`, height: `15`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: [(0, c.jsx)(`path`, { d: `M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z` }), (0, c.jsx)(`circle`, { cx: `12`, cy: `12`, r: `3` })] }) : (0, c.jsx)(`svg`, { width: `15`, height: `15`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22` }) }) })] }), (0, c.jsxs)(`h1`, { className: `card-balance-display`, children: [(0, c.jsx)(`span`, { className: `curr`, children: `RM` }), o ? Y.toFixed(2) : `••••••`] })] }), (0, c.jsxs)(`div`, { className: `sub-balance-grid`, children: [(0, c.jsxs)(`div`, { className: `sub-balance-item`, children: [(0, c.jsx)(`span`, { className: `lbl`, children: `Pending` }), (0, c.jsxs)(`span`, { className: `val`, children: [`RM `, o ? we.toFixed(2) : `•••`] })] }), (0, c.jsxs)(`div`, { className: `sub-balance-item`, children: [(0, c.jsx)(`span`, { className: `lbl`, children: `Cashback` }), (0, c.jsxs)(`span`, { className: `val`, children: [`RM `, o ? Te.toFixed(2) : `•••`] })] }), (0, c.jsxs)(`div`, { className: `sub-balance-item`, children: [(0, c.jsx)(`span`, { className: `lbl`, children: `Reward Pts` }), (0, c.jsx)(`span`, { className: `val`, children: o ? Ee.toLocaleString() : `•••` })] })] })] }), (0, c.jsxs)(`div`, { className: `actions-card`, children: [(0, c.jsx)(`div`, { className: `card-section-title`, children: (0, c.jsx)(`span`, { children: `Quick Actions` }) }), (0, c.jsxs)(`div`, { className: `actions-grid`, children: [(0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`topup`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `rgba(62,193,188,0.1)`, color: `var(--wallet-accent-teal)` }, children: (0, c.jsx)(`svg`, { width: `22`, height: `22`, fill: `none`, stroke: `currentColor`, strokeWidth: `2.5`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M12 5v14M5 12h14` }) }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Top Up` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`transfer`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `rgba(193,16,105,0.1)`, color: `var(--wallet-accent-pink)` }, children: (0, c.jsx)(`svg`, { width: `22`, height: `22`, fill: `none`, stroke: `currentColor`, strokeWidth: `2.5`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M5 12h14M12 5l7 7-7 7` }) }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Send` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`qr`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `rgba(16,185,129,0.1)`, color: `var(--wallet-accent-emerald)` }, children: (0, c.jsxs)(`svg`, { width: `22`, height: `22`, fill: `none`, stroke: `currentColor`, strokeWidth: `2.5`, viewBox: `0 0 24 24`, children: [(0, c.jsx)(`path`, { d: `M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2` }), (0, c.jsx)(`rect`, { x: `7`, y: `7`, width: `10`, height: `10`, rx: `1` })] }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `QR Pay` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`withdraw`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `rgba(245,158,11,0.1)`, color: `var(--wallet-accent-amber)` }, children: (0, c.jsx)(`svg`, { width: `22`, height: `22`, fill: `none`, stroke: `currentColor`, strokeWidth: `2.5`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M19 14l-7 7-7-7M12 3v18` }) }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Withdraw` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`request`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `var(--wallet-border)`, color: `var(--wallet-text-secondary)` }, children: (0, c.jsx)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M17 17l-5-5-5 5M12 3v9` }) }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Request` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`topup`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `var(--wallet-border)`, color: `var(--wallet-text-secondary)` }, children: (0, c.jsxs)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: [(0, c.jsx)(`rect`, { x: `3`, y: `3`, width: `18`, height: `18`, rx: `2` }), (0, c.jsx)(`path`, { d: `M3 9h18m-12 6h6` })] }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Bills` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`topup`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `var(--wallet-border)`, color: `var(--wallet-text-secondary)` }, children: (0, c.jsx)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6` }) }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Bank Xfer` })] }), (0, c.jsxs)(`button`, { className: `action-btn-item`, onClick: () => $(`topup`), children: [(0, c.jsx)(`div`, { className: `action-icon-circle`, style: { background: `var(--wallet-border)`, color: `var(--wallet-text-secondary)` }, children: (0, c.jsx)(`svg`, { width: `20`, height: `20`, fill: `none`, stroke: `currentColor`, strokeWidth: `2`, viewBox: `0 0 24 24`, children: (0, c.jsx)(`path`, { d: `M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.73-5.19` }) }) }), (0, c.jsx)(`span`, { className: `action-btn-label`, children: `Reload` })] })] })] }), (0, c.jsxs)(`div`, {
              className: `chart-card`, children: [(0, c.jsxs)(`div`, { className: `d-flex justify-content-between align-items-center mb-3`, children: [(0, c.jsx)(`span`, { className: `card-section-title mb-0`, children: `Cash Flow Analytics` }), (0, c.jsxs)(`div`, { className: `chart-legend`, children: [(0, c.jsxs)(`div`, { className: `legend-item`, children: [(0, c.jsx)(`div`, { className: `legend-color`, style: { background: `var(--wallet-accent-emerald)` } }), (0, c.jsx)(`span`, { children: `Inflow` })] }), (0, c.jsxs)(`div`, { className: `legend-item`, children: [(0, c.jsx)(`div`, { className: `legend-color`, style: { background: `var(--wallet-accent-pink)` } }), (0, c.jsx)(`span`, { children: `Outflow` })] })] })] }), (0, c.jsxs)(`div`, {
                className: `svg-chart-container`, children: [(0, c.jsxs)(`svg`, {
                  width: `100%`, height: `100%`, viewBox: `0 0 500 200`, preserveAspectRatio: `none`, children: [(0, c.jsxs)(`defs`, { children: [(0, c.jsxs)(`linearGradient`, { id: `glowInflow`, x1: `0`, y1: `0`, x2: `0`, y2: `1`, children: [(0, c.jsx)(`stop`, { offset: `0%`, stopColor: `var(--wallet-accent-emerald)`, stopOpacity: `0.4` }), (0, c.jsx)(`stop`, { offset: `100%`, stopColor: `var(--wallet-accent-emerald)`, stopOpacity: `0.0` })] }), (0, c.jsxs)(`linearGradient`, { id: `glowOutflow`, x1: `0`, y1: `0`, x2: `0`, y2: `1`, children: [(0, c.jsx)(`stop`, { offset: `0%`, stopColor: `var(--wallet-accent-pink)`, stopOpacity: `0.3` }), (0, c.jsx)(`stop`, { offset: `100%`, stopColor: `var(--wallet-accent-pink)`, stopOpacity: `0.0` })] })] }), (0, c.jsx)(`line`, { x1: `40`, y1: `20`, x2: `480`, y2: `20`, stroke: `var(--wallet-border)`, strokeWidth: `1`, strokeDasharray: `4` }), (0, c.jsx)(`line`, { x1: `40`, y1: `70`, x2: `480`, y2: `70`, stroke: `var(--wallet-border)`, strokeWidth: `1`, strokeDasharray: `4` }), (0, c.jsx)(`line`, { x1: `40`, y1: `120`, x2: `480`, y2: `120`, stroke: `var(--wallet-border)`, strokeWidth: `1`, strokeDasharray: `4` }), (0, c.jsx)(`line`, { x1: `40`, y1: `170`, x2: `480`, y2: `170`, stroke: `var(--wallet-border)`, strokeWidth: `1` }), (0, c.jsx)(`path`, {
                    d: `M 40 170 
                          L 113.3 ${170 - Z.inflow[0] / Z.maxVal * 150} 
                          L 186.6 ${170 - Z.inflow[1] / Z.maxVal * 150} 
                          L 260 ${170 - Z.inflow[2] / Z.maxVal * 150} 
                          L 333.3 ${170 - Z.inflow[3] / Z.maxVal * 150} 
                          L 406.6 ${170 - Z.inflow[4] / Z.maxVal * 150} 
                          L 480 ${170 - Z.inflow[6] / Z.maxVal * 150} 
                          L 480 170 Z`, fill: `url(#glowInflow)`
                  }), (0, c.jsx)(`path`, {
                    d: `M 40 ${170 - Z.inflow[0] / Z.maxVal * 150} 
                          L 113.3 ${170 - Z.inflow[0] / Z.maxVal * 150} 
                          L 186.6 ${170 - Z.inflow[1] / Z.maxVal * 150} 
                          L 260 ${170 - Z.inflow[2] / Z.maxVal * 150} 
                          L 333.3 ${170 - Z.inflow[3] / Z.maxVal * 150} 
                          L 406.6 ${170 - Z.inflow[4] / Z.maxVal * 150} 
                          L 480 ${170 - Z.inflow[6] / Z.maxVal * 150}`, fill: `none`, stroke: `var(--wallet-accent-emerald)`, strokeWidth: `3.5`, strokeLinecap: `round`
                  }), (0, c.jsx)(`path`, {
                    d: `M 40 170 
                          L 113.3 ${170 - Z.outflow[0] / Z.maxVal * 150} 
                          L 186.6 ${170 - Z.outflow[1] / Z.maxVal * 150} 
                          L 260 ${170 - Z.outflow[2] / Z.maxVal * 150} 
                          L 333.3 ${170 - Z.outflow[3] / Z.maxVal * 150} 
                          L 406.6 ${170 - Z.outflow[4] / Z.maxVal * 150} 
                          L 480 ${170 - Z.outflow[6] / Z.maxVal * 150} 
                          L 480 170 Z`, fill: `url(#glowOutflow)`
                  }), (0, c.jsx)(`path`, {
                    d: `M 40 ${170 - Z.outflow[0] / Z.maxVal * 150} 
                          L 113.3 ${170 - Z.outflow[0] / Z.maxVal * 150} 
                          L 186.6 ${170 - Z.outflow[1] / Z.maxVal * 150} 
                          L 260 ${170 - Z.outflow[2] / Z.maxVal * 150} 
                          L 333.3 ${170 - Z.outflow[3] / Z.maxVal * 150} 
                          L 406.6 ${170 - Z.outflow[4] / Z.maxVal * 150} 
                          L 480 ${170 - Z.outflow[6] / Z.maxVal * 150}`, fill: `none`, stroke: `var(--wallet-accent-pink)`, strokeWidth: `3.5`, strokeLinecap: `round`
                  }), Z.inflow.map((e, t) => t === 0 ? null : (0, c.jsx)(`circle`, { cx: 40 + t * 73.3, cy: 170 - e / Z.maxVal * 150, r: `5`, fill: `#ffffff`, stroke: `var(--wallet-accent-emerald)`, strokeWidth: `2.5` }, `in-${t}`)), Z.outflow.map((e, t) => t === 0 ? null : (0, c.jsx)(`circle`, { cx: 40 + t * 73.3, cy: 170 - e / Z.maxVal * 150, r: `5`, fill: `#ffffff`, stroke: `var(--wallet-accent-pink)`, strokeWidth: `2.5` }, `out-${t}`))]
                }), (0, c.jsx)(`div`, { className: `d-flex justify-content-between px-4 text-muted`, style: { fontSize: `10.5px`, fontWeight: `600` }, children: Z.days.map((e, t) => (0, c.jsx)(`span`, { children: e }, t)) })]
              })]
            })]
          }), (0, c.jsxs)(`div`, { className: `d-flex flex-column gap-4`, children: [(0, c.jsxs)(`div`, { className: `tx-section-card`, children: [(0, c.jsx)(`span`, { className: `card-section-title`, children: `Transactions` }), (0, c.jsxs)(`div`, { className: `tx-filters-row`, children: [(0, c.jsxs)(`div`, { className: `tx-search-input-wrap`, children: [(0, c.jsxs)(`svg`, { className: `tx-search-icon-svg`, width: `16`, height: `16`, fill: `none`, stroke: `currentColor`, strokeWidth: `2.5`, viewBox: `0 0 24 24`, children: [(0, c.jsx)(`circle`, { cx: `11`, cy: `11`, r: `8` }), (0, c.jsx)(`path`, { d: `m21 21-4.3-4.3` })] }), (0, c.jsx)(`input`, { type: `text`, className: `tx-search-input`, placeholder: `Search ref or description...`, value: _, onChange: e => { oe(e.target.value), x(1) } })] }), (0, c.jsxs)(`select`, { className: `filter-dropdown-select`, value: v, onChange: e => { se(e.target.value), x(1) }, children: [(0, c.jsx)(`option`, { value: `all`, children: `All Flows` }), (0, c.jsx)(`option`, { value: `credit`, children: `Cash In` }), (0, c.jsx)(`option`, { value: `debit`, children: `Cash Out` })] }), (0, c.jsxs)(`select`, { className: `filter-dropdown-select`, value: y, onChange: e => { ce(e.target.value), x(1) }, children: [(0, c.jsx)(`option`, { value: `all`, children: `All Categories` }), (0, c.jsx)(`option`, { value: `Top Up`, children: `Top Up` }), (0, c.jsx)(`option`, { value: `Shopping`, children: `Shopping` }), (0, c.jsx)(`option`, { value: `Transfer`, children: `Transfer` }), (0, c.jsx)(`option`, { value: `Food`, children: `Food/Dining` }), (0, c.jsx)(`option`, { value: `Rewards`, children: `Rewards` })] })] }), Ae.length === 0 ? (0, c.jsx)(`div`, { className: `text-center py-5 border border-dashed rounded-4 var(--wallet-border)`, children: (0, c.jsx)(`p`, { className: `mb-0 text-muted`, children: `No transactions matching filters.` }) }) : (0, c.jsx)(`div`, { className: `tx-list`, children: Ae.map(e => { let t = e.type === `credit`, n = e.category === `Top Up` ? { bg: `rgba(62,193,188,0.15)`, col: `var(--wallet-accent-teal)` } : e.category === `Shopping` ? { bg: `rgba(193,16,105,0.15)`, col: `var(--wallet-accent-pink)` } : e.category === `Transfer` ? { bg: `rgba(245,158,11,0.15)`, col: `var(--wallet-accent-amber)` } : { bg: `rgba(16,185,129,0.15)`, col: `var(--wallet-accent-emerald)` }; return (0, c.jsxs)(`div`, { className: `tx-row-item`, onClick: () => { le(e), C(`details`) }, children: [(0, c.jsxs)(`div`, { className: `tx-item-left`, children: [(0, c.jsx)(`div`, { className: `tx-category-icon`, style: { background: n.bg, color: n.col }, children: e.category.charAt(0) }), (0, c.jsxs)(`div`, { className: `tx-info-block`, children: [(0, c.jsx)(`div`, { className: `tx-title`, children: e.description }), (0, c.jsx)(`div`, { className: `tx-meta`, children: new Date(e.timestamp).toLocaleDateString(`en-MY`, { day: `numeric`, month: `short`, hour: `2-digit`, minute: `2-digit` }) })] })] }), (0, c.jsxs)(`div`, { className: `tx-item-right`, children: [(0, c.jsxs)(`div`, { className: `tx-amount ${t ? `credit` : `debit`}`, children: [t ? `+` : `-`, ` RM `, e.amount.toFixed(2)] }), (0, c.jsx)(`span`, { className: `tx-badge-status ${e.status}`, children: e.status })] })] }, e.id) }) }), (0, c.jsxs)(`div`, { className: `tx-pagination`, children: [(0, c.jsx)(`button`, { className: `pagination-btn`, disabled: b === 1, onClick: () => x(e => e - 1), children: `Previous` }), (0, c.jsxs)(`span`, { style: { fontSize: `12px`, fontWeight: `700` }, children: [`Page `, b, ` of `, je] }), (0, c.jsx)(`button`, { className: `pagination-btn`, disabled: b === je, onClick: () => x(e => e + 1), children: `Next` })] })] }), (0, c.jsxs)(`div`, { className: `tx-section-card`, children: [(0, c.jsx)(`span`, { className: `card-section-title`, children: `Campaigns & Rewards` }), (0, c.jsx)(`div`, { className: `rewards-grid`, children: xe.map(e => (0, c.jsxs)(`div`, { className: `voucher-card-item`, children: [(0, c.jsxs)(`div`, { className: `voucher-info-block`, children: [(0, c.jsx)(`div`, { className: `voucher-title`, children: e.title }), (0, c.jsx)(`div`, { className: `voucher-desc`, children: e.desc })] }), (0, c.jsx)(`button`, { className: `btn-voucher-claim`, disabled: e.claimed, onClick: () => Le(e.id, e.value), children: e.claimed ? `Claimed` : e.value > 0 ? `Claim RM5` : `Claim` })] }, e.id)) })] })] })]
        }), S === `topup` && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `Wallet Top Up` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsx)(`div`, { className: `modal-body-custom`, children: E === 1 ? (0, c.jsxs)(c.Fragment, { children: [(0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label font-weight-700`, style: { fontSize: `13px` }, children: `TOP UP AMOUNT (RM)` }), (0, c.jsx)(`input`, { type: `number`, className: `form-control py-3`, style: { fontSize: `18px`, fontWeight: `700` }, value: N, onChange: e => P(Math.max(1, parseInt(e.target.value) || 0)) })] }), (0, c.jsx)(`div`, { className: `grid-amounts-fpx`, children: [10, 50, 100, 200].map(e => (0, c.jsxs)(`button`, { className: `btn-amount-choice ${N === e ? `active` : ``}`, onClick: () => P(e), children: [`RM `, e] }, e)) }), (0, c.jsx)(`label`, { className: `form-label font-weight-700 mt-2`, style: { fontSize: `13px` }, children: `SELECT FUNDING GATEWAY` }), (0, c.jsx)(`div`, { className: `grid-payment-gateways`, children: [`FPX - Maybank2u`, `FPX - CIMB Clicks`, `FPX - Public Bank`, `Visa / Mastercard`].map(e => (0, c.jsxs)(`button`, { className: `btn-gateway-choice ${F === e ? `active` : ``}`, onClick: () => fe(e), children: [(0, c.jsx)(`div`, { className: `gateway-radio` }), (0, c.jsx)(`span`, { style: { fontSize: `12px`, fontWeight: `600` }, children: e })] }, e)) }), k && (0, c.jsx)(`div`, { className: `alert alert-danger py-2`, children: k }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-3 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, disabled: de, onClick: Me, children: de ? `Connecting Gateway...` : `Top Up RM ${N.toFixed(2)}` })] }) : (0, c.jsxs)(`div`, { className: `text-center py-4`, children: [(0, c.jsx)(`div`, { className: `success-circle-draw`, children: `✓` }), (0, c.jsx)(`h5`, { className: `font-weight-800`, children: `Top Up Successful!` }), (0, c.jsxs)(`p`, { className: `text-muted mt-2 px-3`, style: { fontSize: `13px` }, children: [`RM `, N.toFixed(2), ` has been credited via `, (0, c.jsx)(`strong`, { children: F }), `. Your updated balance is active.`] }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-4 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, onClick: () => { C(null), K() }, children: `Done` })] }) })] }) }), S === `withdraw` && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `Withdrawal to Bank` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsx)(`div`, { className: `modal-body-custom`, children: E === 1 ? (0, c.jsxs)(c.Fragment, { children: [(0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `SELECT BANK` }), (0, c.jsxs)(`select`, { className: `form-select py-2.5`, value: I, onChange: e => pe(e.target.value), children: [(0, c.jsx)(`option`, { value: `Maybank`, children: `Maybank (Malayan Banking Berhad)` }), (0, c.jsx)(`option`, { value: `CIMB Bank`, children: `CIMB Bank Berhad` }), (0, c.jsx)(`option`, { value: `Public Bank`, children: `Public Bank Berhad` }), (0, c.jsx)(`option`, { value: `Hong Leong Bank`, children: `Hong Leong Bank Berhad` }), (0, c.jsx)(`option`, { value: `RHB Bank`, children: `RHB Bank Berhad` }), (0, c.jsx)(`option`, { value: `AmBank`, children: `AmBank Berhad` })] })] }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `BANK ACCOUNT NUMBER` }), (0, c.jsx)(`input`, { type: `text`, className: `form-control`, placeholder: `Enter account number...`, value: L, onChange: e => R(e.target.value.replace(/[^0-9]/g, ``)) })] }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `AMOUNT (RM)` }), (0, c.jsx)(`input`, { type: `number`, className: `form-control`, placeholder: `Min RM 10.00`, value: z, onChange: e => B(e.target.value) }), (0, c.jsxs)(`span`, { className: `text-muted mt-1 d-inline-block`, style: { fontSize: `11px` }, children: [`Max limit: RM `, Y.toFixed(2)] })] }), k && (0, c.jsx)(`div`, { className: `alert alert-danger py-2`, children: k }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-3 text-white font-weight-700`, style: { background: `var(--wallet-accent-pink)`, borderRadius: `12px` }, onClick: () => { let e = parseFloat(z); if (isNaN(e) || e <= 0 || e > Y || !L) { A(`Please input valid withdrawal details.`); return } A(null), D(2) }, children: `Continue` })] }) : E === 2 ? (0, c.jsxs)(`div`, { className: `text-center`, children: [(0, c.jsx)(`h5`, { className: `font-weight-800`, children: `Enter Wallet PIN` }), (0, c.jsxs)(`p`, { className: `text-muted`, style: { fontSize: `12.5px` }, children: [`Enter your 6-digit Wallet PIN to authorize withdrawal of `, (0, c.jsxs)(`strong`, { children: [`RM `, parseFloat(z).toFixed(2)] }), `.`] }), (0, c.jsx)(`div`, { className: `pin-inputs-row`, children: [1, 2, 3, 4, 5, 6].map(e => (0, c.jsx)(`div`, { className: `pin-dot ${j.length >= e ? `filled` : ``}` }, e)) }), (0, c.jsxs)(`div`, { className: `num-pad-grid mt-4`, children: [[1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => (0, c.jsx)(`button`, { className: `btn-numpad`, onClick: () => { if (j.length < 6) { let t = j + e; M(t), t.length === 6 && Ne() } }, children: e }, e)), (0, c.jsx)(`button`, { className: `btn-numpad`, style: { fontSize: `14px` }, onClick: () => M(``), children: `Clear` }), (0, c.jsx)(`button`, { className: `btn-numpad`, onClick: () => { if (j.length < 6) { let e = j + `0`; M(e), e.length === 6 && Ne() } }, children: `0` }), (0, c.jsx)(`button`, { className: `btn-numpad`, style: { fontSize: `14px` }, onClick: () => M(e => e.slice(0, -1)), children: `⌫` })] })] }) : (0, c.jsxs)(`div`, { className: `text-center py-4`, children: [(0, c.jsx)(`div`, { className: `success-circle-draw`, children: `✓` }), (0, c.jsx)(`h5`, { className: `font-weight-800`, children: `Withdrawal Submitted` }), (0, c.jsxs)(`p`, { className: `text-muted mt-2 px-3`, style: { fontSize: `13px` }, children: [`RM `, parseFloat(z).toFixed(2), ` is being transferred to your `, (0, c.jsx)(`strong`, { children: I }), ` account (A/C *`, L.slice(-4), `). Real processing takes 1-2 bank working days.`] }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-4 text-white font-weight-700`, style: { background: `var(--wallet-accent-pink)`, borderRadius: `12px` }, onClick: () => { C(null), K() }, children: `Done` })] }) })] }) }), S === `transfer` && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `DuitNow Fund Transfer` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsx)(`div`, { className: `modal-body-custom`, children: E === 1 ? (0, c.jsxs)(c.Fragment, { children: [(0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `RECIPIENT MOBILE OR EMAIL` }), (0, c.jsx)(`input`, { type: `text`, className: `form-control py-2.5`, placeholder: `e.g. +60123456789 or name@domain.com`, value: V, onChange: e => H(e.target.value) })] }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `AMOUNT (RM)` }), (0, c.jsx)(`input`, { type: `number`, className: `form-control`, placeholder: `RM 0.00`, value: U, onChange: e => me(e.target.value) }), (0, c.jsxs)(`span`, { className: `text-muted mt-1 d-inline-block`, style: { fontSize: `11px` }, children: [`Max limit: RM `, Y.toFixed(2)] })] }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `MESSAGE / REFERENCE (OPTIONAL)` }), (0, c.jsx)(`input`, { type: `text`, className: `form-control`, placeholder: `e.g. Lunch money`, value: he, onChange: e => ge(e.target.value) })] }), k && (0, c.jsx)(`div`, { className: `alert alert-danger py-2`, children: k }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-3 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, onClick: () => { let e = parseFloat(U); if (isNaN(e) || e <= 0 || e > Y || !V) { A(`Please input valid transfer details.`); return } A(null), D(2) }, children: `Authorize Transfer` })] }) : E === 2 ? (0, c.jsxs)(`div`, { className: `text-center`, children: [(0, c.jsx)(`h5`, { className: `font-weight-800`, children: `Enter Wallet PIN` }), (0, c.jsxs)(`p`, { className: `text-muted`, style: { fontSize: `12.5px` }, children: [`Authorize sending `, (0, c.jsxs)(`strong`, { children: [`RM `, parseFloat(U).toFixed(2)] }), ` to `, (0, c.jsx)(`strong`, { children: V }), `.`] }), (0, c.jsx)(`div`, { className: `pin-inputs-row`, children: [1, 2, 3, 4, 5, 6].map(e => (0, c.jsx)(`div`, { className: `pin-dot ${j.length >= e ? `filled` : ``}` }, e)) }), (0, c.jsxs)(`div`, { className: `num-pad-grid mt-4`, children: [[1, 2, 3, 4, 5, 6, 7, 8, 9].map(e => (0, c.jsx)(`button`, { className: `btn-numpad`, onClick: () => { if (j.length < 6) { let t = j + e; M(t), t.length === 6 && Pe() } }, children: e }, e)), (0, c.jsx)(`button`, { className: `btn-numpad`, style: { fontSize: `14px` }, onClick: () => M(``), children: `Clear` }), (0, c.jsx)(`button`, { className: `btn-numpad`, onClick: () => { if (j.length < 6) { let e = j + `0`; M(e), e.length === 6 && Pe() } }, children: `0` }), (0, c.jsx)(`button`, { className: `btn-numpad`, style: { fontSize: `14px` }, onClick: () => M(e => e.slice(0, -1)), children: `⌫` })] })] }) : (0, c.jsxs)(`div`, { className: `text-center py-4`, children: [(0, c.jsx)(`div`, { className: `success-circle-draw`, children: `✓` }), (0, c.jsx)(`h5`, { className: `font-weight-800`, children: `Transfer Successful!` }), (0, c.jsxs)(`p`, { className: `text-muted mt-2 px-3`, style: { fontSize: `13px` }, children: [`RM `, parseFloat(U).toFixed(2), ` has been sent instantly to `, (0, c.jsx)(`strong`, { children: V }), ` via DuitNow Transfer.`] }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-4 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, onClick: () => { C(null), K() }, children: `Close` })] }) })] }) }), S === `request` && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `Request Money` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsx)(`div`, { className: `modal-body-custom`, children: E === 1 ? (0, c.jsxs)(c.Fragment, { children: [(0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `REQUEST AMOUNT (RM)` }), (0, c.jsx)(`input`, { type: `number`, className: `form-control`, placeholder: `RM 0.00`, value: W, onChange: e => _e(e.target.value) })] }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `13px`, fontWeight: `700` }, children: `MEMO / NOTE FOR PAYEE` }), (0, c.jsx)(`input`, { type: `text`, className: `form-control`, placeholder: `e.g. Shared lunch bill`, value: ve, onChange: e => ye(e.target.value) })] }), k && (0, c.jsx)(`div`, { className: `alert alert-danger py-2`, children: k }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-3 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, onClick: Fe, children: `Generate Request QR` })] }) : (0, c.jsxs)(`div`, { className: `text-center py-4`, children: [(0, c.jsx)(`h5`, { className: `font-weight-800`, children: `Scan to Pay Me` }), (0, c.jsxs)(`p`, { className: `text-muted`, style: { fontSize: `12.5px` }, children: [`Show this DuitNow Request QR to your friend to receive `, (0, c.jsxs)(`strong`, { children: [`RM `, parseFloat(W).toFixed(2)] }), `.`] }), (0, c.jsx)(`div`, { className: `bg-white p-3 d-inline-block rounded-4 shadow-sm border border-light my-3`, children: (0, c.jsxs)(`svg`, { width: `180`, height: `180`, viewBox: `0 0 100 100`, children: [(0, c.jsx)(`rect`, { x: `0`, y: `0`, width: `30`, height: `30`, fill: `#000`, rx: `3` }), (0, c.jsx)(`rect`, { x: `5`, y: `5`, width: `20`, height: `20`, fill: `#fff`, rx: `2` }), (0, c.jsx)(`rect`, { x: `10`, y: `10`, width: `10`, height: `10`, fill: `#ea1c24` }), (0, c.jsx)(`rect`, { x: `70`, y: `0`, width: `30`, height: `30`, fill: `#000`, rx: `3` }), (0, c.jsx)(`rect`, { x: `75`, y: `5`, width: `20`, height: `20`, fill: `#fff`, rx: `2` }), (0, c.jsx)(`rect`, { x: `80`, y: `80`, width: `10`, height: `10`, fill: `#ea1c24` }), (0, c.jsx)(`rect`, { x: `0`, y: `70`, width: `30`, height: `30`, fill: `#000`, rx: `3` }), (0, c.jsx)(`rect`, { x: `5`, y: `75`, width: `20`, height: `20`, fill: `#fff`, rx: `2` }), (0, c.jsx)(`rect`, { x: `10`, y: `80`, width: `10`, height: `10`, fill: `#ea1c24` }), (0, c.jsx)(`rect`, { x: `40`, y: `40`, width: `20`, height: `20`, fill: `#ea1c24`, rx: `4` }), (0, c.jsx)(`text`, { x: `50`, y: `52`, fill: `#fff`, fontSize: `6`, fontWeight: `bold`, textAnchor: `middle`, children: `DN` }), (0, c.jsx)(`rect`, { x: `35`, y: `10`, width: `10`, height: `5`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `50`, y: `5`, width: `15`, height: `10`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `40`, y: `20`, width: `25`, height: `5`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `10`, y: `40`, width: `5`, height: `25`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `25`, y: `50`, width: `10`, height: `10`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `70`, y: `45`, width: `20`, height: `5`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `80`, y: `60`, width: `15`, height: `15`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `45`, y: `70`, width: `15`, height: `10`, fill: `#000` })] }) }), (0, c.jsx)(`div`, { className: `alert alert-secondary py-2 border-0 mt-3`, style: { fontSize: `11.5px`, cursor: `pointer` }, children: `📋 Copy Shareable Payment URL` }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-4 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, onClick: () => C(null), children: `Done` })] }) })] }) }), S === `qr` && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `DuitNow QR Pay` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsxs)(`div`, { className: `modal-body-custom`, children: [(0, c.jsxs)(`div`, { className: `tab-bar-sec`, children: [(0, c.jsx)(`button`, { className: `tab-bar-btn ${G === `scan` ? `active` : ``}`, onClick: () => { be(`scan`), D(1) }, children: `Scan Merchant QR` }), (0, c.jsx)(`button`, { className: `tab-bar-btn ${G === `present` ? `active` : ``}`, onClick: () => { be(`present`), D(1) }, children: `Present My Code` })] }), G === `scan` ? E === 1 ? (0, c.jsxs)(`div`, { className: `text-center py-2`, children: [(0, c.jsx)(`div`, { className: `camera-scan-frame`, children: (0, c.jsx)(`div`, { className: `scan-beam` }) }), (0, c.jsx)(`p`, { className: `text-muted`, style: { fontSize: `13px` }, children: `Align DuitNow or shop QR code inside the scanning frame to proceed.` }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-3 text-white font-weight-700`, style: { background: `var(--wallet-accent-emerald)`, borderRadius: `12px` }, onClick: Ie, children: `[Simulate] Code Found (RM18.50)` })] }) : E === 2 ? (0, c.jsxs)(`div`, { className: `text-center py-5`, children: [(0, c.jsx)(`div`, { className: `spinner-border text-success`, role: `status`, style: { width: `3rem`, height: `3rem` } }), (0, c.jsx)(`h5`, { className: `font-weight-800 mt-4`, children: `Processing DuitNow QR...` })] }) : (0, c.jsxs)(`div`, { className: `text-center py-4`, children: [(0, c.jsx)(`div`, { className: `success-circle-draw`, children: `✓` }), (0, c.jsx)(`h5`, { className: `font-weight-800`, children: `QR Payment Approved` }), (0, c.jsxs)(`p`, { className: `text-muted mt-2 px-3`, style: { fontSize: `13px` }, children: [`RM 18.50 paid successfully to `, (0, c.jsx)(`strong`, { children: `Kedai Kopi DuitNow Merchant` }), `.`] }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-4 text-white font-weight-700`, style: { background: `var(--wallet-accent-emerald)`, borderRadius: `12px` }, onClick: () => { C(null), K() }, children: `Done` })] }) : (0, c.jsxs)(`div`, { className: `text-center py-4`, children: [(0, c.jsx)(`p`, { className: `text-muted`, style: { fontSize: `12.5px` }, children: `Present this screen to the cashier/scanner. The code updates automatically.` }), (0, c.jsxs)(`div`, { className: `bg-white p-4 d-inline-block rounded-4 shadow-sm border border-light my-3 text-center`, children: [(0, c.jsx)(`div`, { className: `receipt-barcode`, style: { width: `260px`, height: `70px`, margin: `0 auto 16px auto` } }), (0, c.jsx)(`div`, { className: `d-flex justify-content-center align-items-center gap-3`, children: (0, c.jsxs)(`svg`, { width: `100`, height: `100`, viewBox: `0 0 100 100`, className: `opacity-75`, children: [(0, c.jsx)(`rect`, { x: `0`, y: `0`, width: `30`, height: `30`, fill: `#000`, rx: `3` }), (0, c.jsx)(`rect`, { x: `5`, y: `5`, width: `20`, height: `20`, fill: `#fff`, rx: `2` }), (0, c.jsx)(`rect`, { x: `10`, y: `10`, width: `10`, height: `10`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `70`, y: `0`, width: `30`, height: `30`, fill: `#000`, rx: `3` }), (0, c.jsx)(`rect`, { x: `75`, y: `5`, width: `20`, height: `20`, fill: `#fff`, rx: `2` }), (0, c.jsx)(`rect`, { x: `0`, y: `70`, width: `30`, height: `30`, fill: `#000`, rx: `3` }), (0, c.jsx)(`rect`, { x: `5`, y: `75`, width: `20`, height: `20`, fill: `#fff`, rx: `2` }), (0, c.jsx)(`rect`, { x: `40`, y: `40`, width: `20`, height: `20`, fill: `#000` }), (0, c.jsx)(`rect`, { x: `80`, y: `80`, width: `10`, height: `10`, fill: `#000` })] }) })] }), (0, c.jsx)(`button`, { className: `btn w-100 py-3 mt-4 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `12px` }, onClick: () => C(null), children: `Done` })] })] })] }) }), S === `details` && w && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `Receipt Voucher` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsxs)(`div`, { className: `modal-body-custom`, children: [(0, c.jsxs)(`div`, { className: `digital-receipt-wrap`, children: [(0, c.jsx)(`div`, { className: `receipt-logo`, children: `AmerePay Receipt` }), (0, c.jsxs)(`div`, { className: `receipt-amt`, style: { color: w.type === `credit` ? `var(--wallet-accent-emerald)` : `#000000` }, children: [w.type === `credit` ? `+` : `-`, ` RM `, w.amount.toFixed(2)] }), (0, c.jsx)(`span`, { className: `tx-badge-status ${w.status} d-inline-block mb-3`, children: w.status }), (0, c.jsx)(`table`, { className: `receipt-table`, children: (0, c.jsxs)(`tbody`, { children: [(0, c.jsxs)(`tr`, { children: [(0, c.jsx)(`td`, { children: `Transaction ID` }), (0, c.jsx)(`td`, { children: w.id })] }), (0, c.jsxs)(`tr`, { children: [(0, c.jsx)(`td`, { children: `Reference Number` }), (0, c.jsx)(`td`, { children: w.reference })] }), (0, c.jsxs)(`tr`, { children: [(0, c.jsx)(`td`, { children: `Date / Time` }), (0, c.jsx)(`td`, { children: new Date(w.timestamp).toLocaleString(`en-MY`) })] }), (0, c.jsxs)(`tr`, { children: [(0, c.jsx)(`td`, { children: `Category` }), (0, c.jsx)(`td`, { children: w.category })] }), (0, c.jsxs)(`tr`, { children: [(0, c.jsx)(`td`, { children: `Payment Method` }), (0, c.jsx)(`td`, { children: w.source })] }), (0, c.jsxs)(`tr`, { children: [(0, c.jsx)(`td`, { children: `Description` }), (0, c.jsx)(`td`, { children: w.description })] })] }) }), (0, c.jsx)(`div`, { className: `receipt-barcode` }), (0, c.jsx)(`span`, { className: `text-muted`, style: { fontSize: `10px` }, children: `Secured DuitNow Fintech Receipt Voucher` })] }), (0, c.jsxs)(`div`, { className: `d-flex gap-3 mt-4`, children: [(0, c.jsx)(`button`, { className: `btn btn-outline-secondary w-50 py-2.5 font-weight-700`, style: { borderRadius: `10px` }, onClick: () => C(null), children: `Close` }), (0, c.jsx)(`button`, { className: `btn w-50 py-2.5 text-white font-weight-700`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `10px` }, onClick: () => { alert(`Downloading premium PDF Transaction Receipt...`) }, children: `Download Receipt` })] })] })] }) }), S === `settings` && (0, c.jsx)(`div`, { className: `modal-overlay-custom`, onClick: () => C(null), children: (0, c.jsxs)(`div`, { className: `modal-content-custom`, onClick: e => e.stopPropagation(), children: [(0, c.jsxs)(`div`, { className: `modal-header-custom`, children: [(0, c.jsx)(`h4`, { children: `Security & Settings` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => C(null), children: `×` })] }), (0, c.jsxs)(`div`, { className: `modal-body-custom`, style: { maxHeight: `75vh` }, children: [(0, c.jsx)(`span`, { className: `font-weight-800 text-uppercase text-muted d-block mb-3`, style: { fontSize: `11px`, letterSpacing: `1px` }, children: `Wallet Security` }), (0, c.jsxs)(`div`, { className: `d-flex justify-content-between align-items-center mb-3`, children: [(0, c.jsxs)(`div`, { children: [(0, c.jsx)(`div`, { style: { fontSize: `13.5px`, fontWeight: `700` }, children: `Two-Factor Auth (OTP)` }), (0, c.jsx)(`div`, { className: `text-muted`, style: { fontSize: `11.5px` }, children: `Request SMS/Email OTP for logins` })] }), (0, c.jsx)(`div`, { className: `form-check form-switch`, children: (0, c.jsx)(`input`, { className: `form-check-input`, type: `checkbox`, role: `switch`, style: { transform: `scale(1.2)`, cursor: `pointer` }, checked: g.twoFactorEnabled, onChange: e => Q(`twoFactorEnabled`, e.target.checked) }) })] }), (0, c.jsxs)(`div`, { className: `d-flex justify-content-between align-items-center mb-3`, children: [(0, c.jsxs)(`div`, { children: [(0, c.jsx)(`div`, { style: { fontSize: `13.5px`, fontWeight: `700` }, children: `Biometric Access` }), (0, c.jsx)(`div`, { className: `text-muted`, style: { fontSize: `11.5px` }, children: `Fast login via Touch ID / Face ID` })] }), (0, c.jsx)(`div`, { className: `form-check form-switch`, children: (0, c.jsx)(`input`, { className: `form-check-input`, type: `checkbox`, role: `switch`, style: { transform: `scale(1.2)`, cursor: `pointer` }, checked: g.biometricEnabled, onChange: e => Q(`biometricEnabled`, e.target.checked) }) })] }), (0, c.jsxs)(`div`, { className: `mb-4`, children: [(0, c.jsx)(`div`, { style: { fontSize: `13.5px`, fontWeight: `700` }, children: `Wallet Security PIN` }), (0, c.jsx)(`div`, { className: `text-muted mb-2`, style: { fontSize: `11.5px` }, children: `6-digit payment validation PIN setup` }), (0, c.jsx)(`button`, { className: `btn btn-sm btn-outline-secondary`, onClick: () => alert(`PIN resetting simulated email sent.`), children: `Update 6-digit PIN` })] }), (0, c.jsxs)(`div`, { className: `mb-4`, children: [(0, c.jsx)(`span`, { className: `font-weight-800 text-uppercase text-muted d-block mb-2`, style: { fontSize: `11px`, letterSpacing: `1px` }, children: `Trusted Devices` }), (0, c.jsx)(`ul`, { className: `list-group`, children: g.trustedDevices.map((e, t) => (0, c.jsxs)(`li`, { className: `list-group-item d-flex justify-content-between align-items-center py-2`, style: { fontSize: `12px`, background: `transparent` }, children: [(0, c.jsx)(`span`, { children: e }), t > 0 && (0, c.jsx)(`button`, { className: `btn btn-sm text-danger p-0`, onClick: () => { Q(`trustedDevices`, g.trustedDevices.filter((e, n) => n !== t)) }, children: `Revoke` })] }, t)) })] }), (0, c.jsx)(`span`, { className: `font-weight-800 text-uppercase text-muted d-block mb-3`, style: { fontSize: `11px`, letterSpacing: `1px` }, children: `Wallet Preferences` }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `12.5px`, fontWeight: `700` }, children: `SYSTEM LANGUAGE` }), (0, c.jsxs)(`select`, { className: `form-select`, style: { fontSize: `13px` }, children: [(0, c.jsx)(`option`, { value: `en`, children: `English (US / UK)` }), (0, c.jsx)(`option`, { value: `bm`, children: `Bahasa Malaysia (Melayu)` })] })] }), (0, c.jsxs)(`div`, { className: `form-group mb-3`, children: [(0, c.jsx)(`label`, { className: `form-label`, style: { fontSize: `12.5px`, fontWeight: `700` }, children: `AUTO TOP-UP TRIGGER` }), (0, c.jsxs)(`select`, { className: `form-select`, style: { fontSize: `13px` }, children: [(0, c.jsx)(`option`, { value: `disabled`, children: `Disabled (Manual Top Up)` }), (0, c.jsx)(`option`, { value: `20`, children: `Balance below RM 20 (Auto-reload RM50)` }), (0, c.jsx)(`option`, { value: `50`, children: `Balance below RM 50 (Auto-reload RM100)` })] })] }), (0, c.jsx)(`button`, { className: `btn w-100 py-2.5 text-white font-weight-700 mt-3`, style: { background: `var(--wallet-accent-teal)`, borderRadius: `10px` }, onClick: () => C(null), children: `Save Settings` })] })] }) }), ue && (0, c.jsxs)(c.Fragment, { children: [(0, c.jsx)(`div`, { className: `notif-drawer-overlay`, onClick: () => T(!1) }), (0, c.jsxs)(`div`, { className: `notif-drawer-content`, children: [(0, c.jsxs)(`div`, { className: `drawer-header`, children: [(0, c.jsx)(`span`, { className: `font-weight-800`, style: { fontSize: `16px` }, children: `Notifications Center` }), (0, c.jsxs)(`div`, { className: `d-flex align-items-center gap-3`, children: [(0, c.jsx)(`button`, { className: `btn btn-sm btn-link p-0 text-decoration-none font-weight-700`, style: { fontSize: `12px`, color: `var(--wallet-accent-teal)` }, onClick: ke, children: `Read All` }), (0, c.jsx)(`button`, { className: `modal-close-btn`, onClick: () => T(!1), children: `×` })] })] }), (0, c.jsx)(`div`, { className: `drawer-body`, children: m.length === 0 ? (0, c.jsx)(`div`, { className: `text-center py-5`, children: (0, c.jsx)(`p`, { className: `text-muted`, children: `No messages found.` }) }) : m.map(e => (0, c.jsxs)(`div`, { className: `notif-alert-card ${e.unread ? `unread` : ``}`, children: [(0, c.jsx)(`div`, { className: `notif-title`, children: e.title }), (0, c.jsx)(`div`, { className: `notif-body`, children: e.body }), (0, c.jsx)(`div`, { className: `notif-time`, children: new Date(e.timestamp).toLocaleDateString(`en-MY`, { day: `numeric`, month: `short`, hour: `2-digit`, minute: `2-digit` }) })] }, e.id)) })] })] })]
    })
  })
} var u = () => (0, c.jsxs)(c.Fragment, { children: [(0, c.jsx)(o, { title: `My Wallet | 2Deal - Premium Digital eWallet`, description: `Manage your wallet balance, transactions, bank transfers, and rewards.` }), (0, c.jsx)(a, {}), (0, c.jsx)(l, {})] }); export { u as default };