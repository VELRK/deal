import { useState } from "react";

export default function AffiliateFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who is eligible to join the 2Deal Affiliate Program?",
      a: "Anyone can join! Whether you are a content creator, lifestyle influencer, yoga instructor, wellness blogger, or a loyal customer who loves our incense and aromatic products. We welcome both individuals and established publishers across Malaysia and beyond.",
    },
    {
      q: "Are there any upfront fees or subscription costs?",
      a: "No. The 2Deal Affiliate Program is 100% free to join. There are no registration fees, monthly subscription fees, or minimum sales quotas required to maintain your account.",
    },
    {
      q: "How does tracking work between links and promo codes?",
      a: "You get both! When someone clicks your unique affiliate link, a 30-day cookie is stored in their browser. If they make a purchase within 30 days, you earn commission. Alternatively, if they checkout using your personal vanity promo code (even without clicking a link), the commission is automatically attributed to your account!",
    },
    {
      q: "When and how do I receive commission payouts?",
      a: "Commissions are reviewed and paid out monthly. Once your approved earnings reach the minimum threshold of RM 50.00, you can request an instant withdrawal directly to your Malaysian bank account (Maybank, CIMB, Public Bank, RHB, etc.).",
    },
    {
      q: "Can I share my promo code on WhatsApp, Telegram, or Instagram Stories?",
      a: "Yes! Your code is fully shareable across all social media platforms, messaging apps, personal blogs, or YouTube descriptions. You can also print QR codes for in-person community events or wellness studios.",
    },
    {
      q: "How do I monitor my real-time performance and clicks?",
      a: "Once approved, you receive personal login credentials to the 2Deal Affiliate Dashboard. From there, you can view your referral clicks, conversion rates, order IDs, earnings ledger, and bank withdrawal history 24/7.",
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "#faf8f5" }}>
      <div className="container py-4">
        <div className="pr-section-heading">
          <span className="pr-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Got Questions?
          </span>

          <h2 className="pr-title">
            Frequently Asked Questions
          </h2>

          <p className="pr-desc">
            Everything you need to know about partnering with 2Deal, tracking your earnings, and receiving payouts.
          </p>
        </div>

        <div className="max-w-800 mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`affiliate-faq-card ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      flexShrink: 0,
                      color: isOpen ? "#3ec1bc" : "#64748b",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="faq-body">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
