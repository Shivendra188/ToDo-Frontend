import React, { useState, useEffect } from "react";
import styles from "./TodoItem.module.css";
import { useTodos } from "../../contexts/TodoContext";
import { formatDate, isOverdue } from "../../utils/helpers";

export default function TodoItem({
  todo,
  onEdit,
  view,
  selected,
  onToggleSelect,
  onShowToast,
}) {
  const { toggleComplete, deleteTodo } = useTodos();

  // ✅ Track live overdue status
  const [isNowOverdue, setIsNowOverdue] = useState(isOverdue(todo.dueDate));

  // ✅ Watch due date and auto-mark overdue every minute
  useEffect(() => {
    if (!todo.dueDate || todo.completed) return;
    const interval = setInterval(() => {
      if (isOverdue(todo.dueDate)) setIsNowOverdue(true);
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, [todo.dueDate, todo.completed]);

  const completedCount = (todo.subtasks || []).filter((s) => s.completed).length;
  const subCount = (todo.subtasks || []).length;

  // ✅ Toggle complete (green bounce + toast)
  const handleToggleComplete = async () => {
    try {
      await toggleComplete(todo.id);
      onShowToast?.({
        message: todo.completed
          ? "Marked as active again 🔁"
          : "Marked complete ✅",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      onShowToast?.({ message: "Error updating todo", type: "error" });
    }
  };

  // ✅ Delete Todo (with smooth slide-out)
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${todo.title}"?`)) return;

    const element = document.getElementById(`todo-${todo.id}`);
    if (element) element.classList.add(styles.removedCard);

    setTimeout(async () => {
      try {
        await deleteTodo(todo.id);
        onShowToast?.({ message: "Todo deleted 🗑️", type: "info" });
      } catch (err) {
        console.error(err);
        onShowToast?.({ message: "Error deleting todo", type: "error" });
      }
    }, 300);
  };

  return (
    <article
  id={`todo-${todo.id}`}
  className={`${styles.card} 
    ${todo.completed ? styles.completedCard : ""} 
    ${isNowOverdue && !todo.completed ? styles.overdueCard : ""} 
    ${todo.isRestored ? styles.restoredCard : ""}`}
  aria-labelledby={`title-${todo.id}`}
>
<div
  className={`${styles.due} ${
    isNowOverdue && !todo.completed ? styles.overdue : ""
  }`}
>
  Due {formatDate(todo.dueDate)}
</div>

      {/* ✅ Left: selection checkbox */}
      <div className={styles.left}>
        <input
          aria-label={`Select todo ${todo.title}`}
          title="Select for bulk actions"
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
        />
      </div>

      {/* ✅ Main content */}
      <div className={styles.content}>
        <div className={styles.topRow}>
          {/* ✅ Toggle complete button */}
          <div className="row" style={{ gap: 12 }}>
            <button
              aria-pressed={todo.completed}
              onClick={handleToggleComplete}
              className={`${styles.completeBtn} ${
                todo.completed ? styles.completedAnim : ""
              }`}
              title="Toggle complete"
            >
              {todo.completed ? "✓" : "○"}
            </button>

            <div>
              <h3
                id={`title-${todo.id}`}
                className={`${styles.title} ${
                  todo.completed ? styles.completed : ""
                }`}
              >
                {todo.title}
              </h3>

              {todo.tags && (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {Array.isArray(todo.tags)
                    ? todo.tags.join(", ")
                    : todo.tags.replace(/[\[\]"]/g, "")}
                </div>
              )}
            </div>
          </div>

          {/* ✅ Due date + priority + actions */}
          <div style={{ marginLeft: "auto" }} className="row">
            {todo.dueDate && (
              <div
                className={`${styles.due} ${
                  isNowOverdue && !todo.completed ? styles.overdue : ""
                }`}
              >
                Due {formatDate(todo.dueDate)}
              </div>
            )}

            <div
              className={`${styles.priority} ${
                styles[todo.priority?.toLowerCase()]
              }`}
            >
              {todo.priority}
            </div>

            <button className="btn" onClick={onEdit}>
              Edit
            </button>
            <button className="btn ghost" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        {/* ✅ Expanded view */}
        {view === "expanded" && (
          <div className={styles.bottomRow}>
            {todo.description && (
              <p className={styles.desc}>{todo.description}</p>
            )}

            {subCount > 0 && (
              <div className={styles.subtasks}>
                <strong>
                  {completedCount}/{subCount}
                </strong>{" "}
                subtasks
                <ul>
                  {todo.subtasks.map((s) => (
                    <li key={s.id}>
                      <label>
                        <input type="checkbox" checked={s.completed} readOnly />{" "}
                        {s.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
