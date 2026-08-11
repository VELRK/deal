import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";
import { useModalStore } from "@/store/modalStore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import { addLineToCart } from "@/utils/cartSync";
import type { UnitVariantOption } from "@/context/productContextTypes";

function pickDefaultVariantId(variants: UnitVariantOption[]): number | null {
  if (!variants.length) return null;
  const preferred =
    variants.find((v) => v.isDefault && Number(v.stock) > 0)
    ?? variants.find((v) => Number(v.stock) > 0)
    ?? variants.find((v) => v.isDefault)
    ?? variants[0];
  return preferred?.id ?? null;
}

export default function QuickAdd() {
  const { quickAddProduct, isAddedToCartProducts } = useContextElement();
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "quickAdd";

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const product = quickAddProduct;
  const unitVariants = useMemo(
    () => (product?.unitVariants ?? []) as UnitVariantOption[],
    [product],
  );
  const hasUnitVariants = unitVariants.length > 0;

  useEffect(() => {
    setSelectedColorIndex(0);
    setSelectedSizeIndex(0);
    setQuantity(1);
    setSelectedVariantId(pickDefaultVariantId(unitVariants));
  }, [product?.id, unitVariants]);

  const selectedVariant = hasUnitVariants
    ? (unitVariants.find((v) => v.id === selectedVariantId) ?? unitVariants[0] ?? null)
    : null;

  const sizeOptions = product ? (product.sizes ?? []).map(String) : [];
  const hasSizes = sizeOptions.length > 0;
  const selectedColor = product?.colors?.[selectedColorIndex];
  const selectedSize = sizeOptions[selectedSizeIndex] ?? null;

  const availableStock = hasUnitVariants
    ? Number(selectedVariant?.stock ?? 0)
    : Number(product?.stock ?? 0);
  const isOutOfStock = availableStock <= 0;
  const productFullyOut = hasUnitVariants
    ? unitVariants.every((v) => Number(v.stock) <= 0)
    : Number(product?.stock ?? 0) <= 0 || !!(product as { isStockOut?: boolean } | null)?.isStockOut;

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displayPriceOld = selectedVariant?.priceOld ?? product?.priceOld;
  const previewImage =
    selectedVariant?.img
    ?? selectedColor?.img
    ?? product?.img
    ?? product?.images?.[0]?.src
    ?? "/frontend/assets/images/product/product-1.jpg";

  const handleAddToCart = async () => {
    if (!product || adding || isOutOfStock || productFullyOut) return;
    if (hasUnitVariants && !selectedVariant) return;

    const qty = Math.min(quantity, Math.max(1, availableStock));
    setAdding(true);
    try {
      await addLineToCart(
        {
          ...product,
          price: displayPrice,
          priceOld: displayPriceOld,
          img: previewImage,
          unit_label: selectedVariant?.label ?? product.unit_label,
          selectedVariantId: selectedVariant?.id,
          selectedSize: selectedSize ?? undefined,
          selectedColor: selectedColor?.label,
          stock: availableStock,
          isStockOut: false,
          inStock: true,
        },
        qty,
      );
      closeModal();
    } finally {
      setAdding(false);
    }
  };

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );

  const primaryLabel = productFullyOut || isOutOfStock
    ? "Out of Stock"
    : `Add to Cart - ${formatPrice(displayPrice * quantity)}`;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="500px">
      <ModalHeader
        title="Quick Add"
        onClose={closeModal}
        icon={icon}
      />
      <ModalBody>
        {!product ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            <div className="d-flex gap-3 align-items-center">
              <Link to={`/product-detail/${product.id}`} onClick={closeModal}>
                <img
                  style={{ width: "80px", height: "107px", objectFit: "cover", borderRadius: "8px" }}
                  src={previewImage}
                  alt={product.name}
                />
              </Link>
              <div className="d-flex flex-column">
                <Link
                  to={`/product-detail/${product.id}`}
                  className="fw-semibold text-capitalize text-decoration-none"
                  style={{ fontSize: "16px", color: "var(--modal-primary)" }}
                  onClick={closeModal}
                >
                  {product.name}
                </Link>
                <div className="d-flex gap-2 align-items-center mt-1">
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--modal-accent)" }}>
                    {formatPrice(displayPrice)}
                  </span>
                  {displayPriceOld != null && displayPriceOld > displayPrice && (
                    <span style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "line-through" }}>
                      {formatPrice(displayPriceOld)}
                    </span>
                  )}
                </div>
                {selectedVariant?.label && (
                  <span className="text-muted mt-1" style={{ fontSize: "12px" }}>
                    Pack: {selectedVariant.label}
                    {!isOutOfStock && availableStock > 0 ? ` · ${availableStock} available` : ""}
                  </span>
                )}
                {(productFullyOut || isOutOfStock) && (
                  <span className="text-danger fw-semibold mt-1" style={{ fontSize: "13px" }}>
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {hasUnitVariants && (
              <div>
                <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Pack size:{" "}
                  <span className="fw-semibold">{selectedVariant?.label ?? "Select"}</span>
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: "8px",
                  }}
                >
                  {unitVariants.map((variant) => {
                    const out = Number(variant.stock) <= 0;
                    const active = selectedVariantId === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={out}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          setQuantity(1);
                        }}
                        title={out ? `${variant.label} — Out of stock` : variant.label}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          minWidth: "110px",
                          width: "100%",
                          padding: "12px 10px",
                          border: active ? "2px solid var(--modal-primary)" : "1px solid var(--modal-border)",
                          borderRadius: "10px",
                          backgroundColor: active ? "var(--modal-primary)" : "white",
                          color: out ? "#94A3B8" : active ? "white" : "var(--modal-secondary)",
                          fontWeight: 600,
                          fontSize: "13px",
                          lineHeight: 1.25,
                          cursor: out ? "not-allowed" : "pointer",
                          opacity: out ? 0.55 : 1,
                          textDecoration: out ? "line-through" : "none",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ display: "block", width: "100%" }}>{variant.label}</span>
                        <span
                          style={{
                            display: "block",
                            width: "100%",
                            fontSize: "12px",
                            fontWeight: 500,
                            opacity: 0.9,
                          }}
                        >
                          {out ? "Out of stock" : formatPrice(variant.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Color: <span className="text-capitalize fw-semibold">{selectedColor?.label}</span>
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  {product.colors.map((color, index) => (
                    <button
                      key={`${color.label}-${index}`}
                      type="button"
                      onClick={() => setSelectedColorIndex(index)}
                      style={{
                        padding: 0,
                        border: selectedColorIndex === index ? "2px solid var(--modal-primary)" : "1px solid var(--modal-border)",
                        borderRadius: "50%",
                        width: "44px",
                        height: "44px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <img loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={color.img} alt={color.label} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasSizes && (
              <div>
                <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>
                  Size: <span className="text-capitalize fw-semibold">{selectedSize}</span>
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  {sizeOptions.map((size, index) => (
                    <button
                      key={`${size}-${index}`}
                      type="button"
                      onClick={() => setSelectedSizeIndex(index)}
                      style={{
                        minWidth: "44px",
                        height: "44px",
                        padding: "0 12px",
                        border: selectedSizeIndex === index ? "2px solid var(--modal-primary)" : "1px solid var(--modal-border)",
                        borderRadius: "8px",
                        backgroundColor: selectedSizeIndex === index ? "var(--modal-primary)" : "white",
                        color: selectedSizeIndex === index ? "white" : "var(--modal-secondary)",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>Quantity:</p>
              <div className="d-flex align-items-center" style={{ width: "fit-content", border: "1px solid var(--modal-border)", borderRadius: "8px", overflow: "hidden" }}>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: "40px", height: "40px", border: "none", backgroundColor: "white", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  style={{ width: "40px", height: "40px", border: "none", borderLeft: "1px solid var(--modal-border)", borderRight: "1px solid var(--modal-border)", textAlign: "center", outline: "none", fontWeight: "600", padding: 0, margin: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                />
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= availableStock}
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  style={{ width: "40px", height: "40px", border: "none", backgroundColor: "white", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalBody>
      {product && (
        <ModalFooter
          primaryAction={{
            label: primaryLabel,
            onClick: handleAddToCart,
            disabled: isOutOfStock || productFullyOut || adding,
            variant: "gold"
          }}
          secondaryAction={
            isOutOfStock || productFullyOut
              ? undefined
              : {
                  label: "Buy It Now",
                  onClick: async () => {
                    await handleAddToCart();
                    window.location.href = "/checkout";
                  }
                }
          }
        />
      )}
    </Modal>
  );
}
