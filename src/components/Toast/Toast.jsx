import React, { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`${styles.toast} ${styles[toast.type || "info"]}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.message}>{toast.message}</div>
      <div className={styles.actions}>
        {toast.action && (
          <button className="btn ghost" onClick={toast.action.onClick}>
            {toast.action.label}
          </button>
        )}
        <button className="btn ghost" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
