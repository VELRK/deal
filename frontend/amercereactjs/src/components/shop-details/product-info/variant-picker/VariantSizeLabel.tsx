export function VariantSizeLabel({ currentSize }: { currentSize: string }) {
  return (
    <div className="variant-picker-label d-flex align-items-center justify-content-between mb-2">
      <div className="d-flex align-items-center gap-2">
        <span
          className="fw-medium text-dark"
          style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}
        >
          Select Size:
        </span>
        {currentSize && (
          <span
            className="fw-semibold text-dark px-2 py-0.5 rounded"
            style={{ fontSize: "13px", backgroundColor: "#f3ede6" }}
          >
            {currentSize}
          </span>
        )}
      </div>
      <a
        href="#findSize"
        data-bs-toggle="modal"
        className="text-decoration-underline text-muted hover-dark"
        style={{ fontSize: "12px", cursor: "pointer", letterSpacing: "0.5px" }}
      >
        <i className="icon icon-Ruler me-1" />
        Size Guide
      </a>
    </div>
  );
}
