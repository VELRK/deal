import React from "react";
import styles from "./modal.module.css";

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  icon,
}: ModalHeaderProps) {
  return (
    <div className={styles.header}>
      <div className="d-flex align-items-center gap-3">
        {icon && (
          <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#F1F5F9', color: 'var(--modal-primary)' }}>
            {icon}
          </div>
        )}
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
