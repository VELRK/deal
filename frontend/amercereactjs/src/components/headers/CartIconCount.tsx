import { useStore } from "@/context/store";

export default function CartIconCount({
  className = "count",
}: {
  className?: string;
}) {
  // Subscribe to length directly — avoid object snapshot equality missing updates.
  const count = useStore((s) => s.cartProducts.length);

  return <span className={className}> {count} </span>;
}
