import { useEffect, useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import { formatPrice, formatDateTime } from "@/utils/formatPrice";

interface RoyaltyTx {
  id: number;
  user_id: number;
  type: "earn" | "redeem";
  points: number;
  amount_rm: number;
  balance_after_points: number;
  reference: string;
  description: string;
  created_at: string;
}

export default function AccountRoyalty() {
  const [info, setInfo] = useState<{
    enabled: boolean;
    points: number;
    balance_rm: number;
    min_redeem_points: number;
    min_redeem_rm?: number;
    unlock_min_rm?: number;
    unlock_min_points?: number;
    remaining_rm_to_unlock?: number;
    can_redeem: boolean;
    conversion_label?: string;
    earn_label?: string;
    hint?: string;
  } | null>(null);
  const [rows, setRows] = useState<RoyaltyTx[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    userAPI
      .getRoyalty()
      .then((res) => {
        if (res.data?.success) setInfo(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoadingTx(true);
    const offset = (page - 1) * limit;
    userAPI
      .getRoyaltyTransactions({ limit, offset })
      .then((res) => {
        if (res.data?.success) {
          const payload = res.data.data;
          setRows((payload.rows ?? payload.transactions ?? []) as RoyaltyTx[]);
          setTotal(payload.total ?? 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingTx(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <AccountSection title="Royalty Points">
      <div className="royalty-page">
        <style>{`
          .royalty-page { font-family: 'Inter', sans-serif; color: #222; }
          .royalty-card {
            background: #fff;
            border-radius: 20px;
            border: 1px solid rgba(193, 16, 105, 0.08);
            padding: 28px;
            margin-bottom: 24px;
            box-shadow: 0 4px 24px rgba(193, 16, 105, 0.02);
            position: relative;
            overflow: hidden;
          }
          @media (max-width: 576px) {
            .royalty-card { padding: 20px 16px; }
            .royalty-points { font-size: 28px !important; }
            .royalty-meta { font-size: 13.5px !important; }
          }
          .royalty-card::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 6px; height: 100%;
            background: #f59e0b;
          }
          .royalty-card h4 {
            font-size: 14px; font-weight: 600; color: #64748b;
            text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px;
          }
          .royalty-points {
            font-size: 36px; font-weight: 800; color: #0f172a; line-height: 1.2;
          }
          .royalty-meta { font-size: 15px; color: #64748b; margin-top: 4px; }
          .royalty-hint {
            margin-top: 14px; font-size: 13px; color: #92400e;
            background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 12px;
          }
          .tx-table-wrapper {
            background: #fff; border: 1px solid #eaeaea; border-radius: 12px; overflow-x: auto;
          }
          .tx-table { width: 100%; min-width: 600px; border-collapse: collapse; text-align: left; }
          .tx-table th {
            background: #f8fafc; padding: 14px 18px; font-size: 13px; font-weight: 600;
            color: #475569; border-bottom: 1px solid #eaeaea; text-transform: uppercase;
          }
          .tx-table td {
            padding: 14px 18px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9;
          }
          .badge-earn { background: #e6f4ea; color: #137333; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
          .badge-redeem { background: #fce8e6; color: #c5221f; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
          .tx-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
          .tx-page-btn {
            background: #fff; border: 1px solid #d1d5db; padding: 6px 14px; border-radius: 6px; cursor: pointer;
          }
          .tx-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>

        {loading ? (
          <div className="royalty-card">Loading…</div>
        ) : info ? (
          <div className="royalty-card">
            <h4>Available Royalty Points</h4>
            <div className="royalty-points">{info.points} pts</div>
            <div className="royalty-meta">
              ≈ {formatPrice(info.balance_rm)} · {info.conversion_label ?? "500 pts = RM 100"}
            </div>
            {info.hint && <div className="royalty-hint">{info.hint}</div>}
            {!info.can_redeem && Number(info.remaining_rm_to_unlock ?? 0) > 0 && (
              <div className="royalty-hint" style={{ marginTop: 10 }}>
                You have {formatPrice(Number(info.remaining_rm_to_unlock))} left to unlock royalty points.
              </div>
            )}
            <p className="mt-3 mb-0 small text-muted">
              Royalty points are separate from your wallet. Earn after paid / COD orders. Pay with points
              when you have RM {Number(info.unlock_min_rm ?? info.min_redeem_rm ?? 100)}+ (
              {info.unlock_min_points ?? info.min_redeem_points}+ pts); any remaining bill uses wallet or online payment.
            </p>
          </div>
        ) : (
          <div className="royalty-card">Could not load royalty points.</div>
        )}

        <h5 className="mb-3">Royalty history</h5>
        <div className="tx-table-wrapper">
          {loadingTx ? (
            <div className="p-4 text-muted">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-4 text-muted text-center">No royalty activity yet.</div>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Value</th>
                  <th>Balance</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDateTime(r.created_at)}</td>
                    <td>
                      <span className={r.type === "earn" ? "badge-earn" : "badge-redeem"}>
                        {r.type === "earn" ? "Earn" : "Redeem"}
                      </span>
                    </td>
                    <td>
                      {r.type === "earn" ? "+" : "−"}
                      {r.points} pts
                    </td>
                    <td>{formatPrice(r.amount_rm)}</td>
                    <td>{r.balance_after_points} pts</td>
                    <td className="small text-muted">{r.description || r.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="tx-pagination">
            <span className="small text-muted">
              Page {page} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="tx-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>
              <button
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
