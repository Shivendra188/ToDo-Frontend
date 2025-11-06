import React from "react";
import { render, screen } from "@testing-library/react";
import TodoList from "../components/TodoList/TodoList";
import { TodoProvider } from "../contexts/TodoContext"; // ✅ wrap to provide context

const sampleTodos = [
  {
    id: "1",
    title: "A",
    description: "",
    createdAt: Date.now(),
    priority: "low",
    tags: [],
    subtasks: [],
    completed: false,
  },
  {
    id: "2",
    title: "B",
    description: "",
    createdAt: Date.now(),
    priority: "high",
    tags: [],
    subtasks: [],
    completed: true,
  },
];

test("renders todo items correctly", () => {
  render(
    <TodoProvider>
      <TodoList
        todos={sampleTodos}
        onEdit={() => {}}
        selected={[]}
        setSelected={() => {}}
        view="expanded"
      />
    </TodoProvider>
  );

  // ✅ Assert todos are rendered
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();

  // ✅ Optional: check completion markers or edit buttons
  expect(screen.getAllByRole("button", { name: /edit/i }).length).toBeGreaterThan(0);
});
