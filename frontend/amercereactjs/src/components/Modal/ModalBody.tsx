import React from "react";
import styles from "./modal.module.css";

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ModalBody({ children, className = "", style }: ModalBodyProps) {
  return (
    <div className={`${styles.body} ${className}`} style={style}>
      {children}
    </div>
  );
}
