import type { ProductCardItem } from "@/types/productCard";
import React from "react";

type IntroProps = {
  gridClassName?: string;
  titleTag?: "h5" | "div";
  product?: ProductCardItem;
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
    <span className="fw-medium text-dark">{label}</span>
    <span className="cl-text-2 text-end">{value}</span>
  </div>
);

export function ProductDescriptionIntro({
  gridClassName = "tab-content_desc tf-grid-layout md-col-2",
  titleTag = "h5",
  product,
}: IntroProps) {
  const Title = ({ children }: { children: React.ReactNode }) =>
    titleTag === "h5"
      ? <h5 className="desc_title mb-4 pb-2 text-uppercase fs-6 fw-bold">{children}</h5>
      : <div className="h6 desc_title mb-4 pb-2 text-uppercase fs-6 fw-bold">{children}</div>;

  const hasDetails = product && (
    product.fabric || product.occasion || product.color ||
    product.saree_type || product.pattern || product.fit_type ||
    product.neck_type || product.sleeve_length || product.length_type ||
    product.suitable_for || product.pack_of
  );

  const hasComposition = product && (
    product.fabric || product.wash_care || product.origin_state ||
    product.manufacturer_name || product.weave_type || product.ean
  );

  if (!product || (!product.description && !hasDetails && !hasComposition)) {
    return (
      <div className={gridClassName}>
        <div className="box-desc">
          <Title>Product Description</Title>
          <div className="desc_info">
            <p className="cl-text-2">No description available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={gridClassName} style={{ gap: '3rem' }}>
      {/* Column 1: Description + Features */}
      <div className="box-desc">
        <Title>Overview</Title>
        <div className="desc_info">
          {product.description && (
            <div
              className="cl-text-2 mb-4 product-html-content"
              style={{ lineHeight: '1.8', fontSize: '15px' }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          
          {product.features && product.features.length > 0 && (
            <div className="mt-4 pt-2">
              <h6 className="mb-3 fw-bold text-dark">Key Features</h6>
              <ul className="list-unstyled">
                {product.features.map((f, i) => (
                  <li key={i} className="cl-text-2 mb-2 d-flex align-items-start" style={{ lineHeight: '1.6' }}>
                    <span className="me-2 text-dark opacity-50">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasDetails && (
            <div className="mt-5">
              <h6 className="mb-3 fw-bold text-dark">Product Details</h6>
              <div className="d-flex flex-column border-top">
                {product.saree_type && <DetailRow label="Type" value={product.saree_type} />}
                {product.fabric     && <DetailRow label="Fabric" value={product.fabric} />}
                {product.pattern    && <DetailRow label="Pattern" value={product.pattern} />}
                {product.fit_type   && <DetailRow label="Fit" value={product.fit_type} />}
                {product.neck_type  && <DetailRow label="Neck" value={product.neck_type} />}
                {product.sleeve_length && <DetailRow label="Sleeve" value={product.sleeve_length} />}
                {product.length_type   && <DetailRow label="Length" value={product.length_type} />}
                {product.occasion      && <DetailRow label="Occasion" value={product.occasion} />}
                {product.suitable_for  && <DetailRow label="Ideal For" value={product.suitable_for} />}
                {product.color         && <DetailRow label="Colour" value={`${product.color}${product.color2 ? ` / ${product.color2}` : ""}`} />}
                {product.pack_of && product.pack_of > 1 && <DetailRow label="Pack of" value={product.pack_of} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Column 2: Composition, Origin & Care + Specs */}
      <div className="d-flex flex-column" style={{ gap: '3rem' }}>
        {hasComposition && (
          <div className="box-desc">
            <Title>Composition &amp; Care</Title>
            <div className="d-flex flex-column border-top">
              {product.fabric            && <DetailRow label="Fabric" value={product.fabric} />}
              {product.weave_type        && <DetailRow label="Weave" value={product.weave_type} />}
              {product.wash_care         && <DetailRow label="Care" value={product.wash_care} />}
              {product.origin_state      && <DetailRow label="Origin" value={`${product.origin_state}, India`} />}
              {product.manufacturer_name && <DetailRow label="Manufacturer" value={product.manufacturer_name} />}
              {product.ean               && <DetailRow label="EAN" value={product.ean} />}
              {product.hsn_code          && <DetailRow label="HSN" value={product.hsn_code} />}
              {product.tax_code          && <DetailRow label="Tax" value={product.tax_code} />}
            </div>
          </div>
        )}

        {/* Category attributes */}
        {product.category_attributes && Object.keys(product.category_attributes).length > 0 && (
          <div className="box-desc">
            <Title>Specifications</Title>
            <div className="d-flex flex-column border-top">
              {Object.entries(product.category_attributes).map(([k, v]) => (
                <DetailRow key={k} label={k} value={String(v)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
