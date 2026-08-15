import { VariantSizeLabel } from "./VariantSizeLabel";
import type { SizePickerProps } from "./types";

export function SizePickerButtons({
  sizes,
  currentSize,
  setCurrentSize,
}: SizePickerProps) {
  return (
    <div className="variant-picker-item variant-size mb-3">
      <VariantSizeLabel currentSize={currentSize} />
      <div className="variant-picker-values d-flex flex-wrap gap-2">
        {sizes.map((size) => {
          const active = currentSize?.toLowerCase() === size.value?.toLowerCase();
          return (
            <button
              key={size.value}
              type="button"
              className={`btn size-btn text-uppercase ${active ? "active" : ""}`}
              onClick={() => setCurrentSize(size.value)}
              style={{
                minWidth: "44px",
                height: "40px",
                padding: "0 14px",
                fontSize: "13px",
                fontWeight: 600,
                border: active ? "2px solid #1a1a1a" : "1px solid #dcd8d0",
                borderRadius: "4px",
                backgroundColor: active ? "#1a1a1a" : "#ffffff",
                color: active ? "#ffffff" : "#1a1a1a",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: active ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {size.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
