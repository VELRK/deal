import type { ProductCardItem } from "@/types/productCard";
import { useProduct } from "@/context/useProduct";

export function ProductShortDescription({ product }: { product?: ProductCardItem }) {
  const { extraImages, activeImageIndex, setActiveImageIndex } = useProduct();

  const raw = product?.short_desc?.trim() ?? "";
  const isHtml = raw.startsWith("<");
  const hasImages = extraImages.length > 0;

  if (!raw && !hasImages) return null;

  return (
    <div className="product-infor-desc mb-12">
      {/* Short description — render as HTML if it contains tags, plain text otherwise */}
      {raw && (
        isHtml
          ? <div className="cl-text-2 mb-10 product-html-content" dangerouslySetInnerHTML={{ __html: raw }} />
          : <p className="cl-text-2 mb-10">{raw}</p>
      )}

      {/* Switchable gallery thumbnail strip */}
      {hasImages && (
        <div className="product-desc-image-strip">
          <div className="strip-scroll">
            {extraImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`strip-thumb${activeImageIndex === idx ? " active" : ""}`}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                title={`Image ${idx + 1}`}
              >
                <img
                  src={img.src}
                  alt={`Product view ${idx + 1}`}
                  loading="lazy"
                  width={64}
                  height={80}
                />
              </button>
            ))}
          </div>
          <p className="strip-hint text-caption-01 cl-text-3 mt-6">
            {activeImageIndex + 1} / {extraImages.length} · Click to switch view
          </p>
        </div>
      )}
    </div>
  );
}
