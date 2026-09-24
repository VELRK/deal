export default function AffiliateCtaBanner({
  onApplyClick,
}: {
  onApplyClick: () => void;
}) {
  return (
    <section className="py-5" style={{ background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)", color: "#ffffff" }}>
      <div className="container py-5 text-center">
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "#fef08a",
              padding: "6px 18px",
              borderRadius: "9999px",
              fontSize: "11.5px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Start Your Journey Today
          </span>

          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 600, color: "#ffffff", marginBottom: "16px", lineHeight: 1.25 }}>
            Ready to Partner With Malaysia&apos;s Premier Incense &amp; Lifestyle Brand?
          </h2>

          <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: 1.65, marginBottom: "32px" }}>
            Join our growing community of affiliates and start earning commissions today. Instant sign-up, zero hidden fees, and reliable monthly bank transfers.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              type="button"
              onClick={onApplyClick}
              style={{
                background: "#3ec1bc",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "15px",
                padding: "14px 36px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(62, 193, 188, 0.4)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2da19d")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3ec1bc")}
            >
              Become an Affiliate Now &rarr;
            </button>

            <a
              href="https://wa.me/60126364666?text=Hi%202Deal%2C%20I%20would%20like%20to%20inquire%20about%20the%20Affiliate%20Program"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "transparent",
                color: "#f8fafc",
                fontWeight: 600,
                fontSize: "15px",
                padding: "14px 28px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
