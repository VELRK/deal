import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
  category: "orders" | "returns" | "delivery" | "account";
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How can I place an order?",
    a: "You can place an order by browsing our featured products, adding items to your virtual shopping cart, and proceeding to checkout. You will need to enter your shipping address and choose a payment method.",
    category: "orders",
  },
  {
    q: "What payment methods are supported?",
    a: "We offer various payment methods including credit/debit cards, PayPal, UPI, etc. All transactions are securely processed through our integrated Fiuu payment gateway.",
    category: "orders",
  },
  {
    q: "What is your return and refund policy?",
    a: "We offer refunds for damaged or undelivered products. If you face any issues, please contact us within 7 days of receiving the product or expected delivery date.",
    category: "returns",
  },
  {
    q: "How long does a refund take?",
    a: "Once your refund request is approved, it will be processed within 7 business days to your original payment method.",
    category: "returns",
  },
  {
    q: "How will I know my order is shipped?",
    a: "Once payment is confirmed, the order goes to our backend system, and the seller is notified to pack and ship. You will receive notifications via email, SMS, or in-app alerts.",
    category: "delivery",
  },
  {
    q: "Can I track my order?",
    a: "Yes! Our app integrates with logistics APIs to track your shipping in real-time, so you always know where your package is.",
    category: "delivery",
  },
  {
    q: "Do I need an account to place an order?",
    a: "Users can sign up or log in to track orders and save preferences. However, we also offer guest checkout options for quick purchases.",
    category: "account",
  },
  {
    q: "Is my personal data secure?",
    a: "Yes, we implement appropriate technical and organizational measures to safeguard your personal data. We comply with Malaysia's PDPA. Please see our Privacy Policy for more details.",
    category: "account",
  },
  {
    q: "How can I contact customer support?",
    a: "For order support, refunds, or privacy-related inquiries, you can reach us by email at golden2deal@gmail.com. Our team will be happy to assist you.",
    category: "orders",
  },
];

const CATEGORIES = [
  { id: "all",           label: "All FAQs",                 icon: "✨" },
  { id: "orders",        label: "Orders & Payments",        icon: "🧾" },
  { id: "returns",       label: "Returns & Refunds",        icon: "↩️" },
  { id: "delivery",      label: "Shipping & Delivery",      icon: "📍" },
  { id: "account",       label: "Account & Security",       icon: "🔐" },
];

export default function OrdersFaqContent() {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [search, setSearch]       = useState<string>("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Filter items based on active category and search input
  const filtered = FAQ_ITEMS.filter((item) => {
    const matchesCat = activeCat === "all" || item.category === activeCat;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.q.toLowerCase().includes(query) ||
      item.a.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <section className="flat-spacing-1 bg-light-primary-subtle">
      <style>{`
        .bg-light-primary-subtle {
          background-color: #f4fcfc;
          padding: 50px 0 80px 0;
          font-family: 'Inter', sans-serif;
        }

        .faq-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Search Section */
        .faq-search-box {
          background: #ffffff;
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 4px 20px rgba(62, 193, 188, 0.03);
          border: 1px solid rgba(62, 193, 188, 0.08);
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .faq-search-icon {
          font-size: 20px;
          color: #3ec1bc;
          margin-left: 18px;
        }

        .faq-search-input {
          border: none;
          outline: none;
          padding: 12px 10px;
          font-size: 15px;
          color: #111111;
          flex: 1;
          background: transparent;
        }

        .faq-search-input::placeholder {
          color: #999999;
        }

        /* Category Filter Pills */
        .faq-categories-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .faq-cat-pill {
          background: #ffffff;
          border: 1px solid rgba(62, 193, 188, 0.06);
          color: #555555;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          outline: none;
        }

        .faq-cat-pill:hover {
          color: #3ec1bc;
          border-color: rgba(62, 193, 188, 0.2);
          background: #eaf9f8;
        }

        .faq-cat-pill.active {
          background: #3ec1bc;
          color: #ffffff;
          border-color: #3ec1bc;
          box-shadow: 0 4px 12px rgba(62, 193, 188, 0.15);
        }

        /* Accordion Stack */
        .faq-accordion-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-card-custom {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(62, 193, 188, 0.05);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-card-custom:hover {
          box-shadow: 0 6px 20px rgba(62, 193, 188, 0.04);
          border-color: rgba(62, 193, 188, 0.1);
        }

        .faq-card-header-custom {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }

        .faq-card-question {
          font-size: 16px;
          font-weight: 600;
          color: #111111;
          margin: 0;
          transition: color 0.2s ease;
        }

        .faq-card-header-custom:hover .faq-card-question {
          color: #3ec1bc;
        }

        .faq-card-custom.expanded .faq-card-question {
          color: #3ec1bc;
        }

        .faq-chevron {
          width: 28px;
          height: 28px;
          background: #f4fcfc;
          border-radius: 50%;
          color: #3ec1bc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          border: 1px solid rgba(62, 193, 188, 0.1);
          flex-shrink: 0;
        }

        .faq-card-custom.expanded .faq-chevron {
          transform: rotate(180deg);
          background: #3ec1bc;
          color: #ffffff;
          border-color: #3ec1bc;
        }

        /* Expandable content area */
        .faq-answer-wrap {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 24px;
        }

        .faq-card-custom.expanded .faq-answer-wrap {
          max-height: 300px;
          padding: 0 24px 22px 24px;
          border-top: 1px dashed rgba(62, 193, 188, 0.08);
          margin-top: -2px;
        }

        .faq-answer-text {
          font-size: 14.5px;
          line-height: 1.7;
          color: #555555;
          margin: 0;
          padding-top: 16px;
        }

        /* Help Box */
        .faq-help-card {
          margin-top: 50px;
          background: linear-gradient(135deg, #3ec1bc 0%, #2da19d 100%);
          border-radius: 16px;
          padding: 30px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 8px 24px rgba(62, 193, 188, 0.15);
        }

        .faq-help-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .faq-help-desc {
          font-size: 14px;
          opacity: 0.9;
          max-width: 500px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .faq-help-btn {
          background: #ffffff;
          color: #3ec1bc;
          border: none;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 24px;
          border-radius: 30px;
          text-decoration: none !important;
          transition: all 0.2s ease;
        }

        .faq-help-btn:hover {
          background: #eaf9f8;
          transform: scale(1.03);
          color: #2da19d;
        }
      `}</style>

      <div className="faq-container">
        {/* Search Bar */}
        <div className="faq-search-box">
          <span className="faq-search-icon">🔍</span>
          <input
            type="text"
            className="faq-search-input"
            placeholder="Search FAQs (e.g. shipping, returns, payment)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setExpandedIdx(null);
            }}
          />
        </div>

        {/* Category selector */}
        <div className="faq-categories-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`faq-cat-pill ${activeCat === cat.id ? "active" : ""}`}
              onClick={() => {
                setActiveCat(cat.id);
                setExpandedIdx(null);
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="faq-accordion-stack">
          {filtered.length === 0 ? (
            <div className="text-center py-5 rounded-3" style={{ background: "#ffffff", border: "1px dashed rgba(62, 193, 188, 0.15)" }}>
              <span style={{ fontSize: 32 }}>🔍</span>
              <p className="mt-3 mb-0 text-muted">No matching questions found for "{search}". Try searching for another topic.</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isExpanded = expandedIdx === idx;
              return (
                <div key={idx} className={`faq-card-custom ${isExpanded ? "expanded" : ""}`}>
                  <button
                    type="button"
                    className="faq-card-header-custom"
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  >
                    <h5 className="faq-card-question">{item.q}</h5>
                    <div className="faq-chevron">▼</div>
                  </button>
                  <div className="faq-answer-wrap">
                    <p className="faq-answer-text">{item.a}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Banner */}
        <div className="faq-help-card">
          <h6 className="faq-help-title">Still have questions?</h6>
          <p className="faq-help-desc">
            If you need assistance with orders, refunds, or account issues, get in touch with our team.
          </p>
          <a href="mailto:golden2deal@gmail.com" className="faq-help-btn">
            ✉️ Contact Support: golden2deal@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
