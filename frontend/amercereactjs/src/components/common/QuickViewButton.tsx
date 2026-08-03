import { useContextElement, type Product } from "@/context/Context";
import { useModalStore } from "@/store/modalStore";

interface QuickViewButtonProps {
  product?: Product;
  className?: string;
}

export default function QuickViewButton({
  product,
  className,
}: QuickViewButtonProps) {
  const { setQuickViewItem } = useContextElement();
  const { openModal } = useModalStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product) {
      setQuickViewItem(product);
      openModal("quickView");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || "hover-tooltip tooltip-left box-icon"}
      style={{ border: "none", cursor: "pointer", background: "none" }}
    >
      <span className="icon icon-Eye" aria-hidden />
      <span className="tooltip">Quick view</span>
    </button>
  );
}
