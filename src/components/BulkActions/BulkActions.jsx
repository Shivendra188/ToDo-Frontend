import React from 'react';
import styles from './BulkActions.module.css';
import { useTodos } from '../../contexts/TodoContext';

export default function BulkActions({ selected = [], setSelected = () => {}, onShowToast = () => {} }) {
  const { bulkDelete, toggleComplete, restoreLastDeleted } = useTodos();

  const markComplete = () => {
    selected.forEach((id) => toggleComplete(id));
    setSelected([]);
    onShowToast({ message: 'Marked complete', type: 'success' });
  };

  const remove = () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} item(s)? This can be undone with Undo.`)) return;
    bulkDelete(selected);
    setSelected([]);
    onShowToast({ message: `${selected.length} deleted — Undo available`, type: 'info' });
  };

  return (
    <div className={styles.container} aria-hidden={selected.length === 0}>
      {selected.length > 0 ? (
        <div className="row">
          <div>{selected.length} selected</div>
          <button className="btn" onClick={markComplete}>Complete</button>
          <button className="btn ghost" onClick={remove}>Delete</button>
          <button className="btn ghost" onClick={() => setSelected([])}>Clear</button>
        </div>
      ) : (
        <div className={styles.placeholder}>Select todos to enable bulk actions</div>
      )}
      <div style={{ marginLeft: 'auto' }}>
        <button className="btn ghost" onClick={() => restoreLastDeleted()}>Undo last delete</button>
      </div>
    </div>
  );
}
