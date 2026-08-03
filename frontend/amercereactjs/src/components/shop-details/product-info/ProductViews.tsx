import type { ProductCardItem } from "@/types/productCard";

export function ProductViews({ product }: { product?: ProductCardItem }) {
  const sold = product?.total_sold ?? 0;
  if (sold === 0) return null;

  return (
    <div className="product-infor-reality lh-24">
      <div className="ic d-flex">
        <i className="icon icon-Lightning text-primary" style={{ fontSize: 20 }} />
      </div>
      <span className="text-caption-01 cl-text-2">
        <strong>{sold}</strong> people have bought this saree
      </span>
    </div>
  );
}
