export default function AffiliateBenefitsGrid() {
  const benefits = [
    {
      title: "Generous 5% - 10% Commissions",
      desc: "Earn among the highest commission rates in the lifestyle & home fragrance category on every valid customer purchase.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      ),
    },
    {
      title: "30-Day Cookie Window",
      desc: "Even if your referred visitor browses today and buys three weeks later, you still receive full attribution and commission.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "Personalized Vanity Codes",
      desc: "Give your audience an exclusive 10% discount using your customized coupon code without needing to click complicated links.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: "Real-Time Tracking Dashboard",
      desc: "Access your personalized partner portal anytime to monitor clicks, pending conversions, approved payouts, and top-selling items.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      title: "Direct Malaysian Bank Transfers",
      desc: "Receive dependable monthly payouts directly into Maybank, CIMB, Public Bank, Hong Leong, RHB, and other Malaysian accounts.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      title: "PR Gifting & Marketing Kits",
      desc: "Receive high-resolution banner graphics, product photography, copy swipe files, and PR product boxes for unboxings.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "#faf8f5", borderTop: "1px solid #ebe5db", borderBottom: "1px solid #ebe5db" }}>
      <div className="container py-4">
        <div className="pr-section-heading">
          <span className="pr-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Why Partner With 2Deal
          </span>

          <h2 className="pr-title">
            Exceptional Benefits for Our Affiliates
          </h2>

          <p className="pr-desc">
            We prioritize our affiliates with transparent reporting, generous payouts, and marketing resources that help you earn more.
          </p>
        </div>

        <div className="row g-4">
          {benefits.map((b, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "32px 26px",
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  transition: "transform 0.25s ease, border-color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#3ec1bc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#eef8f8",
                    color: "#2da19d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  {b.icon}
                </div>

                <h4 style={{ fontSize: "17px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
                  {b.title}
                </h4>

                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.55", margin: 0 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
