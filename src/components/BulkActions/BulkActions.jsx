import React, { useState } from "react";
import styles from "./BulkActions.module.css";
import { useTodos } from "../../contexts/TodoContext";

export default function BulkActions({
  selected = [],
  setSelected = () => {},
  onShowToast = () => {},
}) {
  const {
    fetchTodos,
    restoreLastDeleted,
    bulkDelete,
    lastDeleted,
  } = useTodos();
  const [loading, setLoading] = useState(false);

  // ✅ Mark selected todos as complete
  const markComplete = async () => {
    if (!selected.length) return;
    setLoading(true);
    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`http://localhost:5000/api/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true }),
          })
        )
      );
      onShowToast({ message: "Marked complete ✅", type: "success" });
      await fetchTodos();
      setSelected([]);
    } catch (err) {
      console.error(err);
      onShowToast({ message: "Error updating todos ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete selected todos
  const handleDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} todos?`)) return;
    setLoading(true);
    try {
      await bulkDelete(selected);
      onShowToast({
        message: `${selected.length} deleted 🗑️ — Undo available for 5s`,
        type: "info",
      });
      setSelected([]);
      await fetchTodos();
    } catch (err) {
      onShowToast({ message: "Error deleting todos ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Undo last delete
  const handleUndo = async () => {
    if (!lastDeleted) {
      onShowToast({ message: "Nothing to undo", type: "warning" });
      return;
    }
    setLoading(true);
    try {
      await restoreLastDeleted();
      onShowToast({ message: "Undo successful ✅", type: "success" });
      await fetchTodos();
    } catch (err) {
      onShowToast({ message: "Undo failed ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {selected.length > 0 ? (
        <div className="row">
          <div>{selected.length} selected</div>
          <button className="btn" onClick={markComplete} disabled={loading}>
            Complete
          </button>
          <button className="btn ghost" onClick={handleDelete} disabled={loading}>
            Delete
          </button>
          <button className="btn ghost" onClick={() => setSelected([])}>
            Clear
          </button>
        </div>
      ) : (
        <div className={styles.placeholder}>
          Select todos to enable bulk actions
        </div>
      )}

      {/* ✅ Always show Undo button */}
      <div style={{ marginLeft: "auto" }}>
        <button
          className="btn ghost"
          onClick={handleUndo}
          disabled={loading || !lastDeleted}
        >
          Undo Last Delete
        </button>
      </div>
    </div>
  );
}
