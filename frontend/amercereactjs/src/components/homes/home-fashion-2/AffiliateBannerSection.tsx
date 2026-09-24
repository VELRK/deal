import { Link } from "react-router-dom";

export default function AffiliateBannerSection() {
  return (
    <section className="home-affiliate-section">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Classic Editorial Narrative */}
          <div className="col-lg-7">
            <div className="pe-lg-4">
              <span className="affiliate-gold-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Official 2Deal Partner Program
              </span>

              <h2 className="home-affiliate-title">
                Become an Affiliate
              </h2>

              <p className="home-affiliate-subtitle">
                Join our affiliate program and earn commission on every sale. Whether you are a creator, influencer, community leader, or satisfied customer, earn steady income sharing products people truly love.
              </p>

              <div className="home-affiliate-perks">
                <div className="perk-item">
                  <div className="perk-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="perk-text">
                    <h5>Generous Commission Rates</h5>
                    <p>Earn up to 10% commission on every completed order referred via your unique tracking link or promo code.</p>
                  </div>
                </div>

                <div className="perk-item">
                  <div className="perk-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <div className="perk-text">
                    <h5>Personalized Coupon Code</h5>
                    <p>Get a custom vanity code that gives your audience a discount while automatically attributing the commission to your wallet.</p>
                  </div>
                </div>

                <div className="perk-item">
                  <div className="perk-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div className="perk-text">
                    <h5>Direct Monthly Bank Transfers</h5>
                    <p>Hassle-free, on-time payouts directly to Malaysian bank accounts with real-time performance analytics.</p>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/affiliate" className="home-affiliate-btn-primary">
                  <span>Become an Affiliate Partner</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link to="/affiliate#options" className="home-affiliate-btn-secondary">
                  <span>View Affiliate Options</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Classic VIP Card Mockup */}
          <div className="col-lg-5">
            <div className="vip-partner-card">
              <div className="card-top">
                <div className="brand-crest">
                  <div className="crest-icon">2D</div>
                  <div>
                    <div className="brand-text">2Deal Partner</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Verified Affiliate Pass</div>
                  </div>
                </div>
                <div className="status-pill">
                  <span className="live-dot" />
                  <span>Instant Access</span>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                  Affiliate Track
                </span>
                <h4 style={{ color: '#ffffff', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', margin: 0 }}>
                  Creator & Ambassador Tier
                </h4>
              </div>

              <div className="code-box">
                <div className="code-info">
                  <span>Your Exclusive Code</span>
                  <strong>YOURCODE10</strong>
                </div>
                <div className="badge-offer">
                  10% OFF
                </div>
              </div>

              <div className="stats-matrix">
                <div className="matrix-box">
                  <span className="m-label">Commission Rate</span>
                  <span className="m-val" style={{ color: '#5eead4' }}>Up to 10%</span>
                </div>
                <div className="matrix-box">
                  <span className="m-label">Cookie Lifetime</span>
                  <span className="m-val" style={{ color: '#fef08a' }}>30 Days</span>
                </div>
                <div className="matrix-box">
                  <span className="m-label">Half Month Payout</span>
                  <span className="m-val">RM 50.00</span>
                </div>
                <div className="matrix-box">
                  <span className="m-label">Platform Fee</span>
                  <span className="m-val" style={{ color: '#86efac' }}>RM 0 (Free)</span>
                </div>
              </div>

              <div className="card-footer-strip">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Official Verified Program
                </span>
                <Link to="/affiliate" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
                  Apply Online &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
