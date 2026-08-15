import DriftZoom from "@/components/ui/DriftZoom";
import ProductMediaThumbs from "@/components/ui/ProductMediaThumbs";
import type { ProductCardItem, ProductSingleImage } from "@/types/productCard";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ModelViewer from "@/components/ui/ModelViewer";
import WishlistButton from "@/components/common/WishlistButton";
import { useProduct } from "@/context/useProduct";
import { Swiper as SwiperType } from "swiper";
import { useEffect, useState, useMemo } from "react";

export default function ProductMedia({
  product,
}: {
  product: ProductCardItem;
}) {
  const {
    currentColor,
    currentSize,
    setCurrentColor,
    setCurrentSize,
    extraImages,
    thumbnailPosition,
    activeImageIndex,
    setActiveImageIndex,
    currentVariantId,
    unitVariants,
  } = useProduct();

  const [copied, setCopied] = useState(false);

  const activeVariant = unitVariants.find((v) => v.id === currentVariantId) ?? unitVariants[0];
  const variantImg = activeVariant?.img;

  const images: ProductSingleImage[] = useMemo(() => {
    const primary =
      variantImg ||
      product.img ||
      extraImages[0]?.src ||
      "/frontend/assets/images/product/single/detail-1.jpg";

    const seen = new Set<string>([primary]);
    const result: ProductSingleImage[] = [
      {
        src: primary,
        dataColor: extraImages[0]?.dataColor,
        dataSize: extraImages[0]?.dataSize,
      },
    ];

    extraImages.forEach((img) => {
      if (img.src && !seen.has(img.src)) {
        seen.add(img.src);
        result.push(img);
      }
    });

    return result;
  }, [variantImg, product.img, extraImages]);

  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // Reset gallery to first slide when pack size changes
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    swiper.slideTo(0);
    setActiveImageIndex(0);
  }, [currentVariantId, swiper, setActiveImageIndex]);

  // Sync Gallery with Variant Selection
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    // Prioritized search: 1. Both match, 2. Color match, 3. Size match
    const findIndex = () => {
      const both = images.findIndex(
        (img) =>
          img.dataColor?.toLowerCase() === currentColor?.toLowerCase() &&
          img.dataSize?.toLowerCase() === currentSize?.toLowerCase(),
      );
      if (both !== -1) return both;

      const colorMatch = images.findIndex(
        (img) => img.dataColor?.toLowerCase() === currentColor?.toLowerCase(),
      );
      if (colorMatch !== -1) return colorMatch;

      const sizeMatch = images.findIndex(
        (img) => img.dataSize?.toLowerCase() === currentSize?.toLowerCase(),
      );
      return sizeMatch !== -1 ? sizeMatch : -1;
    };

    const targetIndex = findIndex();
    if (targetIndex !== -1 && targetIndex !== swiper.activeIndex) {
      swiper.slideTo(targetIndex);
    }
  }, [currentColor, currentSize, swiper, images]);

  // Sync gallery when activeImageIndex changes from description panel
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (activeImageIndex !== swiper.activeIndex) {
      swiper.slideTo(activeImageIndex);
    }
  }, [activeImageIndex, swiper]);

  // Handle Manual Gallery Swipe -> Updates Variants + shared index
  const handleSlideChange = (index: number) => {
    setActiveImageIndex(index);
    const activeImg = images[index];
    if (!activeImg) return;
    if (activeImg.dataColor) setCurrentColor(activeImg.dataColor);
    if (activeImg.dataSize) setCurrentSize(activeImg.dataSize);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };



  return (
    <div className="col-md-6">
      <div className="tf-product-media-wrap sticky-top classic-media-wrapper position-relative">


        {/* Floating Top Actions: Wishlist & Share */}
        <div
          className="position-absolute d-flex flex-column gap-2"
          style={{ top: "16px", right: "16px", zIndex: 10 }}
        >
          <div
            className="shadow-sm rounded-circle bg-white d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px", border: "1px solid #eee" }}
          >
            <WishlistButton
              product={product as any}
              style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
            />
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="shadow-sm rounded-circle bg-white d-flex align-items-center justify-content-center border-0"
            style={{ width: "42px", height: "42px", border: "1px solid #eee", cursor: "pointer", transition: "transform 0.2s" }}
            title="Share Product"
          >
            <i className="icon icon-ShareNetwork" style={{ fontSize: "18px", color: "#1a1a1a" }} />
          </button>
        </div>

        {copied && (
          <div
            className="position-absolute start-50 translate-middle-x bg-dark text-white px-3 py-2 rounded shadow text-center"
            style={{ top: "70px", zIndex: 20, fontSize: "12px", letterSpacing: "0.5px" }}
          >
            ✓ Link copied to clipboard!
          </div>
        )}

        <Gallery>
          <ProductMediaThumbs
            images={images}
            direction={thumbnailPosition === "bottom" ? "horizontal" : "vertical"}
            preview={6}
            wrapperClassName={
              thumbnailPosition === "bottom"
                ? "product-thumbs-slider"
                : thumbnailPosition === "right"
                  ? "product-thumbs-slider style-row"
                  : undefined
            }
            onMainSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            renderMainSlide={(img: ProductSingleImage) => {
              if (img.model3d) {
                return <ModelViewer src={img.model3d} />;
              }
              return img.video ? (
                <div className="video-product">
                  <video
                    playsInline
                    autoPlay
                    preload="metadata"
                    muted
                    controls
                    loop
                    src={img.video}
                  ></video>
                </div>
              ) : (
                <Item
                  original={img.src}
                  thumbnail={img.src}
                  width={1000}
                  height={1250}
                >
                  {({ ref, open }) => (
                    <a
                      ref={ref as React.LegacyRef<HTMLAnchorElement>}
                      onClick={open}
                      className="item position-relative"
                      style={{
                        cursor: "zoom-in",
                        display: "block",
                        aspectRatio: "1/1",
                        overflow: "hidden",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #f0ece6",
                      }}
                    >
                      <DriftZoom
                        loading="lazy"
                        width={600}
                        height={800}
                        className="tf-image-zoom"
                        dataZoom={img.src}
                        src={img.src}
                        alt={product.name || "Product Image"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          backgroundColor: "#ffffff",
                        }}
                      />
                    </a>
                  )}
                </Item>
              );
            }}
            renderThumbSlide={(img: ProductSingleImage) => (
              <div
                style={{
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid #e8e3dc",
                  backgroundColor: "#ffffff",
                }}
              >
                {img.model3d && (
                  <div className="wrap-btn-viewer">
                    <i className="icon icon-btn3d"></i>
                  </div>
                )}
                <img
                  loading="lazy"
                  width={thumbnailPosition === "bottom" ? 90 : 80}
                  height={thumbnailPosition === "bottom" ? 90 : 80}
                  src={img.src}
                  alt="Thumb"
                  style={{
                    width: thumbnailPosition === "bottom" ? 90 : 80,
                    height: thumbnailPosition === "bottom" ? 90 : 80,
                    objectFit: "cover",
                    backgroundColor: "#ffffff",
                    display: "block",
                  }}
                />
                {img.video && <i className="icon icon-video"></i>}
              </div>
            )}
          />
        </Gallery>
      </div>
    </div>
  );
}
