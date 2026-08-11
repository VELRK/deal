import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI, ordersAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils/formatPrice";

interface DashStats {
  total_orders: number;
  pending: number;
  delivered: number;
  total_spent: number;
  addresses: number;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  subtotal: number;
  thumbnail?: string;
}

interface RecentOrder {
  id: number;
  order_number?: string;
  status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

// Simple line-icon glyphs (no emoji) — stroke-based, inherit currentColor
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.25" />
  </svg>
);

const STAT_CARDS = [
  { key: "total_orders", label: "Total Orders", Icon: IconBox },
  { key: "pending", label: "Pending Orders", Icon: IconClock },
  { key: "delivered", label: "Delivered", Icon: IconCheck },
  { key: "addresses", label: "Saved Addresses", Icon: IconPin },
];

export default function AccountDashboard() {
  useAuthStore();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userAPI.dashboard().catch(() => null),
      ordersAPI.getAll().catch(() => null)
    ])
      .then(([dashRes, ordersRes]) => {
        if (!dashRes) return;
        const d = (dashRes.data as { data?: { stats: DashStats; recent_orders: RecentOrder[] } }).data;
        if (d) {
          const updatedStats = { ...d.stats };
          if (ordersRes && ordersRes.data) {
            const allOrders = (ordersRes.data as { data?: { status: string }[] }).data || [];
            updatedStats.total_orders = allOrders.filter(o => {
              const s = o.status?.toLowerCase();
              return s !== "payment_attempt" && s !== "abandoned";
            }).length;
            updatedStats.pending = allOrders.filter(o => {
              const s = o.status?.toLowerCase();
              return ["pending", "confirmed", "processing", "shipped"].includes(s || "");
            }).length;
            updatedStats.delivered = allOrders.filter(o => {
              const s = o.status?.toLowerCase();
              return s === "delivered";
            }).length;
          }
          setStats(updatedStats);
          setRecent(d.recent_orders.filter(o => {
            const s = o.status?.toLowerCase();
            return s !== "payment_attempt" && s !== "abandoned";
          }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AccountSection title="Dashboard">
      <div className="dashboard-classic-wrapper">
        <style>{`
          .dashboard-classic-wrapper {
            width: 100%;
            --ink: #24262b;
            --muted: #6b6f76;
            --hairline: #dcd7ca;
            --paper: #ffffff;
            --brass: #3ec1bc;
            --brass-dark: #2e9a96;
            --navy: #1f2d3d;
          }

          .dashboard-classic-wrapper * {
            box-sizing: border-box;
          }

          /* ---------- Stat grid ---------- */
          .classic-stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0;
            margin-bottom: 36px;
            border: 1px solid var(--hairline);
            border-radius: 8px;
            background: var(--paper);
            overflow: hidden;
          }

          .classic-stat-card {
            padding: 22px 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-right: 1px solid var(--hairline);
            border-bottom: 1px solid var(--hairline);
          }

          .classic-stat-grid .classic-stat-card:last-child {
            border-right: none;
          }

          @media (max-width: 900px) {
            .classic-stat-card {
              border-right: none;
            }
          }

          @media (max-width: 576px) {
            .classic-stat-grid {
              grid-template-columns: 1fr 1fr;
              margin-bottom: 24px;
            }
            .classic-stat-card {
              padding: 14px 12px;
              gap: 10px;
              border-right: 1px solid var(--hairline);
            }
            .classic-stat-card:nth-child(2n) {
              border-right: none;
            }
            .classic-stat-icon {
              width: 36px !important;
              height: 36px !important;
            }
            .classic-stat-icon svg {
              width: 17px;
              height: 17px;
            }
            .classic-stat-info .stat-label {
              font-size: 10px;
              margin-bottom: 4px;
            }
            .classic-stat-info .stat-value {
              font-size: 22px;
            }
          }

          .classic-stat-icon {
            width: 42px;
            height: 42px;
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--hairline);
            border-radius: 50%;
            color: var(--brass);
            background: #faf7ef;
          }

          .classic-stat-info .stat-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 6px;
          }

          .classic-stat-info .stat-value {
            font-size: 28px;
            font-weight: 400;
            color: var(--navy);
            margin: 0;
            line-height: 1;
          }

          /* ---------- Orders section (Matched to Transaction History) ---------- */
          .tx-history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .tx-history-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
          }

          @media (max-width: 576px) {
            .tx-history-title {
              font-size: 17px;
            }
          }

          .tx-table-wrapper {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.01);
            -webkit-overflow-scrolling: touch;
          }

          .tx-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            min-width: 500px;
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

          .tx-status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .tx-status-badge.delivered { background: #ecfdf5; color: #059669; }
          .tx-status-badge.pending { background: #fffbeb; color: #d97706; }
          .tx-status-badge.shipped { background: #eff6ff; color: #2563eb; }
          .tx-status-badge.cancelled { background: #fef2f2; color: #dc2626; }

          .classic-btn-view {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--brass) !important;
            text-decoration: none;
            padding-bottom: 2px;
            border-bottom: 1px solid var(--brass);
            transition: color 0.2s ease, border-color 0.2s ease;
          }

          .classic-btn-view:hover {
            color: var(--brass-dark) !important;
            border-color: var(--brass-dark);
          }

          .classic-empty {
            text-align: center;
            padding: 48px 0;
            color: var(--muted);
            font-size: 15px;
          }
        `}</style>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : (
          <>
            <div className="classic-stat-grid">
              {STAT_CARDS.map(({ key, label, Icon }) => {
                const value =
                  key === "total_orders" ? stats?.total_orders ?? 0
                    : key === "pending" ? stats?.pending ?? 0
                      : key === "delivered" ? stats?.delivered ?? 0
                        : stats?.addresses ?? 0;
                return (
                  <div className="classic-stat-card" key={key}>
                    <div className="classic-stat-icon">
                      <Icon />
                    </div>
                    <div className="classic-stat-info">
                      <div className="stat-label">{label}</div>
                      <h4 className="stat-value">{value}</h4>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="tx-history-header">
              <h3 className="tx-history-title">Recent Orders</h3>
              <Link to="/account-orders" className="classic-btn-view">View All</Link>
            </div>

            <div className="tx-table-wrapper">
              {recent.length === 0 ? (
                <div className="classic-empty">No recent orders found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="tx-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((order) => {
                        const stClass = order.status === "delivered" ? "delivered"
                          : order.status === "cancelled" ? "cancelled"
                            : order.status === "shipped" ? "shipped"
                              : "pending";
                        const stLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                        return (
                          <tr key={order.id}>
                            <td>
                              <span style={{ fontWeight: 600 }}>#{order.order_number ?? order.id}</span>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td>
                              <span className={`tx-status-badge ${stClass}`}>
                                {stLabel}
                              </span>
                            </td>
                            <td style={{ fontWeight: 500 }}>{formatPrice(order.total)}</td>
                            <td>
                              <Link to={`/account-orders`} className="classic-btn-view" style={{ fontSize: '11px', borderBottom: 'none', padding: 0 }}>View</Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AccountSection>
  );
}
