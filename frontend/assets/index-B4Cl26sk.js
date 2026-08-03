import { j as e, L as y, r as a, V as N } from "./index-hwJIpBuB.js"; import { P as w } from "./PageMeta-D0-D13jV.js"; function k() { return e.jsx(e.Fragment, { children: e.jsx("section", { className: "section-page-title text-center flat-spacing-2 pb-0", children: e.jsx("div", { className: "container", children: e.jsxs("div", { className: "main-page-title", children: [e.jsxs("div", { className: "breadcrumbs", children: [e.jsx(y, { to: "/", className: "text-caption-01 cl-text-3 link", children: "Home" }), e.jsx("i", { className: "icon icon-CaretRightThin cl-text-3" }), e.jsx("p", { className: "text-caption-01", children: "Contact Us" })] }), e.jsx("h3", { children: "Contact Us" }), e.jsx("p", { className: "text-body-1 cl-text-2", children: "Get in touch with us for inquiries, support, or collaboration we’re here to help you." })] }) }) }) }) } function F() { return e.jsx(e.Fragment, { children: e.jsx("div", { className: "section-map flat-spacing-2 pb-0", children: e.jsx("div", { className: "container", children: e.jsx("div", { className: "wg-map", children: e.jsx("iframe", { src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7880.148272329334!2d151.20657421407668!3d-33.858885268389294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae682c546039%3A0x16da940d587922a1!2sCircular%20Quay!5e0!3m2!1sen!2s!4v1745205798630!5m2!1sen!2s", allowFullScreen: !0, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade" }) }) }) }) }) } function S() {
  const [n, l] = a.useState(""), [d, x] = a.useState(""), [o, m] = a.useState(""), [i, h] = a.useState(""), [p, f] = a.useState(!1), [g, u] = a.useState(!1), [b, j] = a.useState(!1), [s, c] = a.useState(null); async function v() { if (!n.trim() || !o.trim() || !i.trim()) { c({ type: "error", text: "Please fill in all required fields." }); return } if (!p || !g) { c({ type: "error", text: "Please accept both consent checkboxes." }); return } j(!0), c(null); try { const t = `${n.trim()} ${d.trim()}`.trim(), r = await N.send({ name: t, email: o.trim(), message: i.trim() }); c({ type: "success", text: r.data.message ?? "Message sent! We'll get back to you soon." }), l(""), x(""), m(""), h(""), f(!1), u(!1) } catch (t) { const r = t?.response?.data?.message; c({ type: "error", text: r ?? "Failed to send message. Please try again." }) } finally { j(!1) } } return e.jsxs(e.Fragment, {
    children: [e.jsx("style", {
      children: `
        .contact-section * { box-sizing: border-box; }

        /* ── Header ── */
        .contact-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .contact-header h1 {
          font-size: 2.8rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .contact-header p {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Main grid ── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        /* ── Left: Form ── */
        .contact-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #c11069;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .contact-form-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .contact-form-sub {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        /* Alert */
        .contact-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          margin-bottom: 20px;
          border: 1px solid transparent;
        }
        .contact-alert.success {
          background: #eaf8ef;
          color: #1a6f3c;
          border-color: #b5e3c8;
        }
        .contact-alert.error {
          background: #fff0f0;
          color: #b91c1c;
          border-color: #fcc;
        }
        .contact-alert svg {
          flex-shrink: 0;
        }

        /* Form rows */
        .contact-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 16px;
        }
        @media (max-width: 480px) {
          .contact-field-row { grid-template-columns: 1fr; }
        }
        .contact-field { margin-bottom: 16px; }
        .contact-field:last-child { margin-bottom: 0; }

        .contact-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .contact-label .req { color: #c11069; margin-left: 2px; }

        .contact-input,
        .contact-textarea {
          width: 100%;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          background: #fff;
          color: #1a1a1a;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .contact-input::placeholder,
        .contact-textarea::placeholder { color: #b0b0b0; }
        .contact-input:focus,
        .contact-textarea:focus {
          border-color: #c11069;
          box-shadow: 0 0 0 3px rgba(193,16,105,0.09);
        }
        .contact-textarea { resize: none; line-height: 1.6; }

        /* Consent */
        .contact-consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
          cursor: pointer;
        }
        .contact-consent input[type=checkbox] {
          width: 15px;
          height: 15px;
          min-width: 15px;
          margin-top: 2px;
          accent-color: #c11069;
          cursor: pointer;
        }
        .contact-consent-text {
          font-size: 13px;
          color: #555;
          line-height: 1.5;
        }
        .contact-consent-text .req { color: #c11069; margin-left: 2px; }

        .contact-privacy {
          font-size: 12.5px;
          color: #888;
          line-height: 1.6;
          margin: 14px 0 20px;
        }
        .contact-privacy a {
          color: #555;
          text-decoration: underline;
        }

        /* Submit button */
        .contact-submit {
          width: 100%;
          padding: 13px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: background 0.2s, transform 0.1s;
          font-family: inherit;
        }
        .contact-submit:hover:not(:disabled) { background: #c11069; }
        .contact-submit:active:not(:disabled) { transform: scale(0.99); }
        .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Right: Map + Info ── */
        .contact-map {
          border-radius: 16px;
          overflow: hidden;
          height: 280px;
          margin-bottom: 20px;
          border: 1px solid #eee;
        }
        .contact-map iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        .contact-info-card {
          border: 1px solid #ebebeb;
          border-radius: 16px;
          padding: 6px 20px;
          background: #fafafa;
        }
        .contact-info-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .contact-info-row:last-child { border-bottom: none; padding-bottom: 16px; }
        .contact-info-row:first-child { padding-top: 16px; }
        .contact-icon-box {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c11069;
        }
        .contact-icon-box svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .contact-info-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.6px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .contact-info-val {
          font-size: 14px;
          color: #1a1a1a;
          line-height: 1.5;
        }

        /* Spinner */
        .contact-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: contact-spin 0.7s linear infinite;
        }
        @keyframes contact-spin { to { transform: rotate(360deg); } }
      `}), e.jsx("section", { className: "contact-section", style: { padding: "32px 0 64px" }, children: e.jsxs("div", { className: "container", children: [e.jsxs("div", { className: "contact-header", children: [e.jsx("h1", { children: "Contact Us" }), e.jsx("p", { children: "We'd love to hear from you. Please fill out the form below or reach out to us directly." })] }), e.jsxs("div", { className: "contact-grid", children: [e.jsxs("div", { children: [e.jsx("div", { className: "contact-section-label", children: "Contact Form" }), e.jsx("h2", { className: "contact-form-title", children: "Let's Talk!" }), e.jsx("p", { className: "contact-form-sub", children: "Get in touch using the enquiry form or contact details below." }), s && e.jsxs("div", { className: `contact-alert ${s.type === "success" ? "success" : "error"}`, children: [s.type === "success" ? e.jsx("svg", { viewBox: "0 0 24 24", width: "18", height: "18", children: e.jsx("path", { d: "M20 6L9 17l-5-5" }) }) : e.jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", children: [e.jsx("circle", { cx: "12", cy: "12", r: "10" }), e.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), e.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }), s.text] }), e.jsxs("div", { className: "contact-field-row", children: [e.jsxs("div", { children: [e.jsxs("label", { className: "contact-label", htmlFor: "cf-fn", children: ["First Name ", e.jsx("span", { className: "req", children: "*" })] }), e.jsx("input", { className: "contact-input", id: "cf-fn", type: "text", placeholder: "e.g. Priya", value: n, onChange: t => l(t.target.value) })] }), e.jsxs("div", { children: [e.jsx("label", { className: "contact-label", htmlFor: "cf-ln", children: "Last Name" }), e.jsx("input", { className: "contact-input", id: "cf-ln", type: "text", placeholder: "e.g. Sharma", value: d, onChange: t => x(t.target.value) })] })] }), e.jsxs("div", { className: "contact-field", children: [e.jsxs("label", { className: "contact-label", htmlFor: "cf-em", children: ["Email ", e.jsx("span", { className: "req", children: "*" })] }), e.jsx("input", { className: "contact-input", id: "cf-em", type: "email", placeholder: "e.g. priya@email.com", value: o, onChange: t => m(t.target.value) })] }), e.jsxs("div", { className: "contact-field", children: [e.jsxs("label", { className: "contact-label", htmlFor: "cf-msg", children: ["Message ", e.jsx("span", { className: "req", children: "*" })] }), e.jsx("textarea", { className: "contact-textarea", id: "cf-msg", rows: 4, placeholder: "How can we help you?", value: i, onChange: t => h(t.target.value) })] }), e.jsxs("label", { className: "contact-consent", children: [e.jsx("input", { type: "checkbox", checked: p, onChange: t => f(t.target.checked) }), e.jsxs("span", { className: "contact-consent-text", children: ["I agree to receive communication messages from 2Deal.", e.jsx("span", { className: "req", children: "*" })] })] }), e.jsxs("label", { className: "contact-consent", children: [e.jsx("input", { type: "checkbox", checked: g, onChange: t => u(t.target.checked) }), e.jsxs("span", { className: "contact-consent-text", children: ["I consent to 2Deal storing my submitted data.", e.jsx("span", { className: "req", children: "*" })] })] }), e.jsxs("p", { className: "contact-privacy", children: ["2Deal is committed to protecting your privacy per our", " ", e.jsx("a", { href: "#", children: "Privacy Policy" }), ". We may occasionally contact you about our products and services."] }), e.jsx("button", { className: "contact-submit", disabled: b, onClick: v, children: b ? e.jsxs(e.Fragment, { children: [e.jsx("span", { className: "contact-spinner" }), "Sending…"] }) : e.jsxs(e.Fragment, { children: [e.jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [e.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), e.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })] }), "Send Message"] }) })] }), e.jsxs("div", { children: [e.jsx("div", { className: "contact-section-label", children: "Our Location" }), e.jsx("h2", { className: "contact-form-title", style: { marginBottom: "20px" }, children: "Find Us" }), e.jsx("div", { className: "contact-map", children: e.jsx("iframe", { title: "2Deal Location", src: "https://maps.google.com/maps?ll=11.0779,77.0130&z=15&output=embed&t=m&q=Saravanampatti+Coimbatore+Tamil+Nadu+641035", allowFullScreen: !0, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade" }) }), e.jsxs("div", { className: "contact-info-card", children: [e.jsxs("div", { className: "contact-info-row", children: [e.jsx("div", { className: "contact-icon-box", children: e.jsxs("svg", { viewBox: "0 0 24 24", children: [e.jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }), e.jsx("path", { d: "M2 7l10 7 10-7" })] }) }), e.jsxs("div", { children: [e.jsx("div", { className: "contact-info-label", children: "Email us" }), e.jsx("div", { className: "contact-info-val", children: "info@indianladiesfashion.in" })] })] }), e.jsxs("div", { className: "contact-info-row", children: [e.jsx("div", { className: "contact-icon-box", children: e.jsx("svg", { viewBox: "0 0 24 24", children: e.jsx("path", { d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" }) }) }), e.jsxs("div", { children: [e.jsx("div", { className: "contact-info-label", children: "Call us" }), e.jsx("div", { className: "contact-info-val", children: "+91 95972 20129" })] })] }), e.jsxs("div", { className: "contact-info-row", children: [e.jsx("div", { className: "contact-icon-box", children: e.jsxs("svg", { viewBox: "0 0 24 24", children: [e.jsx("path", { d: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" }), e.jsx("circle", { cx: "12", cy: "10", r: "3" })] }) }), e.jsxs("div", { children: [e.jsx("div", { className: "contact-info-label", children: "Headquarters" }), e.jsxs("div", { className: "contact-info-val", children: ["2Deal, Saravanampatti", e.jsx("br", {}), "Coimbatore – 641035, Tamil Nadu"] })] })] }), e.jsxs("div", { className: "contact-info-row", children: [e.jsx("div", { className: "contact-icon-box", children: e.jsxs("svg", { viewBox: "0 0 24 24", children: [e.jsx("circle", { cx: "12", cy: "12", r: "10" }), e.jsx("polyline", { points: "12 6 12 12 16 14" })] }) }), e.jsxs("div", { children: [e.jsx("div", { className: "contact-info-label", children: "Working hours" }), e.jsx("div", { className: "contact-info-val", children: "Mon – Sat, 10:00 AM – 7:00 PM" })] })] })] })] })] })] }) })]
  })
} const L = () => e.jsxs(e.Fragment, { children: [e.jsx(w, { title: "Contact Us | 2Deal - Online Shopping Store", description: "2Deal - Online Shopping Store" }), e.jsx(k, {}), e.jsx(F, {}), e.jsx(S, {})] }); export { L as default };
