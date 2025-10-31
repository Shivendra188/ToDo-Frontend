import React from 'react';
import styles from './TodoList.module.css';
import TodoItem from '../TodoItem/TodoItem';
import EmptySVG from '../../assets/empty-illustration.svg'; // ensure present

export default function TodoList({ todos, view = 'expanded', onEdit, selected = [], setSelected }) {
  if (!todos || todos.length === 0) {
    return (
      <div className={styles.empty}>
        <img src={EmptySVG} alt="" aria-hidden="true" />
        <div>
          <h3>No todos yet</h3>
          <p className="muted">Add your first todo using the + Add button.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className={styles.list} role="list">
      {todos.map((t) => (
        <li key={t.id}>
          <TodoItem
            todo={t}
            view={view}
            onEdit={() => onEdit(t)}
            selected={selected.includes(t.id)}
            onToggleSelect={() =>
              setSelected((prev) => (prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id]))
            }
          />
        </li>
      ))}
    </ul>
  );
}
