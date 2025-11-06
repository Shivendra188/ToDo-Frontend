import { useMemo, useState } from "react";
import Header from "./components/Header/Header";
import TodoList from "./components/TodoList/TodoList";
import TodoEditor from "./components/TodoEditor/TodoEditor";
import Filters from "./components/Filters/Filters";
import SearchBar from "./components/SearchBar/SearchBar";
import Toast from "./components/Toast/Toast";
import BulkActions from "./components/BulkActions/BulkActions";
import { useTodos } from "./contexts/TodoContext";
import { useSettings } from "./contexts/SettingsContext";

export default function App() {
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    overdues,
    restoreLastDeleted,
    lastDeleted,
  } = useTodos();

  const { view } = useSettings();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (data) => {
    setToast(data);
    setTimeout(() => setToast(null), 4000);
  };
if (filter === "overdue") {
  list = todos.filter((t) => !t.completed && isOverdue(t.dueDate));
  list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

  // ✅ Filtering + Sorting + Move completed to bottom
  const visible = useMemo(() => {
    let list = [...todos];

    // 1️⃣ Filter
    if (filter === "active") list = list.filter((t) => !t.completed);
    else if (filter === "completed") list = list.filter((t) => t.completed);
    else if (filter === "overdue")
      list = list.filter((t) => overdues.some((o) => o.id === t.id));

    // 2️⃣ Search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // 3️⃣ Sort by field
    if (sortBy === "dueDate") {
      list.sort(
        (a, b) =>
          new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity)
      );
    } else if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "createdAt") {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    // 4️⃣ Always move completed todos to bottom (unless viewing completed filter)
    if (filter !== "completed") {
      list.sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return list;
  }, [todos, filter, query, sortBy, overdues]);

  return (
    <div className="container">
      <Header onAdd={() => setEditorOpen(true)} />

      <div style={{ marginTop: 16 }} className="row">
        <SearchBar onSearch={setQuery} />
        <Filters
          value={filter}
          onChange={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <BulkActions
        selected={selected}
        setSelected={setSelected}
        onShowToast={showToast}
      />

      {lastDeleted && (
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button className="btn ghost" onClick={restoreLastDeleted}>
            🔄 Undo Last Delete
          </button>
        </div>
      )}

      <main style={{ marginTop: 16 }}>
        {visible.length > 0 ? (
          <TodoList
            todos={visible}
            view={view}
            onEdit={(todo) => {
              setEditingTodo(todo);
              setEditorOpen(true);
            }}
            selected={selected}
            setSelected={setSelected}
            onToggle={updateTodo}
            onDelete={deleteTodo}
          />
        ) : (
          <p style={{ textAlign: "center", color: "var(--muted)" }}>
            No todos to display
          </p>
        )}
      </main>

      <TodoEditor
        open={editorOpen}
        todo={editingTodo}
        onClose={() => setEditorOpen(false)}
        onSaved={() => showToast({ message: "Saved ✅", type: "success" })}
        onAdd={addTodo}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
