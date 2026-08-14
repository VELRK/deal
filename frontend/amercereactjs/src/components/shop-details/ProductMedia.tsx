import DriftZoom from "@/components/ui/DriftZoom";
import ProductMediaThumbs from "@/components/ui/ProductMediaThumbs";
import type { ProductCardItem, ProductSingleImage } from "@/types/productCard";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ModelViewer from "@/components/ui/ModelViewer";

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

  const activeVariant = unitVariants.find((v) => v.id === currentVariantId) ?? unitVariants[0];
  const variantImg = activeVariant?.img;

  const images: ProductSingleImage[] = useMemo(
    () => {
      const primary =
        variantImg ||
        product.img ||
        extraImages[0]?.src ||
        "/frontend/assets/images/product/single/detail-1.jpg";
      const rest = extraImages.filter((img) => img.src && img.src !== primary);
      return [
        {
          src: primary,
          dataColor: extraImages[0]?.dataColor,
          dataSize: extraImages[0]?.dataSize,
        },
        ...rest,
      ];
    },
    [variantImg, product.img, extraImages],
  );

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
        (img) => img.dataColor === currentColor && img.dataSize === currentSize,
      );
      if (both !== -1) return both;

      const colorMatch = images.findIndex(
        (img) => img.dataColor === currentColor,
      );
      if (colorMatch !== -1) return colorMatch;

      const sizeMatch = images.findIndex((img) => img.dataSize === currentSize);
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

  return (
    <div className="col-md-6">
      <div className="tf-product-media-wrap sticky-top">
        <Gallery>
          <ProductMediaThumbs
            images={images}
            direction={
              thumbnailPosition === "bottom" ? "horizontal" : "vertical"
            }
            preview={7}
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
                  width={576}
                  height={768}
                >
                  {({ ref, open }) => (
                    <a
                      ref={ref as React.LegacyRef<HTMLAnchorElement>}
                      onClick={open}
                      className="item"
                      style={{ cursor: "pointer", display: "block", aspectRatio: "3/4", overflow: "hidden" }}
                    >
                      <DriftZoom
                        loading="lazy"
                        width={576}
                        height={768}
                        className="tf-image-zoom"
                        dataZoom={img.src}
                        src={img.src}
                        alt="img-product"
                        style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#fff" }}
                      />
                    </a>
                  )}
                </Item>
              );
            }}
            renderThumbSlide={(img: ProductSingleImage) => (
              <>
                {img.model3d && (
                  <div className="wrap-btn-viewer">
                    <i className="icon icon-btn3d"></i>
                  </div>
                )}
                <img
                  loading="lazy"
                  width={thumbnailPosition === "bottom" ? 82 : 72}
                  height={thumbnailPosition === "bottom" ? 110 : 96}
                  src={img.src}
                  alt="Image"
                  style={{
                    width: thumbnailPosition === "bottom" ? 82 : 72,
                    height: thumbnailPosition === "bottom" ? 110 : 96,
                    objectFit: "contain",
                    backgroundColor: "#fff",
                  }}
                />
                {img.video && <i className="icon icon-video"></i>}
              </>
            )}
          />
        </Gallery>
      </div>
    </div>
  );
}
