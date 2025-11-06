import React from "react";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm = () => {},
  onCancel = () => {},
}) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            className="btn ghost"
            onClick={onCancel}
            aria-label="Cancel action"
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={onConfirm}
            aria-label="Confirm action"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
