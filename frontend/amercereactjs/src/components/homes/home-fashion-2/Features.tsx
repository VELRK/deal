const DecorativeBorder = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50 6 L54 14 A 36 36 0 0 1 86 46 L94 50 L86 54 A 36 36 0 0 1 54 86 L50 94 L46 86 A 36 36 0 0 1 14 54 L6 50 L14 46 A 36 36 0 0 1 46 14 Z" stroke="currentColor" fill="none" />
    <circle cx="50" cy="3" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="97" cy="50" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="50" cy="97" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="3" cy="50" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const features = [
  {
    title: "Charcoal-Free & Safe",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M8 11.5c1.5 0 2.5-1 4-1s2.5 1 4 1" />
        <path d="M12 15v-4" />
      </svg>
    ),
  },
  {
    title: "Carbon Neutral",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="8" fontWeight="600" fill="currentColor" stroke="none">CO2</text>
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </svg>
    ),
  },
  {
    title: "CSIR Certified & Safe",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <circle cx="16" cy="11" r="2" />
        <path d="M15 13l-1.5 3 1.5-1 1.5 1-1.5-3" />
        <path d="M7 8h5" />
        <path d="M7 11h3" />
        <path d="M7 14h5" />
      </svg>
    ),
  },
  {
    title: "Handcrafted by Women",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M17 20c0-2-3-5-5-5s-5 3-5 5" />
        <path d="M12 13c-2.5 0-4.5 1.5-5 3.5" />
        <path d="M17 16.5c-.5-2-2.5-3.5-5-3.5" />
      </svg>
    ),
  },
  {
    title: "Made From Recycled Temple Flowers",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c4-2 7-6 7-10 0-4-3-8-7-10-4 2-7 6-7 10 0 4 3 8 7 10z" />
        <path d="M12 22c-2-4-2-8 0-12" />
        <path d="M12 22c2-4 2-8 0-12" />
        <path d="M12 10c2.5-3.5 5.5-4 7-2 1.5 2-1 6.5-7 12" />
        <path d="M12 10c-2.5-3.5-5.5-4-7-2-1.5 2 1 6.5 7 12" />
      </svg>
    ),
  },
  {
    title: "Clean & Natural",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  }
];

export default function Features() {
  // A subtle mandala/floral-like overlapping pattern in faint opacity
  const bgPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M30 30c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zM30 30c0 11 9 20 20 20s20-9 20-20-9-20-20-20-20 9-20 20zM30 30c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zM30 30c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <section className="features-sacred-section">
      <style>{`
        .features-sacred-section {
          background-color: #3ec1bc; /* Deep Burgundy / Dark Red */
          background-image: ${bgPattern};
          padding: 80px 0;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }
        .features-sacred-header {
          text-align: center;
          margin: 0 auto 60px;
          max-width: 800px;
        }
        .features-sacred-subtitle {
          font-size: 11px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          font-weight: 500;
          opacity: 0.9;
        }
        .features-sacred-title {
          font-size: 36px;
          color: #fff;
          font-family: serif;
          font-weight: normal;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        .features-sacred-title span {
          font-size: 20px;
          opacity: 0.7;
          color: #fff;
        }
        .features-sacred-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px 15px;
          max-width: 900px;
          margin: 0 auto;
        }
        @media (min-width: 576px) {
          .features-sacred-grid {
            gap: 40px 20px;
          }
        }
        @media (min-width: 992px) {
          .features-sacred-grid {
            grid-template-columns: repeat(3, 1fr);
            row-gap: 60px;
          }
        }
        .feature-sacred-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUpClassic 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          cursor: pointer;
        }
        .feature-sacred-icon-wrapper {
          width: 70px;
          height: 70px;
          position: relative;
          color: #fff;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 576px) {
          .feature-sacred-icon-wrapper {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
          }
        }
        .feature-sacred-border {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: #fff; /* Gold/cream color */
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-sacred-card:hover .feature-sacred-border {
          transform: rotate(90deg) scale(1.05);
        }
        .feature-sacred-svg {
          z-index: 1;
          color: #fff;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-sacred-card:hover .feature-sacred-svg {
          transform: scale(1.15);
        }
        .feature-sacred-title-text {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
        }
        @media (min-width: 576px) {
          .feature-sacred-title-text {
            font-size: 18px;
          }
        }
        
        @keyframes fadeUpClassic {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container">
        <div className="features-sacred-header">
          <h6 className="features-sacred-subtitle">OUR SACRED PROMISE</h6>
          <h2 className="features-sacred-title">
            <span>⤅</span>
            Rooted in Purity
            <span>⤆</span>
          </h2>
        </div>

        <div className="features-sacred-grid">
          {features.map((item, i) => (
            <div key={i} className="feature-sacred-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-sacred-icon-wrapper">
                <DecorativeBorder className="feature-sacred-border" />
                <div className="feature-sacred-svg">
                  {item.icon}
                </div>
              </div>
              <h5 className="feature-sacred-title-text">{item.title}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
