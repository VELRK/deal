import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";
import { useModalStore } from "@/store/modalStore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";

export default function QuickAdd() {
  const { quickAddProduct, addProductToCart, isAddedToCartProducts } = useContextElement();
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "quickAdd";

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex]   = useState(0);
  const [quantity, setQuantity]                     = useState(1);

  // Reset selections whenever the product changes
  useEffect(() => {
    setSelectedColorIndex(0);
    setSelectedSizeIndex(0);
    setQuantity(1);
  }, [quickAddProduct?.id]);

  const product = quickAddProduct;

  const sizeOptions   = product ? (product.sizes ?? []).map(String) : [];
  const hasSizes      = sizeOptions.length > 0;
  const selectedColor = product?.colors?.[selectedColorIndex];
  const selectedSize  = sizeOptions[selectedSizeIndex] ?? null;
  const displayPrice  = product?.price ?? 0;
  const previewImage  = selectedColor?.img
    ?? product?.img
    ?? product?.images?.[0]?.src
    ?? "/frontend/assets/images/product/product-1.jpg";

  const handleAddToCart = () => {
    if (!product) return;
    if (isAddedToCartProducts(product.id)) return;
    addProductToCart(
      { ...product, selectedSize: selectedSize ?? undefined, selectedColor: selectedColor?.label },
      quantity,
    );
    closeModal();
  };

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );

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
            {/* Product Header */}
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
                  {product.priceOld != null && (
                    <span style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "line-through" }}>
                      {formatPrice(product.priceOld)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Colors */}
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

            {/* Sizes */}
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

            {/* Quantity */}
            <div>
              <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>Quantity:</p>
              <div className="d-flex align-items-center" style={{ width: "fit-content", border: "1px solid var(--modal-border)", borderRadius: "8px", overflow: "hidden" }}>
                <button 
                  type="button" 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ width: "40px", height: "40px", border: "none", backgroundColor: "white", cursor: "pointer", fontSize: "18px" }}
                >
                  -
                </button>
                <input 
                  type="text" 
                  readOnly 
                  value={quantity} 
                  style={{ width: "40px", height: "40px", border: "none", borderLeft: "1px solid var(--modal-border)", borderRight: "1px solid var(--modal-border)", textAlign: "center", outline: "none", fontWeight: "600" }} 
                />
                <button 
                  type="button" 
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: "40px", height: "40px", border: "none", backgroundColor: "white", cursor: "pointer", fontSize: "18px" }}
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
            label: isAddedToCartProducts(product.id) ? "Added" : `Add to Cart - ${formatPrice(displayPrice * quantity)}`,
            onClick: handleAddToCart,
            disabled: isAddedToCartProducts(product.id),
            variant: "gold"
          }}
          secondaryAction={{
            label: "Buy It Now",
            onClick: () => {
              handleAddToCart();
              // In real app, redirect to checkout
              window.location.href = "/checkout";
            }
          }}
        />
      )}
    </Modal>
  );
}
