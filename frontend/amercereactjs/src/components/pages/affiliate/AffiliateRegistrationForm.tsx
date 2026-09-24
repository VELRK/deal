import { useState, useId } from "react";
import { affiliateAPI } from "@/services/api";
import {
  MY_PHONE_ERROR,
  isValidMalaysiaMobile,
  toMalaysiaE164,
  formatMalaysiaDisplay,
} from "@/utils/malaysiaPhone";

export default function AffiliateRegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    promo?: string;
  } | null>(null);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const promoId = useId();
  const msgId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError("Please fill in all required fields (Name, Email, Phone, and Proposal/Message).");
      setLoading(false);
      return;
    }

    if (!isValidMalaysiaMobile(phone)) {
      setError(MY_PHONE_ERROR);
      setLoading(false);
      return;
    }

    const normalizedPhone = toMalaysiaE164(phone);
    const finalPromo = promoCode.trim() ? promoCode.trim().toUpperCase() : undefined;

    try {
      const res = await affiliateAPI.submitEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: normalizedPhone,
        promo_code: finalPromo,
        message: message.trim(),
      });

      if (res.data?.success) {
        setSubmittedData({
          name: name.trim(),
          email: email.trim(),
          promo: finalPromo,
        });
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setPromoCode("");
        setMessage("");
      } else {
        setError(res.data?.message || "Could not submit enquiry. Please try again.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Could not submit enquiry. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="apply" className="py-5" style={{ backgroundColor: "#FAF8F5" }}>
      <div className="container py-4">
        {/* Section Header */}
        <div className="pr-section-heading mb-4 text-center">
          <span className="pr-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Affiliate &amp; Brand Partnership
          </span>

          <h2 className="pr-title" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(28px, 4vw, 38px)" }}>
            Become an Affiliate Partner
          </h2>

          <p className="pr-desc" style={{ maxWidth: "620px", margin: "0 auto" }}>
            Join our affiliate program and earn commission on every sale. Submit your enquiry below and our partnership team will reach out with your exclusive promo code and onboarding details.
          </p>
        </div>

        {/* Centered Form Card */}
        <div className="max-w-750 mx-auto" style={{ maxWidth: "720px" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #E6E0D6",
              borderRadius: "16px",
              boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(212, 175, 55, 0.12)",
              overflow: "hidden",
            }}
          >
            {/* Elegant Header Accent */}
            <div
              style={{
                background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
                padding: "24px 32px",
                color: "#ffffff",
                borderBottom: "2px solid #d4af37",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  Partner Enquiry Application
                </h3>
                <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                  Creators, Influencers, Agencies &amp; Community Advocates
                </span>
              </div>

              <div
                style={{
                  background: "rgba(212, 175, 55, 0.18)",
                  border: "1px solid rgba(212, 175, 55, 0.45)",
                  color: "#fef08a",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                ★ Up to 10% Commission
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="alert alert-danger m-4 mb-0 d-flex align-items-center gap-2"
                style={{ borderRadius: "10px", fontSize: "14px" }}
                role="alert"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>{error}</div>
              </div>
            )}

            {/* Form Body or Success State */}
            <div style={{ padding: "36px 32px" }}>
              {success && submittedData ? (
                <div className="text-center py-4">
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "50%",
                      background: "#e6f9f8",
                      color: "#2da19d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      boxShadow: "0 8px 20px rgba(62, 193, 188, 0.25)",
                    }}
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <h3
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: "26px",
                      color: "#0f172a",
                      marginBottom: "10px",
                    }}
                  >
                    Thank You, {submittedData.name}!
                  </h3>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "15px",
                      maxWidth: "500px",
                      margin: "0 auto 24px",
                      lineHeight: "1.6",
                    }}
                  >
                    Your affiliate enquiry has been successfully received. Our partnership team will review your application and email you at <strong>{submittedData.email}</strong> within 24 business hours.
                  </p>

                  {submittedData.promo && (
                    <div
                      style={{
                        background: "#faf8f5",
                        border: "1.5px dashed #d4af37",
                        borderRadius: "12px",
                        padding: "16px 24px",
                        maxWidth: "380px",
                        margin: "0 auto 28px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#8c6019",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Requested Campaign Code
                      </span>
                      <strong
                        style={{
                          fontSize: "22px",
                          color: "#111827",
                          letterSpacing: "2px",
                          fontFamily: "monospace",
                        }}
                      >
                        {submittedData.promo}
                      </strong>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setSubmittedData(null);
                    }}
                    style={{
                      background: "#3ec1bc",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "14.5px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(62, 193, 188, 0.3)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2da19d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#3ec1bc")}
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Contact / Brand Name */}
                    <div className="col-md-6">
                      <label
                        htmlFor={nameId}
                        style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}
                      >
                        Contact / Brand / Agency Name <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <input
                        id={nameId}
                        type="text"
                        required
                        placeholder="e.g. Siti Sarah / Aura Wellness"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14.5px",
                          color: "#0f172a",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#3ec1bc")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                      />
                    </div>

                    {/* Business Email */}
                    <div className="col-md-6">
                      <label
                        htmlFor={emailId}
                        style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}
                      >
                        Email Address <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14.5px",
                          color: "#0f172a",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#3ec1bc")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                      />
                    </div>

                    {/* Malaysian Phone Number */}
                    <div className="col-md-6">
                      <label
                        htmlFor={phoneId}
                        style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}
                      >
                        Malaysian Mobile Number <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            background: "#f8fafc",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#475569",
                            border: "1px solid #cbd5e1",
                            borderRight: "none",
                            borderRadius: "8px 0 0 8px",
                          }}
                        >
                          +60
                        </span>
                        <input
                          id={phoneId}
                          type="tel"
                          required
                          placeholder="12-345 6789"
                          value={phone}
                          onChange={(e) => setPhone(formatMalaysiaDisplay(e.target.value))}
                          style={{
                            borderRadius: "0 8px 8px 0",
                            border: "1px solid #cbd5e1",
                            borderLeft: "none",
                            padding: "12px 14px",
                            fontSize: "14.5px",
                            color: "#0f172a",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    {/* Desired Promo Code */}
                    <div className="col-md-6">
                      <label
                        htmlFor={promoId}
                        style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}
                      >
                        Preferred Promo Code <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        id={promoId}
                        type="text"
                        placeholder="e.g. SITI10 or AURA10"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14.5px",
                          color: "#0f172a",
                          textTransform: "uppercase",
                          fontFamily: "monospace",
                          letterSpacing: "1px",
                          fontWeight: 600,
                          outline: "none",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#3ec1bc")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                      />
                    </div>

                    {/* Proposal / Collaboration Message */}
                    <div className="col-12">
                      <label
                        htmlFor={msgId}
                        style={{ display: "block", fontSize: "13.5px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}
                      >
                        Collaboration Proposal / Social Handles <span style={{ color: "#e11d48" }}>*</span>
                      </label>
                      <textarea
                        id={msgId}
                        rows={4}
                        required
                        placeholder="Tell us about your audience, social handles (Instagram, TikTok, YouTube), website, or your proposed collaboration ideas..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14.5px",
                          color: "#0f172a",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          lineHeight: "1.5",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#3ec1bc")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                      />
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div
                    className="my-4 p-3"
                    style={{
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      justifyContent: "space-around",
                      fontSize: "12.5px",
                      color: "#475569",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2da19d" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Up to 10% Commission
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2da19d" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Personalized Promo Code
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2da19d" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Direct Bank Payouts
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2da19d" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      100% Free to Join
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: "#3ec1bc",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "15.5px",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 16px rgba(62, 193, 188, 0.35)",
                      transition: "all 0.25s ease",
                      opacity: loading ? 0.75 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.background = "#2da19d";
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.background = "#3ec1bc";
                    }}
                  >
                    {loading ? "Submitting Your Enquiry..." : "Submit Partnership Enquiry →"}
                  </button>

                  <div className="text-center mt-3" style={{ fontSize: "12px", color: "#64748b" }}>
                    Have urgent questions? Email our affiliate team at{" "}
                    <a href="mailto:affiliates@2deal.com.my" style={{ color: "#2da19d", fontWeight: 600 }}>
                      affiliates@2deal.com.my
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
