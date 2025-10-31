import React, { useEffect, useState } from 'react';
import styles from './TodoEditor.module.css';
import { useTodos } from '../../contexts/TodoContext';

export default function TodoEditor({ open, todo, onClose, onSaved }) {
  const { addTodo, updateTodo } = useTodos();
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
    tags: '',
    subtasks: []
  });

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        dueDate: todo.dueDate || '',
        priority: todo.priority || 'low',
        tags: (todo.tags || []).join(', '),
        subtasks: (todo.subtasks || []).map((s) => ({ ...s }))
      });
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        priority: 'low',
        tags: '',
        subtasks: []
      });
    }
  }, [todo, open]);

  if (!open) return null;

  const save = () => {
    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description,
      dueDate: form.dueDate || null,
      priority: form.priority,
      tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      subtasks: form.subtasks.map((s) => ({ title: s.title, completed: !!s.completed }))
    };

    if (todo) {
      updateTodo(todo.id, payload);
    } else {
      addTodo(payload);
    }

    onSaved && onSaved();
  };

  const addSubtask = () => {
    setForm((f) => ({ ...f, subtasks: [...f.subtasks, { id: Date.now(), title: '', completed: false }] }));
  };

  const updateSubtask = (idx, patch) => {
    setForm((f) => {
      const copy = [...f.subtasks];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...f, subtasks: copy };
    });
  };

  const removeSubtask = (idx) => {
    setForm((f) => ({ ...f, subtasks: f.subtasks.filter((_, i) => i !== idx) }));
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={todo ? 'Edit todo' : 'Create todo'}>
      <div className={styles.modal}>
        <h2>{todo ? 'Edit Todo' : 'Add Todo'}</h2>
        <label>
          Title *
          <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
        </label>

        <label>
          Description
          <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
        </label>

        <div className={styles.row}>
          <label>
            Due date
            <input type="date" value={form.dueDate || ''} onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))} />
          </label>

          <label>
            Priority
            <select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <label>
          Tags (comma separated)
          <input value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
        </label>

        <div className={styles.subtasks}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>Subtasks</strong>
            <button className="btn" onClick={addSubtask}>Add</button>
          </div>
          {form.subtasks.map((s, idx) => (
            <div key={s.id} className={styles.subtaskRow}>
              <input value={s.title} onChange={(e) => updateSubtask(idx, { title: e.target.value })} placeholder="Subtask title" />
              <label>
                <input type="checkbox" checked={!!s.completed} onChange={(e) => updateSubtask(idx, { completed: e.target.checked })} /> Done
              </label>
              <button className="btn ghost" onClick={() => removeSubtask(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save}>{todo ? 'Save' : 'Create'}</button>
        </div>
      </div>
    </div>
  );
}
