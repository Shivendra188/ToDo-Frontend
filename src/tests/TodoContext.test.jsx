import React from "react";
import { renderHook, act } from "@testing-library/react";
import { TodoProvider, useTodos } from "../contexts/TodoContext";

// ✅ Mock fetch globally before tests run
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, title: "Sample Todo", completed: false, description: "" },
      ]),
  })
);

function wrapper({ children }) {
  return <TodoProvider>{children}</TodoProvider>;
}

describe("TodoContext", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("adds, toggles and deletes a todo", async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    // wait for initial fetch
    await act(async () => {
      await Promise.resolve();
    });

    // ✅ Add todo
    await act(async () => {
      await result.current.addTodo({
        title: "Test Todo",
        description: "desc",
      });
    });

    expect(result.current.todos.length).toBeGreaterThan(0);
    const addedTodo = result.current.todos[0];

    // ✅ Toggle complete
    await act(async () => {
      await result.current.toggleComplete(addedTodo.id);
    });

    expect(
      result.current.todos.find((t) => t.id === addedTodo.id).completed
    ).toBe(true);

    // ✅ Delete
    await act(async () => {
      await result.current.deleteTodo(addedTodo.id);
    });

    expect(
      result.current.todos.find((t) => t.id === addedTodo.id)
    ).toBeUndefined();
  });
});
