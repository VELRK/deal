import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";

interface Transaction {
  id: number;
  wallet_id: number;
  user_id: number;
  type: "credit" | "debit";
  amount: number;
  balance_after: number;
          source: "admin_add" | "order_payment" | "refund" | "promo" | "adjustment" | "topup" | "topup_sandbox";
  reference: string;
  description: string;
  created_at: string;
}

export default function AccountWallet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [wallet, setWallet] = useState<{
    enabled: boolean;
    balance: number;
    discount_percent: number;
    discount_min_rm?: number;
    discount_promo_text?: string;
    discount_below_text?: string;
  } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const topup = searchParams.get("topup");
    if (topup === "success") {
      setBanner({ type: "success", text: "Wallet topped up successfully!" });
      const next = new URLSearchParams(searchParams);
      next.delete("topup");
      setSearchParams(next, { replace: true });
    } else if (topup === "failed") {
      setBanner({ type: "error", text: "Payment was not completed. No amount was added." });
      const next = new URLSearchParams(searchParams);
      next.delete("topup");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    userAPI
      .getWallet()
      .then((res) => {
        if (res.data?.success) {
          setWallet(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoadingTx(true);
    const offset = (page - 1) * limit;
    userAPI
      .getWalletTransactions({ limit, offset })
      .then((res) => {
        if (res.data?.success) {
          const payload = res.data.data;
          const rows = payload.rows ?? payload.transactions ?? [];
          setTransactions(rows as Transaction[]);
          setTotal(payload.total ?? 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingTx(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  function formatDate(dateStr: string) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-MY", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  function getSourceLabel(src: Transaction["source"]) {
    switch (src) {
      case "admin_add":
        return "Admin Credit";
      case "order_payment":
        return "Order Payment";
      case "refund":
        return "Order Refund";
      case "promo":
        return "Promo Bonus";
      case "topup":
      case "topup_sandbox":
        return "Wallet Top-Up";
      case "adjustment":
        return "Wallet Adjustment";
      default:
        return src;
    }
  }

  return (
    <AccountSection title="My Wallet">
      <div className="wallet-container-custom">
        <style>{`
          .wallet-container-custom {
            font-family: 'Inter', sans-serif;
            color: #222222;
          }

          .wallet-card-custom {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            padding: 32px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          @media (max-width: 576px) {
            .wallet-card-custom {
              padding: 20px 16px;
              gap: 16px;
            }
            .wallet-balance {
              font-size: 28px !important;
            }
            .wallet-benefit-card {
              max-width: 100% !important;
              width: 100%;
            }
            .tx-history-title {
              font-size: 17px !important;
              margin-bottom: 14px;
            }
          }

          .wallet-card-custom::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: #3ec1bc;
          }

          .wallet-info-part h4 {
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 6px 0;
          }

          .wallet-balance {
            font-size: 38px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
          }

          .wallet-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #065f46;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid #a7f3d0;
          }

          .topup-btn-custom {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #3ec1bc;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 20px;
            border: 1px solid #3ec1bc;
            transition: all 0.2s;
            text-decoration: none !important;
            cursor: pointer;
          }

          .topup-btn-custom:hover {
            background: #35a29f;
            border-color: #35a29f;
            color: #ffffff;
            transform: translateY(-1px);
          }

          .wallet-status-badge .dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
          }

          .wallet-benefit-card {
            background: #f0fdfa;
            border: 1px solid #ccfbf1;
            border-radius: 12px;
            padding: 16px 20px;
            max-width: 320px;
          }

          .wallet-benefit-card h5 {
            font-size: 14px;
            font-weight: 700;
            color: #0f766e;
            margin: 0 0 4px 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .wallet-benefit-card p {
            font-size: 13px;
            color: #115e59;
            margin: 0;
            line-height: 1.5;
          }

          .tx-history-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
          }

          /* Classic Table Style */
          .tx-table-wrapper {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
          }

          .tx-table {
            width: 100%;
            min-width: 600px;
            border-collapse: collapse;
            text-align: left;
          }

          .tx-table th {
            background: #f8fafc;
            padding: 14px 18px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            border-bottom: 1px solid #eaeaea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .tx-table td {
            padding: 16px 18px;
            font-size: 14px;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .tx-table tr:last-child td {
            border-bottom: none;
          }

          .tx-type-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 6px;
          }

          .tx-type-badge.credit {
            background: #e6f4ea;
            color: #137333;
          }

          .tx-type-badge.debit {
            background: #fce8e6;
            color: #c5221f;
          }

          .tx-amount {
            font-weight: 700;
            font-size: 15px;
          }

          .tx-amount.credit {
            color: #137333;
          }

          .tx-amount.debit {
            color: #c5221f;
          }

          .tx-ref {
            font-family: monospace;
            font-size: 13px;
            color: #64748b;
          }

          .tx-date {
            font-size: 13px;
            color: #64748b;
          }

          .wallet-empty-state {
            padding: 40px 20px;
            text-align: center;
            color: #64748b;
          }

          .wallet-empty-state .icon {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
          }

          /* Pagination */
          .tx-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 0 4px;
          }

          .tx-pagination-info {
            font-size: 13px;
            color: #64748b;
          }

          .tx-pagination-buttons {
            display: flex;
            gap: 8px;
          }

          .tx-page-btn {
            background: #ffffff;
            border: 1px solid #d1d5db;
            color: #374151;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .tx-page-btn:hover:not(:disabled) {
            background: #f9fafb;
            border-color: #9ca3af;
          }

          .tx-page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Skeletal Pulse */
          .pulse {
            animation: pulse-animation 1.5s infinite ease-in-out;
            background: #f1f5f9;
            height: 14px;
            border-radius: 4px;
          }

          @keyframes pulse-animation {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}</style>

        {banner && (
          <div className={`alert alert-${banner.type === "success" ? "success" : "danger"} mb-3`}>
            {banner.text}
          </div>
        )}

        {loading ? (
          <div className="wallet-card-custom">
            <div className="wallet-info-part" style={{ width: "100%" }}>
              <div className="pulse" style={{ width: "120px", marginBottom: "12px" }} />
              <div className="pulse" style={{ width: "240px", height: "38px" }} />
            </div>
          </div>
        ) : wallet ? (
          <div className="wallet-card-custom">
            <div className="wallet-info-part">
              <h4>Available Balance</h4>
              <div className="wallet-balance">{formatPrice(wallet.balance)}</div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "10px" }}>
                {wallet.enabled && (
                  <div className="wallet-status-badge" style={{ marginTop: 0 }}>
                    <span className="dot" />
                    <span>Wallet Active</span>
                  </div>
                )}
                <Link
                  to="/account-wallet/topup"
                  className="topup-btn-custom"
                >
                  ➕ Add Funds
                </Link>
              </div>
            </div>

            {wallet.enabled && wallet.discount_percent > 0 && (
              <div className="wallet-benefit-card">
                <h5>👛 Wallet Pay Benefit</h5>
                <p>
                  {wallet.discount_promo_text
                    || `Pay via MY Wallet & Get ${Number(wallet.discount_percent.toFixed(2))}% OFF on Orders RM${Number((wallet.discount_min_rm ?? 100).toFixed(2))}+`}
                </p>
                {(wallet.discount_below_text || (wallet.discount_min_rm ?? 100) > 0) && (
                  <p className="mb-0">
                    {wallet.discount_below_text
                      || `Orders below RM${Number((wallet.discount_min_rm ?? 100).toFixed(2))}: Wallet payment available, but no ${Number(wallet.discount_percent.toFixed(2))}% discount`}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="alert alert-danger">Failed to load wallet information.</div>
        )}

        <h3 className="tx-history-title">Transaction History</h3>

        <div className="tx-table-wrapper">
          {loadingTx ? (
            <div style={{ padding: "30px" }}>
              <div className="pulse" style={{ width: "100%", marginBottom: "15px", height: "40px" }} />
              <div className="pulse" style={{ width: "100%", marginBottom: "15px", height: "30px" }} />
              <div className="pulse" style={{ width: "100%", marginBottom: "15px", height: "30px" }} />
              <div className="pulse" style={{ width: "100%", height: "30px" }} />
            </div>
          ) : transactions.length > 0 ? (
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th style={{ textAlign: "right" }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isCredit = tx.type === "credit";
                  return (
                    <tr key={tx.id}>
                      <td>
                        <div className="tx-date">{formatDate(tx.created_at)}</div>
                      </td>
                      <td>
                        <span className="tx-ref">{tx.reference || `TX-${tx.id}`}</span>
                      </td>
                      <td>
                        <span className={`tx-type-badge ${tx.type}`}>
                          {isCredit ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: "14px" }}>
                          {tx.description || getSourceLabel(tx.source)}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className={`tx-amount ${tx.type}`}>
                          {isCredit ? "+" : "-"}
                          {formatPrice(tx.amount)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {formatPrice(tx.balance_after)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="wallet-empty-state">
              <span className="icon">👛</span>
              <p className="mb-0 fw-semibold">No transactions found.</p>
              <span className="text-muted" style={{ fontSize: "13px" }}>
                Transactions will appear here when you pay with your wallet or get credits.
              </span>
            </div>
          )}
        </div>

        {!loadingTx && total > limit && (
          <div className="tx-pagination">
            <div className="tx-pagination-info">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
            </div>
            <div className="tx-pagination-buttons">
              <button
                type="button"
                className="tx-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="tx-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AccountSection>
  );
}
