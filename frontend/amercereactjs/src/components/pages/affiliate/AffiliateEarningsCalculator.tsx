import { useState, useId } from "react";

export default function AffiliateEarningsCalculator({
  onApplyClick,
}: {
  onApplyClick: () => void;
}) {
  const [ordersPerMonth, setOrdersPerMonth] = useState<number>(35);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(85);
  const ordersSliderId = useId();

  // Commission tier logic:
  // Base 8%, if orders >= 50: 9%, if orders >= 100: 10%
  let commissionRate = 0.08;
  let tierName = "Silver Ambassador";
  let tierBadgeColor = "#fef08a";

  if (ordersPerMonth >= 100) {
    commissionRate = 0.10;
    tierName = "VIP Platinum Partner";
    tierBadgeColor = "#5eead4";
  } else if (ordersPerMonth >= 50) {
    commissionRate = 0.09;
    tierName = "Gold Premier Partner";
    tierBadgeColor = "#fed7aa";
  }

  const monthlySales = ordersPerMonth * averageOrderValue;
  const monthlyEarnings = monthlySales * commissionRate;
  const annualEarnings = monthlyEarnings * 12;

  const aovPresets = [
    { label: "RM 50", value: 50 },
    { label: "RM 85 (Avg)", value: 85 },
    { label: "RM 120", value: 120 },
    { label: "RM 200 (Gift Set)", value: 200 },
  ];

  return (
    <section id="calculator" className="calculator-section">
      <div className="container">
        <div className="pr-section-heading">
          <span className="pr-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Interactive Potential
          </span>

          <h2 className="pr-title">
            Calculate Your Estimated Monthly Earnings
          </h2>

          <p className="pr-desc">
            Use the slider below to see how much commission you could generate simply by sharing 2Deal products with your friends, followers, or website visitors.
          </p>
        </div>

        <div className="max-w-900 mx-auto">
          <div className="calc-card">
            <div className="row g-4 align-items-center">
              {/* Left Column: Sliders & Controls */}
              <div className="col-lg-7">
                <div className="calc-slider-wrap">
                  <label htmlFor={ordersSliderId}>
                    <span>Referred Orders per Month</span>
                    <span className="val-badge">{ordersPerMonth} Orders</span>
                  </label>
                  <input
                    id={ordersSliderId}
                    type="range"
                    min={5}
                    max={250}
                    step={5}
                    value={ordersPerMonth}
                    onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between mt-1 text-muted" style={{ fontSize: "12px" }}>
                    <span>5 orders</span>
                    <span>100 orders</span>
                    <span>250 orders</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="d-block fw-semibold mb-2" style={{ fontSize: "14.5px", color: "#1e293b" }}>
                    Average Order Value (AOV)
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {aovPresets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setAverageOrderValue(preset.value)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: averageOrderValue === preset.value
                            ? "1.5px solid #3ec1bc"
                            : "1px solid #cbd5e1",
                          background: averageOrderValue === preset.value
                            ? "#eef8f8"
                            : "#ffffff",
                          color: averageOrderValue === preset.value
                            ? "#2da19d"
                            : "#475569",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: "13px", color: "#64748b" }}>
                    <span>Gross Sales Volume:</span>
                    <strong style={{ color: "#0f172a" }}>RM {monthlySales.toLocaleString()} / mo</strong>
                  </div>
                  <div className="d-flex justify-content-between" style={{ fontSize: "13px", color: "#64748b" }}>
                    <span>Applicable Commission Rate:</span>
                    <strong style={{ color: "#2da19d" }}>{(commissionRate * 100).toFixed(0)}%</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Earnings Highlight Box */}
              <div className="col-lg-5">
                <div className="calc-result-box">
                  <span className="est-title">Estimated Monthly Payout</span>

                  <div className="est-amount">
                    RM {monthlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  <p className="est-sub">
                    Projected Annual: <strong>RM {annualEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </p>

                  <div className="mb-4">
                    <span className="tier-badge" style={{ borderColor: tierBadgeColor }}>
                      ★ {tierName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onApplyClick}
                    style={{
                      width: "100%",
                      background: "#3ec1bc",
                      color: "#ffffff",
                      border: "none",
                      padding: "14px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "14.5px",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(62, 193, 188, 0.4)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2da19d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#3ec1bc")}
                  >
                    Start Earning Today &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
