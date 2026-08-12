import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { ordersAPI, shippingAPI, type ShippingTrackEvent } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";
import { apiImageUrl } from "@/hooks/useApi";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  thumbnail?: string;
}

interface Order {
  id: number;
  order_number?: string;
  status: string;
  payment_status?: string;
  payment_method?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  promo_code?: string;
  tracking_number?: string;
  courier_status?: string;
  latest_track?: string;
  jt_tracks?: Array<{ scanTime?: string; time?: string; desc?: string; remark?: string; scanType?: string }>;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  shipping_name?: string;
  shipping_line1?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_phone?: string;
  items?: OrderItem[];
}

const TABS = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In Progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export default function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [liveEvents, setLiveEvents] = useState<ShippingTrackEvent[]>([]);
  const [trackLoading, setTrackLoading] = useState(false);

  // Custom Modal States for interactions
  const [modalAction, setModalAction] = useState<{ type: "cancel" | "return" | "exchange"; orderId: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  async function downloadInvoice(orderId: number) {
    setInvoiceLoading(true);
    try {
      const res = await ordersAPI.invoice(orderId);
      const url = res.data?.data?.download_url;
      if (!url) {
        setToastMessage("Invoice link unavailable for this order.");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setToastMessage("Could not download invoice. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  }

  useEffect(() => {
    ordersAPI.getAll()
      .then((res) => setOrders((res.data as { data?: Order[] }).data ?? []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const getOrderStatusGroup = (status: string) => {
    const s = status.toLowerCase();
    // payment_attempt is shown as Abandoned (same as admin Orders tab)
    if (s === "payment_attempt") {
      return "abandoned";
    }
    if (["pending", "confirmed", "processing", "shipped"].includes(s)) {
      return "in-progress";
    }
    if (s === "delivered") {
      return "delivered";
    }
    if (["cancelled", "returned"].includes(s)) {
      return "cancelled";
    }
    return "in-progress";
  };

  const filterByDate = (order: Order) => {
    if (dateFilter === "all") return true;
    const orderDate = new Date(order.created_at);
    const now = new Date();
    if (dateFilter === "30days") {
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
    if (dateFilter === "6months") {
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 180;
    }
    if (dateFilter === "2026") {
      return orderDate.getFullYear() === 2026;
    }
    if (dateFilter === "2025") {
      return orderDate.getFullYear() === 2025;
    }
    return true;
  };

  const visibleOrders = orders
    .filter((o) => {
      const group = getOrderStatusGroup(o.status);
      // "All" mirrors admin: hide abandoned checkouts from the main list
      if (activeTab === "all") return group !== "abandoned";
      return group === activeTab;
    })
    .filter(filterByDate);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const isDetailView = selectedOrderId !== null && selectedOrder !== undefined;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshTracking = async (order: Order) => {
    const awb = (order.tracking_number || "").trim();
    if (!awb) {
      showToast("No tracking ID yet for this order.");
      return;
    }
    setTrackLoading(true);
    try {
      const res = await shippingAPI.track({
        tracking_number: awb,
        order_number: order.order_number,
      });
      const data = res.data?.data;
      if (!res.data?.success || !data) {
        showToast(res.data?.message || "Could not refresh tracking.");
        return;
      }
      setLiveEvents(data.events ?? []);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                tracking_number: data.tracking_number || o.tracking_number,
                courier_status: data.courier_status || o.courier_status,
                status: (data.order_status as string) || o.status,
                latest_track: data.events?.[0]?.label || data.courier_status || o.latest_track,
              }
            : o
        )
      );
      showToast("Tracking updated.");
    } catch {
      showToast("Could not refresh tracking. Try again shortly.");
    } finally {
      setTrackLoading(false);
    }
  };

  useEffect(() => {
    setLiveEvents([]);
    if (!selectedOrder?.tracking_number) return;
    void refreshTracking(selectedOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderId]);

  const handleActionConfirm = () => {
    if (!modalAction) return;
    const { type, orderId } = modalAction;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: type === "cancel" ? "cancelled" : "returned",
          };
        }
        return o;
      })
    );

    if (type === "cancel") {
      showToast("Order cancellation request has been successfully processed.");
    } else if (type === "return") {
      showToast("Return request submitted. Pickup will be arranged within 2-3 business days.");
    } else {
      showToast("Exchange ticket created. Our support team will contact you to confirm the items.");
    }

    setModalAction(null);
  };

  // SVGs replacing Emojis
  const SvgArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const SvgCheck = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const SvgPhone = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#a12c3f" }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );

  const SvgBilling = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <line x1="12" y1="4" x2="12" y2="20"></line>
    </svg>
  );

  const SvgAddress = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );

  const SvgBagEmpty = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a12c3f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "20px", opacity: 0.8 }}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );

  return (
    <AccountSection
      title="My Orders"
      hideSidebar={isDetailView}
      customBreadcrumbs={
        isDetailView ? (
          <>
            <Link to="/">Home</Link>
            <span className="separator">&gt;</span>
            <Link to="/account-page">My Account</Link>
            <span className="separator">&gt;</span>
            <span className="breadcrumb-link" onClick={() => setSelectedOrderId(null)} style={{ cursor: "pointer" }}>My Orders</span>
            <span className="separator">&gt;</span>
            <span className="current">Order ID: {selectedOrder?.order_number ?? selectedOrder?.id}</span>
          </>
        ) : null
      }
    >
      <div className="classic-orders-theme">
        <style>{`
          .classic-orders-theme {
            font-family: 'Inter', sans-serif;
            color: #333333;
          }

          /* Toast style */
          .classic-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #2e7d32;
            color: #ffffff;
            padding: 14px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-weight: 500;
            font-size: 14px;
            z-index: 9999;
            animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes toastIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          /* Modal style */
          .classic-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
          }
          .classic-modal {
            background: #ffffff;
            border-radius: 12px;
            width: 90%;
            max-width: 440px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes modalIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .modal-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #111;
          }
          .modal-body {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.5;
          }
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .btn-modal-cancel {
            background: #f5f5f5;
            color: #666;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .btn-modal-cancel:hover { background: #e8e8e8; }
          .btn-modal-confirm {
            background: #3ec1bc;
            color: #fff;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          .btn-modal-confirm:hover { opacity: 0.9; }

          /* Filter area styling */
          .classic-filter-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }
          .tabs-pills {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .tab-pill {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            cursor: pointer;
            transition: all 0.25s ease;
          }
          .tab-pill:hover {
            border-color: #3ec1bc;
            color: #3ec1bc;
            transform: translateY(-1px);
          }
          .tab-pill.active {
            border-color: #3ec1bc;
            background: #faf0f2;
            color: #3ec1bc;
            font-weight: 600;
          }

          /* Date dropdown select styling */
          .date-select-wrap {
            position: relative;
          }
          .date-select {
            appearance: none;
            background: #f7f7f7;
            border: 1px solid #e0e0e0;
            padding: 8px 36px 8px 16px;
            border-radius: 50px;
            font-size: 14px;
            color: #333;
            cursor: pointer;
            font-weight: 500;
            outline: none;
            transition: background 0.2s;
          }
          .date-select:hover {
            background: #eeeeee;
          }
          .date-select-icon {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #666;
            display: flex;
            align-items: center;
          }

          /* LIST VIEW: CARDS */
          .order-list-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .classic-order-card {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e5e5e5;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            cursor: pointer;
            animation: orderCardFade 0.4s ease both;
          }
          @keyframes orderCardFade {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .classic-order-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
            border-color: #3ec1bc;
            transform: translateY(-2px);
          }

          /* Top meta strip of card */
          .card-top-strip {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            background: #fafafa;
            border-bottom: 1px solid #eeeeee;
            font-size: 13px;
          }
          .status-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 50px;
            font-weight: 600;
            text-transform: capitalize;
          }
          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            display: inline-block;
          }
          
          /* Badges by status */
          .badge-in-progress { background: #fff6e6; color: #ff9800; }
          .badge-in-progress .status-dot { background: #ff9800; }

          .badge-abandoned { background: #f3f4f6; color: #6b7280; }
          .badge-abandoned .status-dot { background: #6b7280; }

          .badge-delivered { background: #eafaf1; color: #2e7d32; }
          .badge-delivered .status-dot { background: #2e7d32; }

          .badge-cancelled { background: #fdf2f2; color: #d32f2f; }
          .badge-cancelled .status-dot { background: #d32f2f; }

          .strip-divider {
            color: #cccccc;
            margin: 0 12px;
          }
          .strip-date {
            color: #666666;
            font-weight: 500;
          }

          /* Card main row content */
          .card-main-body {
            display: flex;
            align-items: center;
            padding: 20px;
            gap: 20px;
            justify-content: space-between;
          }
          .card-left-section {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
          }
          
          /* Image container with optional overlay */
          .thumb-img-wrapper {
            position: relative;
            width: 70px;
            height: 85px;
            border-radius: 8px;
            overflow: hidden;
            background: #f8f8f8;
            flex-shrink: 0;
            border: 1px solid #f0f0f0;
          }
          .thumb-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .more-items-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
          }

          .card-details-info {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .order-id-label {
            font-size: 14px;
            font-weight: 700;
            color: #3ec1bc;
          }
          .order-items-summary {
            font-size: 14px;
            color: #555555;
            line-height: 1.4;
          }
          .order-total-price {
            font-size: 15px;
            font-weight: 700;
            color: #111111;
          }
          
          .card-right-section {
            color: #3ec1bc;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 10px;
          }

          /* DETAILS VIEW */
          .details-view-container {
            animation: detailsFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          @keyframes detailsFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Details header summary banner */
          .details-summary-banner {
            display: flex;
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px 24px;
            margin-bottom: 30px;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
          }
          .summary-col {
            flex: 1;
            min-width: 140px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .summary-col:not(:last-child) {
            border-right: 1px solid #e5e5e5;
            padding-right: 20px;
          }
          @media (max-width: 600px) {
            .summary-col:not(:last-child) {
              border-right: none;
              border-bottom: 1px solid #e5e5e5;
              padding-right: 0;
              padding-bottom: 12px;
            }
          }
          .summary-col-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #777777;
            font-weight: 600;
          }
          .summary-col-value {
            font-size: 15px;
            font-weight: 700;
            color: #111111;
          }
          .summary-col-value.highlight-red {
            color: #3ec1bc;
          }
          .savings-pill {
            display: inline-block;
            background: #eafaf1;
            color: #2e7d32;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 8px;
          }

          /* Layout structure for two columns */
          .details-columns-layout {
            display: flex;
            flex-wrap: wrap;
            margin: -12px;
          }
          .col-left-details {
            flex: 1 1 64%;
            min-width: 320px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .col-right-details {
            flex: 1 1 36%;
            min-width: 280px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .section-group-title {
            font-size: 16px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 16px;
          }

          /* Stepper progress tracker */
          .stepper-box {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 16px;
          }
          .stepper-header {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #333;
          }
          .horizontal-stepper {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            position: relative;
            margin-bottom: 20px;
            padding: 0 10px;
          }
          .stepper-progress-line {
            position: absolute;
            top: 14px;
            left: 24px;
            right: 24px;
            height: 4px;
            background: #e9ecef;
            z-index: 1;
            border-radius: 2px;
            overflow: hidden;
          }
          .stepper-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3ec1bc 0%, #2b9d99 100%);
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 10px rgba(62, 193, 188, 0.5);
          }
          .step-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
            flex: 1;
            transition: all 0.4s ease;
          }
          .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999999;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }
          .step-node.completed .step-circle {
            background: #3ec1bc;
            border-color: #3ec1bc;
            color: #ffffff;
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(62, 193, 188, 0.3);
          }
          .step-node.completed .step-circle svg {
            animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .step-node.active .step-circle {
            border-color: #3ec1bc;
            color: #3ec1bc;
            background: #ffffff;
            font-weight: 700;
            transform: scale(1.15);
            box-shadow: 0 0 0 6px rgba(62, 193, 188, 0.15);
            animation: pulseGlow 2s infinite;
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(62, 193, 188, 0.4); }
            70% { box-shadow: 0 0 0 12px rgba(62, 193, 188, 0); }
            100% { box-shadow: 0 0 0 0 rgba(62, 193, 188, 0); }
          }
          .step-label {
            margin-top: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #888;
            text-align: center;
            transition: all 0.4s ease;
          }
          .step-node.completed .step-label {
            color: #111;
          }
          .step-node.active .step-label {
            color: #3ec1bc;
            transform: translateY(-2px);
          }
          .step-date {
            font-size: 11px;
            color: #999;
            margin-top: 4px;
            font-weight: 500;
            opacity: 0;
            animation: fadeIn 0.5s ease forwards 0.3s;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }

          /* Mobile adjustments for filter, cards, and stepper */
          @media (max-width: 576px) {
            .classic-filter-row {
              gap: 10px;
              margin-bottom: 16px;
            }
            .tabs-pills {
              width: 100%;
              overflow-x: auto;
              flex-wrap: nowrap;
              padding-bottom: 4px;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .tabs-pills::-webkit-scrollbar {
              display: none;
            }
            .tab-pill {
              padding: 6px 14px;
              font-size: 12.5px;
              white-space: nowrap;
              flex-shrink: 0;
            }
            .date-select-wrap {
              width: 100%;
            }
            .date-select {
              width: 100%;
            }
            .card-top-strip {
              padding: 10px 14px;
              font-size: 12px;
            }
            .card-main-body {
              padding: 14px;
              gap: 12px;
            }
            .thumb-img-wrapper {
              width: 56px;
              height: 70px;
            }
            .order-id-label {
              font-size: 13px;
            }
            .order-items-summary {
              font-size: 12.5px;
            }
            .order-total-price {
              font-size: 14px;
            }
            .stepper-box {
              padding: 14px 10px;
            }
            .horizontal-stepper {
              padding: 0 4px;
            }
            .stepper-progress-line {
              top: 11px;
              left: 12px;
              right: 12px;
              height: 3px;
            }
            .step-circle {
              width: 24px;
              height: 24px;
              font-size: 10px;
            }
            .step-circle svg {
              width: 10px;
              height: 10px;
            }
            .step-label {
              margin-top: 6px;
              font-size: 10px;
              line-height: 1.2;
            }
            .step-date {
              font-size: 9px;
            }
            .col-left-details, .col-right-details {
              flex: 1 1 100%;
              min-width: 100%;
            }
          }

          /* Details Product cards list */
          .shipment-items-box {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .product-detail-card {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
          }
          .product-card-body {
            display: flex;
            padding: 16px;
            gap: 16px;
          }
          .product-card-body img {
            width: 60px;
            height: 75px;
            object-fit: cover;
            border-radius: 6px;
            background: #f8f8f8;
            border: 1px solid #eeeeee;
          }
          .product-card-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
          }
          .product-title {
            font-size: 14px;
            font-weight: 600;
            color: #111111;
          }
          .product-meta-specs {
            font-size: 13px;
            color: #777777;
            font-weight: 500;
          }
          .product-price-qty {
            font-size: 14px;
            font-weight: 700;
            color: #333333;
            margin-top: 2px;
          }
          .product-item-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 4px;
            padding: 2px 8px;
            border-radius: 4px;
            align-self: flex-start;
          }
          
          /* Action buttons at bottom of product detail card */
          .product-card-footer {
            border-top: 1px solid #eeeeee;
            display: flex;
          }
          .action-btn-flat {
            flex: 1;
            background: transparent;
            border: none;
            color: #3ec1bc;
            font-size: 13px;
            font-weight: 600;
            padding: 12px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            text-align: center;
            text-decoration: none;
          }
          .action-btn-flat:hover {
            background: #faf0f2;
          }
          .action-btn-flat:not(:last-child) {
            border-right: 1px solid #eeeeee;
          }

          /* RIGHT COLUMN CARDS */
          .classic-panel-card {
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
          }
          .panel-card-title {
            font-size: 15px;
            font-weight: 700;
            color: #111;
            margin-bottom: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .address-home-badge {
            font-size: 12px;
            font-weight: 700;
            color: #666;
            margin-bottom: 8px;
            display: block;
          }
          .address-detail-text {
            font-size: 14px;
            line-height: 1.6;
            color: #555555;
          }
          .address-phone-strip {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 14px;
            font-size: 14px;
            color: #111;
            font-weight: 600;
          }

          /* Payment Details styling */
          .payment-panel-card {
            background: #faf5f6; /* Subtle pink tint classic style */
            border: 1px solid #eee1e3;
            border-radius: 8px;
            padding: 20px;
          }
          .payment-items-summary-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .summary-item-row {
            display: flex;
            justify-content: space-between;
            font-size: 13.5px;
            color: #555555;
            font-weight: 500;
          }
          .summary-item-row.green-text {
            color: #2e7d32;
            font-weight: 600;
          }
          .summary-item-row.total-row {
            border-top: 1px dashed #cccccc;
            margin-top: 10px;
            padding-top: 14px;
            font-size: 16px;
            font-weight: 800;
            color: #111111;
          }
        `}</style>

        {/* Global Toast for Alerts */}
        {toastMessage && (
          <div className="classic-toast">
            {toastMessage}
          </div>
        )}

        {/* Action Confirmation Modal */}
        {modalAction && (
          <div className="classic-modal-overlay">
            <div className="classic-modal">
              <div className="modal-title">
                {modalAction.type === "cancel" && "Cancel Order"}
                {modalAction.type === "return" && "Return Order Item"}
                {modalAction.type === "exchange" && "Exchange Order Item"}
              </div>
              <div className="modal-body">
                {modalAction.type === "cancel" && "Are you sure you want to cancel this order? This action will cancel your pending shipment and issue a refund if you already paid."}
                {modalAction.type === "return" && "Are you sure you want to return this item? We will dispatch a courier pickup agent to retrieve the item in original packaging."}
                {modalAction.type === "exchange" && "Are you sure you want to exchange this item? Our support team will create a ticket and assist with sizing/color availability."}
              </div>
              <div className="modal-actions">
                <button className="btn-modal-cancel" onClick={() => setModalAction(null)}>Go Back</button>
                <button className="btn-modal-confirm" onClick={handleActionConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* loading state */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ borderWidth: "2px", width: "2.5rem", height: "2.5rem" }} />
          </div>
        ) : !isDetailView ? (
          // ORDER LISTING VIEW
          <div>
            <div className="classic-filter-row">
              {/* Tab options */}
              <div className="tabs-pills">
                {TABS.map((tab) => {
                  const active = activeTab === tab.id;
                  const count =
                    tab.id === "all"
                      ? orders.length
                      : orders.filter((o) => getOrderStatusGroup(o.status) === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`tab-pill ${active ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                      {count > 0 && <span style={{ marginLeft: "6px", fontSize: "12px", opacity: 0.75 }}>({count})</span>}
                    </button>
                  );
                })}
              </div>

              {/* Date dropdown selector */}
              <div className="date-select-wrap">
                <select
                  className="date-select"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">Select date range</option>
                  <option value="30days">Last 30 days</option>
                  <option value="6months">Last 6 months</option>
                  <option value="2026">Year 2026</option>
                  <option value="2025">Year 2025</option>
                </select>
                <div className="date-select-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* list content */}
            {visibleOrders.length === 0 ? (
              <div className="text-center py-5 rounded-3" style={{ background: "#ffffff", border: "1px dashed #e0e0e0" }}>
                <SvgBagEmpty />
                <p className="mb-4 text-muted fs-6 fw-semibold">No orders found in this filter.</p>
                <Link to="/shop-default" className="tf-btn btn-sm" style={{ background: "#a12c3f", color: "#fff", borderRadius: 50, padding: "12px 30px", fontWeight: 700, border: "none" }}>
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="order-list-container">
                {visibleOrders.map((order, idx) => {
                  const statusGroup = getOrderStatusGroup(order.status);
                  const isMultiItem = (order.items?.length ?? 0) > 1;
                  const firstItem = order.items?.[0];

                  // items titles list separated by pipe
                  const titlesSummary = (order.items ?? [])
                    .map((item) => item.product_name)
                    .join(" | ");

                  return (
                    <div
                      key={order.id}
                      className="classic-order-card"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      {/* Top status line */}
                      <div className="card-top-strip">
                        <span className={`status-badge-pill badge-${statusGroup}`}>
                          <span className="status-dot"></span>
                          {statusGroup === "abandoned"
                            ? "Abandoned"
                            : statusGroup === "in-progress"
                              ? "In progress"
                              : statusGroup}
                        </span>
                        <span className="strip-divider">|</span>
                        <span className="strip-date">
                          {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      {/* Main card body */}
                      <div className="card-main-body">
                        <div className="card-left-section">
                          <div className="thumb-img-wrapper">
                            <img
                              src={apiImageUrl(firstItem?.thumbnail)}
                              alt={firstItem?.product_name ?? "Product"}
                            />
                            {isMultiItem && (
                              <div className="more-items-overlay">
                                +{(order.items?.length ?? 1) - 1}
                              </div>
                            )}
                          </div>
                          <div className="card-details-info">
                            <div className="order-id-label">
                              Order ID: {order.order_number ?? `ABC-${1000000 + order.id}`}
                            </div>
                            <div className="order-items-summary text-line-clamp-2" title={titlesSummary}>
                              {titlesSummary}
                            </div>
                            <div className="order-total-price">
                              {formatPrice(order.total)}
                            </div>
                            {order.tracking_number && (
                              <div style={{ marginTop: 6, fontSize: 12, color: "#0f766e", fontWeight: 600 }}>
                                Track: {order.tracking_number}
                                {order.courier_status ? ` · ${order.courier_status}` : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <div className="card-right-section" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          {order.tracking_number && (
                            <Link
                              to={`/track-order?tracking=${encodeURIComponent(order.tracking_number)}`}
                              className="tf-btn btn-sm"
                              style={{ background: "#0f766e", color: "#fff", borderRadius: 50, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Track
                            </Link>
                          )}
                          <SvgArrowRight />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // DETAILED ORDER VIEW
          <div className="details-view-container">
            {/* Top overview banner split in columns */}
            <div className="details-summary-banner">
              <div className="summary-col">
                <span className="summary-col-label">Order ID</span>
                <span className="summary-col-value highlight-red">
                  {selectedOrder.order_number ?? `ABC-${1000000 + selectedOrder.id}`}
                </span>
                <span style={{ fontSize: "12px", color: "#888", fontWeight: 500 }}>
                  {selectedOrder.items?.length ?? 0} {selectedOrder.items?.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="summary-col">
                <span className="summary-col-label">Amount</span>
                <span className="summary-col-value" style={{ display: "flex", alignItems: "center" }}>
                  {formatPrice(selectedOrder.total)}
                  {(selectedOrder.discount ?? 0) > 0 && (
                    <span className="savings-pill">
                      You saved {formatPrice(selectedOrder.discount!)}
                    </span>
                  )}
                </span>
              </div>
              <div className="summary-col">
                <span className="summary-col-label">Date Placed</span>
                <span className="summary-col-value">
                  {new Date(selectedOrder.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="details-columns-layout">
              {/* Left column: shipments list with stepper */}
              <div className="col-left-details">
                <div>
                  <div className="section-group-title">Items Ordered & Delivery Details</div>

                  {/* For classic mockup, group items under shipments */}
                  {/* Let's render shipment 1: active or delivered */}
                  <div className="stepper-box">
                    <div className="stepper-header">Shipment 1</div>

                    {/* Stepper Progress Bar */}
                    {selectedOrder.status === "cancelled" || selectedOrder.status === "returned" ? (
                      <div className="status-badge-pill badge-cancelled" style={{ padding: "8px 18px", fontSize: "13.5px" }}>
                        <span className="status-dot"></span>
                        {selectedOrder.status === "cancelled" ? "Order Cancelled" : "Return Request Processed"}
                      </div>
                    ) : selectedOrder.status === "payment_attempt" ? (
                      <div className="status-badge-pill badge-abandoned" style={{ padding: "8px 18px", fontSize: "13.5px" }}>
                        <span className="status-dot"></span>
                        Abandoned — awaiting payment
                      </div>
                    ) : (
                      <div>
                        <div className="horizontal-stepper">
                          {/* Green filler connection line */}
                          <div className="stepper-progress-line">
                            <div
                              className="stepper-progress-fill"
                              style={{
                                width:
                                  selectedOrder.status === "delivered"
                                    ? "100%"
                                    : selectedOrder.status === "shipped"
                                      ? "66%"
                                      : selectedOrder.status === "processing"
                                        ? "33%"
                                        : "0%",
                              }}
                            ></div>
                          </div>

                          {[
                            { key: "confirmed", label: "Order confirmed", date: selectedOrder.created_at, activeFor: ["pending", "confirmed"] },
                            { key: "processing", label: "Processing", date: null, activeFor: ["processing"] },
                            { key: "shipped", label: "Shipped", date: selectedOrder.shipped_at, activeFor: ["shipped"] },
                            { key: "delivered", label: selectedOrder.status === "delivered" ? "Delivered" : "Delivery pending", date: selectedOrder.delivered_at, activeFor: ["delivered"] }
                          ].map((step, idx) => {
                            const sequence = ["pending", "confirmed", "processing", "shipped", "delivered"];
                            const currentIdx = sequence.indexOf(selectedOrder.status.toLowerCase());
                            const stepIdx = sequence.findIndex(s => step.activeFor.includes(s));

                            // A step is completed if the current status index is greater than this step's index,
                            // or if it's the exact same step (except for delivery pending which might just be active).
                            const isCompleted = currentIdx >= stepIdx;
                            // A step is active if it's exactly the current step (and not delivered yet, maybe). 
                            // Actually, just apply completed class if passed or reached.
                            const isActive = currentIdx === stepIdx && step.key !== "delivered"; // delivered is just completed when reached

                            return (
                              <div
                                key={step.key}
                                className={`step-node ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                              >
                                <div className="step-circle">
                                  {isCompleted ? <SvgCheck /> : (idx + 1).toString()}
                                </div>
                                <span className="step-label">{step.label}</span>
                                {step.date ? (
                                  <span className="step-date">
                                    {new Date(step.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                                  </span>
                                ) : (isCompleted && step.key === "shipped") ? (
                                  <span className="step-date">In Transit</span>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Live courier tracking when AWB exists */}
                    {selectedOrder.tracking_number && (
                      <div
                        className="mt-4 p-3"
                        style={{ background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 10 }}
                      >
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                          <div>
                            <div style={{ fontSize: 12, color: "#0f766e", fontWeight: 700 }}>SHIPMENT TRACKING</div>
                            <div style={{ fontWeight: 700, color: "#111" }}>
                              AWB: {selectedOrder.tracking_number}
                            </div>
                            {selectedOrder.courier_status && (
                              <div style={{ fontSize: 13, color: "#555" }}>{selectedOrder.courier_status}</div>
                            )}
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              disabled={trackLoading}
                              onClick={() => refreshTracking(selectedOrder)}
                            >
                              {trackLoading ? "Updating…" : "Refresh"}
                            </button>
                            <Link
                              to={`/track-order?tracking=${encodeURIComponent(selectedOrder.tracking_number)}`}
                              className="btn btn-sm btn-success"
                            >
                              Open tracker
                            </Link>
                          </div>
                        </div>
                        {(() => {
                          const events =
                            liveEvents.length > 0
                              ? liveEvents
                              : (selectedOrder.jt_tracks ?? []).map((ev) => ({
                                  time: ev.scanTime || ev.time || "",
                                  desc: ev.desc || ev.remark || ev.scanType || "",
                                  label: [ev.scanTime || ev.time, ev.desc || ev.remark || ev.scanType]
                                    .filter(Boolean)
                                    .join(" — "),
                                }));
                          if (events.length === 0) {
                            return (
                              <p className="mb-0 small text-muted">
                                Tracking ID is ready. No courier scans yet — refresh after pickup.
                              </p>
                            );
                          }
                          return (
                            <ul className="list-unstyled mb-0 small" style={{ borderLeft: "2px solid #14b8a6", paddingLeft: 12 }}>
                              {events.slice(0, 8).map((ev, i) => (
                                <li key={i} className="mb-2">
                                  <div style={{ fontWeight: 600 }}>{ev.desc || ev.label}</div>
                                  {ev.time && <div className="text-muted">{ev.time}</div>}
                                </li>
                              ))}
                            </ul>
                          );
                        })()}
                      </div>
                    )}

                    {/* Cards of items in this shipment */}
                    <div className="shipment-items-box" style={{ marginTop: "30px" }}>
                      {(selectedOrder.items ?? []).map((item, index) => {
                        const statusGroup = getOrderStatusGroup(selectedOrder.status);
                        return (
                          <div key={index} className="product-detail-card">
                            <div className="product-card-body">
                              <img
                                src={apiImageUrl(item.thumbnail)}
                                alt={item.product_name}
                              />
                              <div className="product-card-info">
                                <span className="product-title">{item.product_name}</span>
                                <span className="product-meta-specs">
                                  Qty: {item.quantity}
                                </span>
                                <span className="product-price-qty">{formatPrice(item.price)}</span>
                                <span className={`product-item-status badge-${statusGroup}`}>
                                  <span className="status-dot"></span>
                                  {selectedOrder.status === "delivered"
                                    ? "Delivered"
                                    : selectedOrder.status === "cancelled"
                                      ? "Cancelled"
                                      : selectedOrder.status === "returned"
                                        ? "Returned"
                                        : selectedOrder.status === "payment_attempt"
                                          ? "Abandoned"
                                          : "Arriving soon"}
                                </span>
                              </div>
                            </div>

                            {/* Card actions bottom */}
                            <div className="product-card-footer">
                              {statusGroup === "in-progress" ? (
                                <button
                                  className="action-btn-flat"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalAction({ type: "cancel", orderId: selectedOrder.id });
                                  }}
                                >
                                  Cancel Item
                                </button>
                              ) : statusGroup === "delivered" ? (
                                <>
                                  <button
                                    className="action-btn-flat"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalAction({ type: "return", orderId: selectedOrder.id });
                                    }}
                                  >
                                    Return
                                  </button>
                                  <button
                                    className="action-btn-flat"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalAction({ type: "exchange", orderId: selectedOrder.id });
                                    }}
                                  >
                                    Exchange
                                  </button>
                                </>
                              ) : (
                                <span style={{ padding: "10px 16px", fontSize: "12px", color: "#888", fontWeight: 600 }}>
                                  No actions available
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: shipping address and billing summary */}
              <div className="col-right-details">
                {/* Shipping address panel */}
                <div className="classic-panel-card">
                  <div className="panel-card-title" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <SvgAddress />
                    <span>Delivery Address</span>
                  </div>
                  <span className="address-home-badge">Home</span>
                  <div className="address-detail-text">
                    <strong style={{ display: "block", color: "#111", marginBottom: "4px" }}>
                      {selectedOrder.shipping_name ?? "User Customer"}
                    </strong>
                    {selectedOrder.shipping_line1 ?? "Address Line 1"}<br />
                    {selectedOrder.shipping_city ?? "City"}
                    {selectedOrder.shipping_state ? `, ${selectedOrder.shipping_state}` : ""}<br />
                    Pincode: {selectedOrder.shipping_pincode ?? "N/A"}
                  </div>
                  {selectedOrder.shipping_phone && (
                    <div className="address-phone-strip">
                      <SvgPhone />
                      <span>{selectedOrder.shipping_phone}</span>
                    </div>
                  )}
                </div>

                {/* Payment details billing card */}
                <div className="payment-panel-card">
                  <div className="panel-card-title" style={{ display: "flex", gap: "8px", alignItems: "center", borderColor: "rgba(161, 44, 63, 0.15)" }}>
                    <SvgBilling />
                    <span>Payment details</span>
                  </div>

                  {selectedOrder.status !== "payment_attempt" && (
                    <button
                      type="button"
                      className="tf-btn btn-sm mb-16"
                      style={{ background: "#0f172a", color: "#fff", borderRadius: 8, padding: "10px 16px", fontWeight: 700, width: "100%" }}
                      disabled={invoiceLoading}
                      onClick={() => void downloadInvoice(selectedOrder.id)}
                    >
                      {invoiceLoading ? "Preparing invoice…" : "Download Invoice"}
                    </button>
                  )}

                  <div className="payment-items-summary-list">
                    {/* List products and prices */}
                    {(selectedOrder.items ?? []).map((item, idx) => (
                      <div className="summary-item-row" key={idx}>
                        <span style={{ maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.product_name}
                        </span>
                        <span>{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}

                    {/* Coupon savings */}
                    {(selectedOrder.discount ?? 0) > 0 && (
                      <div className="summary-item-row green-text">
                        <span>Coupon savings</span>
                        <span>-{formatPrice(selectedOrder.discount!)}</span>
                      </div>
                    )}

                    {/* Delivery fee */}
                    <div className="summary-item-row">
                      <span>Delivery</span>
                      {(selectedOrder.shipping ?? 0) === 0 ? (
                        <span style={{ color: "#2e7d32", fontWeight: 700 }}>FREE</span>
                      ) : (
                        <span>{formatPrice(selectedOrder.shipping!)}</span>
                      )}
                    </div>

                    {/* Total Row */}
                    <div className="summary-item-row total-row">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountSection>
  );
}
