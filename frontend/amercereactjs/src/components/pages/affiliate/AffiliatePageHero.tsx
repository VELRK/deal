import { Link } from "react-router-dom";

export default function AffiliatePageHero({
  onApplyClick,
  onOptionsClick,
}: {
  onApplyClick: () => void;
  onOptionsClick: () => void;
}) {
  return (
    <section className="affiliate-hero-section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-center mb-4">
          <Link to="/" className="text-caption-01 cl-text-3 link" style={{ textDecoration: 'none' }}>
            Home
          </Link>
          <span className="mx-2 text-muted">&gt;</span>
          <span className="text-caption-01 text-dark fw-medium">Affiliate Program</span>
        </div>

        {/* Central Hero Header */}
        <div className="text-center max-w-800 mx-auto">
          <div className="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            2Deal Official Partner Network
          </div>

          <h1 className="hero-heading">
            Join Our Affiliate Program &amp; Earn{" "}
            <span className="highlight">Commission on Every Sale</span>
          </h1>

          <p className="hero-paragraph">
            Partner with Malaysia&apos;s premier brand for authentic incense, aromatic dhoop, sambrani cones, and handcrafted wellness essentials. Share products your audience will treasure and turn your recommendations into consistent monthly income.
          </p>

          <div className="hero-action-group">
            <button
              type="button"
              onClick={onApplyClick}
              className="btn-hero-primary border-0"
            >
              Apply to Join Program &rarr;
            </button>

            <button
              type="button"
              onClick={onOptionsClick}
              className="btn-hero-secondary"
            >
              Explore Affiliate Options
            </button>

            <a
              href="/deal/admin/affiliate/login"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-secondary"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Affiliate Portal Login
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="hero-metrics-grid">
            <div className="metric-col">
              <div className="metric-num">
                10<span className="gold">%</span>
              </div>
              <p className="metric-title">Max Commission Rate</p>
            </div>

            <div className="metric-col">
              <div className="metric-num">
                30 <span className="gold" style={{ fontSize: "20px" }}>Days</span>
              </div>
              <p className="metric-title">Cookie Attribution</p>
            </div>

            <div className="metric-col">
              <div className="metric-num">
                RM <span className="gold">0</span>
              </div>
              <p className="metric-title">100% Free to Join</p>
            </div>

            <div className="metric-col">
              <div className="metric-num">
                Direct
              </div>
              <p className="metric-title">Monthly Bank Payout</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
