import { useContextElement } from "@/context/Context";

export default function CartIconCount({
  className = "count",
}: {
  className?: string;
}) {
  const { cartProducts } = useContextElement();
  const count = cartProducts.length;

  return <span className={className}> {count} </span>;
}
