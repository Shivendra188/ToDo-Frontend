import React from 'react';
import styles from './Filters.module.css';

export default function Filters({ value, onChange, sortBy, setSortBy }) {
  return (
    <div className={styles.filters} role="toolbar" aria-label="Filters and sort">
      <div className={styles.group} role="tablist">
        <button className="btn ghost" onClick={() => onChange('all')} aria-pressed={value === 'all'}>All</button>
        <button className="btn ghost" onClick={() => onChange('active')} aria-pressed={value === 'active'}>Active</button>
        <button className="btn ghost" onClick={() => onChange('completed')} aria-pressed={value === 'completed'}>Completed</button>
        <button className="btn ghost" onClick={() => onChange('overdue')} aria-pressed={value === 'overdue'}>Overdue</button>
      </div>

      <select
        aria-label="Sort todos"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className={styles.select}
      >
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
        <option value="createdAt">Created</option>
      </select>
    </div>
  );
}
