export function ProductSafeCheckout() {
  return (
    <div className="tf-product-trust-seal">
      <p className="h6 text-seal">Guaranteed Safe Checkout:</p>
      <div className="d-flex align-items-center flex-wrap gap-8 mt-8">
        {/* UPI */}
        <span className="badge border fw-medium px-10 py-6" style={{ fontSize: 11, background: "#f0f7ff", color: "#1a56db", borderColor: "#bfdbfe" }}>
          UPI
        </span>
        {/* Razorpay */}
        <span className="badge border fw-medium px-10 py-6" style={{ fontSize: 11, background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}>
          Razorpay
        </span>
        {/* COD */}
        <span className="badge border fw-medium px-10 py-6" style={{ fontSize: 11, background: "#fefce8", color: "#854d0e", borderColor: "#fde68a" }}>
          Cash on Delivery
        </span>
        {/* Net Banking */}
        <span className="badge border fw-medium px-10 py-6" style={{ fontSize: 11, background: "#fdf4ff", color: "#6b21a8", borderColor: "#e9d5ff" }}>
          Net Banking
        </span>
        {/* Cards */}
        <span className="badge border fw-medium px-10 py-6" style={{ fontSize: 11, background: "#fff7ed", color: "#9a3412", borderColor: "#fed7aa" }}>
          Debit / Credit Card
        </span>
      </div>
      <p className="text-caption-01 cl-text-3 mt-6">
        <i className="icon icon-Lock me-4" /> 100% Secure &amp; Encrypted Transaction
      </p>
    </div>
  );
}
