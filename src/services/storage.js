export const STORAGE_KEYS = {
  TODOS: 'todo_app_v1_todos',
  SETTINGS: 'todo_app_v1_settings'
};

export const loadTodos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Failed to load todos', e);
    return [];
  }
};

export const saveTodos = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos', e);
  }
};
