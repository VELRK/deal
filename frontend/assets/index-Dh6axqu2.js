import { n as v, r as n, j as e, p as S } from "./index-CR29pjTL.js"; import { A as w, a as C } from "./AccountSection-CSjFuwfU.js"; import { s as E, M as u, f as P, i as k, a as A, t as D } from "./malaysiaPhone-B0OpccwC.js"; import { P as M } from "./PageMeta-xwiUIOSp.js"; function O() {
  const { user: c, setUser: g } = v(), [d, h] = n.useState(c?.name ?? ""), [o, y] = n.useState(() => { const s = c?.phone ?? ""; if (!s) return ""; const t = E(s); return t.startsWith(u) ? "0" + t.slice(u.length) : t }), l = c?.email ?? "", a = l.startsWith("ph_") || l.includes("@2Deal.app"), [m, j] = n.useState(a ? "" : l), [p, f] = n.useState(!1), [i, r] = n.useState(null); async function N(s) { if (s.preventDefault(), !d.trim()) return r({ type: "error", text: "Full name is required." }); if (o.trim() && !k(o)) return r({ type: "error", text: A }); r(null), f(!0); try { const t = { name: d.trim(), phone: o.trim() ? D(o) : "" }; a && m.trim() && (t.email = m.trim()); const b = (await S.updateProfile(t)).data.data; b && g(b), r({ type: "success", text: "Profile updated successfully." }) } catch (t) { const x = t?.response?.data?.message; r({ type: "error", text: x ?? "Failed to save changes. Please try again." }) } finally { f(!1) } } return e.jsx(w, {
    title: "Account Details", children: e.jsxs("div", {
      className: "settings-container-custom", children: [e.jsx("style", {
        children: `
          .settings-container-custom {
            font-family: 'Inter', sans-serif;
            color: #111111;
          }

          .settings-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
          }

          @media (max-width: 576px) {
            .settings-card-custom {
              padding: 20px;
            }
          }

          .settings-title-custom {
            font-size: 18px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(193, 16, 105, 0.08);
            padding-bottom: 12px;
          }

          .form-label-custom {
            font-weight: 600;
            font-size: 13px;
            color: #333333;
            margin-bottom: 6px;
            display: block;
          }

          .form-input-custom {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(193, 16, 105, 0.15);
            border-radius: 10px;
            font-size: 14px;
            color: #111111;
            background: #ffffff;
            outline: none;
            transition: all 0.25s ease;
          }

          .form-input-custom:focus {
            border-color: #3EC1BC;
            box-shadow: 0 0 0 3px rgba(193, 16, 105, 0.1);
          }

          .form-input-custom:read-only {
            background: #f8fafc;
            border-color: #e2e8f0;
            color: #64748b;
            cursor: not-allowed;
          }

          .alert-custom {
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13.5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
          }

          .alert-custom.warning {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fef3c7;
          }

          .alert-custom.success {
            background: #f0fdf4;
            color: #15803d;
            border: 1px solid #bbf7d0;
          }

          .alert-custom.danger {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fee2e2;
          }

          .btn-primary-custom {
            background: #3EC1BC;
            color: #ffffff;
            border: 1px solid #3EC1BC;
            border-radius: 10px;
            padding: 12px 28px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-primary-custom:hover {
            background: #920b4e;
            border-color: #920b4e;
          }

          .btn-primary-custom:disabled {
            background: #cbd5e1;
            border-color: #cbd5e1;
            color: #94a3b8;
            cursor: not-allowed;
          }

          .form-desc-custom {
            margin-top: 6px;
            color: #64748b;
            font-size: 12px;
          }
        `}), e.jsxs("div", { className: "settings-card-custom", children: [e.jsx("h5", { className: "settings-title-custom", children: "Personal Details" }), a && e.jsxs("div", { className: "alert-custom warning", children: [e.jsx("span", { children: "📧" }), e.jsx("span", { children: "Your account doesn't have an email address yet. Add one below to enable email login." })] }), i && e.jsxs("div", { className: `alert-custom ${i.type === "success" ? "success" : "danger"}`, children: [e.jsx("span", { children: i.type === "success" ? "✓" : "✕" }), e.jsx("span", { children: i.text })] }), e.jsxs("form", { onSubmit: N, children: [e.jsxs("div", { className: "row", children: [e.jsxs("div", { className: "col-12 mb-4", children: [e.jsxs("label", { className: "form-label-custom", children: ["Full Name ", e.jsx("span", { style: { color: "#dc2626" }, children: "*" })] }), e.jsx("input", { className: "form-input-custom", type: "text", value: d, onChange: s => h(s.target.value), placeholder: "Your full name", required: !0 })] }), e.jsxs("div", { className: "col-12 mb-4", children: [e.jsx("label", { className: "form-label-custom", children: "Phone Number" }), e.jsxs("div", { className: "d-flex align-items-center form-input-custom", style: { padding: 0, overflow: "hidden" }, children: [e.jsxs("span", { className: "px-3 fw-medium", style: { backgroundColor: "#f8fafc", borderRight: "1px solid #e2e8f0", alignSelf: "stretch", display: "flex", alignItems: "center" }, children: ["+", u] }), e.jsx("input", { className: "form-input-custom", type: "tel", value: P(o), onChange: s => y(s.target.value.replace(/\D/g, "").slice(0, 11)), placeholder: "12-345 6789", style: { border: "none", borderRadius: 0 } })] })] }), e.jsxs("div", { className: "col-12 mb-4", children: [e.jsxs("label", { className: "form-label-custom", children: ["Email Address ", a ? e.jsx("span", { className: "text-muted fw-normal", children: "(optional — enables email login)" }) : "(Read-only)"] }), a ? e.jsx("input", { className: "form-input-custom", type: "email", value: m, onChange: s => j(s.target.value), placeholder: "your@email.com" }) : e.jsx("input", { className: "form-input-custom", type: "email", value: l, readOnly: !0 }), !a && e.jsx("p", { className: "form-desc-custom", children: "Account email address cannot be modified." })] })] }), e.jsx("div", { className: "mt-4", children: e.jsx("button", { type: "submit", className: "btn-primary-custom", disabled: p, children: p ? "Saving Changes..." : "Save Changes" }) })] })] })]
    })
  })
} const _ = () => e.jsxs(e.Fragment, { children: [e.jsx(M, { title: "Setting |2Deal- Online Saree & Ethnic Wear Store", description: "2Deal - Online Saree & Ethnic Wear Store" }), e.jsx(C, {}), e.jsx(O, {})] }); export { _ as default };
