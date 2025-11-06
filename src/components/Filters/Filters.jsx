import React from "react";
import styles from "./Filters.module.css";
import { useTodos } from "../../contexts/TodoContext";

export default function Filters({ value, onChange, sortBy, setSortBy }) {
  const { overdues } = useTodos();

  // ✅ Safe fallback — prevent undefined crash
  const overdueCount = Array.isArray(overdues) ? overdues.length : 0;

  return (
    <div className={styles.filters} role="toolbar" aria-label="Filters and sort">
      {/* ✅ Filter buttons */}
      <div className={styles.group} role="tablist">
        <button
          className={`btn ghost ${value === "all" ? styles.active : ""}`}
          onClick={() => onChange("all")}
          aria-pressed={value === "all"}
        >
          All
        </button>

        <button
          className={`btn ghost ${value === "active" ? styles.active : ""}`}
          onClick={() => onChange("active")}
          aria-pressed={value === "active"}
        >
          Active
        </button>

        <button
          className={`btn ghost ${value === "completed" ? styles.active : ""}`}
          onClick={() => onChange("completed")}
          aria-pressed={value === "completed"}
        >
          Completed
        </button>

        {/* ✅ Overdue Button (with count & pulse) */}
        <button
          className={`btn ghost 
            ${value === "overdue" ? styles.active : ""} 
            ${overdueCount > 0 ? styles.overduePulse : ""}`}
          onClick={() => onChange("overdue")}
          aria-pressed={value === "overdue"}
          title="Show overdue tasks"
        >
          ⏰ Overdue
          {overdueCount > 0 && (
            <span className={styles.overdueCount}>{overdueCount}</span>
          )}
        </button>
      </div>

      {/* ✅ Sorting dropdown */}
      <div className={styles.sortSection}>
        <label htmlFor="sortBy" className={styles.sortLabel}>
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.select}
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  );
}
