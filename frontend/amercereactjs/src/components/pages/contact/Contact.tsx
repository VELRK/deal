import { useState } from "react";
import { contactAPI } from "@/services/api";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit() {
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      setResult({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    if (!c1 || !c2) {
      setResult({ type: "error", text: "Please accept both consent checkboxes." });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await contactAPI.send({ name, email: email.trim(), message: message.trim() });
      setResult({ type: "success", text: res.data.message ?? "Message sent! We'll get back to you soon." });
      setFirstName(""); setLastName(""); setEmail(""); setMessage("");
      setC1(false); setC2(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setResult({ type: "error", text: msg ?? "Failed to send message. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
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
      `}</style>

      <section className="contact-section" style={{ padding: "32px 0 64px" }}>
        <div className="container">

          {/* ── Clean Header ── */}
          <div className="contact-header">
            <h1>Contact Us</h1>
            <p>
              We'd love to hear from you. Please fill out the form below or reach out to us directly.
            </p>
          </div>

          {/* ── Two-column grid ── */}
          <div className="contact-grid">

            {/* LEFT — Form */}
            <div>
              <div className="contact-section-label">Contact Form</div>
              <h2 className="contact-form-title">Let's Talk!</h2>
              <p className="contact-form-sub">
                Get in touch using the enquiry form or contact details below.
              </p>

              {result && (
                <div className={`contact-alert ${result.type === "success" ? "success" : "error"}`}>
                  {result.type === "success" ? (
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  )}
                  {result.text}
                </div>
              )}

              {/* Name row */}
              <div className="contact-field-row">
                <div>
                  <label className="contact-label" htmlFor="cf-fn">
                    First Name <span className="req">*</span>
                  </label>
                  <input
                    className="contact-input"
                    id="cf-fn"
                    type="text"
                    placeholder="e.g. Priya"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="contact-label" htmlFor="cf-ln">Last Name</label>
                  <input
                    className="contact-input"
                    id="cf-ln"
                    type="text"
                    placeholder="e.g. Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-em">
                  Email <span className="req">*</span>
                </label>
                <input
                  className="contact-input"
                  id="cf-em"
                  type="email"
                  placeholder="e.g. priya@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Message */}
              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-msg">
                  Message <span className="req">*</span>
                </label>
                <textarea
                  className="contact-textarea"
                  id="cf-msg"
                  rows={4}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Consents */}
              <label className="contact-consent">
                <input
                  type="checkbox"
                  checked={c1}
                  onChange={(e) => setC1(e.target.checked)}
                />
                <span className="contact-consent-text">
                  I agree to receive communication messages from Indian Ladies Fashion.
                  <span className="req">*</span>
                </span>
              </label>
              <label className="contact-consent">
                <input
                  type="checkbox"
                  checked={c2}
                  onChange={(e) => setC2(e.target.checked)}
                />
                <span className="contact-consent-text">
                  I consent to Indian Ladies Fashion storing my submitted data.
                  <span className="req">*</span>
                </span>
              </label>

              <p className="contact-privacy">
                Indian Ladies Fashion is committed to protecting your privacy per our{" "}
                <a href="#">Privacy Policy</a>. We may occasionally contact you about
                our products and services.
              </p>

              <button
                className="contact-submit"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <span className="contact-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </div>

            {/* RIGHT — Map + Info */}
            <div>
              <div className="contact-section-label">Our Location</div>
              <h2 className="contact-form-title" style={{ marginBottom: "20px" }}>Find Us</h2>

              <div className="contact-map">
                <iframe
                  title="Indian Ladies Fashion Location"
                  src="https://maps.google.com/maps?ll=11.0779,77.0130&z=15&output=embed&t=m&q=Saravanampatti+Coimbatore+Tamil+Nadu+641035"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="contact-info-card">
                {/* Email */}
                <div className="contact-info-row">
                  <div className="contact-icon-box">
                    <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Email us</div>
                    <div className="contact-info-val">info@indianladiesfashion.in</div>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-info-row">
                  <div className="contact-icon-box">
                    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Call us</div>
                    <div className="contact-info-val">+91 95972 20129</div>
                  </div>
                </div>

                {/* Address */}
                <div className="contact-info-row">
                  <div className="contact-icon-box">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Headquarters</div>
                    <div className="contact-info-val">
                      Indian Ladies Fashion, Saravanampatti<br />
                      Coimbatore – 641035, Tamil Nadu
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="contact-info-row">
                  <div className="contact-icon-box">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Working hours</div>
                    <div className="contact-info-val">Mon – Sat, 10:00 AM – 7:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;