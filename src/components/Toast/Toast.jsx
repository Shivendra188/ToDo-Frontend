import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className={styles.snackbar} role="status" aria-live="polite">
      <div>{toast.message}</div>
      <div style={{ marginLeft: 12 }}>
        {toast.action ? <button className="btn" onClick={toast.action.onClick}>{toast.action.label}</button> : null}
        <button className="btn ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
