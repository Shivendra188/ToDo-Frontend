// Simple adapter that mimics async server calls. Replace implementations with fetch/Axios to a real API.
const simulateDelay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async fetchTodos() {
    await simulateDelay(300);
    // return [] // when server exists, call fetch
    return { status: 200, data: [] };
  },

  async saveTodo(todo) {
    await simulateDelay(200);
    return { status: 200, data: todo };
  },

  async deleteTodo(id) {
    await simulateDelay(150);
    return { status: 200 };
  }
};
