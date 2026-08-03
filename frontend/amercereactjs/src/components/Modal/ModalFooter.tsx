import React from "react";
import styles from "./modal.module.css";

interface ModalFooterProps {
  children?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: "default" | "gold";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export default function ModalFooter({
  children,
  primaryAction,
  secondaryAction,
}: ModalFooterProps) {
  return (
    <div className={styles.footer}>
      {children ? (
        children
      ) : (
        <>
          {secondaryAction && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary} ${
                primaryAction.variant === "gold" ? styles.gold : ""
              }`}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled || primaryAction.loading}
            >
              {primaryAction.loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              {primaryAction.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}
