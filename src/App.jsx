import { useMemo, useState } from 'react';
// import styles from './App.module.css';
import Header from './components/Header/Header';
import TodoList from './components/TodoList/TodoList';
import TodoEditor from './components/TodoEditor/TodoEditor';
import Filters from './components/Filters/Filters';
import SearchBar from './components/SearchBar/SearchBar';
import Toast from './components/Toast/Toast';

import BulkActions from './components/BulkActions/BulkActions';
import { useTodos } from './contexts/TodoContext';
import { useSettings } from './contexts/SettingsContext';

export default function App() {
  const { todos } = useTodos();
  const { view } = useSettings();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selected, setSelected] = useState([]); // ids for bulk selection
  const [toast, setToast] = useState(null);

  // filtered & sorted list
  const visible = useMemo(() => {
    let list = [...todos];

    // filter
    if (filter === 'active') list = list.filter((t) => !t.completed);
    else if (filter === 'completed') list = list.filter((t) => t.completed);
    else if (filter === 'overdue') list = list.filter((t) => !t.completed && new Date(t.dueDate) < new Date());

    // search
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q) ||
          (t.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    }

    // sort
    if (sortBy === 'dueDate') list.sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));
    else if (sortBy === 'priority') {
      const weight = (p) => (p === 'high' ? 0 : p === 'med' ? 1 : 2);
      list.sort((a, b) => weight(a.priority) - weight(b.priority));
    } else if (sortBy === 'createdAt') list.sort((a, b) => b.createdAt - a.createdAt);

    return list;
  }, [todos, filter, query, sortBy]);

  return (
    <div className="container">
      <Header
        onAdd={() => {
          setEditingTodo(null);
          setEditorOpen(true);
        }}
      />
      <div style={{ marginTop: 16 }} className="row" aria-hidden="false">
        <SearchBar onSearch={setQuery} />
        <Filters value={filter} onChange={setFilter} sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <BulkActions
        selected={selected}
        setSelected={setSelected}
        onShowToast={setToast}
      />

      <main style={{ marginTop: 16 }}>
        <TodoList
          todos={visible}
          view={view}
          onEdit={(todo) => {
            setEditingTodo(todo);
            setEditorOpen(true);
          }}
          selected={selected}
          setSelected={setSelected}
        />
      </main>

      <TodoEditor
        open={editorOpen}
        todo={editingTodo}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          setToast({ message: 'Saved', type: 'success' });
        }}
      />

     

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
