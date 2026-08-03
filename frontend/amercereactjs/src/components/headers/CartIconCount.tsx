import { useStore } from "@/context/store";

export default function CartIconCount({
  className = "count",
}: {
  className?: string;
}) {
  const cartProducts = useStore((s) => s.cartProducts);
  const count = cartProducts.length;

  if (count <= 0) return null;

  return <span className={className}>{count}</span>;
}
