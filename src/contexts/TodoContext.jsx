import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { STORAGE_KEYS, loadTodos, saveTodos } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';
import { isOverdue } from '../utils/helpers';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null); // for undo

  // load from storage once
  useEffect(() => {
    const loaded = loadTodos();
    setTodos(loaded);
  }, []);

  // persist on change (debounced could be added)
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // core CRUD operations
  const addTodo = (data) => {
    const newTodo = {
      id: uuidv4(),
      title: data.title,
      description: data.description || '',
      createdAt: Date.now(),
      dueDate: data.dueDate || null,
      priority: data.priority || 'low',
      tags: data.tags || [],
      completed: false,
      subtasks: (data.subtasks || []).map((st) => ({ id: uuidv4(), title: st.title, completed: !!st.completed })),
    };
    setTodos((t) => [newTodo, ...t]);
    return newTodo;
  };

  const updateTodo = (id, patch) => {
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTodo = (id) => {
    setTodos((list) => {
      const item = list.find((x) => x.id === id);
      setLastDeleted({ items: [item], time: Date.now() });
      return list.filter((x) => x.id !== id);
    });
  };

  const bulkDelete = (ids) => {
    setTodos((list) => {
      const removed = list.filter((x) => ids.includes(x.id));
      setLastDeleted({ items: removed, time: Date.now() });
      return list.filter((x) => !ids.includes(x.id));
    });
  };

  const restoreLastDeleted = () => {
    if (!lastDeleted) return;
    setTodos((list) => [...lastDeleted.items, ...list]);
    setLastDeleted(null);
  };

  const toggleComplete = (id) => {
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const addSubtask = (todoId, title) => {
    const sub = { id: uuidv4(), title, completed: false };
    setTodos((list) => list.map((t) => (t.id === todoId ? { ...t, subtasks: [...t.subtasks, sub] } : t)));
  };

  const toggleSubtask = (todoId, subId) => {
    setTodos((list) =>
      list.map((t) =>
        t.id === todoId ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s)) } : t
      )
    );
  };

  // imports/exports
  const exportJSON = () => {
    return JSON.stringify({ todos, exportedAt: Date.now() }, null, 2);
  };

  const importJSON = (jsonString, { merge = false } = {}) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed.todos)) throw new Error('Invalid format');
      const imported = parsed.todos.map((t) => ({ ...t, id: t.id || uuidv4() }));
      setTodos((curr) => (merge ? [...imported, ...curr] : imported));
    } catch (e) {
      throw e;
    }
  };

  // derived values
  const overdues = useMemo(() => todos.filter((t) => !t.completed && isOverdue(t.dueDate)), [todos]);

  return (
    <TodoContext.Provider
      value={{
        todos,
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
        overdues,
        setTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
