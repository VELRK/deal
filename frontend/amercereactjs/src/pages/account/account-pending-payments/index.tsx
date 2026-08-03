import { useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import PageMeta from "@/components/common/PageMeta";
import { formatPrice } from "@/utils/formatPrice";

interface PendingPayment {
  id: number;
  invoice_number: string;
  created_at: string;
  due_date: string;
  amount: number;
  items_summary: string;
}

export default function AccountPendingPaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([
    { id: 1, invoice_number: "INV-9082352", created_at: "2026-07-01", due_date: "2026-07-08", amount: 4500, items_summary: "Blue & pink Silk Saree (Qty: 1)" },
    { id: 2, invoice_number: "INV-9082381", created_at: "2026-07-03", due_date: "2026-07-10", amount: 2500, items_summary: "Linen Kurta (Qty: 1)" }
  ]);

  const handlePayNow = (id: number) => {
    // Mock payment trigger
    alert(`Redirecting to payment gateway for invoice ${payments.find(p => p.id === id)?.invoice_number}...`);
    setPayments(payments.filter(p => p.id !== id));
  };

  return (
    <>
      <PageMeta
        title="Pending Payments | Indian Ladies Fashion"
        description="View and clear your pending payments and checkout invoices."
      />
      <AccountSection title="Pending Payments">
        <style>{`
          .payments-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .payment-card-classic {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(0,0,0,0.06);
            padding: 24px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            transition: all 0.3s ease;
          }
          @media (max-width: 576px) {
            .payment-card-classic {
              padding: 16px;
              flex-direction: column;
              align-items: stretch;
              gap: 16px;
            }
            .payment-info-group {
              display: grid !important;
              grid-template-columns: 1fr 1fr;
              gap: 14px !important;
            }
            .pay-btn-classic {
              width: 100%;
              text-align: center;
            }
          }
          .payment-card-classic:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border-color: rgba(139, 0, 0, 0.12);
          }
          .payment-info-group {
            display: flex;
            flex-wrap: wrap;
            gap: 32px;
          }
          .payment-info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .info-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #888;
          }
          .info-value {
            font-size: 15px;
            font-weight: 600;
            color: #222;
          }
          .info-value.amount {
            color: #8b0000;
            font-size: 16px;
            font-weight: 700;
          }
          .payment-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 700;
            background: #fff9f0;
            color: #b45309;
            border: 1px solid #fde68a;
          }
          .payment-badge-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #b45309;
          }
          .pay-btn-classic {
            background: #8b0000;
            color: #ffffff;
            border: none;
            padding: 10px 24px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
          }
          .pay-btn-classic:hover {
            background: #700000;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(139, 0, 0, 0.25);
          }
          .no-payments {
            background: #ffffff;
            border-radius: 16px;
            border: 1px dashed rgba(0,0,0,0.08);
            padding: 48px;
            text-align: center;
          }
          .no-payments-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #f4faf6;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
          }
        `}</style>

        {payments.length === 0 ? (
          <div className="no-payments">
            <div className="no-payments-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h5 className="fw-semibold text-muted">All Clear!</h5>
            <p className="text-muted mt-2 mb-0">You have no pending payments or outstanding invoices.</p>
          </div>
        ) : (
          <div className="payments-list">
            {payments.map((p) => (
              <div key={p.id} className="payment-card-classic">
                <div className="payment-info-group">
                  <div className="payment-info-item">
                    <span className="info-label">Invoice ID</span>
                    <span className="info-value">{p.invoice_number}</span>
                  </div>
                  <div className="payment-info-item">
                    <span className="info-label">Due Date</span>
                    <span className="info-value">
                      {new Date(p.due_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="payment-info-item">
                    <span className="info-label">Items</span>
                    <span className="info-value">{p.items_summary}</span>
                  </div>
                  <div className="payment-info-item">
                    <span className="info-label">Amount Due</span>
                    <span className="info-value amount">{formatPrice(p.amount)}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span className="payment-badge">
                    <span className="payment-badge-dot"></span>
                    Pending
                  </span>
                  <button type="button" className="pay-btn-classic" onClick={() => handlePayNow(p.id)}>
                    PAY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccountSection>
    </>
  );
}
