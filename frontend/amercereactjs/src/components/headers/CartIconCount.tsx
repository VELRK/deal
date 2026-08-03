import { useStore } from "@/context/store";

export default function CartIconCount({
  className = "count",
}: {
  className?: string;
}) {
  const count = useStore((s) => s.cartProducts.length);

  if (count <= 0) return null;

  return (
    <span className={className} data-cart-count={count}>
      {count}
    </span>
  );
}
