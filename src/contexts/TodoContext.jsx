import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { isOverdue } from "../utils/helpers";
import { STORAGE_KEYS, loadTodos, saveTodos } from "../services/storage";

const TodoContext = createContext();
export const useTodos = () => useContext(TodoContext);

const API_URL = "http://localhost:5000/api/todos";

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [undoTimer, setUndoTimer] = useState(null);

  // ✅ Fetch todos from backend (fallback: localStorage)
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      if (Array.isArray(data)) setTodos(data);
      else throw new Error("Invalid data format");
    } catch (err) {
      console.warn("⚠️ Backend not reachable, using local storage:", err.message);
      setTodos(loadTodos());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Backup to localStorage
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // ✅ Add todo
  const addTodo = async (data) => {
    const newTodo = {
      title: data.title.trim(),
      description: data.description || "",
      dueDate: data.dueDate || null,
      priority: data.priority || "low",
      tags: data.tags || [],
      completed: false,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      await fetchTodos();
    } catch (err) {
      console.error("❌ Backend error, saving locally:", err.message);
      const localTodo = { id: uuidv4(), ...newTodo, createdAt: Date.now() };
      setTodos((prev) => [localTodo, ...prev]);
    }
  };

  // ✅ Update todo (edit / mark complete)
  const updateTodo = async (id, patch) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchTodos();
    } catch (err) {
      console.warn("⚠️ Update failed (offline), patching locally:", err.message);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    }
  };

  // ✅ Delete todo (with Undo)
  const deleteTodo = async (id) => {
    const item = todos.find((t) => t.id === id);
    if (!item) return;

    // Always store deleted items for Undo
    setLastDeleted({ items: [item], time: Date.now() });

    // Clear previous undo timer
    if (undoTimer) clearTimeout(undoTimer);
    setUndoTimer(setTimeout(() => setLastDeleted(null), 5000));

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchTodos();
    } catch (err) {
      console.warn("⚠️ Delete failed, removing locally:", err.message);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // ✅ Bulk delete
  const bulkDelete = async (ids) => {
    const deletedItems = todos.filter((t) => ids.includes(t.id));
    setLastDeleted({ items: deletedItems, time: Date.now() });

    if (undoTimer) clearTimeout(undoTimer);
    setUndoTimer(setTimeout(() => setLastDeleted(null), 5000));

    for (const id of ids) await deleteTodo(id);
  };

  // ✅ Undo last delete (restore local + backend)
  const restoreLastDeleted = async () => {
    if (!lastDeleted?.items?.length) return;
    try {
      for (const todo of lastDeleted.items) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(todo),
        });
      }
      await fetchTodos();
    } catch (err) {
      console.error("❌ Restore failed:", err.message);
      // fallback local restore
      setTodos((prev) => [...lastDeleted.items, ...prev]);
    } finally {
      setLastDeleted(null);
      if (undoTimer) clearTimeout(undoTimer);
    }
  };

  // ✅ Toggle complete
  const toggleComplete = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    updateTodo(id, { completed: !todo.completed });
  };

  // ✅ Subtasks (local only)
  const addSubtask = (todoId, title) => {
    const sub = { id: uuidv4(), title, completed: false };
    setTodos((list) =>
      list.map((t) =>
        t.id === todoId
          ? { ...t, subtasks: [...(t.subtasks || []), sub] }
          : t
      )
    );
  };

  const toggleSubtask = (todoId, subId) => {
    setTodos((list) =>
      list.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      )
    );
  };

  // ✅ Export / Import JSON
  const exportJSON = () =>
    JSON.stringify({ todos, exportedAt: Date.now() }, null, 2);

  const importJSON = (jsonString, { merge = false } = {}) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed.todos)) throw new Error("Invalid format");
      const imported = parsed.todos.map((t) => ({
        ...t,
        id: t.id || uuidv4(),
      }));
      setTodos((curr) => (merge ? [...imported, ...curr] : imported));
    } catch (e) {
      console.error(e);
    }
  };

  // ✅ Derived filtered lists
  const activeTodos = useMemo(() => todos.filter((t) => !t.completed), [todos]);
  const completedTodos = useMemo(
    () => todos.filter((t) => t.completed),
    [todos]
  );
  const overdueTodos = useMemo(
    () => todos.filter((t) => !t.completed && isOverdue(t.dueDate)),
    [todos]
  );

  return (
    <TodoContext.Provider
      value={{
        todos,
        activeTodos,
        completedTodos,
        overdueTodos,
        loading,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        bulkDelete,
        restoreLastDeleted,
        lastDeleted,
        toggleComplete,
        addSubtask,
        toggleSubtask,
        exportJSON,
        importJSON,
        setTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
