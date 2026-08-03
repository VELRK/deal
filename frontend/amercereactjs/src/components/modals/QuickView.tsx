import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";
import { useModalStore } from "@/store/modalStore";
import { Drawer } from "@/components/Modal";
import { addLineToCart } from "@/utils/cartSync";

export default function QuickView() {
  const { quickViewItem, isAddedToCartProducts } = useContextElement();
  const { activeModal, closeModal } = useModalStore();
  const isOpen = activeModal === "quickView";

  const product = quickViewItem;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedColor = product?.colors?.[selectedColorIndex];
  const selectedSize = product?.sizes?.[selectedSizeIndex];
  const hasColors = Boolean(product?.colors?.length);
  const hasSizes = Boolean(product?.sizes?.length);
  const isAdded = product ? isAddedToCartProducts(product.id) : false;

  const galleryImages = useMemo(() => {
    if (product?.images?.length) return product.images.map((img) => img.src);

    const fromColors = product?.colors?.map((c) => c.img) ?? [];
    const base = [product?.img, product?.imgHover].filter(
      (img): img is string => Boolean(img),
    );
    const all = [...fromColors, ...base];
    const unique = Array.from(new Set(all));
    if (unique.length > 1) return unique;

    return [
      product?.img,
      "/frontend/assets/images/product/product-2.jpg",
      "/frontend/assets/images/product/product-3.jpg",
      "/frontend/assets/images/product/product-4.jpg",
    ];
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || isAdded) return;
    await addLineToCart(product, quantity);
  };

  return (
    <Drawer isOpen={isOpen} onClose={closeModal} width="850px">
      {!product ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-secondary" role="status" />
        </div>
      ) : (
        <div className="d-flex h-100 flex-column flex-md-row" style={{ overflowY: "auto" }}>
          <div style={{ flex: "1 1 50%", background: "#f8f8f8" }}>
            <div className="wrapper-scroll-quickview h-100" style={{ overflowY: "auto" }}>
              {galleryImages.map((src, index) => (
                <div key={`${src}-${index}`} className="w-100">
                  <img loading="lazy" className="w-100 h-auto" src={src} alt={product.name} />
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ flex: "1 1 50%", padding: "40px", display: "flex", flexDirection: "column", backgroundColor: "white" }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h5 className="m-0 text-uppercase fw-semibold" style={{ letterSpacing: "1px", color: "var(--modal-primary)" }}>Quick View</h5>
              <button 
                type="button"
                onClick={closeModal}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--modal-secondary)" }}
              >
                <i className="icon icon-X2 fs-24" />
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <p className="text-uppercase mb-1" style={{ fontSize: "12px", color: "#64748B", letterSpacing: "1px" }}>
                  {product.category ?? "Clothing"}
                </p>
                <h3 className="mb-2" style={{ fontSize: "28px", fontWeight: "600", color: "var(--modal-primary)" }}>
                  {product.name}
                </h3>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-1" style={{ color: "var(--modal-accent)" }}>
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star" style={{ fontSize: "12px" }} />
                    ))}
                    <span style={{ fontSize: "13px", color: "#64748B", marginLeft: "4px" }}>
                      {product.reviewsText ?? "(134 reviews)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <h4 style={{ color: "var(--modal-primary)", fontWeight: "600", fontSize: "24px", margin: 0 }}>
                  {formatPrice(product.price)}
                </h4>
                {product.priceOld != null && (
                  <p style={{ textDecoration: "line-through", color: "#94A3B8", margin: 0 }}>
                    {formatPrice(product.priceOld)}
                  </p>
                )}
                {product.badge && (
                  <span style={{ background: "var(--modal-danger)", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
                    {product.badge}
                  </span>
                )}
              </div>

              <p style={{ color: "var(--modal-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                {product.description ?? "The garments labelled as Committed are products that have been produced using sustainable fibres or processes, reducing their environmental impact."}
              </p>

              <hr style={{ borderColor: "var(--modal-border)" }} />

              {hasColors && (
                <div>
                  <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>
                    Color: <span className="text-capitalize fw-semibold">{selectedColor?.label}</span>
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    {(product.colors ?? []).map((color, index) => (
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
                <div className="mt-2">
                  <div className="d-flex justify-content-between mb-2">
                    <p className="m-0" style={{ fontSize: "14px", fontWeight: "500" }}>
                      Size: <span className="text-capitalize fw-semibold">{selectedSize}</span>
                    </p>
                    <a href="#findSize" className="text-decoration-underline" style={{ fontSize: "13px", color: "var(--modal-primary)" }}>Size Guide</a>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {(product.sizes ?? []).map((size, index) => (
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

              <div className="mt-2">
                <p className="mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>Quantity:</p>
                <div className="d-flex gap-3 align-items-center">
                  <div className="d-flex align-items-center" style={{ border: "1px solid var(--modal-border)", borderRadius: "8px", overflow: "hidden" }}>
                    <button 
                      type="button" 
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={{ width: "40px", height: "48px", border: "none", backgroundColor: "white", cursor: "pointer", fontSize: "18px" }}
                    >
                      -
                    </button>
                    <input 
                      type="text" 
                      readOnly 
                      value={quantity} 
                      style={{ width: "40px", height: "48px", border: "none", borderLeft: "1px solid var(--modal-border)", borderRight: "1px solid var(--modal-border)", textAlign: "center", outline: "none", fontWeight: "600" }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setQuantity((q) => q + 1)}
                      style={{ width: "40px", height: "48px", border: "none", backgroundColor: "white", cursor: "pointer", fontSize: "18px" }}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    className="flex-grow-1 text-uppercase fw-semibold"
                    onClick={handleAddToCart}
                    style={{
                      height: "48px",
                      background: "linear-gradient(135deg, #1E293B, var(--modal-primary))",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      transition: "all 0.2s"
                    }}
                  >
                    {isAdded ? "Added" : `Add to Cart - ${formatPrice(product.price * quantity)}`}
                  </button>
                </div>
              </div>
              
              <Link
                to={`/product-detail/${product.id}`}
                onClick={closeModal}
                className="w-100 text-center text-uppercase fw-semibold mt-3 py-3"
                style={{
                  border: "1px solid var(--modal-primary)",
                  color: "var(--modal-primary)",
                  borderRadius: "8px",
                  textDecoration: "none"
                }}
              >
                View Full Details
              </Link>

            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
