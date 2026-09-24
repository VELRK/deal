export default function AffiliateHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Apply & Select Your Code",
      desc: "Complete our quick registration in less than 60 seconds. Customize your vanity promo code (e.g. YOURNAME10) and receive your trackable partner link instantly.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Share & Recommend",
      desc: "Share your love for 2Deal's handcrafted incense sticks, sambrani cones, and wellness collections on Instagram, TikTok, WhatsApp groups, or your website.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Collect Your Commission",
      desc: "Track every click, conversion, and order in real time. Get paid directly into your Malaysian bank account every single month with zero hidden fees.",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="pr-section-heading">
          <span className="pr-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Simple 3-Step Process
          </span>

          <h2 className="pr-title">
            How the 2Deal Affiliate Program Works
          </h2>

          <p className="pr-desc">
            We’ve eliminated complicated requirements. Getting started and monetizing your recommendations takes just three easy steps.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((st) => (
            <div key={st.num} className="col-lg-4 col-md-6">
              <div className="step-card">
                <span className="step-number">{st.num}</span>
                <div className="step-icon-wrap">
                  {st.icon}
                </div>
                <h3 className="step-title">{st.title}</h3>
                <p className="step-desc">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
