import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  width = "400px"
}: DrawerProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      const timer = setTimeout(() => setShouldRender(false), 250); // match animation duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return createPortal(
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
        onClick={onClose}
      />
      <div 
        className={`${styles.drawer} ${isOpen ? styles.slideInRight : styles.slideOutRight}`}
        style={{ width, maxWidth: "100%" }}
      >
        {children}
      </div>
    </>,
    document.body
  );
}
