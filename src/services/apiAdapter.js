const API_URL = "/https://t-odo-backend-8351rcxxj-shivendra188s-projects.vercel.app/api/todos";

export const api = {
  // ✅ Fetch all todos
  async fetchTodos() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      return { status: 200, data };
    } catch (err) {
      console.error("❌ fetchTodos error:", err);
      return { status: 500, data: [] };
    }
  },

  // ✅ Create new todo
  async saveTodo(todo) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });
      const data = await res.json();
      return { status: res.ok ? 200 : res.status, data };
    } catch (err) {
      console.error("❌ saveTodo error:", err);
      return { status: 500, data: null };
    }
  },

  // ✅ Update todo
  async updateTodo(id, updates) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      return { status: res.ok ? 200 : res.status, data };
    } catch (err) {
      console.error("❌ updateTodo error:", err);
      return { status: 500, data: null };
    }
  },

  // ✅ Delete todo
  async deleteTodo(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      return { status: res.ok ? 200 : res.status };
    } catch (err) {
      console.error("❌ deleteTodo error:", err);
      return { status: 500 };
    }
  },
};
