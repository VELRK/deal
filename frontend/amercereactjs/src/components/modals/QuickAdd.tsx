import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";
import { useModalStore } from "@/store/modalStore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/Modal";
import { addLineToCart } from "@/utils/cartSync";
import type { UnitVariantOption } from "@/context/productContextTypes";
import styles from "./QuickAdd.module.css";

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
  const {
    quickAddProduct,
    addToWishlist,
    removeFromWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    removeFromCompareItem,
    isAddedToCompareItem,
  } = useContextElement();
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

  const discountPercent =
    displayPriceOld != null && displayPriceOld > displayPrice
      ? Math.round(((displayPriceOld - displayPrice) / displayPriceOld) * 100)
      : null;

  const previewImage =
    selectedVariant?.img
    ?? selectedColor?.img
    ?? product?.img
    ?? product?.images?.[0]?.src
    ?? "/frontend/assets/images/product/product-1.jpg";

  const inWishlist = product && isAddedtoWishlist ? isAddedtoWishlist(product.id) : false;
  const inCompare = product && isAddedToCompareItem ? isAddedToCompareItem(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist?.(product.id);
    } else {
      addToWishlist?.(product);
    }
  };

  const handleToggleCompare = () => {
    if (!product) return;
    if (inCompare) {
      removeFromCompareItem?.(product.id);
    } else {
      addToCompareItem?.(product);
    }
  };

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
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );

  const primaryLabel = adding
    ? "Adding to Cart..."
    : productFullyOut || isOutOfStock
      ? "Out of Stock"
      : `Add to Cart — ${formatPrice(displayPrice * quantity)}`;

  const ratingValue = product?.rating ?? product?.avg_rating ?? 5;
  const reviewsCountText = product?.reviewsText ?? (product?.review_count ? `(${product.review_count} reviews)` : null);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="520px">
      <ModalHeader title="Quick Add to Bag" onClose={closeModal} icon={icon} />
      <ModalBody>
        {!product ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {/* Product Summary Header Card */}
            <div className={styles.productHeaderCard}>
              <div className={styles.imageWrapper}>
                <Link to={`/product-detail/${product.id}`} onClick={closeModal}>
                  <img
                    className={styles.productImg}
                    src={previewImage}
                    alt={product.name}
                  />
                </Link>
                {discountPercent != null && (
                  <span className={styles.discountBadge}>-{discountPercent}%</span>
                )}
              </div>

              <div className={styles.productInfo}>
                {(product.category || product.brand_name || product.unit_label) && (
                  <span className={styles.categoryTag}>
                    {product.category ?? product.brand_name ?? product.unit_label}
                  </span>
                )}

                <Link
                  to={`/product-detail/${product.id}`}
                  className={styles.productTitle}
                  onClick={closeModal}
                  title={product.name}
                >
                  {product.name}
                </Link>

                {/* {ratingValue > 0 && (
                  <div className={styles.ratingRow}>
                    <span className={styles.starIcon}>★</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                      {ratingValue.toFixed(1)}
                    </span>
                    {reviewsCountText && (
                      <span className={styles.reviewText}>{reviewsCountText}</span>
                    )}
                  </div>
                )} */}

                <div className={styles.priceRow}>
                  <span className={styles.currentPrice}>
                    {formatPrice(displayPrice)}
                  </span>
                  {displayPriceOld != null && displayPriceOld > displayPrice && (
                    <span className={styles.oldPrice}>
                      {formatPrice(displayPriceOld)}
                    </span>
                  )}
                  {discountPercent != null && (
                    <span className={styles.saveBadge}>Save {discountPercent}%</span>
                  )}
                </div>

                <div className={styles.stockBadge}>
                  {productFullyOut || isOutOfStock ? (
                    <span className={`${styles.stockBadge} ${styles.stockOut}`}>
                      <span className={`${styles.stockDot} ${styles.stockDotOut}`} />
                      Out of Stock
                    </span>
                  ) : (
                    <span className={`${styles.stockBadge} ${styles.stockIn}`}>
                      <span className={`${styles.stockDot} ${styles.stockDotIn}`} />
                      In Stock{availableStock > 0 ? ` · ${availableStock} available` : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pack Size / Unit Variants */}
            {hasUnitVariants && (
              <div>
                <div className={styles.sectionTitle}>
                  <span>Select Pack Size</span>
                  <span className={styles.selectedVal}>
                    {selectedVariant?.label ?? "Select"}
                  </span>
                </div>
                <div className={styles.variantGrid}>
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
                        className={`${styles.variantCard} ${active ? styles.variantCardActive : ""
                          } ${out ? styles.variantCardDisabled : ""}`}
                      >
                        {active && <span className={styles.activeCheckIcon}>✓</span>}
                        <span className={styles.variantLabel}>{variant.label}</span>
                        <span className={styles.variantPrice}>
                          {out ? "Out of stock" : formatPrice(variant.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className={styles.sectionTitle}>
                  <span>Color</span>
                  <span className={styles.selectedVal}>{selectedColor?.label}</span>
                </div>
                <div className={styles.colorRow}>
                  {product.colors.map((color, index) => {
                    const isActive = selectedColorIndex === index;
                    return (
                      <button
                        key={`${color.label}-${index}`}
                        type="button"
                        onClick={() => setSelectedColorIndex(index)}
                        title={color.label}
                        className={`${styles.colorSwatchBtn} ${isActive ? styles.colorSwatchActive : ""
                          }`}
                      >
                        <img
                          loading="lazy"
                          className={styles.swatchImg}
                          src={color.img}
                          alt={color.label}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {hasSizes && (
              <div>
                <div className={styles.sectionTitle}>
                  <span>Size</span>
                  <span className={styles.selectedVal}>{selectedSize}</span>
                </div>
                <div className={styles.sizeRow}>
                  {sizeOptions.map((size, index) => {
                    const isActive = selectedSizeIndex === index;
                    return (
                      <button
                        key={`${size}-${index}`}
                        type="button"
                        onClick={() => setSelectedSizeIndex(index)}
                        className={`${styles.sizeBtn} ${isActive ? styles.sizeBtnActive : ""
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Utility Buttons */}
            <div className={styles.controlsRow}>
              <div>
                <div className={styles.sectionTitle} style={{ marginBottom: "6px" }}>
                  <span>Quantity</span>
                </div>
                <div className={styles.quantityStepper}>
                  <button
                    type="button"
                    disabled={isOutOfStock || quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className={styles.stepperBtn}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={quantity}
                    className={styles.stepperInput}
                  />
                  <button
                    type="button"
                    disabled={isOutOfStock || quantity >= availableStock}
                    onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                    className={styles.stepperBtn}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.actionIconBtns}>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  className={`${styles.iconUtilityBtn} ${inWishlist ? styles.iconUtilityBtnActive : ""
                    }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {/* <button
                  type="button"
                  onClick={handleToggleCompare}
                  title={inCompare ? "Remove from compare" : "Add to compare"}
                  className={`${styles.iconUtilityBtn} ${
                    inCompare ? styles.iconCompareBtnActive : ""
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
                  </svg>
                </button> */}

                <Link
                  to={`/product-detail/${product.id}`}
                  onClick={closeModal}
                  className={styles.viewDetailsLink}
                  title="View Full Product Page"
                >
                  <span>Details</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </Link>
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
            variant: "gold",
          }}
          secondaryAction={
            isOutOfStock || productFullyOut
              ? undefined
              : {
                label: "Buy It Now",
                onClick: async () => {
                  await handleAddToCart();
                  window.location.href = "/checkout";
                },
              }
          }
        />
      )}
    </Modal>
  );
}
