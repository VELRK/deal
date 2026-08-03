import { o as j, r as l, j as e, L as z, p as v, x as N } from "./index-CUVxoUft.js"; import { A as P, a as k } from "./AccountSection-BkwFlNCU.js"; import { P as R } from "./PageMeta-DWfEskmy.js"; function M() { return new Promise(c => { if (window.Razorpay) { c(!0); return } const n = document.createElement("script"); n.src = "https://checkout.razorpay.com/v1/checkout.js", n.onload = () => c(!0), n.onerror = () => c(!1), document.body.appendChild(n) }) } const S = 5, F = [50, 100, 200, 500]; function A() {
  const c = j(), [n, f] = l.useState(""), [u, s] = l.useState(!1), [x, o] = l.useState(null), [y, m] = l.useState(null), r = parseFloat(n), g = l.useMemo(() => isNaN(r) || r <= 0 ? 0 : Math.round(r * S), [r]); function b(a) { f(a.toString()), o(null) } async function h(a) { if (!await M()) { o("Could not load payment gateway. Please try again."), s(!1); return } new window.Razorpay({ key: a.key_id, amount: a.amount, currency: a.currency, order_id: a.razorpay_order_id, name: "2Deal", description: `Wallet top-up RM ${(a.amount_rm ?? r).toFixed(2)}`, image: "/deal/frontend/assets/logo/logo.png", prefill: a.prefill ?? {}, theme: { color: "#3EC1BC" }, handler: async p => { try { const d = await N.verifyWalletTopup({ razorpay_order_id: p.razorpay_order_id, razorpay_payment_id: p.razorpay_payment_id, razorpay_signature: p.razorpay_signature, reference: a.reference }); d.data?.success ? (m(d.data.message || `RM ${r.toFixed(2)} added to your wallet${a.points ? ` (${a.points} pts)` : ""}.`), setTimeout(() => c("/account-wallet?topup=success"), 1200)) : o(d.data?.message || "Payment verification failed.") } catch (d) { const _ = d?.response?.data?.message; o(_ ?? "Payment received but verification failed. Contact support.") } finally { s(!1) } }, modal: { ondismiss: () => { o("Payment cancelled. No amount was charged."), s(!1) } } }).open() } async function w(a) { if (a.preventDefault(), o(null), m(null), isNaN(r) || r < 1) { o("Enter at least RM 1.00 to top up."); return } s(!0); try { const i = await v.topupWallet({ amount: r }); if (!i.data?.success) { o(i.data?.message || "Failed to start top-up."), s(!1); return } const t = i.data.data, p = t.gateway ?? (t.payment_url ? "toyyibpay" : t.credited ? "sandbox" : void 0); if (p === "razorpay" && t.razorpay_order_id && t.key_id && t.amount && t.currency && t.reference) { await h({ reference: t.reference, amount_rm: t.amount_rm, points: t.points, razorpay_order_id: t.razorpay_order_id, amount: t.amount, currency: t.currency, key_id: t.key_id, prefill: t.prefill }); return } if (p === "toyyibpay" && t.payment_url) { window.location.href = t.payment_url; return } if (t.credited || p === "sandbox") { m(i.data.message || `RM ${r.toFixed(2)} added${t.points ? ` (${t.points} pts)` : ""}.`), s(!1), setTimeout(() => c("/account-wallet?topup=success"), 1500); return } o("Payment gateway did not return a checkout URL. Contact support."), s(!1) } catch (i) { const t = i?.response?.data?.message; o(t ?? "Failed to start top-up. Please try again."), s(!1) } } return e.jsx(P, {
    title: "Add Funds to Wallet", children: e.jsxs("div", {
      className: "topup-container-custom", children: [e.jsx("style", {
        children: `
          .topup-container-custom { font-family: 'Inter', sans-serif; color: #222; }
          .topup-card-custom {
            background: #fff; border-radius: 20px; border: 1px solid rgba(193,16,105,.06);
            padding: 32px; box-shadow: 0 4px 24px rgba(193,16,105,.02); max-width: 600px;
          }
          .form-group-custom { margin-bottom: 22px; }
          .form-group-custom label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
          .input-amount-wrapper { position: relative; display: flex; align-items: center; }
          .input-amount-prefix {
            position: absolute; left: 16px; font-size: 18px; font-weight: 600; color: #64748b; pointer-events: none;
          }
          .input-amount {
            width: 100%; height: 52px; padding: 10px 16px 10px 52px; font-size: 20px; font-weight: 700;
            border: 1px solid #d1d5db; border-radius: 10px; outline: none;
          }
          .input-amount:focus { border-color: #3ec1bc; box-shadow: 0 0 0 4px rgba(62,193,188,.1); }
          .points-preview { font-size: 13px; color: #0f766e; margin-top: 8px; }
          .gateway-note {
            background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px;
            font-size: 13px; color: #115e59; margin-bottom: 20px;
          }
          .presets-list { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
          .preset-btn {
            background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; padding: 8px 16px;
            font-size: 13px; font-weight: 600; border-radius: 8px; cursor: pointer;
          }
          .preset-btn.selected { background: #f0fdfa; border-color: #3ec1bc; color: #0f766e; }
          .form-actions {
            display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
            border-top: 1px solid #f1f5f9; padding-top: 20px;
          }
          .btn-cancel, .btn-topup {
            padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none !important;
          }
          .btn-cancel { background: #fff; border: 1px solid #d1d5db; color: #475569; }
          .btn-topup { background: #3ec1bc; border: 1px solid #3ec1bc; color: #fff; cursor: pointer; }
          .btn-topup:disabled { opacity: .7; cursor: not-allowed; }
        `}), e.jsxs("div", { className: "topup-card-custom", children: [e.jsxs("div", { className: "gateway-note", children: ["Pay securely via ", e.jsx("strong", { children: "FPX / online banking / card" }), " (Razorpay or ToyyibPay). Funds are added to your wallet after payment is confirmed."] }), x && e.jsx("div", { className: "alert alert-danger mb-4", children: x }), y && e.jsxs("div", { className: "alert alert-success mb-4", children: ["✓ ", y] }), e.jsxs("form", { onSubmit: w, children: [e.jsxs("div", { className: "form-group-custom", children: [e.jsx("label", { htmlFor: "amount", children: "Top-up amount (MYR)" }), e.jsxs("div", { className: "input-amount-wrapper", children: [e.jsx("span", { className: "input-amount-prefix", children: "RM" }), e.jsx("input", { type: "number", id: "amount", className: "input-amount", placeholder: "0.00", value: n, onChange: a => { f(a.target.value), o(null) }, required: !0, min: "1", step: "0.01", disabled: u })] }), g > 0 && e.jsxs("div", { className: "points-preview", children: ["≈ ", g, " wallet points (500 pts = RM 100)"] }), e.jsx("div", { className: "presets-list", children: F.map(a => e.jsxs("button", { type: "button", className: `preset-btn ${n === a.toString() ? "selected" : ""}`, onClick: () => b(a), disabled: u, children: ["+RM ", a] }, a)) })] }), e.jsxs("div", { className: "form-actions", children: [e.jsx(z, { to: "/account-wallet", className: "btn-cancel", children: "Cancel" }), e.jsx("button", { type: "submit", className: "btn-topup", disabled: u, children: u ? "Opening payment…" : "Pay & Add to Wallet" })] })] })] })]
    })
  })
} const E = () => e.jsxs(e.Fragment, { children: [e.jsx(R, { title: "Top Up Wallet | 2Deal - Online Shopping Store", description: "2Deal - Online Shopping Store" }), e.jsx(k, {}), e.jsx(A, {})] }); export { E as default };
