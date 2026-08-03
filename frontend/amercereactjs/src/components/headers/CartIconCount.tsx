import { useContextElement } from "@/context/Context";
import { cartTotalQty } from "@/utils/cartQty";

export default function CartIconCount({
  className = "count",
}: {
  className?: string;
}) {
  const { cartProducts } = useContextElement();
  const count = cartTotalQty(cartProducts);

  return <span className={className}> {count} </span>;
}
