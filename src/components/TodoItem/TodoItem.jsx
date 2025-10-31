import React from 'react';
import styles from './TodoItem.module.css';
import { useTodos } from '../../contexts/TodoContext';
import { formatDate } from '../../utils/helpers';

export default function TodoItem({ todo, onEdit, view, selected, onToggleSelect }) {
  const { toggleComplete, toggleSubtask, deleteTodo } = useTodos();

  const completedCount = (todo.subtasks || []).filter((s) => s.completed).length;
  const subCount = (todo.subtasks || []).length;

  return (
    <article className={styles.card} aria-labelledby={`title-${todo.id}`}>
      <div className={styles.left}>
        <input
          aria-label={`Select todo ${todo.title}`}
          title="Select for bulk actions"
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className="row" style={{ gap: 12 }}>
            <button
              aria-pressed={todo.completed}
              onClick={() => toggleComplete(todo.id)}
              className="btn ghost"
              title="Toggle complete"
            >
              {todo.completed ? '✓' : '○'}
            </button>
            <div>
              <h3 id={`title-${todo.id}`} className={styles.title} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title}
              </h3>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{todo.tags && todo.tags.join(', ')}</div>
            </div>
          </div>

          <div style={{ marginLeft: 'auto' }} className="row">
            {todo.dueDate && <div className={styles.due}>Due {formatDate(todo.dueDate)}</div>}
            <div className={styles.priority}>{todo.priority}</div>
            <button className="btn" onClick={onEdit} aria-label={`Edit ${todo.title}`}>Edit</button>
            <button className="btn ghost" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`}>Delete</button>
          </div>
        </div>

        {view === 'expanded' && (
          <div className={styles.bottomRow}>
            <p className={styles.desc}>{todo.description}</p>
            {subCount > 0 && (
              <div className={styles.subtasks}>
                <strong>{completedCount}/{subCount}</strong> subtasks
                <ul>
                  {todo.subtasks.map((s) => (
                    <li key={s.id}>
                      <label>
                        <input type="checkbox" checked={s.completed} onChange={() => toggleSubtask(todo.id, s.id)} /> {s.title}
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
