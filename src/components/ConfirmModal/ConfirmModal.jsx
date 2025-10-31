import React from 'react';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
