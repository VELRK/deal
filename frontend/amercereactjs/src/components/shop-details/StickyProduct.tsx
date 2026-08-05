import { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import { useCurrentProductStore } from "@/store/currentProductStore";
import { formatPrice } from "@/utils/formatPrice";
import { addLineToCart, setCartLineQuantity } from "@/utils/cartSync";
import { useModalStore } from "@/store/modalStore";
import { useStore } from "@/context/store";

export default function StickyProduct() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [quantity, setQuantity]   = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [adding, setAdding] = useState(false);

  const product = useCurrentProductStore((s) => s.product);
  const { isAddedToCartProducts } = useContextElement();
  const { openModal } = useModalStore();

  const unitVariants = product?.unitVariants ?? [];
  const selectedVariant = unitVariants.find((v) => v.isDefault) ?? unitVariants[0];
  const variantId = selectedVariant?.id ?? product?.selectedVariantId;
  const isInCart = product ? isAddedToCartProducts(product.id, variantId) : false;
  const cartQty = useStore((s) =>
    product ? s.quantityInCart(product.id, variantId) : 0,
  );

  useEffect(() => {
    if (product?.sizes?.[0]) setSelectedSize(String(product.sizes[0]));
  }, [product?.id]);

  useEffect(() => {
    if (cartQty > 0) setQuantity(Math.max(1, cartQty));
  }, [cartQty, product?.id, variantId]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) return null;

  const price    = selectedVariant?.price ?? product.price;
  const imgSrc   = selectedVariant?.img || product.img || product.images?.[0]?.src || "";
  const sizes    = (product.sizes ?? []).map(String).filter(Boolean);

  const changeQuantity = async (next: number) => {
    const q = Math.max(1, next);
    setQuantity(q);
    if (isInCart) {
      await setCartLineQuantity(product.id, q, variantId);
    }
  };

  const handleAddToCart = async () => {
    if (adding) return;
    const payload = {
      ...product,
      price,
      img: imgSrc || product.img,
      unit_label: selectedVariant?.label ?? product.unit_label,
      selectedVariantId: variantId,
      selectedSize,
    };
    setAdding(true);
    try {
      if (isInCart) {
        await setCartLineQuantity(product.id, quantity, variantId);
      } else {
        await addLineToCart(payload, quantity);
      }
      openModal("cart");
    } finally {
      setAdding(false);
    }
  };

  const isStockOut = product && (product as { isStockOut?: boolean }).isStockOut;

  return (
    <div className={`tf-sticky-btn-atc${(isVisible || isMobile) ? " show" : ""}`}>
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="atc-product-side">
              {imgSrc && (
                <div className="prd_img">
                  <img loading="lazy" width={60} height={80} src={imgSrc} alt={product.name} />
                </div>
              )}
              <div className="prd_info d-none d-lg-grid">
                <p className="name__prd fw-medium lh-24">{product.name}</p>
                <p className="price__prd fw-semibold">{formatPrice(price)}</p>
              </div>
            </div>
          </div>

          <div className="tf-sticky-atc-infos">
            <form onSubmit={(e) => e.preventDefault()}>
              {sizes.length > 0 && (
                <div className="tf-sticky-atc-variant-price">
                  <p className="title">Size:</p>
                  <div className="tf-select style-2">
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      {sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="tf-product-info-quantity">
                <p className="title">Quantity:</p>
                <div className="wg-quantity style-2">
                  <button className="btn-quantity minus-btn" type="button"
                    disabled={adding || quantity <= 1}
                    onClick={() => void changeQuantity(quantity - 1)}>
                    <i className="icon icon-minus" />
                  </button>
                  <input className="quantity-product" type="text" readOnly value={quantity} />
                  <button className="btn-quantity plus-btn" type="button"
                    disabled={adding}
                    onClick={() => void changeQuantity(quantity + 1)}>
                    <i className="icon icon-plus" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={`tf-btn btn-add-to-cart ${!isStockOut ? "animate-btn" : ""}`}
                onClick={isStockOut ? undefined : () => void handleAddToCart()}
                disabled={!!isStockOut || adding}
                style={
                  isStockOut
                    ? { backgroundColor: "#e2e2e2", color: "#333", cursor: "not-allowed", border: "none", fontWeight: "600" }
                    : { backgroundColor: "#3ec1bc", color: "#fff", border: "none" }
                }
              >
                {isStockOut
                  ? "Out of Stock"
                  : adding
                    ? "Updating…"
                    : isInCart
                      ? "Update Cart"
                      : `Add To Cart — ${formatPrice(price * quantity)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
