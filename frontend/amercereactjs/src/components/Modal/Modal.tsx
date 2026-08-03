import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = "500px",
  closeOnOverlayClick = true,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle mount and unmount with animation delay
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else if (isMounted) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
        document.body.style.overflow = "";
      }, 250); // Matches var(--modal-transition)
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  // Handle ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle Overlay Click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modal}
        style={{ maxWidth }}
        ref={modalRef}
        // Basic focus trap can be added here if needed
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
