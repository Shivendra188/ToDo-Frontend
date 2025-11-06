import React from "react";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.css";

export default function TodoList({
  todos,
  view,
  onEdit,
  selected,
  setSelected,
  onToggle,
  onDelete,
  onShowToast,
}) {
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.listWrapper}>
      {todos.map((todo) => (
        <div key={todo.id} className={styles.todoTransition}>
          <TodoItem
            todo={todo}
            view={view}
            onEdit={() => onEdit(todo)}
            selected={selected.includes(todo.id)}
            onToggleSelect={() => toggleSelect(todo.id)}
            onShowToast={onShowToast}
          />
        </div>
      ))}
    </div>
  );
}
