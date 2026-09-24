export interface AffiliateOption {
  id: string;
  role: string;
  target: string;
  badge?: string;
  isPopular?: boolean;
  rate: string;
  rateLabel: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  features: string[];
}

export const affiliateOptionsData: AffiliateOption[] = [
  {
    id: "creator",
    role: "Content Creator & Influencer",
    target: "Instagram, TikTok, YouTube creators, lifestyle & home decor bloggers",
    badge: "Most Popular",
    isPopular: true,
    rate: "10%",
    rateLabel: "Commission Rate",
    iconBg: "#eef8f8",
    iconColor: "#2da19d",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    features: [
      "Custom swipe-up & link-in-bio tracking URLs",
      "Complimentary PR gifting kits & new product previews",
      "High-converting lifestyle photos & story assets",
      "Dedicated 1-on-1 affiliate manager support",
    ],
  },
  {
    id: "ambassador",
    role: "Community Ambassador",
    target: "Everyday shoppers, wellness advocates, friends & family promoters",
    badge: "No Follower Minimum",
    rate: "8%",
    rateLabel: "Commission Rate",
    iconBg: "#fef9ee",
    iconColor: "#d97706",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    features: [
      "Personalized coupon code for friends to get 10% off",
      "Instant sign up — zero minimum followers required",
      "One-click sharing on WhatsApp, Telegram & Facebook",
      "Earn real cash rewards on every single purchase",
    ],
  },
  {
    id: "publisher",
    role: "Publisher & Review Site",
    target: "Editorial websites, coupon & cashback portals, price comparison platforms",
    badge: "High Volume",
    rate: "12%",
    rateLabel: "Volume Commission",
    iconBg: "#f1f5f9",
    iconColor: "#475569",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    features: [
      "Full product feed & API integration capability",
      "Robust 30-day persistent cookie attribution",
      "Dynamic high-resolution web banners & widgets",
      "Automated monthly performance reports & batch payouts",
    ],
  },
  {
    id: "studio",
    role: "Wellness Studio & Retail Partner",
    target: "Yoga studios, spas, pooja boutiques & corporate gifting agencies",
    badge: "B2B & Offline",
    rate: "Custom",
    rateLabel: "Tiered Commission",
    iconBg: "#f5f3ff",
    iconColor: "#7c3aed",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    features: [
      "Printable in-studio counter QR code displays",
      "Generous bulk referral & corporate event incentives",
      "Priority stock reservation for festive occasions",
      "Direct bank wire payouts with business invoices",
    ],
  },
];

export default function AffiliateOptionsSection({
  onSelectOption,
}: {
  onSelectOption: (optionId: string) => void;
}) {
  return (
    <section id="options" className="affiliate-options-section">
      <div className="container">
        <div className="pr-section-heading">
          <span className="pr-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Tailored Partnership Tracks
          </span>

          <h2 className="pr-title">
            Choose the Affiliate Option That Fits You Best
          </h2>

          <p className="pr-desc">
            We provide specialized tracking, custom promo codes, and dedicated resources tailored to your community and content style.
          </p>
        </div>

        <div className="row g-4">
          {affiliateOptionsData.map((opt) => (
            <div key={opt.id} className="col-lg-3 col-md-6">
              <div className={`option-card ${opt.isPopular ? "highlighted" : ""}`}>
                {opt.badge && (
                  <div className="card-ribbon">
                    {opt.badge}
                  </div>
                )}

                <div
                  className="option-icon-box"
                  style={{ backgroundColor: opt.iconBg, color: opt.iconColor }}
                >
                  {opt.icon}
                </div>

                <h3 className="option-role">{opt.role}</h3>
                <p className="option-target">{opt.target}</p>

                <div className="option-rate-pill">
                  <span className="rate-digit">{opt.rate}</span>
                  <span className="rate-label">{opt.rateLabel}</span>
                </div>

                <ul className="option-features">
                  {opt.features.map((feat, i) => (
                    <li key={i}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onSelectOption(opt.id)}
                  className="btn-choose-option"
                >
                  Select This Track &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
